<template>
  <div ref="mapContainer" class="map-container tw:w-full tw:h-screen"></div>
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import { createApp, h } from 'vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Event from '../components/Event.vue'
import DiscoveryProfileCard from '../components/DiscoveryProfileCard.vue'
import { MAP_OPEN_EVENT_DETAIL, MAP_OPEN_PROFILE_DETAIL } from '@/utils/mapPopupBridge'
import { fetchEvents } from '../api/events'
import { pickProfileLatLng } from '@/api/discoveryProfiles'
import { useMapStore } from '@/stores/mapStore'
import { eventMapFocusPulse } from '@/utils/mapEventFocus'
import i18n from '../i18n'

const mapContainer = ref(null)
const events = ref([])

let map
const mapStore = useMapStore()
const markerPool = new Map()
const profileMarkerPool = new Map()

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

function eventLngLat(ev) {
  const lat = ev.lat ?? ev.latitude
  const lng = ev.lng ?? ev.longitude
  if (lat == null || lng == null) return null
  const la = Number(lat)
  const ln = Number(lng)
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null
  return { lat: la, lng: ln }
}

async function loadEvents() {
  try {
    const result = await fetchEvents({ per_page: 100 })
    events.value = result.data
    syncMarkers()
  } catch (e) {
    console.error('Failed to load events:', e)
  }
}

/** Event listing pins — branded image */
function createMapPinMarkerEl() {
  const el = document.createElement('div')
  el.style.backgroundImage = `url(http://185.133.88.194:3001/marker.png)`
  el.style.width = '60px'
  el.style.height = '60px'
  el.style.backgroundSize = 'contain'
  el.style.backgroundRepeat = 'no-repeat'
  el.style.cursor = 'pointer'
  return el
}

/** Discovery profile pins — distinct colour per type. No CSS transition (MapLibre uses transform while panning). */
const PROFILE_MARKER_COLORS = {
  organisers: '#6366f1',
  talents: '#10b981',
  venues: '#0ea5e9',
}

function createProfileMarkerEl(profileType) {
  const color = PROFILE_MARKER_COLORS[profileType] ?? '#6b7280'
  const el = document.createElement('div')
  el.style.width = '52px'
  el.style.height = '62px'
  el.style.cursor = 'pointer'
  el.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 52" fill="none" style="width:100%;height:100%;display:block">
      <ellipse cx="22" cy="49" rx="9" ry="3" fill="rgba(0,0,0,0.18)"/>
      <path d="M22 2C14.268 2 8 8.268 8 16c0 10.5 14 32 14 32S36 26.5 36 16C36 8.268 29.732 2 22 2z"
        fill="${color}" stroke="white" stroke-width="2.5"/>
      <circle cx="22" cy="16" r="7" fill="white"/>
    </svg>`
  return el
}

function createMarkerEl() {
  return createMapPinMarkerEl()
}

function syncMarkers() {
  if (!map?.loaded()) return

  const list = events.value
    .map((ev) => ({ ev, ll: eventLngLat(ev) }))
    .filter((x) => x.ll)

  const nextIds = new Set(list.map(({ ev }) => ev.id))

  for (const [key, { marker }] of markerPool.entries()) {
    const id = Number(key.replace('e-', ''))
    if (!nextIds.has(id)) {
      marker.remove()
      markerPool.delete(key)
    }
  }

  for (const { ev, ll } of list) {
    const key = `e-${ev.id}`
    if (markerPool.has(key)) continue

    const el = createMarkerEl()
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

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([ll.lng, ll.lat])
      .setPopup(popup)
      .addTo(map)

    el.addEventListener('click', () => {
      map.easeTo({
        center: [ll.lng, ll.lat],
        zoom: Math.max(map.getZoom(), 12),
        offset: [0, 250],
        duration: 600,
      })
    })

    markerPool.set(key, { marker, el })
  }
}

// ── Profile Markers (colour-coded teardrops; no transform transition) ──

function syncProfileMarkers() {
  if (!map?.loaded()) return
  const list = mapStore.mapProfileItems
    .map((p) => {
      const ll = pickProfileLatLng(p)
      if (!ll) return null
      return { ...p, latitude: ll.latitude, longitude: ll.longitude }
    })
    .filter(Boolean)

  const nextIds = new Set(list.map((p) => Number(p.id)))

  for (const [key, { marker }] of profileMarkerPool.entries()) {
    if (!nextIds.has(Number(key.replace('p-', '')))) {
      marker.remove()
      profileMarkerPool.delete(key)
    }
  }

  for (const p of list) {
    const key = `p-${Number(p.id)}`
    if (profileMarkerPool.has(key)) continue

    const el = createProfileMarkerEl(p.profileType)
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

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([p.longitude, p.latitude])
      .setPopup(popup)
      .addTo(map)

    el.addEventListener('click', () => {
      map.easeTo({
        center: [p.longitude, p.latitude],
        zoom: Math.max(map.getZoom(), 12),
        offset: [0, 250],
        duration: 600,
      })
    })

    profileMarkerPool.set(key, { marker, el })
  }
}

function clearProfileMarkers() {
  for (const { marker } of profileMarkerPool.values()) marker.remove()
  profileMarkerPool.clear()
}

onMounted(() => {
  map = new maplibregl.Map({
    container: mapContainer.value,
    style,
    center: [mapStore.appliedLocation.lng, mapStore.appliedLocation.lat],
    zoom: 10,
  })

  map.on('load', () => loadEvents())
})

onUnmounted(() => {
  markerPool.forEach(({ marker }) => marker.remove())
  markerPool.clear()
  clearProfileMarkers()
  map?.remove()
  map = null
})

watch(
  () => mapStore.appliedLocation,
  (loc) => {
    if (!map || !loc) return
    map.flyTo({
      center: [loc.lng, loc.lat],
      zoom: Math.max(map.getZoom(), 12),
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
  () => mapStore.mapProfileItems,
  (items) => {
    if (!map) return
    if (items.length === 0) {
      clearProfileMarkers()
      return
    }
    if (map.loaded()) {
      syncProfileMarkers()
    } else {
      map.once('load', syncProfileMarkers)
    }
    // Do not change zoom/center when discovery profiles load — keep event map framing.
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
</style>
