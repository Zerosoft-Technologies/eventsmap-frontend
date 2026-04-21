<template>
  <div ref="mapContainer" class="map-container tw:w-full tw:h-screen"></div>
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import { createApp } from 'vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { fetchEvents } from '../api/events'
import { useMapStore } from '@/stores/mapStore'
import { eventMapFocusPulse } from '@/utils/mapEventFocus'
import i18n from '../i18n'

const mapContainer = ref(null)
const events = ref([])

let map
const mapStore = useMapStore()
const markerPool = new Map()

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

function createMarkerEl() {
  const el = document.createElement('div')
  el.style.backgroundImage = `url(http://185.133.88.194:3001/marker.png)`
  el.style.width = '60px'
  el.style.height = '60px'
  el.style.backgroundSize = 'contain'
  el.style.backgroundRepeat = 'no-repeat'
  el.style.cursor = 'pointer'
  return el
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
    import('../components/Event.vue').then(({ default: Event }) => {
      createApp(Event, { event: ev }).use(i18n).mount(popupEl)
    })
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
