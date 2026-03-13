/**
 * Firestore chat operations using the conversations/{id}/messages structure.
 * Replaces flat messages collection with scalable conversation-based structure.
 */
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore'
import { firestore } from '@/services/firebase'

const CONVERSATIONS = 'conversations'
const MESSAGES = 'messages'

/** Generate deterministic conversation ID: global_{minUserId}_{maxUserId} */
export function getConversationId(user1: number, user2: number): string {
  const [min, max] = [Math.min(user1, user2), Math.max(user1, user2)]
  return `global_${min}_${max}`
}

export interface ConversationDoc {
  participants: number[]
  participant_map: Record<string, boolean>
  last_message?: string
  last_message_type?: string
  last_message_sender?: number
  last_message_time?: Timestamp | null
  created_at?: Timestamp | null
  updated_at?: Timestamp | null
  unread?: Record<string, number>
}

export interface MessageDoc {
  sender_id: number
  receiver_id: number
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

/** Ensure conversation exists; create if not. */
export async function getOrCreateConversation(
  conversationId: string,
  participant1: number,
  participant2: number
): Promise<void> {
  const ref = doc(firestore, CONVERSATIONS, conversationId)
  const snap = await getDoc(ref)

  if (snap.exists()) return

  const participants = [participant1, participant2].sort((a, b) => a - b)
  const participantMap: Record<string, boolean> = {}
  participants.forEach((id) => {
    participantMap[String(id)] = true
  })

  await setDoc(ref, {
    participants,
    participant_map: participantMap,
    last_message: '',
    last_message_type: 'text',
    last_message_sender: 0,
    last_message_time: serverTimestamp(),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })
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

/** Subscribe to messages in a conversation (real-time). */
export function subscribeToMessages(
  conversationId: string,
  currentUserId: number,
  onUpdate: (messages: MessageWithId[], snapshot: QuerySnapshot<DocumentData>) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const coll = collection(firestore, CONVERSATIONS, conversationId, MESSAGES)
  const q = query(coll, orderBy('timestamp', 'asc'))

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

/** Send a message and update conversation. */
export async function sendMessage(
  conversationId: string,
  senderId: number,
  receiverId: number,
  text: string
): Promise<void> {
  const convRef = doc(firestore, CONVERSATIONS, conversationId)
  const msgColl = collection(firestore, CONVERSATIONS, conversationId, MESSAGES)
  const newMsgRef = doc(msgColl)

  const batch = writeBatch(firestore)

  batch.set(newMsgRef, {
    sender_id: senderId,
    receiver_id: receiverId,
    message: text,
    message_type: 'text',
    status: 'sent',
    timestamp: serverTimestamp(),
  } as MessageDoc)

  batch.update(convRef, {
    last_message: text,
    last_message_type: 'text',
    last_message_sender: senderId,
    last_message_time: serverTimestamp(),
    updated_at: serverTimestamp(),
  })

  await batch.commit()
}

/** Mark messages from other user as read when receiver opens conversation. */
export async function markMessagesAsRead(
  conversationId: string,
  currentUserId: number,
  snapshot: QuerySnapshot<DocumentData>
): Promise<void> {
  const batch = writeBatch(firestore)
  let hasWork = false

  snapshot.docs.forEach((d) => {
    const data = d.data() as MessageDoc & { status?: string }
    if (data.receiver_id === currentUserId && data.status !== 'read') {
      batch.update(
        doc(firestore, CONVERSATIONS, conversationId, MESSAGES, d.id),
        { status: 'read' }
      )
      hasWork = true
    }
  })

  if (hasWork) await batch.commit()
}
