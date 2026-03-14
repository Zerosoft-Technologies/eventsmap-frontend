/**
 * Firestore real-time subscription for invitation notifications.
 * Collection: invitation_notifications (doc id: invitation_{id}).
 * Backend writes when an invitation is sent; updates status when user accepts/rejects.
 *
 * If you see a "missing index" error in the console, use the link in the error
 * to create the composite index (receiver_id + created_at) in Firebase Console.
 */
import {
  collection,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { firestore } from '@/services/firebase'

const COLLECTION = 'invitation_notifications'

/** Sort by created_at desc in memory (avoids needing a composite index while it builds). */
function sortByCreatedDesc(
  list: InvitationNotificationWithId[]
): InvitationNotificationWithId[] {
  return [...list].sort((a, b) => {
    const t1 = a.created_at?.toMillis?.() ?? 0
    const t2 = b.created_at?.toMillis?.() ?? 0
    return t2 - t1
  })
}

export interface InvitationNotificationDoc {
  receiver_id: string
  invitation_id: number
  event_id: number
  event_title: string
  sender_id: number
  sender_name: string
  message: string
  status: 'pending' | 'completed'
  created_at: { toMillis: () => number } | null
  completed_at?: { toMillis: () => number } | null
}

export interface InvitationNotificationWithId extends InvitationNotificationDoc {
  id: string
}

/**
 * Subscribe to invitation notifications for the current user (real-time).
 * receiver_id is the string version of the Laravel user id (same as Firebase auth uid from custom token).
 * Uses only receiver_id in the query so no composite index is required; sorts by created_at in memory.
 */
export function subscribeToInvitationNotifications(
  receiverId: number,
  onUpdate: (notifications: InvitationNotificationWithId[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const receiverIdStr = String(receiverId)
  const coll = collection(firestore, COLLECTION)
  const q = query(coll, where('receiver_id', '==', receiverIdStr))

  return onSnapshot(
    q,
    (snapshot) => {
      const list: InvitationNotificationWithId[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as InvitationNotificationDoc),
      }))
      onUpdate(sortByCreatedDesc(list))
    },
    (err) => {
      console.error('subscribeToInvitationNotifications error:', err)
      onError?.(err)
    }
  )
}
