import api from '@/services/api'
import type { AxiosError } from 'axios'

export type InvitationStatusFilter = 'pending' | 'accepted' | 'rejected'
export type EventTimingFilter = 'upcoming' | 'past'

export interface InvitationSender {
  id: number
  name: string
  email: string
}

/** Nested event object from V2 invitations API — keep loose for API richness */
export interface InvitedEventPayload {
  id: number
  slug?: string
  title?: string
  event_date?: string
  start_date?: string
  end_date?: string
  start_time?: string
  end_time?: string
  start_datetime?: string
  end_datetime?: string
  address?: string
  image_url?: string
  /** V2 events often expose this as the primary cover URL */
  cover_image?: string
  category?: string
  venue?: { name?: string; title?: string } | string | null
  [key: string]: unknown
}

export interface EventInvitationListItem {
  invitation_id?: number
  /** Some API variants may expose the primary key as `id` */
  id?: number
  event_id: number
  sender_id: number
  receiver_id: number
  receiver_type: string
  status: string
  invited_at: string
  updated_at?: string
  responded_at?: string | null
  sender?: InvitationSender
  event?: InvitedEventPayload | null
}

export interface InvitationsPagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface InvitationsListSuccess {
  success: true
  message?: string
  data: {
    invitations: EventInvitationListItem[]
    pagination: InvitationsPagination
  }
}

export interface InvitationsListFailure {
  success: false
  message?: string
  data?: unknown
}

export type InvitationsListResponse = InvitationsListSuccess | InvitationsListFailure

export interface InvitationRespondBody {
  status: 'accepted' | 'rejected'
}

function normalizeListPayload(body: unknown): {
  invitations: EventInvitationListItem[]
  pagination: InvitationsPagination | null
} {
  if (!body || typeof body !== 'object') {
    return { invitations: [], pagination: null }
  }
  const d = body as Record<string, unknown>
  let invitations: EventInvitationListItem[] = []
  let pagination: InvitationsPagination | null = null

  if (Array.isArray(d.invitations)) {
    invitations = d.invitations as EventInvitationListItem[]
  } else if (Array.isArray(d.data)) {
    invitations = d.data as EventInvitationListItem[]
  }

  const pg = d.pagination
  if (pg && typeof pg === 'object') {
    pagination = pg as InvitationsPagination
  }

  return { invitations, pagination }
}

export async function fetchReceivedInvitations(params: {
  status?: InvitationStatusFilter | 'all' | ''
  event_timing?: EventTimingFilter | 'all' | ''
  page?: number
  per_page?: number
}): Promise<InvitationsListResponse> {
  const query: Record<string, string | number> = {}
  if (params.status && params.status !== 'all') {
    query.status = params.status
  }
  if (params.event_timing && params.event_timing !== 'all') {
    query.event_timing = params.event_timing
  }
  if (params.page != null) query.page = params.page
  if (params.per_page != null) query.per_page = params.per_page

  try {
    const res = await api.get<{
      success: boolean
      message?: string
      data?: unknown
    }>('v2/invitations', { params: query })

    const payload = res.data
    if (!payload.success) {
      return {
        success: false,
        message: payload.message || 'Could not load invitations',
      }
    }

    const { invitations, pagination } = normalizeListPayload(payload.data)

    const defaultPagination: InvitationsPagination = {
      current_page: 1,
      last_page: 1,
      per_page: invitations.length || 15,
      total: invitations.length,
    }

    return {
      success: true,
      message: payload.message,
      data: {
        invitations,
        pagination: pagination || defaultPagination,
      },
    }
  } catch (err) {
    const ax = err as AxiosError<{ message?: string; success?: boolean }>
    const msg =
      ax.response?.data?.message ||
      (typeof ax.response?.data === 'object' &&
      ax.response?.data &&
      'message' in ax.response.data
        ? String((ax.response.data as { message?: unknown }).message)
        : null) ||
      ax.message ||
      'Could not load invitations'
    return { success: false, message: msg }
  }
}

export async function respondToInvitation(
  invitationId: number,
  body: InvitationRespondBody,
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await api.post<{ success: boolean; message?: string }>(
      `v2/invitations/${invitationId}/respond`,
      body,
    )
    return {
      success: !!res.data?.success,
      message: res.data?.message,
    }
  } catch (err) {
    const ax = err as AxiosError<{ message?: string; success?: boolean }>
    const msg =
      ax.response?.data?.message ||
      ax.message ||
      'Could not update invitation'
    return { success: false, message: msg }
  }
}
