<template>
  <div class="tw:px-4 tw:py-4 tw:space-y-4">
    <!-- Date & times card -->
    <div
      class="tw:rounded-xl tw:border tw:border-gray-200 tw:bg-white tw:p-4 tw:shadow-sm"
    >
      <div>
        <p class="tw:text-base tw:font-semibold tw:text-[#1a73e8]">
          {{ t('dateLocation.eventDate') }}
        </p>
        <p class="tw:mt-2 tw:text-base tw:font-normal tw:text-gray-600">
          {{ formattedLongEventDate }}
        </p>
      </div>

      <div class="tw:mt-5 tw:grid tw:grid-cols-2 tw:gap-4">
        <div>
          <p class="tw:text-base tw:font-semibold tw:text-[#1a73e8]">
            {{ t('dateLocation.startTime') }}
          </p>
          <div class="tw:mt-2 tw:flex tw:items-center tw:gap-2">
            <span
              class="tw:inline-flex tw:items-center tw:justify-center tw:w-8 tw:h-8 tw:flex-shrink-0 tw:text-[#FF7700]"
              aria-hidden="true"
            >
              <svg class="tw:w-5 tw:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span class="tw:text-base tw:text-gray-600">{{ displayStartTime }}</span>
          </div>
        </div>
        <div>
          <p class="tw:text-base tw:font-semibold tw:text-[#1a73e8]">
            {{ t('dateLocation.endTime') }}
          </p>
          <div class="tw:mt-2 tw:flex tw:items-center tw:gap-2">
            <span
              class="tw:inline-flex tw:items-center tw:justify-center tw:w-8 tw:h-8 tw:flex-shrink-0 tw:text-[#FF7700]"
              aria-hidden="true"
            >
              <svg class="tw:w-5 tw:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span class="tw:text-base tw:text-gray-600">{{ displayEndTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Event status & countdown -->
    <!-- <div
      v-if="showEventStatusSection"
      class="tw:rounded-xl tw:border tw:border-gray-200 tw:bg-white tw:p-4 tw:shadow-sm"
    >
      <p class="tw:text-base tw:font-semibold tw:text-[#1a73e8] tw:mb-4">
        {{ t('dateLocation.eventStatus') }}
      </p>

      <div
        class="tw:rounded-2xl tw:bg-gradient-to-r tw:from-[#3B82F6] tw:to-[#1D4ED8] tw:px-4 tw:py-5 sm:tw:px-6"
      >
        <template v-if="eventPhase === 'past'">
          <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-3 tw:min-h-[120px]">
            <span
              class="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-900"
            >
              <svg class="tw:w-4 tw:h-4 tw:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ t('eventCard.pastEvent') }}
            </span>
            <p class="tw:text-center tw:text-base tw:font-semibold tw:text-white">
              {{ t('dateLocation.eventHasEnded') }}
            </p>
          </div>
        </template>

        <template v-else>
          <div class="tw:flex tw:flex-col tw:items-center tw:gap-4">
            <span
              class="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-900"
            >
              <svg class="tw:w-4 tw:h-4 tw:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ statusBadgeLabel }}
            </span>

            <p class="tw:text-center tw:text-base tw:font-bold tw:text-white">
              {{ countdownSectionTitle }}
            </p>

            <div class="tw:grid tw:grid-cols-4 tw:gap-2 tw:w-full tw:max-w-md tw:mx-auto">
              <div
                v-for="unit in countdownUnits"
                :key="unit.key"
                class="tw:bg-white tw:rounded-xl tw:px-1 tw:py-3 tw:text-center tw:min-w-0 tw:shadow-sm"
              >
                <p class="tw:text-xl sm:tw:text-2xl tw:font-bold tw:text-gray-900 tw:tabular-nums">
                  {{ unit.value }}
                </p>
                <p class="tw:text-[10px] sm:tw:text-xs tw:text-gray-600 tw:mt-1 tw:leading-tight">
                  {{ unit.label }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div> -->

    <!-- Event Location: venue, address, map, more info / directions -->
    <div
      class="tw:rounded-xl tw:border tw:border-gray-200 tw:bg-white tw:p-4 tw:shadow-sm"
    >
      <p class="tw:text-base tw:font-semibold tw:text-[#1a73e8] tw:mb-4">
        {{ t('dateLocation.eventLocation') }}
      </p>

      <div class="tw:flex tw:gap-3 tw:items-start">
        <span
          class="tw:inline-flex tw:flex-shrink-0 tw:pt-0.5 tw:text-[#FF7700]"
          aria-hidden="true"
        >
          <svg class="tw:w-6 tw:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </span>
        <div class="tw:flex-1 tw:min-w-0">
          <p class="tw:text-base tw:font-bold tw:text-gray-800">
            {{ eventVenueName }}
          </p>
          <p class="tw:mt-1 tw:text-sm tw:text-gray-600 tw:leading-relaxed">
            {{ displayAddress }}
          </p>
        </div>
      </div>

      <div class="tw:mt-4 tw:relative tw:rounded-xl tw:overflow-hidden tw:border tw:border-gray-200 tw:shadow-sm">
        <Transition name="fade">
          <div
            v-if="isMapLoading"
            class="tw:absolute tw:inset-0 tw:bg-gray-100 tw:flex tw:items-center tw:justify-center tw:z-10"
          >
            <div class="tw:flex tw:flex-col tw:items-center tw:gap-3">
              <div class="tw:w-8 tw:h-8 tw:border-[3px] tw:border-blue-500 tw:border-t-transparent tw:rounded-full tw:animate-spin"></div>
              <span class="tw:text-sm tw:text-gray-600">Loading map...</span>
            </div>
          </div>
        </Transition>

        <div
          v-if="hasValidCoordinates"
          ref="mapContainerRef"
          class="tw:h-[220px] sm:tw:h-[280px] tw:w-full"
        ></div>

        <div
          v-else
          class="tw:h-[220px] sm:tw:h-[280px] tw:bg-gray-50 tw:flex tw:items-center tw:justify-center"
        >
          <div class="tw:flex tw:flex-col tw:items-center tw:gap-3 tw:text-center tw:px-6">
            <div class="tw:w-12 tw:h-12 tw:bg-gray-200 tw:rounded-full tw:flex tw:items-center tw:justify-center">
              <svg class="tw:w-6 tw:h-6 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p class="tw:text-sm tw:text-gray-500">Map coordinates not available for this event</p>
          </div>
        </div>
      </div>

      <!-- <p class="tw:text-xs tw:text-gray-400 tw:mt-2 tw:text-right">
        © MapTiler © OpenStreetMap contributors
      </p> -->

      <div class="tw:grid tw:grid-cols-2 tw:gap-3 tw:mt-4">
        <button
          type="button"
          class="tw:flex tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:py-2.5 tw:px-3 tw:rounded-lg tw:border-2 tw:border-[#1a73e8] tw:bg-white tw:text-[#1a73e8] tw:font-medium tw:text-sm hover:tw:bg-blue-50 tw:transition-colors"
          @click="openMoreInfo"
        >
          <svg class="tw:w-4 tw:h-4 tw:flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ t('dateLocation.moreInfo') }}
        </button>
        <button
          type="button"
          class="tw:flex tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:py-2.5 tw:px-3 tw:rounded-lg tw:bg-[#FF7700] tw:text-white tw:font-medium tw:text-sm hover:tw:bg-[#1557b8] tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
          :disabled="!hasValidCoordinates"
          @click="showDirections = true"
        >
          <svg class="tw:w-4 tw:h-4 tw:flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          {{ t('dateLocation.directions') }}
        </button>
      </div>
    </div>

    <!-- In-app directions panel (replaces old Google Maps redirect) -->
    <DirectionsPanel
      :visible="showDirections"
      :event="event"
      @close="showDirections = false"
      @routeDrawn="drawRouteOnDetailMap"
      @routeCleared="clearRouteFromDetailMap"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MAP_CONFIG } from '../config/mapConfig'
import DirectionsPanel from './DirectionsPanel.vue'

const { t, locale } = useI18n()

const showDirections = ref(false)

const props = defineProps({
  event: {
    type: Object,
    default: null
  },
  locationDetails: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['route', 'viewMap'])

// Refs
const mapContainerRef = ref(null)
const mapInstance = ref(null)
const markerInstance = ref(null)
const isMapLoading = ref(false)
const isMapInitialized = ref(false)

function formatTimeHHMM(timeStr) {
  if (timeStr == null || String(timeStr).trim() === '') return ''
  const s = String(timeStr).trim()
  const parts = s.split(':')
  if (parts.length >= 2) {
    const h = parts[0].padStart(2, '0')
    const m = parts[1].padStart(2, '0')
    return `${h}:${m}`
  }
  return s
}

// Computed - Convert coordinates to numbers and validate
// Support both lat/lng (transformed UI event) and latitude/longitude (raw API event)
const latitudeValue = computed(() => {
  const event = props.event
  if (!event) return null
  const lat = event.lat ?? event.latitude
  if (lat === null || lat === undefined || lat === '') return null
  const num = Number(lat)
  if (isNaN(num) || num === 0) return null
  return num
})

const longitudeValue = computed(() => {
  const event = props.event
  if (!event) return null
  const lng = event.lng ?? event.longitude
  if (lng === null || lng === undefined || lng === '') return null
  const num = Number(lng)
  if (isNaN(num)) return null
  return num
})

const hasValidCoordinates = computed(() => {
  return latitudeValue.value !== null && longitudeValue.value !== null
})

const formattedLongEventDate = computed(() => {
  const ev = props.event
  if (!ev) return t('dateLocation.notSpecified')
  const dateStr =
    ev.event_date ||
    ev.start_date ||
    (ev.start_datetime ? String(ev.start_datetime).split('T')[0] : null)
  if (!dateStr) {
    return ev.formatted_date || t('dateLocation.notSpecified')
  }
  const d = new Date(`${dateStr}T12:00:00`)
  if (isNaN(d.getTime())) {
    return ev.formatted_date || dateStr
  }
  return d.toLocaleDateString(locale.value, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const displayStartTime = computed(() => {
  const ev = props.event
  if (!ev) return t('dateLocation.notSpecified')
  if (ev.start_time) {
    const formatted = formatTimeHHMM(ev.start_time)
    return formatted || t('dateLocation.notSpecified')
  }
  if (ev.start_datetime) {
    const d = new Date(ev.start_datetime)
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString(locale.value, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  }
  return t('dateLocation.notSpecified')
})

const displayEndTime = computed(() => {
  const ev = props.event
  if (!ev) return t('dateLocation.notSpecified')
  if (ev.end_time) {
    const formatted = formatTimeHHMM(ev.end_time)
    return formatted || t('dateLocation.notSpecified')
  }
  if (ev.end_datetime) {
    const d = new Date(ev.end_datetime)
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString(locale.value, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  }
  return t('dateLocation.notSpecified')
})

const displayAddress = computed(() => {
  if (props.locationDetails?.full_address) {
    return props.locationDetails.full_address
  }
  const parts = []
  if (props.event?.address) parts.push(props.event.address)
  if (props.event?.city) parts.push(props.event.city)
  if (props.event?.country) parts.push(props.event.country)
  return parts.length > 0 ? parts.join(', ') : t('dateLocation.notSpecified')
})

const eventVenueName = computed(() => {
  const ev = props.event
  if (ev?.venue?.name) return ev.venue.name
  const inv = ev?.invited_venues_objects
  if (Array.isArray(inv) && inv.length && inv[0]?.name) return inv[0].name
  if (ev?.venue_name) return ev.venue_name
  if (props.locationDetails?.venue_name) return props.locationDetails.venue_name
  return t('dateLocation.notSpecified')
})

const venueWebsitePrimary = computed(() => {
  const inv = props.event?.invited_venues_objects
  if (Array.isArray(inv) && inv[0]?.website) {
    let w = String(inv[0].website).trim()
    if (w && !/^https?:\/\//i.test(w)) w = `https://${w}`
    return w
  }
  if (props.locationDetails?.venue_website) {
    const w = String(props.locationDetails.venue_website).trim()
    if (w && !/^https?:\/\//i.test(w)) return `https://${w}`
    return w || null
  }
  return null
})

function openMoreInfo() {
  if (venueWebsitePrimary.value) {
    window.open(venueWebsitePrimary.value, '_blank', 'noopener,noreferrer')
    return
  }
  const q = `${eventVenueName.value} ${displayAddress.value}`.trim()
  if (q.length > 0) {
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(q)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }
}

function normalizeTimePart(timeStr) {
  if (!timeStr) return '00:00:00'
  const s = String(timeStr).trim()
  if (s.length === 5 && s.includes(':') && s.split(':').length === 2) {
    return `${s}:00`
  }
  return s
}

const eventStartMs = computed(() => {
  const ev = props.event
  if (!ev) return null
  if (ev.start_datetime) {
    const d = new Date(ev.start_datetime)
    return isNaN(d.getTime()) ? null : d.getTime()
  }
  if (ev.event_date && ev.start_time) {
    const d = new Date(`${ev.event_date}T${normalizeTimePart(ev.start_time)}`)
    return isNaN(d.getTime()) ? null : d.getTime()
  }
  return null
})

const eventEndMs = computed(() => {
  const ev = props.event
  if (!ev) return null
  if (ev.end_datetime) {
    const d = new Date(ev.end_datetime)
    return isNaN(d.getTime()) ? null : d.getTime()
  }
  if (ev.event_date && ev.end_time) {
    const d = new Date(`${ev.event_date}T${normalizeTimePart(ev.end_time)}`)
    return isNaN(d.getTime()) ? null : d.getTime()
  }
  return null
})

const eventPhase = computed(() => {
  const now = Date.now()
  const start = eventStartMs.value
  const end = eventEndMs.value
  if (start == null) return 'unknown'
  if (now < start) return 'upcoming'
  if (end != null && now <= end) return 'live'
  return 'past'
})

const countdownTargetMs = computed(() => {
  if (eventPhase.value === 'upcoming') return eventStartMs.value
  if (eventPhase.value === 'live') return eventEndMs.value
  return null
})

const showEventStatusSection = computed(() => eventStartMs.value != null)

const statusBadgeLabel = computed(() => {
  if (eventPhase.value === 'live') return t('eventCard.liveNow')
  return t('eventCard.upcomingEvent')
})

const countdownSectionTitle = computed(() => {
  if (eventPhase.value === 'live') return t('dateLocation.countdownToEventEnd')
  return t('dateLocation.countdownToEventStart')
})

const countdownParts = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })

function padTwo(n) {
  return String(Math.max(0, Math.floor(Number(n)))).padStart(2, '0')
}

function updateCountdown() {
  const phase = eventPhase.value
  if (phase === 'past' || phase === 'unknown') {
    countdownParts.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }
  const target = countdownTargetMs.value
  if (target == null) {
    countdownParts.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }
  let diff = Math.max(0, target - Date.now())
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  diff -= days * 24 * 60 * 60 * 1000
  const hours = Math.floor(diff / (60 * 60 * 1000))
  diff -= hours * 60 * 60 * 1000
  const minutes = Math.floor(diff / (60 * 1000))
  diff -= minutes * 60 * 1000
  const seconds = Math.floor(diff / 1000)
  countdownParts.value = { days, hours, minutes, seconds }
}

const countdownUnits = computed(() => [
  {
    key: 'd',
    value: String(Math.max(0, countdownParts.value.days)),
    label: t('eventCard.countdownDays')
  },
  {
    key: 'h',
    value: padTwo(countdownParts.value.hours),
    label: t('eventCard.countdownHours')
  },
  {
    key: 'm',
    value: padTwo(countdownParts.value.minutes),
    label: t('eventCard.countdownMinutes')
  },
  {
    key: 's',
    value: padTwo(countdownParts.value.seconds),
    label: t('eventCard.countdownSeconds')
  }
])

let countdownTimerId = null

watch(
  () => props.event,
  () => {
    updateCountdown()
  },
  { deep: true }
)

// Initialize map
const initializeMap = async () => {
  if (!hasValidCoordinates.value) {
    return
  }
  
  if (!mapContainerRef.value) {
    await nextTick()
    if (!mapContainerRef.value) {
      return
    }
  }
  
  // Cleanup existing map
  destroyMap()
  
  isMapLoading.value = true
  
  try {
    await nextTick()
    
    const lng = longitudeValue.value
    const lat = latitudeValue.value
    
    mapInstance.value = new maplibregl.Map({
      container: mapContainerRef.value,
      style: MAP_CONFIG.STYLE_URL,
      center: [lng, lat],
      zoom: MAP_CONFIG.DETAIL_ZOOM,
      attributionControl: false
    })
    
    // Add navigation control
    mapInstance.value.addControl(
      new maplibregl.NavigationControl({ showCompass: false }), 
      'top-right'
    )
    
    // Handle map load
    mapInstance.value.on('load', () => {
      isMapLoading.value = false
      isMapInitialized.value = true
      
      // Resize map to fit container
      mapInstance.value.resize()
      
      // Add marker after map loads
      addMarker()
    })
    
    // Handle map error
    mapInstance.value.on('error', (e) => {
      console.error('Map error:', e)
      isMapLoading.value = false
    })
    
  } catch (error) {
    console.error('Failed to initialize map:', error)
    isMapLoading.value = false
  }
}

// Add marker with popup
const addMarker = () => {
  if (!mapInstance.value || !hasValidCoordinates.value) return
  
  const lng = longitudeValue.value
  const lat = latitudeValue.value
  
  // Create custom marker element
  const el = document.createElement('div')
  el.className = 'custom-map-marker'
  el.innerHTML = `
    <img 
      src="/marker.png" 
      alt="Location" 
      style="width: 40px; height: 40px; cursor: pointer; display: block;"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
    />
    <div style="display: none; width: 36px; height: 36px; background: #EF4444; border-radius: 50%; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `
  
  // Create popup
  const popupContent = ``
  
  const popup = new maplibregl.Popup({
    offset: [0, -40],
    closeButton: true,
    closeOnClick: false,
    className: 'event-location-popup'
  }).setHTML(popupContent)
  
  // Create and add marker
  markerInstance.value = new maplibregl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat([lng, lat])
    .setPopup(popup)
    .addTo(mapInstance.value)
  
  // Show popup by default
  markerInstance.value.togglePopup()
}

// Destroy map instance
const destroyMap = () => {
  if (markerInstance.value) {
    markerInstance.value.remove()
    markerInstance.value = null
  }
  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
  }
  isMapInitialized.value = false
}

// Route overlay state for the inline map
let routeSource = null
let routeLayer = null
let userMarkerObj = null

function drawRouteOnDetailMap(payload) {
  clearRouteFromDetailMap()

  const m = mapInstance.value
  if (!m || !m.loaded()) return

  const geojson = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: payload.polyline.map(([lat, lng]) => [lng, lat]),
    },
    properties: {},
  }

  const srcId  = 'dp-route-src'
  const layId  = 'dp-route-layer'

  m.addSource(srcId, { type: 'geojson', data: geojson })
  m.addLayer({
    id: layId, type: 'line', source: srcId,
    paint: { 'line-color': '#F97316', 'line-width': 4, 'line-opacity': 0.85 },
    layout: { 'line-join': 'round', 'line-cap': 'round' },
  })
  routeSource = srcId
  routeLayer  = layId

  // User location marker
  const el = document.createElement('div')
  el.style.cssText = 'width:16px;height:16px;border-radius:50%;background:#3B82F6;border:3px solid #fff;box-shadow:0 0 6px rgba(59,130,246,0.5);'
  userMarkerObj = new maplibregl.Marker({ element: el })
    .setLngLat([payload.userLng, payload.userLat])
    .addTo(m)

  // Fit bounds to show full route
  const bounds = new maplibregl.LngLatBounds()
  bounds.extend([payload.userLng, payload.userLat])
  const lat = latitudeValue.value
  const lng = longitudeValue.value
  if (lat != null && lng != null) bounds.extend([lng, lat])
  m.fitBounds(bounds, { padding: 50, duration: 600 })
}

function clearRouteFromDetailMap() {
  const m = mapInstance.value
  if (m && m.loaded()) {
    if (routeLayer && m.getLayer(routeLayer))  m.removeLayer(routeLayer)
    if (routeSource && m.getSource(routeSource)) m.removeSource(routeSource)
  }
  routeLayer = null
  routeSource = null
  if (userMarkerObj) { userMarkerObj.remove(); userMarkerObj = null }
}

// Watch for coordinate changes and reinitialize map
watch(
  [hasValidCoordinates, latitudeValue, longitudeValue],
  async ([hasCoords, lat, lng], [prevHasCoords, prevLat, prevLng]) => {
    if (hasCoords) {
      // Wait for DOM to update (v-if renders the container)
      await nextTick()
      
      // Additional delay to ensure container is fully rendered
      setTimeout(() => {
        if (!mapContainerRef.value) {
          setTimeout(() => {
            if (mapContainerRef.value && hasValidCoordinates.value && !isMapInitialized.value) {
              initializeMap()
            }
          }, 100)
          return
        }
        
        // Initialize or reinitialize if coordinates changed
        if (!isMapInitialized.value || lat !== prevLat || lng !== prevLng) {
          initializeMap()
        }
      }, 50)
    } else {
      // Destroy map if coordinates became invalid
      if (isMapInitialized.value) {
        destroyMap()
      }
    }
  },
  { immediate: true }
)

// Lifecycle
onMounted(() => {
  updateCountdown()
  countdownTimerId = setInterval(updateCountdown, 1000)

  if (hasValidCoordinates.value && !isMapInitialized.value) {
    setTimeout(() => {
      if (mapContainerRef.value && hasValidCoordinates.value && !isMapInitialized.value) {
        initializeMap()
      }
    }, 200)
  }
})

onUnmounted(() => {
  if (countdownTimerId) {
    clearInterval(countdownTimerId)
    countdownTimerId = null
  }
  destroyMap()
})
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom marker styles */
:deep(.custom-map-marker) {
  cursor: pointer;
  transition: transform 0.2s ease;
}

:deep(.custom-map-marker:hover) {
  transform: scale(1.1);
}

/* Popup styles */
:deep(.event-location-popup .maplibregl-popup-content) {
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 0;
}

:deep(.event-location-popup .maplibregl-popup-close-button) {
  font-size: 16px;
  padding: 4px 8px;
  color: #9CA3AF;
}

:deep(.event-location-popup .maplibregl-popup-close-button:hover) {
  color: #374151;
  background: transparent;
}

:deep(.maplibregl-popup-tip) {
  border-top-color: white;
}

/* Ensure map container has proper dimensions */
:deep(.maplibregl-canvas) {
  outline: none;
}
</style>
