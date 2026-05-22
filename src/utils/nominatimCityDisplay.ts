/** OSM/Nominatim `address` keys that usually carry a locality / city label */

const CITY_LIKE_KEYS = [
  'city',
  'town',
  'village',
  'municipality',
  'borough',
  'city_district',
  'suburb',
  'hamlet',
  'county',
] as const

export function cityFromOsmAddress(address?: Record<string, unknown> | null): string {
  if (!address || typeof address !== 'object') return ''
  for (const k of CITY_LIKE_KEYS) {
    const v = address[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return ''
}

/**
 * Single place to derive a short city label for UI from a Nominatim result:
 * prefers structured `address`, then falls back to `display_name` segments.
 */
export function locationCityDisplayFromNominatim(
  displayName: string,
  address?: Record<string, unknown> | null,
): string {
  const fromAddr = cityFromOsmAddress(address)
  if (fromAddr) return fromAddr
  return inferCityFromDisplayName(displayName)
}

function inferCityFromDisplayName(displayName: string): string {
  const raw = displayName?.trim()
  if (!raw) return ''
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0] ?? ''
  if (parts.length >= 3) return (parts[1] ?? parts[0]) ?? ''
  return (parts[1] ?? parts[0]) ?? ''
}

/**
 * Loaded profile only has stored full address string — best-effort city for display.
 */
export function cityDisplayFromStoredFullAddress(full: string): string {
  if (!full?.trim()) return ''
  const parts = full.split(',').map((s) => s.trim()).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0] ?? ''
  if (parts.length === 2) return parts[1] ?? ''
  return (parts[Math.max(1, parts.length - 3)] ?? parts[1] ?? parts[0]) ?? ''
}

/** UK / US / EU-style postcodes — excluded from public location lines */
export function looksLikePostcode(segment: string): boolean {
  const t = segment.trim()
  if (!t) return false
  if (/^\d{4,6}(-\d{4})?$/.test(t)) return true
  if (/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(t)) return true
  if (/^\d{4,5}\s+[A-Za-zÀ-ÿ]/.test(t)) return true
  return false
}

function cityOrRegionFromAddress(full: string): string {
  if (!full?.trim()) return ''
  const parts = full.split(',').map((s) => s.trim()).filter(Boolean)
  for (const part of parts) {
    if (looksLikePostcode(part)) continue
    if (part.length >= 2) return part
  }
  const inferred = cityDisplayFromStoredFullAddress(full)
  if (inferred && !looksLikePostcode(inferred)) return inferred
  return ''
}

type ProfileLocationSource = {
  city?: string | null
  address?: string | null
  country?: string | null
}

/** Short public location line: talents show city/region only (never postcode). */
export function displayProfileLocationLine(
  profile: ProfileLocationSource | null | undefined,
  profileType?: string,
): string {
  if (!profile) return ''
  if (profileType === 'talents') {
    if (profile.city?.trim()) return profile.city.trim()
    const fromAddr = cityOrRegionFromAddress(profile.address || '')
    if (fromAddr) return fromAddr
    return profile.country?.trim() || ''
  }
  return profile.address?.trim() || profile.city?.trim() || profile.country?.trim() || ''
}
