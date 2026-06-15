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

export interface BlockedChatUser {
  id: number
  name: string
  profile_type?: string | null
  avatar?: string | null
}

export interface ChatBlocksResponse {
  blocked: number[]
  blocked_by: number[]
  blocked_users: BlockedChatUser[]
}

export interface CanMessageResponse {
  can_message: boolean
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

  async getBlocks(): Promise<ChatBlocksResponse> {
    const { data } = await api.get('/v2/chat/blocks')
    const payload = (data.data ?? data ?? {}) as Partial<ChatBlocksResponse>
    return {
      blocked: Array.isArray(payload.blocked) ? payload.blocked.map(Number) : [],
      blocked_by: Array.isArray(payload.blocked_by) ? payload.blocked_by.map(Number) : [],
      blocked_users: Array.isArray(payload.blocked_users) ? payload.blocked_users : [],
    }
  },

  async blockUser(userId: number): Promise<void> {
    await api.post(`/v2/chat/block/${userId}`)
  },

  async unblockUser(userId: number): Promise<void> {
    await api.delete(`/v2/chat/block/${userId}`)
  },

  async canMessage(userId: number): Promise<CanMessageResponse> {
    const { data } = await api.get(`/v2/chat/can-message/${userId}`)
    return (data.data ?? data) as CanMessageResponse
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
