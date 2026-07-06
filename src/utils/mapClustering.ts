/** Web Mercator pixel size (px) per screen cell — markers in the same cell become one cluster. */
export function pixelCellSizeForZoom(zoom: number): number {
  if (zoom <= 3) return 90
  if (zoom <= 6) return 75
  if (zoom <= 10) return 65
  if (zoom <= 14) return 55
  return 45
}

/** @deprecated Kept for callers that still reference zoom precision; clustering uses pixels now. */
export function clusterPrecisionForZoom(zoom: number): number {
  if (zoom >= 18) return 6
  if (zoom >= 16) return 5
  if (zoom >= 14) return 4
  if (zoom >= 12) return 3
  if (zoom >= 10) return 2
  if (zoom >= 8) return 1
  return 0
}

function lngLatToWorldPixel(lng: number, lat: number, zoom: number): { x: number; y: number } {
  const scale = 256 * 2 ** zoom
  const x = ((lng + 180) / 360) * scale
  const clampedLat = Math.max(-85.05112878, Math.min(85.05112878, lat))
  const sinLat = Math.sin((clampedLat * Math.PI) / 180)
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale
  return { x, y }
}

function haversineDistanceM(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export interface MapCluster<T> {
  /** Stable screen-cell bucket key */
  key: string
  latitude: number
  longitude: number
  items: T[]
}

export type MapPoint<T> = { latitude: number; longitude: number; item: T }

/**
 * Group markers by screen pixel grid at the current zoom (Leaflet/Supercluster style).
 * Markers that overlap visually always share one cluster with the correct total count.
 */
export function groupIntoMapClusters<T>(
  points: Array<MapPoint<T>>,
  zoom: number,
): MapCluster<T>[] {
  const cellSize = pixelCellSizeForZoom(zoom)

  type Bucket = { key: string; items: T[]; sumLat: number; sumLng: number; count: number }
  const buckets = new Map<string, Bucket>()

  for (const pt of points) {
    const lat = Number(pt.latitude)
    const lng = Number(pt.longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue

    const { x, y } = lngLatToWorldPixel(lng, lat, zoom)
    const cellX = Math.floor(x / cellSize)
    const cellY = Math.floor(y / cellSize)
    const key = `${cellX}:${cellY}`

    let bucket = buckets.get(key)
    if (!bucket) {
      bucket = { key, items: [], sumLat: 0, sumLng: 0, count: 0 }
      buckets.set(key, bucket)
    }
    bucket.items.push(pt.item)
    bucket.sumLat += lat
    bucket.sumLng += lng
    bucket.count += 1
  }

  const clusters: MapCluster<T>[] = []
  for (const bucket of buckets.values()) {
    clusters.push({
      key: bucket.key,
      latitude: bucket.sumLat / bucket.count,
      longitude: bucket.sumLng / bucket.count,
      items: bucket.items,
    })
  }
  return clusters
}

export type ClusterMemberPoint = {
  latitude: number
  longitude: number
}

/** True when every member is within thresholdM of the cluster centre (or each other). */
export function areMembersColocated(
  members: ClusterMemberPoint[],
  centerLat: number,
  centerLng: number,
  thresholdM = 80,
): boolean {
  if (members.length <= 1) return true
  return members.every(
    (m) =>
      haversineDistanceM(centerLat, centerLng, m.latitude, m.longitude) <= thresholdM,
  )
}

/** Ring radius (m) — wider at lower zoom so spiderfied pins stay visible. */
export function spiderfyRadiusMetersForZoom(zoom: number, count: number): number {
  const base = zoom >= 16 ? 50 : zoom >= 14 ? 90 : zoom >= 10 ? 160 : 280
  return base + Math.min(count, 12) * 8
}

/** Radial offsets (degrees) for spiderfied markers around a centre. */
export function spiderfyLatLngOffsets(
  count: number,
  centerLat: number,
  radiusM = 40,
): Array<{ lat: number; lng: number }> {
  if (count <= 0) return []
  if (count === 1) return [{ lat: 0, lng: 0 }]
  const latScale = radiusM / 111320
  const lngScale = radiusM / (111320 * Math.cos((centerLat * Math.PI) / 180))
  const offsets: Array<{ lat: number; lng: number }> = []
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2
    offsets.push({
      lat: latScale * Math.cos(angle),
      lng: lngScale * Math.sin(angle),
    })
  }
  return offsets
}

export type MapClusterMarkerVariant = 'profile' | 'event'

/** Update count label on an existing cluster marker element. */
export function updateMapClusterMarkerCount(el: HTMLElement, count: number, fillColor: string) {
  const label = count > 99 ? '99+' : String(count)
  const text = el.querySelector('text')
  if (text) {
    text.textContent = label
    text.setAttribute('fill', fillColor)
    return
  }
  const path = el.querySelector('path')
  if (path) path.setAttribute('fill', fillColor)
}

/** Pin-shaped cluster marker with count (tip anchors to map coordinate). */
export function createMapClusterMarkerElement(
  count: number,
  variant: MapClusterMarkerVariant = 'profile',
  fillColor?: string,
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

  const fill = fillColor ?? (variant === 'event' ? '#FF7700' : '#0061FF')
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
