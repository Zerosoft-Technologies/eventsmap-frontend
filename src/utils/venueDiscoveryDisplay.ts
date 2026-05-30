/** Dog policy slugs (Create Venue Premium) → display labels. */
export const ALLOWANCE_OF_DOGS_LABELS: Record<string, string> = {
  'all-dogs': 'All dogs allowed',
  'small-dogs': 'Small dogs only, except for assistance dogs',
  'no-dogs-assistance': 'No dogs allowed, except for assistance dogs',
  'no-dogs-included': 'No dogs allowed, assistance dogs included',
}

function apiBoolToNullable(v: unknown): boolean | null {
  if (v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true' || v === 'yes') return true
  if (v === false || v === 0 || v === '0' || String(v).toLowerCase() === 'false' || v === 'no') return false
  return null
}

export function resolveAllowanceOfDogsLabel(
  profile: Record<string, unknown> | null | undefined,
): string | null {
  if (!profile) return null
  const slug = profile.allowance_of_dogs
  if (typeof slug === 'string' && slug.trim()) {
    return ALLOWANCE_OF_DOGS_LABELS[slug.trim()] ?? slug.trim()
  }
  const legacy = profile.allow_dogs
  if (legacy === true || legacy === 1 || legacy === '1' || String(legacy).toLowerCase() === 'true') {
    return ALLOWANCE_OF_DOGS_LABELS['all-dogs'] ?? null
  }
  if (legacy === false || legacy === 0 || legacy === '0' || String(legacy).toLowerCase() === 'false') {
    return ALLOWANCE_OF_DOGS_LABELS['no-dogs-included'] ?? null
  }
  return null
}

export type VenueFeatureRow = { key: string; label: string; yes: boolean }

/** Venue feature booleans saved from Create Venue Premium. */
export function resolveVenueFeatureRows(
  profile: Record<string, unknown> | null | undefined,
): VenueFeatureRow[] {
  if (!profile) return []
  const specs: Array<{ key: string; label: string; raw: unknown }> = [
    { key: 'wheelchair', label: 'Wheelchair accessible', raw: profile.wheelchair_accessible },
    {
      key: 'parking',
      label: 'Accessible parking near entrance',
      raw:
        profile.accessible_parking_close_to_entrance ??
        profile.accessible_parking ??
        profile.parking,
    },
    { key: 'valet', label: 'Valet parking', raw: profile.valet_parking ?? profile.valet },
    {
      key: 'play',
      label: "Children's play area",
      raw: profile.childrens_play_area ?? profile.play_area,
    },
  ]
  return specs
    .map(({ key, label, raw }) => {
      const v = apiBoolToNullable(raw)
      if (v === null) return null
      return { key, label, yes: v }
    })
    .filter((r): r is VenueFeatureRow => r != null)
}

export function resolveVenueDescriptionItems(
  profile: Record<string, unknown> | null | undefined,
): string[] {
  if (!profile) return []
  const raw = profile.description_items
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => (typeof item === 'string' ? item.trim() : String(item ?? '').trim()))
    .filter(Boolean)
}

export function venueHasAmenitiesContent(
  profile: Record<string, unknown> | null | undefined,
): boolean {
  return (
    resolveVenueDescriptionItems(profile).length > 0 ||
    resolveVenueFeatureRows(profile).length > 0 ||
    !!resolveAllowanceOfDogsLabel(profile)
  )
}
