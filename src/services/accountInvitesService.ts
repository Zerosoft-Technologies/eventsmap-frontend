import api from '@/services/api'
import type { AxiosError } from 'axios'

export type AccountInviteType = 'talent' | 'organiser' | 'venue'

export interface AccountInvitesSummary {
  totalEvents: number
  talentsInvited: number
  organisersInvited: number
  venuesInvited: number
  totalInvites: number
}

export interface AccountInviteRow {
  id: string | number
  name: string
  genre: string | null
  category: string | null
  /** Public profile slug (e.g. from API) */
  slug: string | null
  profileId: string | number | null
  inviteType: AccountInviteType
  eventId: string | number | null
  eventTitle: string
  imageUrl: string | null
  /** When API sends absolute profile URL; otherwise UI may build from slug */
  viewProfileUrl: string | null
  raw: Record<string, unknown>
}

const EMPTY_SUMMARY: AccountInvitesSummary = {
  totalEvents: 0,
  talentsInvited: 0,
  organisersInvited: 0,
  venuesInvited: 0,
  totalInvites: 0,
}

function mapInviteType(raw: unknown): AccountInviteType {
  const t = String(raw ?? '')
    .toLowerCase()
    .replace(/\s+/g, '_')
  if (t === 'venue' || t === 'venues') return 'venue'
  if (t === 'organiser' || t === 'organizer' || t === 'organizers' || t === 'organisers')
    return 'organiser'
  return 'talent'
}

function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = obj[k]
    if (v != null && String(v).trim() !== '') return String(v)
  }
  return ''
}

function pickId(obj: Record<string, unknown>, keys: string[]): string | number | null {
  for (const k of keys) {
    const v = obj[k]
    if (v != null && v !== '') return v as string | number
  }
  return null
}

function normalizeOne(raw: Record<string, unknown>, index: number): AccountInviteRow {
  const eventObj =
    raw.event && typeof raw.event === 'object'
      ? (raw.event as Record<string, unknown>)
      : null
  const eventId =
    eventObj && pickId(eventObj, ['id', 'event_id']) != null
      ? pickId(eventObj, ['id', 'event_id'])
      : pickId(raw, ['event_id', 'eventId'])

  const eventTitle = eventObj
    ? pickString(eventObj, ['title', 'name'])
    : pickString(raw, ['event_title', 'event_name', 'eventTitle', 'title'])

  const name = pickString(raw, [
    'name',
    'display_name',
    'user_name',
    'full_name',
    'title',
  ])

  const genre = pickString(raw, ['genre']) || null
  const category = pickString(raw, ['category']) || null
  const slug = pickString(raw, ['slug', 'profile_slug']) || null
  const profileId = pickId(raw, ['profile_id', 'profileId', 'user_id'])

  const imageUrl = pickString(raw, [
    'image_path',
    'image_url',
    'avatar_url',
    'profile_image',
    'photo',
    'image',
  ])
  if (!imageUrl && eventObj) {
    // nested profile on some APIs
  }

  const viewProfileUrl = pickString(raw, [
    'profile_url',
    'view_url',
    'public_url',
    'url',
  ])

  const typeRaw =
    raw.invite_type ?? raw.type ?? raw.role ?? raw.profile_type ?? raw.invited_type

  const id =
    pickId(raw, ['id', 'invite_id']) ??
    (eventId != null && profileId != null
      ? `${eventId}-${profileId}`
      : `invite-${index}`)

  return {
    id,
    name: name || 'Unknown',
    genre,
    category,
    slug: slug || null,
    profileId,
    inviteType: mapInviteType(typeRaw),
    eventId,
    eventTitle: eventTitle || 'Event',
    imageUrl: imageUrl || null,
    viewProfileUrl: viewProfileUrl || null,
    raw,
  }
}

function extractRows(payload: unknown): unknown[] {
  if (!payload || typeof payload !== 'object') return []
  const p = payload as Record<string, unknown>
  if (Array.isArray(p)) return p
  if (Array.isArray(p.data)) return p.data as unknown[]
  const data = p.data
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.invites)) return d.invites
    if (Array.isArray(d.data)) return d.data
  }
  if (Array.isArray(p.invites)) return p.invites
  return []
}

function extractSummary(payload: unknown, invites: AccountInviteRow[]): AccountInvitesSummary {
  if (!payload || typeof payload !== 'object') return buildSummaryFromInvites(invites)
  const p = payload as Record<string, unknown>
  let s: Record<string, unknown> | null = null
  if (p.summary && typeof p.summary === 'object' && !Array.isArray(p.summary)) {
    s = p.summary as Record<string, unknown>
  } else if (p.data && typeof p.data === 'object' && !Array.isArray(p.data)) {
    const d = p.data as Record<string, unknown>
    if (d.summary && typeof d.summary === 'object' && !Array.isArray(d.summary)) {
      s = d.summary as Record<string, unknown>
    }
  }

  const g = (k: string, ...alts: string[]) => {
    if (!s) return NaN
    for (const key of [k, ...alts]) {
      if (key in s) {
        const v = s[key]
        if (v != null && v !== '') return Number(v)
      }
    }
    return NaN
  }

  const totalEvents = g('total_events', 'totalEvents')
  const talentsInvited = g('talents_invited', 'talentsInvited')
  const organisersInvited = g('organisers_invited', 'organizers_invited', 'organisersInvited')
  const venuesInvited = g('venues_invited', 'venuesInvited')
  const totalInvites = g('total_invites', 'totalInvites')

  if (Number.isFinite(totalInvites) && totalInvites >= 0) {
    return {
      totalEvents: Number.isFinite(totalEvents) ? totalEvents : 0,
      talentsInvited: Number.isFinite(talentsInvited) ? talentsInvited : 0,
      organisersInvited: Number.isFinite(organisersInvited) ? organisersInvited : 0,
      venuesInvited: Number.isFinite(venuesInvited) ? venuesInvited : 0,
      totalInvites: Number.isFinite(totalInvites) ? totalInvites : invites.length,
    }
  }

  return buildSummaryFromInvites(invites)
}

function buildSummaryFromInvites(invites: AccountInviteRow[]): AccountInvitesSummary {
  const byEvent = new Set<string>()
  for (const i of invites) {
    if (i.eventId != null) byEvent.add(String(i.eventId))
  }
  let t = 0
  let o = 0
  let v = 0
  for (const i of invites) {
    if (i.inviteType === 'talent') t++
    else if (i.inviteType === 'organiser') o++
    else v++
  }
  return {
    totalEvents: byEvent.size,
    talentsInvited: t,
    organisersInvited: o,
    venuesInvited: v,
    totalInvites: invites.length,
  }
}

export interface AccountInvitesResult {
  success: boolean
  message?: string
  invites: AccountInviteRow[]
  summary: AccountInvitesSummary
}

export async function fetchAccountInvites(): Promise<AccountInvitesResult> {
  try {
    const res = await api.get<Record<string, unknown>>('my-account/invites')
    const body = res.data
    const success = body?.success !== false
    const rows = extractRows(body).map((r, i) =>
      normalizeOne(
        r && typeof r === 'object' ? (r as Record<string, unknown>) : ({} as Record<string, unknown>),
        i,
      ),
    )
    const summary = success ? extractSummary(body, rows) : { ...EMPTY_SUMMARY }
    return { success, message: typeof body?.message === 'string' ? body.message : undefined, invites: rows, summary }
  } catch (e) {
    const err = e as AxiosError<{ message?: string }>
    return {
      success: false,
      message: err.response?.data?.message || err.message || 'Failed to load invites',
      invites: [],
      summary: { ...EMPTY_SUMMARY },
    }
  }
}

/**
 * DELETE /api/my-account/invites — backend may expect invite id in JSON body.
 */
export async function deleteAccountInvite(
  inviteId: string | number,
): Promise<{ success: boolean; message?: string }> {
  const parse = (res: { data: Record<string, unknown> }) => {
    const body = res.data
    return {
      success: body?.success !== false,
      message: typeof body?.message === 'string' ? body.message : undefined,
    }
  }
  try {
    const res = await api.delete<Record<string, unknown>>('my-account/invites', {
      data: { id: inviteId },
    })
    return parse(res)
  } catch (e) {
    const first = e as AxiosError<{ message?: string }>
    if (first.response?.status === 404 || first.response?.status === 405) {
      try {
        const res = await api.delete<Record<string, unknown>>(
          `my-account/invites/${encodeURIComponent(String(inviteId))}`,
        )
        return parse(res)
      } catch (e2) {
        const err = e2 as AxiosError<{ message?: string }>
        return {
          success: false,
          message: err.response?.data?.message || err.message || 'Failed to remove invite',
        }
      }
    }
    const err = first
    return {
      success: false,
      message: err.response?.data?.message || err.message || 'Failed to remove invite',
    }
  }
}
