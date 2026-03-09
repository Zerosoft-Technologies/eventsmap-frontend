import api from './api'

export interface ChatUser {
  id: number
  name: string
  profile_type: string
  account_type: 'free' | 'premium'
  avatar?: string | null
  last_message?: string | null
  last_message_at?: string | null
  unread_count?: number
}

export interface ChatAccessResponse {
  can_chat: boolean
  reason?: string
}

export interface InvitationRespondPayload {
  status: 'accepted' | 'rejected'
  token?: string
}

export const chatService = {
  /**
   * Check whether the current user can chat in the given event.
   * GET /api/v2/events/{eventId}/chat-access
   */
  async checkAccess(eventId: number): Promise<ChatAccessResponse> {
    const { data } = await api.get(`/v2/events/${eventId}/chat-access`)
    return (data.data ?? data) as ChatAccessResponse
  },

  /**
   * Get a Firebase custom token scoped to this event.
   * POST /api/v2/firebase/token/event/{eventId}
   */
  async getFirebaseToken(eventId: number): Promise<string> {
    const { data } = await api.post(`/v2/firebase/token/event/${eventId}`)
    return (data.data?.token ?? data.token) as string
  },

  /**
   * Get the list of participants for this event's chat.
   * GET /api/v2/events/{eventId}/chat-users
   */
  async getChatUsers(eventId: number): Promise<ChatUser[]> {
    const { data } = await api.get(`/v2/events/${eventId}/chat-users`)
    return (data.data ?? data ?? []) as ChatUser[]
  },

  /**
   * Validate that the current user is allowed to send a message.
   * POST /api/v2/events/{eventId}/chat/validate-message
   * Returns { can_send: true } or throws 429.
   */
  async validateMessage(eventId: number): Promise<{ can_send: boolean }> {
    const { data } = await api.post(`/v2/events/${eventId}/chat/validate-message`)
    return data as { can_send: boolean }
  },

  /**
   * Accept or reject an event invitation.
   * POST /api/v2/event-invitations/{id}/respond
   */
  async respondToInvitation(
    invitationId: string,
    payload: InvitationRespondPayload,
  ) {
    const { data } = await api.post(
      `/v2/event-invitations/${invitationId}/respond`,
      payload,
    )
    return data
  },
}
