import api from '@/services/api'
import type { PaginationMeta } from '@/types/events'

export interface DiscoveryProfile {
  id: number
  title: string
  slug: string
  status?: string
  status_label?: string
  publish_status?: string
  publish_status_label?: string
  event_type?: string
  image_path?: string | null
  profile_image?: string | null
  cover_image?: string | null
  category?: { id: number; name: string; slug?: string } | null
  subcategories?: Array<{ id: number; name: string; slug?: string }>
  address?: string | null
  city?: string | null
  latitude?: number | null
  longitude?: number | null
  description?: string | null
  contact_phone?: string | null
  contact_email?: string | null
  contact_website?: string | null
  facebook_url?: string | null
  instagram_url?: string | null
  tiktok_url?: string | null
  user?: { id: number; name: string } | null
  is_approved?: boolean
  created_at?: string | null
  updated_at?: string | null

  // Talent-specific
  talent_category?: { id: number; name: string; slug?: string } | null
  talent_subcategories?: Array<{ id: number; name: string; slug?: string }>
  nationality?: string | null
  highlights?: string | null
  languages?: string[]

  // Organiser-specific
  organiser_category?: { id: number; name: string; slug?: string } | null
  organiser_subcategories?: Array<{ id: number; name: string; slug?: string }>

  // Venue-specific
  opening_hours?: Array<{
    day: string
    is_open: boolean
    open: string | null
    close: string | null
  }>
  capacity?: number | null
  description_items?: string[]
  allowance_of_dogs?: string | null
  wheelchair_accessible?: boolean | null
  accessible_parking_close_to_entrance?: boolean | null
  accessible_parking?: boolean | null
  valet_parking?: boolean | null
  childrens_play_area?: boolean | null
  accessibility_description?: string | null
  parking?: boolean | null
  play_area?: boolean | null
  allow_dogs?: boolean | null

  [key: string]: unknown
}

export type ProfileType = 'organisers' | 'talents' | 'venues'

interface ProfileListApiResponse {
  success: boolean
  message?: string
  /** Nested payload, or list fields may also sit on the root response */
  data?: unknown
  [key: string]: unknown
}

export interface ProfileSearchParams {
  search?: string
  category?: string
  subcategory?: string
  lat?: number
  lng?: number
  radius?: number
  from_date?: string
  to_date?: string
  morning?: boolean
  afternoon?: boolean
  evening?: boolean
  night?: boolean
  per_page?: number
  page?: number
  [key: string]: unknown
}

/**
 * Map marker coordinates from discovery API payloads (organisers often use `lat`/`lng`
 * or strings; venues/talents may use `latitude`/`longitude`).
 */
export function pickProfileLatLng(p: Record<string, unknown>): { latitude: number; longitude: number } | null {
  const latRaw =
    p.lat ?? p.latitude ?? p.location_lat ?? p.location_latitude ?? p.organiser_latitude ?? p.organizer_latitude
  const lngRaw =
    p.lng ??
    p.longitude ??
    p.lon ??
    p.location_lng ??
    p.location_longitude ??
    p.organiser_longitude ??
    p.organizer_longitude
  if (latRaw == null || lngRaw == null || latRaw === '' || lngRaw === '') return null
  const lat =
    typeof latRaw === 'string' && latRaw.trim() !== ''
      ? Number.parseFloat(latRaw)
      : Number(latRaw)
  const lng =
    typeof lngRaw === 'string' && lngRaw.trim() !== ''
      ? Number.parseFloat(lngRaw)
      : Number(lngRaw)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (lat === 0) return null
  return { latitude: lat, longitude: lng }
}

function buildProfileQueryString(params: ProfileSearchParams): string {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === '') continue
    if (typeof v === 'boolean') {
      if (v) qs.set(k, 'true')
      continue
    }
    qs.set(k, String(v))
  }
  const s = qs.toString()
  return s ? `?${s}` : ''
}

/** Laravel / custom wrappers: raw value may be an array or a paginator `{ data: [] }` */
function asProfileArray(raw: unknown): DiscoveryProfile[] | null {
  if (raw == null) return null
  if (Array.isArray(raw)) return raw as DiscoveryProfile[]
  if (typeof raw === 'object' && Array.isArray((raw as { data?: unknown }).data)) {
    return (raw as { data: DiscoveryProfile[] }).data
  }
  return null
}

const LIST_KEY_FALLBACKS: Record<ProfileType, string[]> = {
  organisers: ['organisers', 'organizers', 'organiser', 'data', 'items', 'results'],
  talents: ['talents', 'talent', 'data', 'items', 'results'],
  venues: ['venues', 'venue', 'data', 'items', 'results'],
}

function isPlainRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === 'object' && !Array.isArray(v)
}

/**
 * Extract rows from `data: { organisers, pagination }`, Laravel paginator shapes,
 * or top-level list keys when `data` is missing.
 */
function extractProfileRows(body: Record<string, unknown>, profileType: ProfileType): DiscoveryProfile[] {
  const innerCandidate = body.data
  const inner: Record<string, unknown> | null = isPlainRecord(innerCandidate) ? innerCandidate : null
  const searchRoots: Record<string, unknown>[] = []
  if (inner) searchRoots.push(inner)
  searchRoots.push(body)

  const keysToTry = [...new Set([profileType, ...LIST_KEY_FALLBACKS[profileType]])]

  for (const root of searchRoots) {
    for (const key of keysToTry) {
      const rows = asProfileArray(root[key])
      if (rows && rows.length > 0) return rows
    }
    // First array-valued property (except pagination/meta/links)
    for (const [k, v] of Object.entries(root)) {
      if (k === 'pagination' || k === 'meta' || k === 'links') continue
      const rows = asProfileArray(v)
      if (rows && rows.length > 0) return rows
    }
  }

  return []
}

function extractPagination(
  body: Record<string, unknown>,
  inner: Record<string, unknown> | null
): PaginationMeta | null {
  const pag =
    (inner && isPlainRecord(inner.pagination) ? inner.pagination : null) ??
    (isPlainRecord(body.pagination) ? body.pagination : null)
  if (pag && typeof pag.current_page === 'number') {
    return {
      current_page: pag.current_page,
      last_page: typeof pag.last_page === 'number' ? pag.last_page : 1,
      per_page: typeof pag.per_page === 'number' ? pag.per_page : 20,
      total: typeof pag.total === 'number' ? pag.total : 0,
    }
  }

  if (inner && typeof inner.current_page === 'number') {
    return {
      current_page: inner.current_page,
      last_page: typeof inner.last_page === 'number' ? inner.last_page : 1,
      per_page: typeof inner.per_page === 'number' ? inner.per_page : 20,
      total: typeof inner.total === 'number' ? inner.total : 0,
    }
  }
  return null
}

export async function fetchProfiles(
  profileType: ProfileType,
  params: ProfileSearchParams = {}
): Promise<{ data: DiscoveryProfile[]; meta: PaginationMeta }> {
  const qs = buildProfileQueryString(params)
  const endpoint = `/v2/${profileType}${qs}`

  const response = await api.get<ProfileListApiResponse>(endpoint)

  const body = response.data as Record<string, unknown>
  if (body.success === false) {
    throw new Error((body.message as string) || 'Failed to fetch profiles')
  }

  const innerCandidate = body.data
  const inner = isPlainRecord(innerCandidate) ? innerCandidate : null

  let rows = extractProfileRows(body, profileType)
  if (rows.length === 0 && inner) {
    const paginated = asProfileArray(inner)
    if (paginated) rows = paginated
  }

  const pag = extractPagination(body, inner)
  return {
    data: rows,
    meta: {
      current_page: pag?.current_page ?? 1,
      last_page: pag?.last_page ?? 1,
      per_page: pag?.per_page ?? 20,
      total: pag?.total ?? rows.length,
    },
  }
}
