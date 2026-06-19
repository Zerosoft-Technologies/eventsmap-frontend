import type { Component } from 'vue'
import { MapPin, Mic2, User } from 'lucide-vue-next'

export const INVITATION_ROLE_META: Record<string, { label: string; icon: Component }> = {
  talent: { label: 'Talent', icon: Mic2 },
  organiser: { label: 'Organiser', icon: User },
  organizer: { label: 'Organiser', icon: User },
  venue: { label: 'Venue', icon: MapPin },
}

export function invitationRoleMeta(receiverType?: string | null) {
  const key = String(receiverType || '').toLowerCase()
  return INVITATION_ROLE_META[key] ?? { label: receiverType || 'Invitee', icon: User }
}
