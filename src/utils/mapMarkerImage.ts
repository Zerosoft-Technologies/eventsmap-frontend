/** Resolve a HTTP(S) cover URL suitable for map marker thumbnails. */
export function discoveryCoverImageUrl(
  entity: {
    cover_image?: string | null
    profile_image?: string | null
    image_url?: string | null
    main_image_url?: string | null
  } | null | undefined,
): string | null {
  if (!entity) return null

  const candidates = [
    entity.cover_image,
    entity.profile_image,
    entity.image_url,
    entity.main_image_url,
  ]

  for (const value of candidates) {
    if (typeof value !== 'string') continue
    const trimmed = value.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
      return trimmed
    }
  }

  return null
}

export function isTruthyFlag(value: unknown): boolean {
  return value === true || value === 1 || value === '1' || value === 'true'
}

/** Premium listings may opt in to showing their main image inside the map pin circle. */
export function shouldUsePhotoMapMarker(
  entity: {
    event_type?: string | null
    show_photo_map_marker?: unknown
  } | null | undefined,
): boolean {
  if (!entity || entity.event_type != 'premium') return false
  return isTruthyFlag(entity.show_photo_map_marker)
}

export type MapMarkerVisualVariant = 'photo' | 'default'

export function eventMarkerPoolKey(eventId: number): string {
  return `e-${Number(eventId)}`
}

export function profileMarkerPoolKey(
  profileId: number,
  profileType?: string | null,
): string {
  const type = profileType ? String(profileType).toLowerCase() : 'profile'
  return `p-${type}-${Number(profileId)}`
}

export function profileClusterPoolKey(
  clusterKey: string,
  profileType?: string | null,
): string {
  const type = profileType ? String(profileType).toLowerCase() : 'profile'
  return `c-${type}-${clusterKey}`
}

export function eventMarkerVariant(event: {
  event_type?: string
  show_photo_map_marker?: unknown
  cover_image?: string | null
}): MapMarkerVisualVariant {
  const usePhoto = shouldUsePhotoMapMarker(event) && !!discoveryCoverImageUrl(event)
  return usePhoto ? 'photo' : 'default'
}

export function profileMarkerVariant(profile: {
  profileType?: string | null
  profile_type?: string | null
  event_type?: string
  show_photo_map_marker?: unknown
  cover_image?: string | null
  profile_image?: string | null
}): MapMarkerVisualVariant | string {
  const pt = profile.profileType ?? profile.profile_type ?? 'profile'
  const usePhoto = shouldUsePhotoMapMarker(profile) && !!discoveryCoverImageUrl(profile)
  return `${pt}-${usePhoto ? 'photo' : 'default'}`
}

/** Deduplicate map listing rows by numeric id (last occurrence wins). */
export function dedupeMapItemsById<T extends { id?: unknown }>(items: T[]): T[] {
  const byId = new Map<number, T>()
  for (const item of items) {
    const id = Number(item?.id)
    if (!Number.isFinite(id)) continue
    byId.set(id, item)
  }
  return [...byId.values()]
}

function cssUrl(value: string): string {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

/** Modern circular photo marker — accent ring, cover image, minimal pointer tail. */
export function createPhotoMapMarkerElement(
  color: string,
  imageUrl: string,
  idPrefix: string,
): HTMLDivElement {
  const safeUrl = cssUrl(imageUrl)
  const el = document.createElement('div')
  el.className = 'map-photo-pin-marker map-photo-pin-marker--modern map-marker-interactive'
  el.style.setProperty('--pin-accent', color)
  el.style.setProperty('--pin-photo', `url("${safeUrl}")`)
  el.dataset.markerPhotoId = idPrefix

  el.innerHTML = `
    <div class="map-photo-pin-marker__shell">
      <div class="map-photo-pin-marker__photo" aria-hidden="true"></div>
    </div>
    <div class="map-photo-pin-marker__tail" aria-hidden="true"></div>`

  return el
}
