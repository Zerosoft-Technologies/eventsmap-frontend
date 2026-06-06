import api from '@/services/api'

export type GuestInvitationRole = 'talent' | 'organiser' | 'venue'

export type GuestInvitationCode = 'OK' | 'USER_EXISTS' | 'INVITATION_PENDING' | 'INVALID_ROLE'

export interface GuestInvitationValidateResponse {
  success: boolean
  code?: GuestInvitationCode
  message: string
}

export interface GuestInvitationSendResponse {
  success: boolean
  code?: GuestInvitationCode
  message: string
  data?: {
    id: number
    email: string
    receiver_type: string
    status: string
  }
}

export interface GuestInvitationTokenData {
  valid: boolean
  email?: string
  name?: string
  receiver_type?: GuestInvitationRole
  event_title?: string
  invitation_id?: number
  message?: string
}

/** Map UI role (organizer) to API role (organiser). */
export function guestRoleForApi(role: string): GuestInvitationRole {
  const r = String(role ?? '').toLowerCase()
  if (r === 'organizer' || r === 'organiser') return 'organiser'
  if (r === 'venue') return 'venue'
  return 'talent'
}

export async function validateGuestInvitationEmail(
  eventId: number,
  email: string,
  role: string,
): Promise<GuestInvitationValidateResponse> {
  const { data } = await api.post<GuestInvitationValidateResponse>(
    `/v2/events/${eventId}/guest-invitations/validate-email`,
    { email, receiver_type: guestRoleForApi(role) },
  )
  return data
}

export async function sendGuestInvitation(
  eventId: number,
  payload: { email: string; name?: string; role: string },
): Promise<GuestInvitationSendResponse> {
  const { data } = await api.post<GuestInvitationSendResponse>(
    `/v2/events/${eventId}/guest-invitations`,
    {
      email: payload.email,
      name: payload.name || undefined,
      receiver_type: guestRoleForApi(payload.role),
    },
  )
  return data
}

export async function fetchGuestInvitationByToken(
  token: string,
): Promise<{ success: boolean; data?: GuestInvitationTokenData; message?: string }> {
  const { data } = await api.get(`/v2/guest-invitations/token/${encodeURIComponent(token)}`)
  return data
}
