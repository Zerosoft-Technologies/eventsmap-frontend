/**
 * Firestore chat operations using the conversations/{id}/messages structure.
 * Production-level WhatsApp-style architecture.
 */
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  limitToLast,
  endBefore,
  increment,
  onSnapshot,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { getPresence, isChatActive } from '@/services/chatPresence'

export class ChatUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ChatUnavailableError'
  }
}

const CONVERSATIONS = 'conversations'
const MESSAGES = 'messages'
const MESSAGE_LIMIT = 50

/** Generate deterministic conversation ID: global_{minUserId}_{maxUserId} */
export function getConversationId(user1: number, user2: number): string {
  const [min, max] = [Math.min(user1, user2), Math.max(user1, user2)]
  return `global_${min}_${max}`
}

export interface ConversationDoc {
  participants: number[]
  participant_map: Record<string, boolean>
  participant_names?: Record<string, string>
  last_message?: string
  last_message_type?: string
  last_message_sender?: number
  last_message_time?: Timestamp | null
  created_at?: Timestamp | null
  updated_at?: Timestamp | null
  unread_count?: Record<string, number>
  typing_users?: Record<string, boolean>
}

export interface MessageDoc {
  sender_id: number
  receiver_id: number
  sender_name?: string
  receiver_name?: string
  message: string
  message_type: string
  status: 'sent' | 'delivered' | 'read'
  timestamp?: Timestamp | null
}

export interface MessageWithId extends MessageDoc {
  id: string
}

export interface ConversationWithMeta extends ConversationDoc {
  id: string
  otherParticipantId: number
}

/** Ensure conversation exists; create if not. Uses participant names. */
export async function getOrCreateConversation(
  conversationId: string,
  participant1: number,
  participant2: number,
  participantNames: { [key: number]: string } = {}
): Promise<void> {
  const ref = doc(firestore, CONVERSATIONS, conversationId)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    const data = snap.data() as ConversationDoc
    const hasNames = data.participant_names && Object.keys(data.participant_names || {}).length > 0
    if (!hasNames && Object.keys(participantNames).length > 0) {
      await updateDoc(ref, {
        participant_names: {
          [String(participant1)]: participantNames[participant1] || `User ${participant1}`,
          [String(participant2)]: participantNames[participant2] || `User ${participant2}`,
        },
        updated_at: serverTimestamp(),
      })
    }
    return
  }

  const participants = [participant1, participant2].sort((a, b) => a - b)
  const participantMap: Record<string, boolean> = {}
  const names: Record<string, string> = {}
  participants.forEach((id) => {
    participantMap[String(id)] = true
    names[String(id)] = participantNames[id] || `User ${id}`
  })

  const unreadCount: Record<string, number> = {}
  participants.forEach((id) => {
    unreadCount[String(id)] = 0
  })

  await setDoc(ref, {
    participants,
    participant_map: participantMap,
    participant_names: names,
    last_message: '',
    last_message_type: 'text',
    last_message_sender: 0,
    last_message_time: serverTimestamp(),
    unread_count: unreadCount,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })
}

/** Subscribe to conversations for real-time updates. */
export function subscribeToConversationsForUser(
  currentUserId: number,
  onUpdate: (conversations: ConversationWithMeta[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  if (currentUserId == null || currentUserId === undefined || typeof currentUserId !== 'number' || currentUserId <= 0) {
    return () => {}
  }
  const coll = collection(firestore, CONVERSATIONS)
  const q = query(coll, where('participants', 'array-contains', currentUserId))
  return onSnapshot(
    q,
    (snapshot) => {
      const result: ConversationWithMeta[] = []
      snapshot.docs.forEach((d) => {
        const data = d.data() as ConversationDoc
        const otherId = data.participants.find((p) => p !== currentUserId)
        if (otherId != null) {
          result.push({ ...data, id: d.id, otherParticipantId: otherId })
        }
      })
      result.sort((a, b) => {
        const t1 = a.last_message_time?.toMillis?.() ?? 0
        const t2 = b.last_message_time?.toMillis?.() ?? 0
        return t2 - t1
      })
      onUpdate(result)
    },
    (err) => {
      console.error('subscribeToConversationsForUser error:', err)
      onError?.(err)
    }
  )
}

/** Fetch conversations where current user is participant, ordered by last_message_time. */
export async function getConversationsForUser(
  currentUserId: number
): Promise<ConversationWithMeta[]> {
  if (currentUserId == null || currentUserId === undefined || typeof currentUserId !== 'number' || currentUserId <= 0) {
    return []
  }

  try {
    const coll = collection(firestore, CONVERSATIONS)
    const q = query(coll, where('participants', 'array-contains', currentUserId))
    const snapshot = await getDocs(q)
    const result: ConversationWithMeta[] = []

    snapshot.docs.forEach((d) => {
      const data = d.data() as ConversationDoc
      const otherId = data.participants.find((p) => p !== currentUserId)
      if (otherId != null) {
        result.push({
          ...data,
          id: d.id,
          otherParticipantId: otherId,
        })
      }
    })

    result.sort((a, b) => {
      const t1 = a.last_message_time && typeof a.last_message_time.toMillis === 'function'
        ? a.last_message_time.toMillis()
        : 0
      const t2 = b.last_message_time && typeof b.last_message_time.toMillis === 'function'
        ? b.last_message_time.toMillis()
        : 0
      return t2 - t1
    })

    return result
  } catch (err) {
    console.error('getConversationsForUser error:', err)
    return []
  }
}

/** Subscribe to messages in a conversation (real-time, paginated with limit). */
export function subscribeToMessages(
  conversationId: string,
  _currentUserId: number,
  onUpdate: (messages: MessageWithId[], snapshot: QuerySnapshot<DocumentData>) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const coll = collection(firestore, CONVERSATIONS, conversationId, MESSAGES)
  const q = query(coll, orderBy('timestamp', 'asc'), limitToLast(MESSAGE_LIMIT))

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const msgs = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as MessageDoc),
      }))
      onUpdate(msgs, snapshot)
    },
    (err) => {
      console.error('Firestore messages listener error:', err)
      onError?.(err)
    }
  )
}

/** Send a message and update conversation. Increments unread_count for receiver. */
export async function sendMessage(
  conversationId: string,
  senderId: number,
  receiverId: number,
  text: string,
  senderName: string = '',
  receiverName: string = '',
): Promise<void> {
  const [senderPresence, receiverPresence] = await Promise.all([
    getPresence(senderId),
    getPresence(receiverId),
  ])

  if (!isChatActive(senderPresence)) {
    throw new ChatUnavailableError(
      'You are unavailable for chat. Turn on chat availability to send messages.',
    )
  }
  if (!isChatActive(receiverPresence)) {
    throw new ChatUnavailableError(
      'This user is unavailable for chat and cannot receive messages right now.',
    )
  }

  const convRef = doc(firestore, CONVERSATIONS, conversationId)
  const msgColl = collection(firestore, CONVERSATIONS, conversationId, MESSAGES)
  const newMsgRef = doc(msgColl)

  const batch = writeBatch(firestore)

  batch.set(newMsgRef, {
    sender_id: senderId,
    receiver_id: receiverId,
    sender_name: senderName || `User ${senderId}`,
    receiver_name: receiverName || `User ${receiverId}`,
    message: text,
    message_type: 'text',
    status: 'sent',
    timestamp: serverTimestamp(),
  })

  batch.update(convRef, {
    last_message: text,
    last_message_type: 'text',
    last_message_sender: senderId,
    last_message_time: serverTimestamp(),
    updated_at: serverTimestamp(),
    [`unread_count.${receiverId}`]: increment(1),
  })

  await batch.commit()
}

/** Set typing indicator for current user. */
export async function setTyping(conversationId: string, userId: number): Promise<void> {
  const ref = doc(firestore, CONVERSATIONS, conversationId)
  await updateDoc(ref, {
    [`typing_users.${userId}`]: true,
    updated_at: serverTimestamp(),
  })
}

/** Clear typing indicator when user stops typing. */
export async function clearTyping(conversationId: string, userId: number): Promise<void> {
  const ref = doc(firestore, CONVERSATIONS, conversationId)
  await updateDoc(ref, {
    [`typing_users.${userId}`]: false,
    updated_at: serverTimestamp(),
  })
}

/** Subscribe to conversation doc (for typing indicator, etc). */
export function subscribeToConversation(
  conversationId: string,
  onUpdate: (data: ConversationDoc) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const ref = doc(firestore, CONVERSATIONS, conversationId)
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as ConversationDoc)
      }
    },
    (err) => {
      console.error('Firestore conversation listener error:', err)
      onError?.(err)
    }
  )
}

/** Mark messages from other user as read and reset unread_count for current user. */
export async function markMessagesAsRead(
  conversationId: string,
  currentUserId: number,
  snapshot: QuerySnapshot<DocumentData>
): Promise<void> {
  const batch = writeBatch(firestore)

  snapshot.docs.forEach((d) => {
    const data = d.data() as MessageDoc & { status?: string }
    if (data.receiver_id === currentUserId && data.status !== 'read') {
      batch.update(
        doc(firestore, CONVERSATIONS, conversationId, MESSAGES, d.id),
        { status: 'read' }
      )
    }
  })

  const convRef = doc(firestore, CONVERSATIONS, conversationId)
  batch.update(convRef, {
    [`unread_count.${currentUserId}`]: 0,
    updated_at: serverTimestamp(),
  })

  await batch.commit()
}

/** Load older messages (for pagination). Returns messages before the given timestamp. */
export async function loadOlderMessages(
  conversationId: string,
  beforeTimestamp: Timestamp
): Promise<MessageWithId[]> {
  const coll = collection(firestore, CONVERSATIONS, conversationId, MESSAGES)
  const q = query(
    coll,
    orderBy('timestamp', 'desc'),
    endBefore(beforeTimestamp),
    limit(MESSAGE_LIMIT)
  )
  const snapshot = await getDocs(q)
  const older = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as MessageDoc) }))
  older.sort((a, b) => (a.timestamp?.toMillis?.() ?? 0) - (b.timestamp?.toMillis?.() ?? 0))
  return older
}
