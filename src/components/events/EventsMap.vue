<template>
  <div class="em-map-root tw:w-full tw:h-full tw:rounded-xl tw:overflow-hidden">
    <div ref="mapContainer" class="tw:w-full tw:h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import maplibregl from 'maplibre-gl'
import type { Event, MapCenter, MapBounds } from '../../types/events'

const props = defineProps<{
  events: Event[]
  center: MapCenter
  selectedEventId: number | null
}>()

const emit = defineEmits<{
  (e: 'mapMove', center: MapCenter): void
  (e: 'mapViewport', payload: { center: MapCenter; bounds: MapBounds; zoom: number }): void
  (e: 'selectEvent', id: number): void
}>()

const mapContainer = ref<HTMLElement | null>(null)

type BBox = [number, number, number, number]

let map: maplibregl.Map | null = null
let moveTimeout: ReturnType<typeof setTimeout> | null = null
const markerPool = new Map<string, { marker: maplibregl.Marker; el: HTMLElement }>()

const MAP_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm-layer', type: 'raster' as const, source: 'osm' }],
}

function categoryName(event: Event): string {
  const c = event.category
  if (!c) return ''
  return typeof c === 'string' ? c : (c as { name?: string }).name ?? ''
}

function createEventMarkerEl(event: Event, isSelected: boolean): HTMLElement {
  const el = document.createElement('div')
  el.className = 'em-event-marker'
  el.dataset.eventId = String(event.id)
  el.style.cssText = `
    width: 40px; height: 40px;
    background-color: ${isSelected ? '#0061FF' : event.is_live_now ? '#EF4444' : '#FF7700'};
    border: 3px solid white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.2s, background-color 0.2s;
    position: relative;
    ${isSelected ? 'transform: scale(1.2);' : ''}
  `

  if (event.is_live_now) {
    const pulse = document.createElement('div')
    pulse.style.cssText = `
      position: absolute; width: 100%; height: 100%;
      border-radius: 50%; background-color: #EF4444;
      animation: em-pulse 2s infinite; opacity: 0.5;
    `
    el.appendChild(pulse)
  }

  const inner = document.createElement('div')
  inner.style.cssText = `
    width: 12px; height: 12px; background-color: white;
    border-radius: 50%; z-index: 1; flex-shrink: 0;
  `
  el.appendChild(inner)
  return el
}

function buildPopupHtml(event: Event): string {
  const live = event.is_live_now
    ? `<span style="color:#EF4444;font-size:11px;font-weight:600;">● LIVE NOW</span>`
    : ''
  const dist = event.distance_km != null
    ? `<div style="color:#0061FF;font-size:12px;margin-top:4px;">${event.distance_km.toFixed(1)} km away</div>`
    : ''
  const addr = event.address
    ? `<div style="font-size:12px;color:#666;margin-top:4px;">${event.address}</div>`
    : ''

  return `
    <div style="padding:12px;min-width:200px;font-family:Inter,sans-serif;">
      <div style="display:flex;justify-content:space-between;align-items:start;gap:8px;">
        <h4 style="margin:0;font-size:14px;font-weight:600;color:#0061FF;line-height:1.3;">${event.title}</h4>
        ${live}
      </div>
      <div style="font-size:12px;color:#666;margin-top:4px;text-transform:capitalize;">${categoryName(event)}</div>
      ${addr}${dist}
      <button
        onclick="window.dispatchEvent(new CustomEvent('viewEvent',{detail:${event.id}}))"
        style="margin-top:8px;padding:6px 12px;background:#0061FF;color:white;border:none;
               border-radius:6px;font-size:12px;cursor:pointer;width:100%;"
      >View Details</button>
    </div>
  `
}

function applySelectionStyle(el: HTMLElement, selected: boolean, live: boolean) {
  el.style.backgroundColor = selected ? '#0061FF' : live ? '#EF4444' : '#FF7700'
  el.style.transform = selected ? 'scale(1.2)' : ''
}

function viewportBbox(): BBox {
  if (!map) return [0, 0, 0, 0]
  const b = map.getBounds()
  const w = b.getWest(), e2 = b.getEast(), s = b.getSouth(), n = b.getNorth()
  const dLng = (e2 - w) * 0.1, dLat = (n - s) * 0.1
  return [w - dLng, s - dLat, e2 + dLng, n + dLat]
}

function eventsInViewport(): Event[] {
  const [w, s, e2, n] = viewportBbox()
  return props.events.filter(ev => {
    if (ev.latitude == null || ev.longitude == null) return false
    const lng = ev.longitude, lat = ev.latitude
    return lng >= w && lng <= e2 && lat >= s && lat <= n
  })
}

function updateMarkers() {
  if (!map) return

  const visible = eventsInViewport()
  const nextKeys = new Set<string>()

  for (const event of visible) {
    if (event.latitude == null || event.longitude == null) continue
    const lng = event.longitude
    const lat = event.latitude
    const eventId = event.id
    const key = `e-${eventId}`
    nextKeys.add(key)

    const selected = eventId === props.selectedEventId

    if (!markerPool.has(key)) {
      const el = createEventMarkerEl(event, selected)
      const popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: '280px',
        offset: [0, -20] as [number, number],
      }).setHTML(buildPopupHtml(event))

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map)

      el.addEventListener('click', () => emit('selectEvent', eventId))

      markerPool.set(key, { marker, el })
      if (selected) marker.togglePopup()
    } else {
      applySelectionStyle(markerPool.get(key)!.el, selected, !!event.is_live_now)
    }
  }

  for (const [key, { marker }] of markerPool.entries()) {
    if (!nextKeys.has(key)) {
      marker.remove()
      markerPool.delete(key)
    }
  }
}

function emitViewport() {
  if (!map) return
  const c = map.getCenter()
  const b = map.getBounds()
  const bounds: MapBounds = {
    minLat: b.getSouthWest().lat,
    maxLat: b.getNorthEast().lat,
    minLng: b.getSouthWest().lng,
    maxLng: b.getNorthEast().lng,
  }
  emit('mapMove', { lat: c.lat, lng: c.lng })
  emit('mapViewport', { center: { lat: c.lat, lng: c.lng }, bounds, zoom: map.getZoom() })
}

function scheduleViewportUpdate() {
  if (moveTimeout) clearTimeout(moveTimeout)
  moveTimeout = setTimeout(() => {
    updateMarkers()
    emitViewport()
  }, 300)
}

const centerOnEvent = (eventId: number) => {
  const event = props.events.find(e => e.id === eventId)
  if (!event || event.latitude == null || event.longitude == null || !map) return
  map.easeTo({
    center: [event.longitude, event.latitude],
    zoom: Math.max(map.getZoom(), 14),
    duration: 500,
  })
}

onMounted(async () => {
  await nextTick()
  if (!mapContainer.value) return

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: MAP_STYLE,
    center: [props.center.lng, props.center.lat],
    zoom: 11,
  })

  map.addControl(new maplibregl.NavigationControl(), 'top-right')

  map.on('moveend', scheduleViewportUpdate)
  map.on('zoomend', scheduleViewportUpdate)

  const onViewEvent = (e: CustomEvent) => emit('selectEvent', e.detail as number)
  window.addEventListener('viewEvent', onViewEvent as EventListener)

  map.on('load', () => {
    updateMarkers()
    emitViewport()
  })

  ;(map as unknown as Record<string, unknown>)['__viewEventListener'] = onViewEvent
})

onUnmounted(() => {
  if (moveTimeout) clearTimeout(moveTimeout)
  markerPool.forEach(({ marker }) => marker.remove())
  markerPool.clear()

  const listener = map
    ? (map as unknown as Record<string, unknown>)['__viewEventListener']
    : null
  if (listener) window.removeEventListener('viewEvent', listener as EventListener)

  map?.remove()
  map = null
})

watch(
  () => props.events,
  () => {
    markerPool.forEach(({ marker }) => marker.remove())
    markerPool.clear()
    if (map?.loaded()) updateMarkers()
  },
  { deep: false },
)

watch(
  () => props.selectedEventId,
  (newId, oldId) => {
    if (!map?.loaded()) return
    const eventById = new Map(props.events.map(ev => [ev.id, ev]))

    if (oldId != null) {
      const poolEntry = markerPool.get(`e-${oldId}`)
      if (poolEntry) {
        const ev = eventById.get(oldId)
        applySelectionStyle(poolEntry.el, false, ev?.is_live_now ?? false)
      }
    }

    if (newId != null) {
      const poolEntry = markerPool.get(`e-${newId}`)
      if (poolEntry) {
        applySelectionStyle(poolEntry.el, true, false)
        centerOnEvent(newId)
      }
    }
  },
)

watch(
  () => props.center,
  (next) => {
    if (!map?.loaded()) return
    const cur = map.getCenter()
    const THRESHOLD = 0.001
    if (
      Math.abs(cur.lat - next.lat) > THRESHOLD ||
      Math.abs(cur.lng - next.lng) > THRESHOLD
    ) {
      map.easeTo({ center: [next.lng, next.lat], duration: 500 })
    }
  },
  { deep: true },
)

defineExpose({ centerOnEvent })
</script>

<style>
@import "maplibre-gl/dist/maplibre-gl.css";

.em-map-root {
  position: relative;
}

.em-event-marker:hover {
  transform: scale(1.1) !important;
}

@keyframes em-pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.maplibregl-popup-content {
  padding: 0 !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
}

.maplibregl-popup-close-button {
  font-size: 18px;
  padding: 4px 8px;
  color: #666;
}

.maplibregl-popup-close-button:hover {
  color: #0061ff;
  background: transparent;
}
</style>
