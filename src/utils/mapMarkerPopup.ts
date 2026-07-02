import type { Marker } from 'maplibre-gl'

export type MapMarkerPool = Map<string, { marker: Marker; el: HTMLElement }>

/** Close every open marker popup except the one being activated. */
export function closeOtherMapPopups(
  pools: MapMarkerPool[],
  exceptMarker?: Marker | null,
) {
  for (const pool of pools) {
    for (const { marker } of pool.values()) {
      if (marker === exceptMarker) continue
      const popup = marker.getPopup()
      if (popup?.isOpen()) marker.togglePopup()
    }
  }
}

export type AttachMarkerPopupOptions = {
  flyOnClick?: boolean
  easeTo?: (lng: number, lat: number) => void
  markerPools?: MapMarkerPool[]
}

export type ClusterMemberPoint = {
  latitude: number
  longitude: number
}

export type AttachClusterMarkerOptions = {
  getMemberPoints: () => ClusterMemberPoint[]
  easeToCluster: (
    centerLng: number,
    centerLat: number,
    members: ClusterMemberPoint[],
  ) => void
  getZoom: () => number
  markerPools?: MapMarkerPool[]
  /** At this zoom and above, cluster click opens the popup instead of zooming further. */
  maxZoomBeforePopup?: number
}

/**
 * MapLibre markers need explicit click handling; pan/zoom must not steal the event.
 * Uses bottom anchor so the pin tip sits on the coordinate.
 */
export function attachMarkerPopupClick(
  marker: Marker,
  el: HTMLElement,
  lng: number,
  lat: number,
  options: AttachMarkerPopupOptions = {},
) {
  const { flyOnClick = true, easeTo, markerPools = [] } = options

  el.classList.add('no-hover', 'map-marker-interactive')
  if (!el.style.pointerEvents) el.style.pointerEvents = 'auto'

  const activate = (e?: Event) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()

    closeOtherMapPopups(markerPools, marker)

    const popup = marker.getPopup()
    if (!popup) return

    if (popup.isOpen()) {
      marker.togglePopup()
      return
    }

    if (flyOnClick && easeTo) easeTo(lng, lat)
    marker.togglePopup()
  }

  el.addEventListener('click', activate)
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      activate(e)
    }
  })
}

/**
 * Cluster markers zoom the map to reveal underlying pins (Leaflet-style).
 * Popup carousel is only used when already zoomed in and pins still overlap.
 */
export function attachClusterMarkerClick(
  marker: Marker,
  el: HTMLElement,
  lng: number,
  lat: number,
  options: AttachClusterMarkerOptions,
) {
  const {
    easeToCluster,
    getMemberPoints,
    getZoom,
    markerPools = [],
    maxZoomBeforePopup = 17,
  } = options

  el.classList.add('no-hover', 'map-marker-interactive')
  if (!el.style.pointerEvents) el.style.pointerEvents = 'auto'

  const activate = (e?: Event) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()

    closeOtherMapPopups(markerPools, marker)

    const popup = marker.getPopup()
    const zoom = getZoom()

    if (popup && zoom >= maxZoomBeforePopup) {
      marker.togglePopup()
      return
    }

    easeToCluster(lng, lat, getMemberPoints())
  }

  el.addEventListener('click', activate)
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      activate(e)
    }
  })
}
