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
   * Get a Firebase custom token for global chat (user-scoped, no event).
   * POST /api/v2/firebase/token
   */
  async getFirebaseToken(): Promise<string> {
    const { data } = await api.post('/v2/firebase/token')
    return (data.data?.token ?? data.token) as string
  },

  /**
   * Get the list of premium users for global chat (no event).
   * GET /api/v2/chat/users
   */
  async getChatUsers(): Promise<ChatUser[]> {
    const { data } = await api.get('/v2/chat/users')
    return (data.data ?? data ?? []) as ChatUser[]
  },

  /**
   * Validate that the current user is allowed to send a message (global chat).
   * POST /api/v2/chat/validate-message
   * Returns { can_send: true } or throws 429.
   */
  async validateMessage(): Promise<{ can_send: boolean }> {
    const { data } = await api.post('/v2/chat/validate-message')
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
