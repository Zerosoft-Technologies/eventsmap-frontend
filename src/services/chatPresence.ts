/**
 * User presence (online/offline) for chat.
 * Firestore: user_presence/{userId}
 */
import { doc, onSnapshot, setDoc, serverTimestamp, type Timestamp, type Unsubscribe } from 'firebase/firestore'
import { firestore } from '@/services/firebase'

const PRESENCE_COLLECTION = 'user_presence'

export interface PresenceDoc {
  user_id: number
  name: string
  online: boolean
  last_seen?: Timestamp | { toMillis: () => number }
}

/** Set user as online. Call when user logs in or opens app. */
export async function setOnline(userId: number, name: string): Promise<void> {
  const ref = doc(firestore, PRESENCE_COLLECTION, String(userId))
  await setDoc(ref, {
    user_id: userId,
    name: name || `User ${userId}`,
    online: true,
    last_seen: serverTimestamp(),
  })
}

/** Set user as offline. Call when user leaves page or logs out. */
export async function setOffline(userId: number, name: string): Promise<void> {
  const ref = doc(firestore, PRESENCE_COLLECTION, String(userId))
  await setDoc(ref, {
    user_id: userId,
    name: name || `User ${userId}`,
    online: false,
    last_seen: serverTimestamp(),
  })
}

/** Subscribe to a user's presence. Returns unsubscribe function. */
export function subscribeToPresence(
  userId: number,
  onUpdate: (data: PresenceDoc | null) => void,
  onError?: (err: Error) => void
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
    }
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
