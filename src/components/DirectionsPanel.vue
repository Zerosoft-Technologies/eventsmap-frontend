<template>
  <Teleport to="body">
    <transition name="dp-backdrop">
      <div v-if="visible" class="dp-backdrop" @click="$emit('close')" />
    </transition>

    <transition name="dp-slide">
      <div v-if="visible" class="dp-panel">
        <header class="dp-header">
          <button type="button" class="dp-back" @click="$emit('close')">
            <ChevronLeft class="dp-icon" :stroke-width="2.25" aria-hidden="true" />
            <span>{{ $t('dateLocation.directions') }}</span>
          </button>
          <h1 class="dp-title">{{ $t('dateLocation.directions') }}</h1>
          <button type="button" class="dp-close" aria-label="Close" @click="$emit('close')">
            <X class="dp-icon" :stroke-width="2.25" />
          </button>
        </header>

        <div class="dp-body">
          <div class="dp-summary">
            <div class="dp-loc-row">
              <span class="dp-dot dp-dot--from" />
              <div>
                <span class="dp-loc-label">From</span>
                <span class="dp-loc-value">{{ locationLabel }}</span>
              </div>
            </div>
            <div class="dp-connector" />
            <div class="dp-loc-row">
              <span class="dp-dot dp-dot--to" />
              <div>
                <span class="dp-loc-label">To</span>
                <span class="dp-loc-value">{{ event?.address || event?.title || '—' }}</span>
              </div>
            </div>
          </div>

          <div v-if="locationPhase === 'checking'" class="dp-loc-wait">
            <div class="dp-spinner dp-spinner--sm" />
            <p>Checking location access…</p>
          </div>

          <div v-else-if="locationPhase === 'need_permission'" class="dp-loc-cta">
            <p class="dp-loc-cta-title">Use your current location</p>
            <p class="dp-loc-cta-text">
              Tap below — your browser will ask to share your position. Choose <strong>Allow</strong> to see the route on the map.
            </p>
            <button
              type="button"
              class="dp-loc-btn"
              :disabled="isGeoLoading"
              @click="onUseMyLocation"
            >
              <span v-if="isGeoLoading" class="dp-spinner dp-spinner--sm dp-spinner--inline" />
              <MapPin v-else class="dp-btn-icon" :stroke-width="2" aria-hidden="true" />
              {{ isGeoLoading ? 'Waiting for browser…' : 'Use my current location' }}
            </button>
          </div>

          <div v-else-if="locationPhase === 'denied'" class="dp-loc-cta dp-loc-cta--muted">
            <p class="dp-loc-cta-title">Location is off for this site</p>
            <p class="dp-loc-cta-text">{{ getBrowserInstructions() }}</p>
            <button
              type="button"
              class="dp-loc-btn dp-loc-btn--secondary"
              :disabled="isGeoLoading"
              @click="onUseMyLocation"
            >
              <span v-if="isGeoLoading" class="dp-spinner dp-spinner--sm dp-spinner--inline" />
              {{ isGeoLoading ? 'Trying…' : 'Try again after allowing' }}
            </button>
          </div>

          <div v-else-if="locationPhase === 'unsupported'" class="dp-loc-cta dp-loc-cta--muted">
            <p class="dp-loc-cta-title">Location not available</p>
            <p class="dp-loc-cta-text">
              This browser cannot access your position. Use the links at the bottom to open directions elsewhere.
            </p>
          </div>

          <!-- <div v-if="userLoc" class="dp-modes">
            <button
              v-for="m in modes"
              :key="m.value"
              type="button"
              class="dp-mode"
              :class="{ active: activeMode === m.value }"
              @click="switchMode(m.value)"
            >
              <span class="dp-mode-icon">{{ m.icon }}</span>
              <span class="dp-mode-name">{{ m.label }}</span>
              <span v-if="cache[m.value]" class="dp-mode-time">{{ fmt.dur(cache[m.value]!.durationSeconds) }}</span>
            </button>
          </div> -->

          <!-- add scrollbar -->
          <div v-if="current" class="dp-stats" 
            aria-label="Route summary with distance, duration, and estimated arrival time" role="region" tabindex="0" >
            <div class="dp-stat">
              <Route class="dp-stat-svg" :stroke-width="2" />
              <strong>{{ fmt.dist(current.distanceMeters) }}</strong>
              <small>Distance</small>
            </div>
            <div class="dp-stat-sep" />
            <div class="dp-stat">
              <Clock class="dp-stat-svg" :stroke-width="2" />
              <strong>{{ fmt.dur(current.durationSeconds) }}</strong>
              <small>Duration</small>
            </div>
            <div class="dp-stat-sep" />
            <div class="dp-stat">
              <Navigation class="dp-stat-svg" :stroke-width="2" />
              <strong>{{ arrivalTime }}</strong>
              <small>Arrival</small>
            </div>
          </div>

          <!-- Route preview map -->
          <div v-show="current && !loading" class="dp-map-wrap">
            <div class="dp-map-label">
              <span class="dp-map-label-dot" />
              Route preview
            </div>
            <div ref="routeMapContainer" class="dp-route-map" />
            <div v-if="mapLoading" class="dp-map-loading">
              <div class="dp-spinner dp-spinner--sm" />
            </div>
          </div>

          <div v-if="loading && userLoc" class="dp-loading">
            <div class="dp-spinner" />
            <p>Calculating route…</p>
          </div>

          <div v-if="locError && locationPhase === 'error'" class="dp-error">
            <MapPin class="dp-error-icon" :stroke-width="2" />
            <p>{{ locError }}</p>
            <button type="button" class="dp-retry" @click="onUseMyLocation">Try again</button>
          </div>

          <div v-if="routeError && !loading" class="dp-error">
            <AlertCircle class="dp-error-icon" :stroke-width="2" />
            <p>{{ routeError }}</p>
            <button type="button" class="dp-retry" @click="loadRoute(activeMode)">Try again</button>
          </div>

          <div v-if="current && !loading" class="dp-steps" 
          style="overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 8px; margin-bottom: 8px; border-bottom: 1px solid rgba(226, 232, 240, 0.95); height: 40%;">
            <h2 class="dp-steps-title">Turn-by-turn</h2>
            <ol class="dp-step-list">
              <li
                v-for="(step, i) in current.steps"
                :key="i"
                class="dp-step"
              >
                <span class="dp-step-num">{{ i + 1 }}</span>
                <div class="dp-step-body">
                  <p class="dp-step-text">{{ step.instruction }}</p>
                  <span class="dp-step-dist">{{ fmt.dist(step.distance) }}</span>
                </div>
              </li>
            </ol>
          </div>

          <footer class="dp-ext">
            <p class="dp-ext-label">Open in another app</p>
            <div class="dp-ext-btns">
              <a :href="extLinks.google" target="_blank" rel="noopener noreferrer" class="dp-ext-btn">Google Maps</a>
              <a :href="extLinks.apple" target="_blank" rel="noopener noreferrer" class="dp-ext-btn">Apple Maps</a>
              <a :href="extLinks.osm" target="_blank" rel="noopener noreferrer" class="dp-ext-btn">OpenStreetMap</a>
            </div>
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import maplibregl from 'maplibre-gl'
import {
  ChevronLeft,
  X,
  MapPin,
  Route,
  Clock,
  Navigation,
  AlertCircle,
} from 'lucide-vue-next'
import { useLocationPermission } from '@/composables/useLocationPermission'
import {
  fetchRoute,
  formatDistance,
  formatDuration,
  type RouteResult,
  type TransportMode,
} from '@/services/routingService'

const props = defineProps<{
  visible: boolean
  event: Record<string, unknown> | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'routeDrawn', payload: { polyline: [number, number][]; userLat: number; userLng: number }): void
  (e: 'routeCleared'): void
}>()

const fmt = { dist: formatDistance, dur: formatDuration }

const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap',
    },
  },
  layers: [{ id: 'osm-layer', type: 'raster' as const, source: 'osm' }],
}

const ROUTE_SRC = 'dp-route-geo'
const ROUTE_LAYER = 'dp-route-line'
const ROUTE_HALO = 'dp-route-halo'

const modes: { value: TransportMode; icon: string; label: string }[] = [
  { value: 'driving', icon: '🚗', label: 'Drive' },
  { value: 'walking', icon: '🚶', label: 'Walk' },
  { value: 'cycling', icon: '🚲', label: 'Cycle' },
]

const activeMode = ref<TransportMode>('driving')
const cache = ref<Partial<Record<TransportMode, RouteResult>>>({})
const loading = ref(false)
const routeError = ref<string | null>(null)
const locError = ref<string | null>(null)
const userLoc = ref<{ lat: number; lng: number } | null>(null)

type LocationPhase = 'checking' | 'need_permission' | 'denied' | 'ready' | 'error' | 'unsupported'
const locationPhase = ref<LocationPhase>('checking')

const routeMapContainer = ref<HTMLElement | null>(null)
const mapLoading = ref(false)

let routeMap: maplibregl.Map | null = null
let userMk: maplibregl.Marker | null = null
let destMk: maplibregl.Marker | null = null
let mapResizeObs: ResizeObserver | null = null

const {
  checkPermissionStatus,
  requestLocation,
  getBrowserInstructions,
  isLoading: isGeoLoading,
} = useLocationPermission()

const current = computed(() => cache.value[activeMode.value] ?? null)

const locationLabel = computed(() => {
  if (userLoc.value) return 'Your location'
  switch (locationPhase.value) {
    case 'checking':
      return 'Checking access…'
    case 'need_permission':
      return 'Tap the button below'
    case 'denied':
      return 'Location blocked'
    case 'error':
      return 'Could not get location'
    case 'unsupported':
      return 'Not available'
    default:
      return '—'
  }
})

const arrivalTime = computed(() => {
  if (!current.value) return '—'
  const d = new Date(Date.now() + current.value.durationSeconds * 1000)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
})

function eventCoords(): { lat: number; lng: number } | null {
  const e = props.event
  if (!e) return null
  const lat = Number(e.lat ?? e.latitude)
  const lng = Number(e.lng ?? e.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

const extLinks = computed(() => {
  const c = eventCoords()
  const lat = c?.lat ?? 0
  const lng = c?.lng ?? 0
  return {
    google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    apple: `https://maps.apple.com/?daddr=${lat},${lng}`,
    osm: `https://www.openstreetmap.org/directions?to=${lat},${lng}`,
  }
})

function teardownRouteMap() {
  mapResizeObs?.disconnect()
  mapResizeObs = null
  userMk?.remove()
  destMk?.remove()
  userMk = null
  destMk = null
  routeMap?.remove()
  routeMap = null
}

function makeDotEl(color: string, ring: string): HTMLElement {
  const el = document.createElement('div')
  el.className = 'dp-map-marker-dot'
  el.style.cssText = `
    width:14px;height:14px;border-radius:50%;
    background:${color};border:3px solid #fff;
    box-shadow:0 0 0 2px ${ring}, 0 4px 12px rgba(0,0,0,.2);
  `
  return el
}

async function syncRouteMap() {
  const route = current.value
  const ul = userLoc.value
  const dest = eventCoords()

  if (!props.visible || !route || !ul || !dest || !routeMapContainer.value) {
    teardownRouteMap()
    return
  }

  await nextTick()
  if (!routeMapContainer.value || !props.visible) return

  mapLoading.value = true

  const geojson: GeoJSON.Feature = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: route.polyline.map(([lat, lng]) => [lng, lat]),
    },
    properties: {},
  }

  try {
    if (!routeMap) {
      routeMap = new maplibregl.Map({
        container: routeMapContainer.value,
        style: OSM_STYLE as maplibregl.StyleSpecification,
        center: [ul.lng, ul.lat],
        zoom: 12,
      })
      routeMap.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

      routeMap.on('load', () => {
        const m = routeMap
        if (!m) return
        if (!m.getSource(ROUTE_SRC)) {
          m.addSource(ROUTE_SRC, { type: 'geojson', data: geojson })
          m.addLayer({
            id: ROUTE_HALO,
            type: 'line',
            source: ROUTE_SRC,
            paint: {
              'line-color': '#c2410c',
              'line-width': 8,
              'line-opacity': 0.25,
              'line-blur': 1,
            },
            layout: { 'line-cap': 'round', 'line-join': 'round' },
          })
          m.addLayer({
            id: ROUTE_LAYER,
            type: 'line',
            source: ROUTE_SRC,
            paint: {
              'line-color': '#f97316',
              'line-width': 4,
              'line-opacity': 1,
            },
            layout: { 'line-cap': 'round', 'line-join': 'round' },
          })
        }
        finishMapSync(geojson, ul, dest)
      })

      mapResizeObs = new ResizeObserver(() => routeMap?.resize())
      mapResizeObs.observe(routeMapContainer.value)
    } else {
      const src = routeMap.getSource(ROUTE_SRC) as maplibregl.GeoJSONSource | undefined
      if (src) src.setData(geojson)
      else {
        routeMap.addSource(ROUTE_SRC, { type: 'geojson', data: geojson })
        routeMap.addLayer({
          id: ROUTE_HALO,
          type: 'line',
          source: ROUTE_SRC,
          paint: {
            'line-color': '#c2410c',
            'line-width': 8,
            'line-opacity': 0.25,
          },
          layout: { 'line-cap': 'round', 'line-join': 'round' },
        })
        routeMap.addLayer({
          id: ROUTE_LAYER,
          type: 'line',
          source: ROUTE_SRC,
          paint: { 'line-color': '#f97316', 'line-width': 4 },
          layout: { 'line-cap': 'round', 'line-join': 'round' },
        })
      }
      if (routeMap.loaded()) finishMapSync(geojson, ul, dest)
      else routeMap.once('load', () => finishMapSync(geojson, ul, dest))
    }
  } finally {
    mapLoading.value = false
  }
}

function finishMapSync(
  geojson: GeoJSON.Feature,
  ul: { lat: number; lng: number },
  dest: { lat: number; lng: number },
) {
  if (!routeMap) return

  const coords = (geojson.geometry as GeoJSON.LineString).coordinates
  const bounds = new maplibregl.LngLatBounds()
  for (const c of coords) bounds.extend(c as [number, number])
  bounds.extend([ul.lng, ul.lat])
  bounds.extend([dest.lng, dest.lat])

  userMk?.remove()
  destMk?.remove()
  userMk = new maplibregl.Marker({ element: makeDotEl('#3b82f6', 'rgba(59,130,246,.45)') })
    .setLngLat([ul.lng, ul.lat])
    .addTo(routeMap)
  destMk = new maplibregl.Marker({ element: makeDotEl('#f97316', 'rgba(249,115,22,.45)') })
    .setLngLat([dest.lng, dest.lat])
    .addTo(routeMap)

  routeMap.fitBounds(bounds, {
    padding: { top: 36, bottom: 28, left: 28, right: 28 },
    duration: 500,
    maxZoom: 15,
  })
  routeMap.resize()
}

async function loadRoute(mode: TransportMode) {
  if (!userLoc.value) return
  const dest = eventCoords()
  if (!dest) return

  loading.value = true
  routeError.value = null

  try {
    const result = await fetchRoute(userLoc.value, dest, mode)
    cache.value = { ...cache.value, [mode]: result }
    emit('routeDrawn', { polyline: result.polyline, userLat: userLoc.value.lat, userLng: userLoc.value.lng })
    await nextTick()
    void syncRouteMap()
  } catch (err) {
    routeError.value = err instanceof Error ? err.message : 'Route calculation failed'
  } finally {
    loading.value = false
  }
}

// function switchMode(mode: TransportMode) {
//   activeMode.value = mode
//   if (cache.value[mode]) {
//     emit('routeDrawn', {
//       polyline: cache.value[mode]!.polyline,
//       userLat: userLoc.value?.lat ?? 0,
//       userLng: userLoc.value?.lng ?? 0,
//     })
//     void syncRouteMap()
//   } else {
//     void loadRoute(mode)
//   }
// }

function resetPanel() {
  cache.value = {}
  routeError.value = null
  locError.value = null
  userLoc.value = null
  activeMode.value = 'driving'
  teardownRouteMap()
}

async function onPanelOpen() {
  resetPanel()
  locationPhase.value = 'checking'

  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    locationPhase.value = 'unsupported'
    return
  }

  const status = await checkPermissionStatus()
  if (!props.visible) return

  if (status === 'granted') {
    const loc = await requestLocation()
    if (!props.visible) return
    if (loc) {
      userLoc.value = { lat: loc.latitude, lng: loc.longitude }
      locationPhase.value = 'ready'
      await loadRoute('driving')
    } else {
      locationPhase.value = 'need_permission'
    }
    return
  }

  if (status === 'denied') {
    locationPhase.value = 'denied'
    return
  }

  locationPhase.value = 'need_permission'
}

async function onUseMyLocation() {
  locError.value = null
  routeError.value = null

  const loc = await requestLocation()
  if (!props.visible) return

  if (loc) {
    userLoc.value = { lat: loc.latitude, lng: loc.longitude }
    locationPhase.value = 'ready'
    await loadRoute('driving')
    return
  }

  const st = await checkPermissionStatus()
  if (st === 'denied') {
    locationPhase.value = 'denied'
    return
  }

  locationPhase.value = 'error'
  locError.value = 'Could not read your location. Allow access in the browser prompt, or enable GPS and try again.'
}

watch(
  () => [current.value, props.visible] as const,
  () => {
    if (props.visible && current.value && userLoc.value) void syncRouteMap()
    if (!props.visible) teardownRouteMap()
  },
)

watch(() => props.visible, (open) => {
  if (open) {
    void onPanelOpen()
  } else {
    teardownRouteMap()
    emit('routeCleared')
  }
})

onUnmounted(() => {
  teardownRouteMap()
})
</script>

<style scoped>
.dp-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  z-index: 998;
  backdrop-filter: blur(6px);
}
.dp-backdrop-enter-active,
.dp-backdrop-leave-active {
  transition: opacity 0.28s ease;
}
.dp-backdrop-enter-from,
.dp-backdrop-leave-to {
  opacity: 0;
}

.dp-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 432px;
  max-width: 100vw;
  z-index: 999;
  display: flex;
  flex-direction: column;
  background: linear-gradient(165deg, #f8fafc 0%, #ffffff 38%, #ffffff 100%);
  box-shadow: -12px 0 48px rgba(15, 23, 42, 0.12), -1px 0 0 rgba(15, 23, 42, 0.06);
  border-left: 1px solid rgba(148, 163, 184, 0.25);
}
@media (max-width: 768px) {
  .dp-panel {
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 90vh;
    max-height: 100dvh;
    border-left: none;
    border-radius: 22px 22px 0 0;
    box-shadow: 0 -12px 48px rgba(15, 23, 42, 0.15);
  }
}

.dp-slide-enter-active {
  transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1);
}
.dp-slide-leave-active {
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}
.dp-slide-enter-from,
.dp-slide-leave-to {
  transform: translateX(100%);
}
@media (max-width: 768px) {
  .dp-slide-enter-from,
  .dp-slide-leave-to {
    transform: translateY(100%);
  }
}

.dp-header {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  padding: 14px 16px 14px 12px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}
.dp-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-self: start;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #ea580c;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.dp-back:hover {
  background: rgba(255, 237, 213, 0.85);
}
.dp-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
  justify-self: center;
  text-align: center;
}
.dp-close {
  justify-self: end;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  background: rgba(241, 245, 249, 0.95);
  color: #64748b;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.dp-close:hover {
  background: #e2e8f0;
  color: #0f172a;
}
.dp-icon {
  width: 20px;
  height: 20px;
}

.dp-body {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-bottom: env(safe-area-inset-bottom, 12px);
}

.dp-summary {
  margin: 16px 16px 12px;
  padding: 18px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.04);
}
.dp-loc-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.dp-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}
.dp-dot--from {
  background: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}
.dp-dot--to {
  background: #f97316;
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.22);
}
.dp-connector {
  width: 2px;
  height: 18px;
  margin: 6px 0 6px 5px;
  border-radius: 1px;
  background: linear-gradient(180deg, #cbd5e1, #e2e8f0);
}
.dp-loc-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}
.dp-loc-value {
  display: block;
  margin-top: 4px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  color: #0f172a;
}

.dp-loc-wait {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px 20px;
  margin: 0 16px;
  color: #64748b;
  font-size: 14px;
}

.dp-loc-cta {
  margin: 0 16px 14px;
  padding: 20px;
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(255, 247, 237, 0.95) 0%, #fff 55%);
  border: 1px solid rgba(253, 186, 116, 0.55);
  box-shadow: 0 4px 20px rgba(249, 115, 22, 0.08);
}
.dp-loc-cta--muted {
  background: #f8fafc;
  border-color: #e2e8f0;
  box-shadow: none;
}
.dp-loc-cta-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}
.dp-loc-cta-text {
  margin: 0 0 16px;
  font-size: 13px;
  line-height: 1.55;
  color: #475569;
}
.dp-loc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px 18px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(234, 88, 12, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.dp-loc-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(234, 88, 12, 0.4);
}
.dp-loc-btn:disabled {
  opacity: 0.72;
  cursor: wait;
}
.dp-loc-btn--secondary {
  background: #fff;
  color: #ea580c;
  border: 2px solid #fb923c;
  box-shadow: none;
}
.dp-loc-btn--secondary:hover:not(:disabled) {
  background: #fff7ed;
}
.dp-btn-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.dp-spinner--sm {
  width: 22px;
  height: 22px;
  border-width: 2px;
}
.dp-spinner--inline {
  flex-shrink: 0;
}

.dp-modes {
  display: flex;
  gap: 8px;
  padding: 0 16px 12px;
}
.dp-mode {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}
.dp-mode:hover {
  border-color: #fdba74;
  background: #fffbeb;
}
.dp-mode.active {
  border-color: #f97316;
  background: linear-gradient(180deg, #fff7ed 0%, #fff 100%);
  box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.2);
}
.dp-mode-icon {
  font-size: 20px;
  line-height: 1;
}
.dp-mode-name {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}
.dp-mode.active .dp-mode-name {
  color: #c2410c;
}
.dp-mode-time {
  font-size: 11px;
  font-weight: 700;
  color: #ea580c;
}

.dp-stats {
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  margin: 0 16px 14px;
  padding: 16px 12px;
  border-radius: 18px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 55%, #c2410c 100%);
  box-shadow: 0 8px 28px rgba(234, 88, 12, 0.35);
}
.dp-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
}
.dp-stat-svg {
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.95);
}
.dp-stat strong {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
}
.dp-stat small {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.82);
}
.dp-stat-sep {
  width: 1px;
  align-self: stretch;
  margin: 4px 0;
  background: rgba(255, 255, 255, 0.28);
}

.dp-map-wrap {
  position: relative;
  margin: 0 16px 16px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #e2e8f0;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 28px rgba(15, 23, 42, 0.06);
}
.dp-map-label {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #0f172a;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}
.dp-map-label-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.35);
}
.dp-route-map {
  width: 100%;
  height: 220px;
}
@media (min-width: 640px) {
  .dp-route-map {
    height: 260px;
  }
}
.dp-map-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(248, 250, 252, 0.65);
  z-index: 1;
}

.dp-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px;
  color: #64748b;
  font-size: 14px;
}
.dp-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #f97316;
  border-radius: 50%;
  animation: dp-spin 0.75s linear infinite;
}
@keyframes dp-spin {
  to {
    transform: rotate(360deg);
  }
}

.dp-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 0 16px 14px;
  padding: 20px;
  text-align: center;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 16px;
}
.dp-error p {
  margin: 0;
  font-size: 14px;
  color: #b91c1c;
  line-height: 1.45;
}
.dp-error-icon {
  width: 22px;
  height: 22px;
  color: #dc2626;
}
.dp-retry {
  padding: 10px 20px;
  margin-top: 4px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #fb923c, #ea580c);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
}

.dp-steps {
  margin: 0 16px 16px;
  padding: 18px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}
.dp-steps-title {
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #64748b;
}
.dp-step-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.dp-step {
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #f1f5f9;
}
.dp-step:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.dp-step-num {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
  background: #f1f5f9;
  border-radius: 10px;
}
.dp-step-body {
  min-width: 0;
}
.dp-step-text {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.45;
  color: #0f172a;
}
.dp-step-dist {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
}

.dp-ext {
  margin-top: auto;
  padding: 20px 16px 24px;
  border-top: 1px solid rgba(226, 232, 240, 0.95);
  background: rgba(248, 250, 252, 0.65);
}
.dp-ext-label {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #94a3b8;
}
.dp-ext-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dp-ext-btn {
  flex: 1;
  min-width: calc(33% - 6px);
  padding: 11px 10px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  color: #0f172a;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}
.dp-ext-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}
</style>

<style>
/* MapLibre base — global so controls render correctly inside Teleport */
@import 'maplibre-gl/dist/maplibre-gl.css';
</style>
