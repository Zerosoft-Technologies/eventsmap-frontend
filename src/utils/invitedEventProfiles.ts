import {
  normalizeInvitationProfile,
  type InvitationProfile,
} from '@/api/invitationProfiles'

export type InvitedProfileKind = 'talent' | 'organiser' | 'venue'

const V2_FIELD: Record<InvitedProfileKind, string> = {
  talent: 'talent_v2',
  organiser: 'organiser_v2',
  venue: 'venue_v2',
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === 'object' && !Array.isArray(v)
}

/**
 * Map API invited_*_objects entry → invitation picker profile (profile PK + display name).
 */
export function invitedObjectToProfile(
  raw: unknown,
  kind: InvitedProfileKind,
): InvitationProfile | null {
  if (!isRecord(raw)) return null

  const v2 = isRecord(raw[V2_FIELD[kind]]) ? (raw[V2_FIELD[kind]] as Record<string, unknown>) : null
  const profileId = v2?.id ?? raw.profile_id ?? raw.id

  const name =
    (typeof v2?.title === 'string' && v2.title.trim()) ||
    (typeof raw.name === 'string' && raw.name.trim()) ||
    ''

  const countryRaw =
    (typeof v2?.country === 'string' && v2.country) ||
    (typeof raw.country === 'string' && raw.country) ||
    (typeof v2?.city === 'string' && v2.city) ||
    ''

  return normalizeInvitationProfile({
    id: profileId,
    name,
    title: name,
    profile_type: kind,
    account_type: raw.account_type ?? v2?.account_type,
    country: countryRaw,
  })
}

/**
 * Resolve invited profile IDs for the picker from id arrays and/or *_objects payloads.
 */
export function parseInvitedProfileIds(
  ids: unknown,
  objects: unknown,
  kind: InvitedProfileKind,
): string[] {
  const out: string[] = []
  const seen = new Set<string>()

  const add = (value: unknown) => {
    if (value == null || value === '') return
    const s = String(value).trim()
    if (!s || seen.has(s)) return
    seen.add(s)
    out.push(s)
  }

  if (Array.isArray(ids)) {
    for (const entry of ids) {
      if (isRecord(entry)) {
        const profile = invitedObjectToProfile(entry, kind)
        if (profile) add(profile.id)
        else add(entry.profile_id ?? entry.id)
      } else {
        add(entry)
      }
    }
  }

  if (Array.isArray(objects)) {
    for (const obj of objects) {
      const profile = invitedObjectToProfile(obj, kind)
      if (profile) add(profile.id)
    }
  }

  return out
}

export function profilesFromInvitedObjects(
  objects: unknown,
  kind: InvitedProfileKind,
): InvitationProfile[] {
  if (!Array.isArray(objects)) return []
  return objects
    .map((o) => invitedObjectToProfile(o, kind))
    .filter((p): p is InvitationProfile => p != null)
}
