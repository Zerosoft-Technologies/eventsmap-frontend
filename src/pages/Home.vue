<template>
  <div ref="mapContainer" class="map-container tw:w-full tw:h-screen"></div>
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import { createApp, h } from 'vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Event from '../components/Event.vue'
import DiscoveryProfileCard from '../components/DiscoveryProfileCard.vue'
import MapProfileClusterList from '../components/map/MapProfileClusterList.vue'
import MapEventClusterList from '../components/map/MapEventClusterList.vue'
import {
  MAP_OPEN_EVENT_DETAIL,
  MAP_OPEN_PROFILE_DETAIL,
  MAP_RESTORE_EVENT_POPUP,
  MAP_POPUP_CLOSED,
  MAP_RESET_HOME,
} from '@/utils/mapPopupBridge'
import { pickProfileLatLng } from '@/api/discoveryProfiles'
import { useMapStore } from '@/stores/mapStore'
import { clusterPrecisionForZoom, createMapClusterMarkerElement } from '@/utils/mapClustering'
import { attachMarkerPopupClick } from '@/utils/mapMarkerPopup'
import { groupEventsIntoClusters } from '@/utils/eventMapClustering'
import { groupProfilesIntoClusters } from '@/utils/profileMapClustering'
import { eventMapFocusPulse } from '@/utils/mapEventFocus'
import {
  discoveryCoverImageUrl,
  shouldUsePhotoMapMarker,
  profileMarkerPoolKey,
  eventMarkerPoolKey,
  eventMarkerVariant,
  profileMarkerVariant,
  dedupeMapItemsById,
  createPhotoMapMarkerElement,
} from '@/utils/mapMarkerImage'
import { filterItemsByMapViewport } from '@/utils/mapViewportFilter'
import { filterActiveDiscoveryEvents } from '@/utils/eventSchedule'
import { circlePolygonFeature } from '@/utils/mapCircleGeo'
import i18n from '../i18n'

/** Default talent address region radius on the discovery map (km). */
const TALENT_REGION_RADIUS_KM = 5

/** City / neighbourhood zoom (~1 km visible area at equator). */
const MAP_CITY_ZOOM = 13

const mapContainer = ref(null)

let map
const mapStore = useMapStore()
const markerPool = new Map()
const profileMarkerPool = new Map()
/** Marker whose popup was closed when opening View Event from the map info window */
let suspendedEventPopupMarker = null

const style = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm-layer', type: 'raster', source: 'osm' }],
}

function getMapVisibleEvents() {
  const all = dedupeMapItemsById(mapStore.mapEventItems)
  const active = filterActiveDiscoveryEvents(all)
  return filterItemsByMapViewport(active, mapStore.mapViewportBounds)
}

function getMapVisibleProfiles() {
  const all = dedupeMapItemsById(mapStore.mapProfileItems)
  return filterItemsByMapViewport(all, mapStore.mapViewportBounds)
}

function syncTalentRegionCircles() {
  if (!map?.loaded()) return
  const sourceId = 'talent-regions'
  const fillLayerId = 'talent-regions-fill'
  const lineLayerId = 'talent-regions-line'

  const talents = getMapVisibleProfiles().filter((p) => {
    const type = p.profileType ?? p.profile_type
    return type === 'talents' || type === 'talent'
  })

  const features = talents
    .map((p) => {
      const ll = pickProfileLatLng(p)
      if (!ll) return null
      return circlePolygonFeature(ll.latitude, ll.longitude, TALENT_REGION_RADIUS_KM, {
        id: String(p.id ?? ''),
      })
    })
    .filter(Boolean)

  const data = { type: 'FeatureCollection', features }

  if (map.getSource(sourceId)) {
    map.getSource(sourceId).setData(data)
    return
  }

  map.addSource(sourceId, { type: 'geojson', data })
  map.addLayer({
    id: fillLayerId,
    type: 'fill',
    source: sourceId,
    paint: {
      'fill-color': '#FF7700',
      'fill-opacity': 0.12,
    },
  })
  map.addLayer({
    id: lineLayerId,
    type: 'line',
    source: sourceId,
    paint: {
      'line-color': '#FF7700',
      'line-width': 2,
      'line-opacity': 0.45,
    },
  })
}

function clearTalentRegionCircles() {
  if (!map?.loaded()) return
  const sourceId = 'talent-regions'
  const fillLayerId = 'talent-regions-fill'
  const lineLayerId = 'talent-regions-line'
  if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId)
  if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId)
  if (map.getSource(sourceId)) map.removeSource(sourceId)
}

function eventLngLat(ev) {
  const lat = ev.lat ?? ev.latitude
  const lng = ev.lng ?? ev.longitude
  if (lat == null || lng == null) return null
  const la = Number(lat)
  const ln = Number(lng)
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null
  return { lat: la, lng: ln }
}

function collectMapPoints() {
  const points = []
  for (const ev of getMapVisibleEvents()) {
    const ll = eventLngLat(ev)
    if (ll) points.push(ll)
  }
  for (const p of getMapVisibleProfiles()) {
    const ll = pickProfileLatLng(p)
    if (ll) points.push({ lat: ll.latitude, lng: ll.longitude })
  }
  return points
}

function fitMapToResults() {
  if (!map) return
  const points = collectMapPoints()
  const loc = mapStore.appliedLocation

  if (points.length === 0) {
    if (loc?.lat != null && loc?.lng != null) {
      map.flyTo({
        center: [loc.lng, loc.lat],
        zoom: MAP_CITY_ZOOM,
        speed: 1.2,
        curve: 1.42,
        essential: true,
      })
    }
    publishMapViewportBounds()
    return
  }

  if (points.length === 1) {
    map.flyTo({
      center: [points[0].lng, points[0].lat],
      zoom: MAP_CITY_ZOOM,
      speed: 1.2,
      curve: 1.42,
      essential: true,
    })
    publishMapViewportBounds()
    return
  }

  const bounds = new maplibregl.LngLatBounds()
  for (const p of points) bounds.extend([p.lng, p.lat])
  map.fitBounds(bounds, {
    padding: { top: 120, bottom: 120, left: 80, right: 80 },
    maxZoom: MAP_CITY_ZOOM,
    duration: 800,
    essential: true,
  })
  publishMapViewportBounds()
}

/** Event listing pins — branded image or premium photo circle marker */
function createEventMarkerEl(event) {
  const color = '#FF7700'
  const imageUrl = discoveryCoverImageUrl(event)
  const usePhoto = shouldUsePhotoMapMarker(event) && imageUrl

  const el = document.createElement('div')
  el.className = 'map-event-pin-marker map-marker-interactive'
  el.style.cursor = 'pointer'
  el.style.pointerEvents = 'auto'

  if (usePhoto) {
    const photoPin = createPhotoMapMarkerElement(color, imageUrl, `event-${event.id}`)
    return photoPin
  }

  el.style.width = '60px'
  el.style.height = '60px'
  el.style.backgroundImage = 'url(/marker.png)'
  el.style.backgroundSize = 'contain'
  el.style.backgroundRepeat = 'no-repeat'
  return el
}

/** Discovery profile pins — distinct colour + icon per type. No CSS transition (MapLibre uses transform while panning). */
const PROFILE_MARKER_COLORS = {
  organisers: '#6366f1',
  talents: '#10b981',
  venues: '#0ea5e9',
}

/** Material-style paths (24×24), centered inside marker disc */
const PROFILE_MARKER_ICON_D = {
  organisers:
    'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  talents:
    'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
  venues:
    'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
}

function createProfileMarkerEl(profile) {
  const profileType = profile.profileType
  const color = PROFILE_MARKER_COLORS[profileType] ?? '#6b7280'
  const d = PROFILE_MARKER_ICON_D[profileType] ?? PROFILE_MARKER_ICON_D.venues
  const imageUrl = discoveryCoverImageUrl(profile)
  const usePhoto = shouldUsePhotoMapMarker(profile) && imageUrl

  const el = document.createElement('div')
  el.className = 'map-profile-pin-marker map-marker-interactive'
  el.style.width = '52px'
  el.style.height = '62px'
  el.style.cursor = 'pointer'
  el.style.pointerEvents = 'auto'

  if (usePhoto) {
    return createPhotoMapMarkerElement(color, imageUrl, `profile-${profile.id}`)
  }

  el.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 52" fill="none" style="width:100%;height:100%;display:block" aria-hidden="true">
      <ellipse cx="22" cy="49" rx="9" ry="3" fill="rgba(0,0,0,0.18)"/>
      <path d="M22 2C14.268 2 8 8.268 8 16c0 10.5 14 32 14 32S36 26.5 36 16C36 8.268 29.732 2 22 2z"
        fill="${color}" stroke="white" stroke-width="2.5"/>
      <circle cx="22" cy="16" r="7" fill="white"/>
      <g transform="translate(22,16) scale(0.26) translate(-12,-12)">
        <path d="${d}" fill="${color}"/>
      </g>
    </svg>`
  return el
}

function mountProfileClusterPopup(profiles) {
  const popupEl = document.createElement('div')
  popupEl.classList.add('tw:relative', 'tw:bg-transparent')

  const popup = new maplibregl.Popup({
    closeButton: true,
    maxWidth: 'none',
    anchor: 'bottom',
    offset: [0, -80],
  }).setDOMContent(popupEl)
  wirePopupCloseRestoreList(popup)

  createApp({
    render: () =>
      h(MapProfileClusterList, {
        profiles,
        onSelect: (prof) => {
          popup.remove()
          window.dispatchEvent(
            new CustomEvent(MAP_OPEN_PROFILE_DETAIL, {
              detail: { profile: prof, profileType: prof.profileType },
            }),
          )
        },
      }),
  })
    .use(i18n)
    .mount(popupEl)

  return popup
}

function mountSingleProfilePopup(p) {
  const popupEl = document.createElement('div')
  popupEl.classList.add('tw:relative', 'tw:bg-white', 'tw:rounded-2xl', 'tw:p-4')

  const pt = p.profileType
  createApp({
    render: () =>
      h(DiscoveryProfileCard, {
        profile: p,
        profileType: pt,
        onViewProfile: (prof) => {
          window.dispatchEvent(
            new CustomEvent(MAP_OPEN_PROFILE_DETAIL, {
              detail: { profile: prof, profileType: pt },
            }),
          )
        },
      }),
  })
    .use(i18n)
    .mount(popupEl)

  const popup = new maplibregl.Popup({
    closeButton: false,
    maxWidth: 'none',
    anchor: 'bottom',
    offset: [0, -42],
  }).setDOMContent(popupEl)
  wirePopupCloseRestoreList(popup)
  return popup
}

function easeMapToPoint(lng, lat) {
  map.easeTo({
    center: [lng, lat],
    zoom: Math.max(map.getZoom(), 12),
    offset: [0, 250],
    duration: 600,
  })
}

function wireMapMarker(marker, el, lng, lat) {
  attachMarkerPopupClick(marker, el, lng, lat, {
    flyOnClick: true,
    easeTo: easeMapToPoint,
    markerPools: [markerPool, profileMarkerPool],
  })
}

function wirePopupCloseRestoreList(popup) {
  popup.on('close', () => {
    window.dispatchEvent(new CustomEvent(MAP_POPUP_CLOSED))
  })
}

function mountEventClusterPopup(events) {
  const popupEl = document.createElement('div')
  popupEl.classList.add('tw:relative', 'tw:bg-transparent')

  const popup = new maplibregl.Popup({
    closeButton: true,
    maxWidth: 'none',
    anchor: 'bottom',
    offset: [0, -80],
  }).setDOMContent(popupEl)
  wirePopupCloseRestoreList(popup)

  createApp({
    render: () =>
      h(MapEventClusterList, {
        events,
        onSelect: (ev) => {
          popup.remove()
          window.dispatchEvent(new CustomEvent(MAP_OPEN_EVENT_DETAIL, { detail: ev }))
        },
      }),
  })
    .use(i18n)
    .mount(popupEl)

  return popup
}

function findEventMarkerById(eventId) {
  const id = Number(eventId)
  const stableKey = eventMarkerPoolKey(id)
  const stable = markerPool.get(stableKey)
  if (stable?.marker) return stable.marker

  for (const [key, entry] of markerPool.entries()) {
    if (key === stableKey || key.startsWith(`e-${id}-`)) {
      return entry.marker ?? null
    }
  }
  return null
}

function removeEventMarkersForId(eventId, keepKey = null) {
  const id = Number(eventId)
  const prefix = `e-${id}`
  for (const [key, entry] of [...markerPool.entries()]) {
    if (keepKey && key === keepKey) continue
    if (key === prefix || key.startsWith(`${prefix}-`)) {
      entry.marker.remove()
      markerPool.delete(key)
    }
  }
}

function removeProfileMarkersForId(profileId, keepKey = null) {
  const id = Number(profileId)
  const prefix = `p-${id}`
  for (const [key, entry] of [...profileMarkerPool.entries()]) {
    if (keepKey && key === keepKey) continue
    if (key === prefix || key.startsWith(`${prefix}-`)) {
      entry.marker.remove()
      profileMarkerPool.delete(key)
    }
  }
}

function suspendOpenEventPopup(eventId) {
  const marker = findEventMarkerById(eventId)
  if (!marker) return
  const popup = marker.getPopup()
  if (!popup?.isOpen()) return
  marker.togglePopup()
  suspendedEventPopupMarker = marker
}

function restoreSuspendedEventPopup() {
  if (!suspendedEventPopupMarker) return
  const marker = suspendedEventPopupMarker
  const popup = marker.getPopup()
  if (popup && !popup.isOpen()) {
    marker.togglePopup()
  }
  suspendedEventPopupMarker = null
}

function onMapOpenEventDetail(e) {
  const ev = e?.detail
  const id = ev?.id
  if (id != null) suspendOpenEventPopup(id)
}

function onMapRestoreEventPopup() {
  restoreSuspendedEventPopup()
}

function dismissAllMapPopups() {
  for (const { marker } of markerPool.values()) {
    const popup = marker.getPopup()
    if (popup?.isOpen()) marker.togglePopup()
  }
  for (const { marker } of profileMarkerPool.values()) {
    const popup = marker.getPopup()
    if (popup?.isOpen()) marker.togglePopup()
  }
  suspendedEventPopupMarker = null
}

function onMapResetHome() {
  dismissAllMapPopups()
  if (!map) return
  const loc = mapStore.appliedLocation
  if (loc?.lat != null && loc?.lng != null) {
    map.flyTo({
      center: [loc.lng, loc.lat],
      zoom: MAP_CITY_ZOOM,
      speed: 1.2,
      curve: 1.42,
      essential: true,
    })
  }
  publishMapViewportBounds()
}

function mountSingleEventPopup(ev) {
  const popupEl = document.createElement('div')
  popupEl.classList.add('tw:relative', 'tw:bg-white', 'tw:rounded-2xl', 'tw:p-4')
  createApp({
    render: () =>
      h(Event, {
        event: ev,
        onViewEvent: (payload) => {
          window.dispatchEvent(new CustomEvent(MAP_OPEN_EVENT_DETAIL, { detail: payload }))
        },
      }),
  })
    .use(i18n)
    .mount(popupEl)
  const triangleDiv = document.createElement('div')
  triangleDiv.className =
    'tw:absolute tw:left-1/2 tw:-translate-x-1/2 tw:-bottom-2 tw:w-0 tw:h-0 tw:border-l-10 tw:border-l-transparent tw:border-r-10 tw:border-r-transparent tw:border-t-12 tw:border-t-white tw:shadow-md'
  popupEl.appendChild(triangleDiv)

  const popup = new maplibregl.Popup({
    closeButton: false,
    maxWidth: 'none',
    anchor: 'bottom',
    offset: [0, -45],
  }).setDOMContent(popupEl)
  wirePopupCloseRestoreList(popup)
  return popup
}

function clearEventMarkers() {
  for (const { marker } of markerPool.values()) marker.remove()
  markerPool.clear()
}

let eventMarkerSyncRunning = false
let eventMarkerSyncQueued = false
let profileMarkerSyncRunning = false
let profileMarkerSyncQueued = false

function syncEventMarkers() {
  if (!map?.loaded()) return
  if (eventMarkerSyncRunning) {
    eventMarkerSyncQueued = true
    return
  }
  eventMarkerSyncRunning = true

  try {
    const events = getMapVisibleEvents()
    const points = events
      .map((ev) => {
        const ll = eventLngLat(ev)
        if (!ll) return null
        return { event: ev, latitude: ll.lat, longitude: ll.lng }
      })
      .filter(Boolean)

    const precision = clusterPrecisionForZoom(map.getZoom())
    const clusters = groupEventsIntoClusters(points, precision)

    const nextKeys = new Set()
    for (const cluster of clusters) {
      if (cluster.events.length === 1) {
        nextKeys.add(eventMarkerPoolKey(cluster.events[0].id))
      } else {
        nextKeys.add(`ec-${cluster.key}`)
      }
    }

    for (const [key, { marker }] of markerPool.entries()) {
      if (!nextKeys.has(key)) {
        marker.remove()
        markerPool.delete(key)
      }
    }

    for (const cluster of clusters) {
      const lat = cluster.latitude
      const lng = cluster.longitude

      if (cluster.events.length === 1) {
        const ev = cluster.events[0]
        const key = eventMarkerPoolKey(ev.id)
        const variant = eventMarkerVariant(ev)
        const existing = markerPool.get(key)

        if (existing?.variant === variant) continue

        if (existing) {
          existing.marker.remove()
          markerPool.delete(key)
        }
        removeEventMarkersForId(ev.id, key)

        const el = createEventMarkerEl(ev)
        const popup = mountSingleEventPopup(ev)

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map)

        wireMapMarker(marker, el, lng, lat)
        markerPool.set(key, { marker, el, variant })
        continue
      }

      const key = `ec-${cluster.key}`
      if (markerPool.has(key)) continue

      const el = createMapClusterMarkerElement(cluster.events.length, 'event')
      const popup = mountEventClusterPopup(cluster.events)

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map)

      wireMapMarker(marker, el, lng, lat)
      markerPool.set(key, { marker, el })
    }
  } finally {
    eventMarkerSyncRunning = false
    if (eventMarkerSyncQueued) {
      eventMarkerSyncQueued = false
      syncEventMarkers()
    }
  }
}

function clearProfileMarkers() {
  for (const { marker } of profileMarkerPool.values()) marker.remove()
  profileMarkerPool.clear()
  clearTalentRegionCircles()
}

function syncProfileMarkers() {
  if (!map?.loaded()) return
  if (profileMarkerSyncRunning) {
    profileMarkerSyncQueued = true
    return
  }
  profileMarkerSyncRunning = true

  try {
    const profiles = getMapVisibleProfiles()
    const points = profiles
      .map((p) => {
        const ll = pickProfileLatLng(p)
        if (!ll) return null
        return {
          profile: { ...p, latitude: ll.latitude, longitude: ll.longitude },
          latitude: ll.latitude,
          longitude: ll.longitude,
        }
      })
      .filter(Boolean)

    const precision = clusterPrecisionForZoom(map.getZoom())
    const clusters = groupProfilesIntoClusters(points, precision)

    const nextKeys = new Set()
    for (const cluster of clusters) {
      if (cluster.profiles.length === 1) {
        nextKeys.add(profileMarkerPoolKey(cluster.profiles[0].id))
      } else {
        nextKeys.add(`c-${cluster.key}`)
      }
    }

    for (const [key, { marker }] of profileMarkerPool.entries()) {
      if (!nextKeys.has(key)) {
        marker.remove()
        profileMarkerPool.delete(key)
      }
    }

    for (const cluster of clusters) {
      const { latitude: lat, longitude: lng } = cluster

      if (cluster.profiles.length === 1) {
        const p = cluster.profiles[0]
        const key = profileMarkerPoolKey(p.id)
        const variant = profileMarkerVariant(p)
        const existing = profileMarkerPool.get(key)

        if (existing?.variant === variant) continue

        if (existing) {
          existing.marker.remove()
          profileMarkerPool.delete(key)
        }
        removeProfileMarkersForId(p.id, key)

        const el = createProfileMarkerEl(p)
        const popup = mountSingleProfilePopup(p)

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map)

        wireMapMarker(marker, el, lng, lat)
        profileMarkerPool.set(key, { marker, el, variant })
        continue
      }

      const key = `c-${cluster.key}`
      if (profileMarkerPool.has(key)) continue

      const el = createMapClusterMarkerElement(cluster.profiles.length, 'profile')
      const popup = mountProfileClusterPopup(cluster.profiles)

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map)

      wireMapMarker(marker, el, lng, lat)
      profileMarkerPool.set(key, { marker, el })
    }

    syncTalentRegionCircles()
  } finally {
    profileMarkerSyncRunning = false
    if (profileMarkerSyncQueued) {
      profileMarkerSyncQueued = false
      syncProfileMarkers()
    }
  }
}

let mapClusterResyncTimer = null

function publishMapViewportBounds() {
  if (!map) return
  const b = map.getBounds()
  mapStore.setMapViewportBounds({
    west: b.getWest(),
    south: b.getSouth(),
    east: b.getEast(),
    north: b.getNorth(),
  })
}

function scheduleMapClusterResync() {
  if (!map) return
  publishMapViewportBounds()
  if (mapStore.mapEventItems.length === 0 && mapStore.mapProfileItems.length === 0) return
  if (mapClusterResyncTimer) clearTimeout(mapClusterResyncTimer)
  mapClusterResyncTimer = setTimeout(() => {
    mapClusterResyncTimer = null
    publishMapViewportBounds()
    const hasEvents = mapStore.mapEventItems.length > 0
    const hasProfiles = mapStore.mapProfileItems.length > 0
    if (hasEvents && !hasProfiles) syncEventMarkers()
    else if (hasProfiles && !hasEvents) syncProfileMarkers()
  }, 200)
}

function refreshMapFromStore() {
  if (!map) return
  const run = () => {
    const hasEvents = mapStore.mapEventItems.length > 0
    const hasProfiles = mapStore.mapProfileItems.length > 0

    if (hasEvents) {
      clearProfileMarkers()
      syncEventMarkers()
    } else {
      clearEventMarkers()
    }

    if (hasProfiles) {
      clearEventMarkers()
      syncProfileMarkers()
    } else {
      clearProfileMarkers()
    }

    fitMapToResults()
  }

  if (map.loaded()) {
    run()
  } else {
    map.once('load', run)
  }
}

onMounted(() => {
  map = new maplibregl.Map({
    container: mapContainer.value,
    style,
    center: [mapStore.appliedLocation.lng, mapStore.appliedLocation.lat],
    zoom: MAP_CITY_ZOOM,
  })

  map.on('load', () => {
    publishMapViewportBounds()
    refreshMapFromStore()
  })
  map.on('moveend', scheduleMapClusterResync)
  map.on('zoomend', scheduleMapClusterResync)

  window.addEventListener(MAP_OPEN_EVENT_DETAIL, onMapOpenEventDetail)
  window.addEventListener(MAP_RESTORE_EVENT_POPUP, onMapRestoreEventPopup)
  window.addEventListener(MAP_RESET_HOME, onMapResetHome)
})

onUnmounted(() => {
  window.removeEventListener(MAP_OPEN_EVENT_DETAIL, onMapOpenEventDetail)
  window.removeEventListener(MAP_RESTORE_EVENT_POPUP, onMapRestoreEventPopup)
  window.removeEventListener(MAP_RESET_HOME, onMapResetHome)
  suspendedEventPopupMarker = null
  if (mapClusterResyncTimer) clearTimeout(mapClusterResyncTimer)
  eventMarkerSyncRunning = false
  eventMarkerSyncQueued = false
  profileMarkerSyncRunning = false
  profileMarkerSyncQueued = false
  clearEventMarkers()
  clearProfileMarkers()
  map?.remove()
  map = null
})

watch(
  () => mapStore.appliedLocation,
  (loc) => {
    if (!map || !loc) return
    const hasResults =
      mapStore.mapEventItems.length > 0 || mapStore.mapProfileItems.length > 0
    if (hasResults) return
    map.flyTo({
      center: [loc.lng, loc.lat],
      zoom: MAP_CITY_ZOOM,
      speed: 1.2,
      curve: 1.42,
      easing: (t) => t,
      essential: true,
    })
  },
  { deep: true },
)

watch(
  () => eventMapFocusPulse.value?.seq,
  () => {
    const pulse = eventMapFocusPulse.value
    if (!map || !pulse) return
    map.flyTo({
      center: [pulse.lng, pulse.lat],
      zoom: Math.max(map.getZoom(), 14),
      speed: 1.2,
      curve: 1.42,
      easing: (t) => t,
      essential: true,
    })
  },
)

watch(
  () => mapStore.mapEventItems,
  () => refreshMapFromStore(),
  { deep: true },
)

watch(
  () => mapStore.mapProfileItems,
  () => refreshMapFromStore(),
  { deep: true },
)

watch(
  () => mapStore.mapViewportBounds,
  () => {
    if (!map?.loaded()) return
    syncEventMarkers()
    syncProfileMarkers()
  },
  { deep: true },
)
</script>

<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";

.maplibregl-popup-content {
  background: none !important;
  padding: 0 !important;
  box-shadow: none !important;
}
.maplibregl-popup-tip {
  display: none !important;
}

.map-profile-cluster-marker:hover > div,
.map-event-cluster-marker:hover > div {
  filter: brightness(1.08);
  transform: scale(1.06);
  transition: transform 0.15s ease, filter 0.15s ease;
}
</style>
