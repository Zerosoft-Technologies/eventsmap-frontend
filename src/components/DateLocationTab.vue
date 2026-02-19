<template>
  <div class="tw:px-4 tw:py-4">
    <!-- Date & Time Section -->
    <div class="tw:mb-6">
      <div class="tw:flex tw:items-start tw:gap-3">
        <div class="tw:w-10 tw:h-10 tw:bg-blue-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
          <svg class="tw:w-5 tw:h-5 tw:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="tw:flex-1">
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-900 tw:mb-1">Date & Time</h4>
          <p class="tw:text-sm tw:text-gray-700">{{ displayDate }}</p>
        </div>
      </div>
    </div>

    <!-- Location Section -->
    <div class="tw:mb-6">
      <div class="tw:flex tw:items-start tw:gap-3">
        <div class="tw:w-10 tw:h-10 tw:bg-green-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
          <svg class="tw:w-5 tw:h-5 tw:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div class="tw:flex-1">
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-900 tw:mb-1">Location</h4>
          <p class="tw:text-sm tw:text-gray-700 tw:mb-2">{{ displayAddress }}</p>
          
          <!-- Coordinates -->
          <div v-if="hasValidCoordinates" class="tw:flex tw:gap-3 tw:mb-3">
            <span class="tw:text-xs tw:text-gray-500 tw:bg-gray-100 tw:px-2 tw:py-1 tw:rounded">
              Lat: {{ latitudeValue.toFixed(6) }}
            </span>
            <span class="tw:text-xs tw:text-gray-500 tw:bg-gray-100 tw:px-2 tw:py-1 tw:rounded">
              Lng: {{ longitudeValue.toFixed(6) }}
            </span>
          </div>
          
          <!-- Action Buttons -->
          <div class="tw:flex tw:gap-2">
            <button 
              @click="openDirections"
              :disabled="!hasValidCoordinates"
              class="tw:inline-flex tw:items-center tw:gap-1.5 tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:text-blue-600 tw:bg-blue-50 tw:rounded-lg hover:tw:bg-blue-100 tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
            >
              <svg class="tw:w-3.5 tw:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Get Directions
            </button>
            <button 
              @click="copyAddress"
              :disabled="!displayAddress"
              class="tw:inline-flex tw:items-center tw:gap-1.5 tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:text-gray-600 tw:bg-gray-100 tw:rounded-lg hover:tw:bg-gray-200 tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
            >
              <svg class="tw:w-3.5 tw:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {{ copySuccess ? 'Copied!' : 'Copy Address' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Section -->
    <div>
      <h4 class="tw:text-sm tw:font-semibold tw:text-gray-900 tw:mb-3">Venue Map</h4>
      
      <div class="tw:relative tw:rounded-xl tw:overflow-hidden tw:border tw:border-gray-200 tw:shadow-sm">
        <!-- Loading State -->
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
        
        <!-- Map Container (shown when coordinates valid) -->
        <div 
          v-if="hasValidCoordinates"
          ref="mapContainerRef" 
          class="tw:h-[300px] lg:tw:h-[400px] tw:w-full"
        ></div>
        
        <!-- No Coordinates Fallback -->
        <div 
          v-else
          class="tw:h-[300px] lg:tw:h-[400px] tw:bg-gray-50 tw:flex tw:items-center tw:justify-center"
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
      
      <!-- Map Attribution -->
      <p class="tw:text-xs tw:text-gray-400 tw:mt-2 tw:text-right">
        © MapTiler © OpenStreetMap contributors
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MAP_CONFIG } from '../config/mapConfig'

const { t, locale } = useI18n()

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
const copySuccess = ref(false)

// Debug: Log event prop changes
watch(() => props.event, (newEvent) => {
  console.log('[DateLocationTab] Event prop changed:', newEvent)
  console.log('[DateLocationTab] lat:', newEvent?.lat, 'latitude:', newEvent?.latitude)
  console.log('[DateLocationTab] lng:', newEvent?.lng, 'longitude:', newEvent?.longitude)
}, { immediate: true, deep: true })

// Computed - Convert coordinates to numbers and validate
// Support both lat/lng (transformed UI event) and latitude/longitude (raw API event)
const latitudeValue = computed(() => {
  const event = props.event
  if (!event) {
    console.log('[DateLocationTab] latitudeValue: event is null/undefined')
    return null
  }
  
  // Check both property names: lat (UI) and latitude (API)
  const lat = event.lat ?? event.latitude
  console.log('[DateLocationTab] Raw latitude - lat:', event.lat, 'latitude:', event.latitude, 'using:', lat)
  
  if (lat === null || lat === undefined || lat === '') {
    console.log('[DateLocationTab] latitudeValue: lat is null/undefined/empty')
    return null
  }
  
  const num = Number(lat)
  if (isNaN(num) || num === 0) {
    console.log('[DateLocationTab] latitudeValue: invalid number:', num)
    return null
  }
  
  console.log('[DateLocationTab] latitudeValue: valid =', num)
  return num
})

const longitudeValue = computed(() => {
  const event = props.event
  if (!event) {
    console.log('[DateLocationTab] longitudeValue: event is null/undefined')
    return null
  }
  
  // Check both property names: lng (UI) and longitude (API)
  const lng = event.lng ?? event.longitude
  console.log('[DateLocationTab] Raw longitude - lng:', event.lng, 'longitude:', event.longitude, 'using:', lng)
  
  if (lng === null || lng === undefined || lng === '') {
    console.log('[DateLocationTab] longitudeValue: lng is null/undefined/empty')
    return null
  }
  
  const num = Number(lng)
  if (isNaN(num)) {
    console.log('[DateLocationTab] longitudeValue: invalid number:', num)
    return null
  }
  
  console.log('[DateLocationTab] longitudeValue: valid =', num)
  return num
})

const hasValidCoordinates = computed(() => {
  const lat = latitudeValue.value
  const lng = longitudeValue.value
  const valid = lat !== null && lng !== null
  console.log('[DateLocationTab] hasValidCoordinates:', valid, '(lat:', lat, 'lng:', lng, ')')
  return valid
})

const displayDate = computed(() => {
  return props.event?.formatted_date || props.event?.date || 'Not specified'
})

const displayAddress = computed(() => {
  if (props.locationDetails?.full_address) {
    return props.locationDetails.full_address
  }
  
  const parts = []
  if (props.event?.address) parts.push(props.event.address)
  if (props.event?.city) parts.push(props.event.city)
  if (props.event?.country) parts.push(props.event.country)
  
  return parts.length > 0 ? parts.join(', ') : 'Address not specified'
})

// Initialize map
const initializeMap = async () => {
  if (!hasValidCoordinates.value) {
    console.log('No valid coordinates, skipping map init')
    return
  }
  
  if (!mapContainerRef.value) {
    console.log('Map container not ready, waiting...')
    await nextTick()
    if (!mapContainerRef.value) {
      console.log('Map container still not available')
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
    
    console.log('Initializing map at:', { lat, lng })
    
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
      console.log('Map loaded successfully')
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
  const popupContent = `
    <div style="padding: 10px; min-width: 180px;">
      <h4 style="font-weight: 600; font-size: 14px; color: #111827; margin: 0 0 6px 0;">
        ${props.event?.title || 'Event Location'}
      </h4>
      <p style="font-size: 12px; color: #6B7280; margin: 0; line-height: 1.4;">
        ${displayAddress.value}
      </p>
    </div>
  `
  
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

// Open directions in Google Maps
const openDirections = () => {
  if (!hasValidCoordinates.value) return
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitudeValue.value},${longitudeValue.value}`
  window.open(url, '_blank')
  emit('route', props.event)
}

// Copy address to clipboard
const copyAddress = async () => {
  if (!displayAddress.value) return
  try {
    await navigator.clipboard.writeText(displayAddress.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy address:', error)
  }
}

// Watch for coordinate changes and reinitialize map
watch(
  [hasValidCoordinates, latitudeValue, longitudeValue],
  async ([hasCoords, lat, lng], [prevHasCoords, prevLat, prevLng]) => {
    console.log('[DateLocationTab] Coordinates watch triggered:', { hasCoords, lat, lng, prevHasCoords, prevLat, prevLng })
    
    if (hasCoords) {
      // Wait for DOM to update (v-if renders the container)
      await nextTick()
      
      // Additional delay to ensure container is fully rendered
      setTimeout(() => {
        if (!mapContainerRef.value) {
          console.log('[DateLocationTab] Map container not ready yet, retrying...')
          setTimeout(() => {
            if (mapContainerRef.value && hasValidCoordinates.value && !isMapInitialized.value) {
              initializeMap()
            }
          }, 100)
          return
        }
        
        // Initialize or reinitialize if coordinates changed
        if (!isMapInitialized.value || lat !== prevLat || lng !== prevLng) {
          console.log('[DateLocationTab] Triggering map initialization')
          initializeMap()
        }
      }, 50)
    } else {
      // Destroy map if coordinates became invalid
      if (isMapInitialized.value) {
        console.log('[DateLocationTab] Destroying map - coordinates invalid')
        destroyMap()
      }
    }
  },
  { immediate: true }
)

// Lifecycle
onMounted(() => {
  console.log('[DateLocationTab] Component mounted')
  console.log('[DateLocationTab] props.event:', props.event)
  console.log('[DateLocationTab] hasValidCoordinates:', hasValidCoordinates.value)
  
  // Ensure map initializes after mount if coordinates are valid
  if (hasValidCoordinates.value && !isMapInitialized.value) {
    setTimeout(() => {
      console.log('[DateLocationTab] Delayed mount init check')
      if (mapContainerRef.value && hasValidCoordinates.value && !isMapInitialized.value) {
        initializeMap()
      }
    }, 200)
  }
})

onUnmounted(() => {
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
