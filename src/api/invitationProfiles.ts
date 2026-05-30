import api from '@/services/api'

export type InvitationProfileType = 'talent' | 'organiser' | 'venue'

export interface InvitationProfile {
  id: number
  name: string
  profile_type: InvitationProfileType | 'organizer'
  account_type: 'free' | 'premium' | string
  country: string
}

export interface FetchInvitationProfilesParams {
  profile_type?: string
  search?: string
  country?: string
  account_type?: string
  exclude_self?: boolean
}

export interface FetchEventInvitationProfilesParams {
  exclude_invited?: boolean
  search?: string
  profile_type?: string
  country?: string
  account_type?: string
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === 'object' && !Array.isArray(v)
}

function extractProfileRows(body: unknown): unknown[] {
  if (!isRecord(body)) return []
  if (body.success === false) {
    throw new Error(typeof body.message === 'string' ? body.message : 'Failed to load invitation profiles')
  }
  const data = body.data
  if (Array.isArray(data)) return data
  if (isRecord(data)) {
    if (Array.isArray(data.profiles)) return data.profiles
    if (Array.isArray(data.data)) return data.data
    for (const key of ['talents', 'organisers', 'venues', 'results', 'items']) {
      if (Array.isArray(data[key])) return data[key] as unknown[]
    }
  }
  return []
}

/** Map UI role `organizer` → API `organiser`. */
export function inviteRoleToApiType(role: string): string {
  const r = String(role ?? '').toLowerCase().trim()
  if (r === 'organizer' || r === 'organiser') return 'organiser'
  return r
}

export function normalizeInvitationProfile(raw: unknown): InvitationProfile | null {
  if (!isRecord(raw)) return null
  const idRaw = raw.id ?? raw.profile_id
  const id = typeof idRaw === 'number' ? idRaw : Number.parseInt(String(idRaw), 10)
  if (!Number.isFinite(id) || id <= 0) return null

  const name =
    (typeof raw.name === 'string' && raw.name.trim()) ||
    (typeof raw.title === 'string' && raw.title.trim()) ||
    ''

  let profileType = String(raw.profile_type ?? raw.type ?? 'talent').toLowerCase().trim()
  if (profileType === 'organizer') profileType = 'organiser'

  const accountType = String(raw.account_type ?? 'free').toLowerCase().trim()
  const country = typeof raw.country === 'string' ? raw.country.trim().toUpperCase() : ''

  return {
    id,
    name: name || `Profile #${id}`,
    profile_type: profileType as InvitationProfile['profile_type'],
    account_type: accountType,
    country,
  }
}

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === '') continue
    if (typeof v === 'boolean') {
      qs.set(k, v ? '1' : '0')
      continue
    }
    qs.set(k, String(v))
  }
  const s = qs.toString()
  return s ? `?${s}` : ''
}

/**
 * List profiles for the invitation picker (create flow).
 * GET /api/v2/invitation-profiles
 */
export async function fetchInvitationProfiles(
  params: FetchInvitationProfilesParams = {},
): Promise<InvitationProfile[]> {
  const query = buildQuery({
    profile_type: params.profile_type,
    search: params.search?.trim(),
    country: params.country?.trim(),
    account_type: params.account_type,
    exclude_self: params.exclude_self ?? true,
  })
  const response = await api.get(`/v2/invitation-profiles${query}`)
  const rows = extractProfileRows(response.data)
  return rows
    .map(normalizeInvitationProfile)
    .filter((p): p is InvitationProfile => p != null)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
}

/**
 * List profiles when editing an event (owner only).
 * GET /api/v2/events/{eventId}/invitation-profiles
 */
export async function fetchEventInvitationProfiles(
  eventId: number | string,
  params: FetchEventInvitationProfilesParams = {},
): Promise<InvitationProfile[]> {
  const id = encodeURIComponent(String(eventId))
  const query = buildQuery({
    exclude_invited: params.exclude_invited ?? true,
    search: params.search?.trim(),
    profile_type: params.profile_type,
    country: params.country?.trim(),
    account_type: params.account_type,
  })
  const response = await api.get(`/v2/events/${id}/invitation-profiles${query}`)
  const rows = extractProfileRows(response.data)
  return rows
    .map(normalizeInvitationProfile)
    .filter((p): p is InvitationProfile => p != null)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
}
