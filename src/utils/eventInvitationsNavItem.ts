import { Mail } from 'lucide-vue-next'

/** Sidebar item for “received event invitations” — same shape as other EventSidebar menu entries */
export function eventInvitationsNavItem(basePath: string) {
  const base = basePath.replace(/\/$/, '')
  return {
    id: 'event-invitations',
    icon: Mail,
    label: 'Event invitations',
    route: `${base}/event-invitations`,
  }
}
