/**
 * User presence (online/offline) and chat availability for messaging.
 * Firestore: user_presence/{userId}
 */
import { doc, getDoc, onSnapshot, setDoc, serverTimestamp, type Timestamp, type Unsubscribe } from 'firebase/firestore'
import { firestore } from '@/services/firebase'

const PRESENCE_COLLECTION = 'user_presence'

export interface PresenceDoc {
  user_id: number
  name: string
  online: boolean
  /** When false, user cannot send or receive new chat messages. Defaults to true. */
  chat_active?: boolean
  last_seen?: Timestamp | { toMillis: () => number }
}

/** True unless presence explicitly sets chat_active to false. */
export function isChatActive(presence: PresenceDoc | null | undefined): boolean {
  if (!presence) return true
  return presence.chat_active !== false
}

/** Fetch presence once (e.g. before sending a message). */
export async function getPresence(userId: number): Promise<PresenceDoc | null> {
  const ref = doc(firestore, PRESENCE_COLLECTION, String(userId))
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as PresenceDoc) : null
}

/** Set user as online. Does not change chat_active (merge). */
export async function setOnline(userId: number, name: string): Promise<void> {
  const ref = doc(firestore, PRESENCE_COLLECTION, String(userId))
  await setDoc(
    ref,
    {
      user_id: userId,
      name: name || `User ${userId}`,
      online: true,
      last_seen: serverTimestamp(),
    },
    { merge: true },
  )
}

/** Set user as offline. Does not change chat_active (merge). */
export async function setOffline(userId: number, name: string): Promise<void> {
  const ref = doc(firestore, PRESENCE_COLLECTION, String(userId))
  await setDoc(
    ref,
    {
      user_id: userId,
      name: name || `User ${userId}`,
      online: false,
      last_seen: serverTimestamp(),
    },
    { merge: true },
  )
}

/** Toggle whether the user accepts and can send chat messages. */
export async function setChatActive(userId: number, name: string, active: boolean): Promise<void> {
  const ref = doc(firestore, PRESENCE_COLLECTION, String(userId))
  await setDoc(
    ref,
    {
      user_id: userId,
      name: name || `User ${userId}`,
      chat_active: active,
      last_seen: serverTimestamp(),
    },
    { merge: true },
  )
}

/** Subscribe to a user's presence. Returns unsubscribe function. */
export function subscribeToPresence(
  userId: number,
  onUpdate: (data: PresenceDoc | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const ref = doc(firestore, PRESENCE_COLLECTION, String(userId))
  return onSnapshot(
    ref,
    (snap) => {
      onUpdate(snap.exists() ? (snap.data() as PresenceDoc) : null)
    },
    (err) => {
      console.error('Presence listener error:', err)
      onError?.(err)
    },
  )
}

/** Format last seen relative time (e.g. "Last seen 2 minutes ago") */
export function formatLastSeen(lastSeen: { toMillis?: () => number } | undefined): string {
  if (!lastSeen?.toMillis) return 'Last seen long ago'
  const ms = lastSeen.toMillis()
  const diff = Date.now() - ms
  const sec = Math.floor(diff / 1000)
  const min = Math.floor(sec / 60)
  const hour = Math.floor(min / 60)
  const day = Math.floor(hour / 24)

  if (sec < 60) return 'Last seen just now'
  if (min < 60) return `Last seen ${min} minute${min === 1 ? '' : 's'} ago`
  if (hour < 24) return `Last seen ${hour} hour${hour === 1 ? '' : 's'} ago`
  if (day < 7) return `Last seen ${day} day${day === 1 ? '' : 's'} ago`
  return 'Last seen long ago'
}
