export type MapViewportBounds = {
  west: number
  south: number
  east: number
  north: number
}

export function isPointInViewportBounds(
  lat: number | null | undefined,
  lng: number | null | undefined,
  bounds: MapViewportBounds | null | undefined,
): boolean {
  if (!bounds) return true
  if (lat == null || lng == null) return false
  const la = Number(lat)
  const ln = Number(lng)
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return false
  return la >= bounds.south && la <= bounds.north && ln >= bounds.west && ln <= bounds.east
}

export function pickItemLatLng(item: Record<string, unknown>): { lat: number; lng: number } | null {
  const lat = item.lat ?? item.latitude
  const lng = item.lng ?? item.longitude
  if (lat == null || lng == null) return null
  const la = Number(lat)
  const ln = Number(lng)
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null
  return { lat: la, lng: ln }
}

export function filterItemsByMapViewport<T extends Record<string, unknown>>(
  items: T[],
  bounds: MapViewportBounds | null | undefined,
): T[] {
  if (!bounds || !Array.isArray(items)) return items
  return items.filter((item) => {
    const ll = pickItemLatLng(item)
    if (!ll) return false
    return isPointInViewportBounds(ll.lat, ll.lng, bounds)
  })
}
