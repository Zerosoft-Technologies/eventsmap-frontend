/** Decimal places for grouping — fewer decimals at lower zoom merges nearby pins. */
export function clusterPrecisionForZoom(zoom: number): number {
  if (zoom >= 17) return 7
  if (zoom >= 15) return 6
  if (zoom >= 13) return 5
  if (zoom >= 11) return 4
  if (zoom >= 9) return 3
  return 2
}

export interface MapCluster<T> {
  /** Stable bucket key from rounded coordinates */
  key: string
  latitude: number
  longitude: number
  items: T[]
}

export function groupIntoMapClusters<T>(
  points: Array<{ latitude: number; longitude: number; item: T }>,
  precision: number,
): MapCluster<T>[] {
  const buckets = new Map<string, MapCluster<T>>()

  type Bucket = MapCluster<T> & { sumLat: number; sumLng: number; count: number }
  const internal = new Map<string, Bucket>()

  for (const pt of points) {
    const lat = Number(pt.latitude)
    const lng = Number(pt.longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue

    const key = `${lng.toFixed(precision)},${lat.toFixed(precision)}`
    let cluster = internal.get(key)
    if (!cluster) {
      cluster = { key, latitude: lat, longitude: lng, items: [], sumLat: 0, sumLng: 0, count: 0 }
      internal.set(key, cluster)
    }
    cluster.items.push(pt.item)
    cluster.sumLat += lat
    cluster.sumLng += lng
    cluster.count += 1
  }

  for (const cluster of internal.values()) {
    if (cluster.count > 1) {
      cluster.latitude = cluster.sumLat / cluster.count
      cluster.longitude = cluster.sumLng / cluster.count
    }
    buckets.set(cluster.key, {
      key: cluster.key,
      latitude: cluster.latitude,
      longitude: cluster.longitude,
      items: cluster.items,
    })
  }

  return Array.from(buckets.values())
}

export type MapClusterMarkerVariant = 'profile' | 'event'

/** Pin-shaped cluster marker with count (tip anchors to map coordinate). */
export function createMapClusterMarkerElement(
  count: number,
  variant: MapClusterMarkerVariant = 'profile',
): HTMLDivElement {
  const el = document.createElement('div')
  const variantClass =
    variant === 'event' ? 'map-event-cluster-marker' : 'map-profile-cluster-marker'
  el.className = `no-hover map-cluster-pin map-marker-interactive ${variantClass}`
  el.style.width = '56px'
  el.style.height = '66px'
  el.style.cursor = 'pointer'
  el.style.pointerEvents = 'auto'
  el.setAttribute('role', 'button')
  el.tabIndex = 0
  el.setAttribute(
    'aria-label',
    variant === 'event' ? `${count} events at this location` : `${count} profiles at this location`,
  )

  const fill = variant === 'event' ? '#FF7700' : '#0061FF'
  const label = count > 99 ? '99+' : String(count)

  el.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 66" fill="none"
      style="width:100%;height:100%;display:block;pointer-events:auto" aria-hidden="true">
      <ellipse cx="28" cy="62" rx="10" ry="3" fill="rgba(0,0,0,0.2)"/>
      <path d="M28 4C17.46 4 9 12.46 9 23c0 12.25 19 38 19 38s19-25.75 19-38C47 12.46 38.54 4 28 4z"
        fill="${fill}" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="28" cy="23" r="12" fill="#ffffff"/>
      <text x="28" y="27.5" text-anchor="middle"
        font-family="Inter,system-ui,sans-serif" font-size="14" font-weight="700" fill="${fill}">${label}</text>
    </svg>`

  return el
}
