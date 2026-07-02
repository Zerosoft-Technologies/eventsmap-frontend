/** Street / neighbourhood zoom — ~300 m visible at equator. */
export const MAP_NEIGHBOURHOOD_ZOOM = 15

export function isGeolocationSecureContext(): boolean {
  if (typeof window === 'undefined') return false
  return window.isSecureContext
}

export function createUserLocationMarkerElement(): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'map-user-location-marker'
  el.style.cssText =
    'width:16px;height:16px;border-radius:50%;background:#3B82F6;border:3px solid #fff;box-shadow:0 0 8px rgba(59,130,246,0.6);'
  return el
}

export async function reverseGeocodeCity(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    )
    const data = await res.json()
    const addr = data.address ?? {}
    return (
      addr.city ||
      addr.town ||
      addr.village ||
      addr.municipality ||
      addr.suburb ||
      addr.county ||
      null
    )
  } catch {
    return null
  }
}
