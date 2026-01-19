<template>
  <div class="tw:px-4 tw:py-4">
    <!-- Date & Time Section -->
    <!-- <div class="tw:mb-2">
      <div class="tw:flex tw:items-start tw:gap-3">
        <div class="tw:mt-0.5">
          <img src="../assets/calendar.png" alt="Calendar Icon">
        </div>
        
        <div class="tw:flex-1">
          <p class="tw-text-base tw-font-medium tw:text-gray-900 tw:mb-4" style="font-size: 14px;">
            {{ formattedDateTime }}
          </p>
          
          <p v-if="fullAddress" class="tw:text-sm tw:text-gray-600 tw:mb-4">
            {{ fullAddress }}
          </p>
          
          <button 
            @click="addToCalendar"
            class="tw:flex tw:items-center tw:gap-1 tw:text-sm tw:text-blue-600 hover:tw:text-blue-700 tw-transition-colors tw:mb-4"
          >
            <span>{{ t('dateLocation.addToCalendar') }}</span>
            <svg class="tw-w-4 tw:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div> -->

    <!-- Location Section -->
    <div class="tw:mb-2">
      <div class="tw:flex tw:items-start tw:gap-3">
        <!-- Location Pin Icon -->
        <div class="tw:mt-0.5">
          <img src="../assets/location-01.png" alt="Location Pin Icon">
        </div>
        
        <!-- Location Content -->
        <div class="tw:flex-1">
          <!-- Location Title (Venue Name) -->
          <p class="tw:text-base tw-font-medium tw:text-gray-900 tw:mb-4" style="font-size: 14px;">
            {{ venueName }}
          </p>
          
          <!-- Full Address -->
          <p v-if="fullAddress" class="tw:text-sm tw:text-gray-600 tw:mb-4">
            {{ fullAddress }}
          </p>

          <!-- Directions -->
          <p v-if="locationDetails?.directions" class="tw:text-sm tw:text-gray-500 tw:mb-4 tw:italic">
            {{ locationDetails.directions }}
          </p>

          <!-- Public Transport -->
          <div v-if="hasPublicTransport" class="tw:mb-4">
            <p class="tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">{{ t('dateLocation.publicTransport') }}</p>
            <div class="tw:text-sm tw:text-gray-600 tw:space-y-1">
              <p v-if="locationDetails?.public_transport?.subway">
                <span class="tw:font-medium">{{ t('dateLocation.subway') }}:</span> {{ locationDetails.public_transport.subway }}
              </p>
              <p v-if="locationDetails?.public_transport?.bus">
                <span class="tw:font-medium">{{ t('dateLocation.bus') }}:</span> {{ locationDetails.public_transport.bus }}
              </p>
              <p v-if="locationDetails?.public_transport?.tram && locationDetails.public_transport.tram.length > 0">
                <span class="tw:font-medium">{{ t('dateLocation.tram') }}:</span> {{ locationDetails.public_transport.tram.join(', ') }}
              </p>
              <p v-if="locationDetails?.public_transport?.train_station || locationDetails?.public_transport?.train">
                <span class="tw:font-medium">{{ t('dateLocation.train') }}:</span> {{ locationDetails.public_transport.train || locationDetails.public_transport.train_station }}
              </p>
            </div>
          </div>

          <!-- Parking Info -->
          <div v-if="hasParkingInfo" class="tw:mb-4">
            <p class="tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">{{ t('dateLocation.parking') }}</p>
            <div class="tw:text-sm tw:text-gray-600 tw:space-y-1">
              <p v-if="locationDetails?.parking_info?.available">
                {{ t('dateLocation.parkingAvailable') }}
                <span v-if="locationDetails?.parking_info?.price"> - {{ locationDetails.parking_info.price }}</span>
              </p>
              <div v-if="locationDetails?.parking_info?.lots && locationDetails.parking_info.lots.length > 0">
                <p v-for="(lot, index) in locationDetails.parking_info.lots" :key="index">• {{ lot }}</p>
              </div>
            </div>
          </div>
          
          <!-- Location Actions -->
          <div class="tw:flex tw:items-center">
            <!-- View on Map Link -->
            <button 
              @click="viewOnMap"
              class="tw:text-sm tw:text-blue-600 hover:tw:text-blue-700 tw-transition-colors" 
              style="display: flex; align-items: center;"
            >
              {{ t('dateLocation.viewOnMap') }} <img src="../assets/map.png" alt="Map Icon" style="width: 15px; height: 15px; margin-left: 10px;">
            </button>
            
            <!-- Route Button -->
            <button 
              @click="openRoute"
              class="tw:bg-white tw:px-3 tw:py-2 tw:flex tw:items-center tw:gap-1 tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)" 
              style="margin-left: 2rem;"
            >
              <span class="tw:text-sm tw-font-medium tw:text-gray-900">{{ t('dateLocation.route') }}</span>
              <img src="../assets/map.png" alt="Map Icon" style="width: 15px; height: 15px; margin-left: 10px;">
            </button>
          </div>

          <!-- Venue Website -->
          <a 
            v-if="locationDetails?.venue_website"
            :href="locationDetails.venue_website"
            target="_blank"
            rel="noopener noreferrer"
            class="tw:block tw:mt-4 tw:text-sm tw:text-blue-600 hover:tw:text-blue-700 tw:underline"
          >
            {{ t('dateLocation.visitVenueWebsite') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Event, EventLocationDetails } from '../types/events'

const { t } = useI18n()

interface Props {
  event?: Event | null
  locationDetails?: EventLocationDetails | null
}

const props = withDefaults(defineProps<Props>(), {
  event: null,
  locationDetails: null
})

const emit = defineEmits(['route', 'viewMap'])

// Computed: Formatted date and time
// const formattedDateTime = computed(() => {
//   if (!props.event?.start_datetime) {
//     return t('dateLocation.notSpecified')
//   }
  
//   const start = new Date(props.event.start_datetime)
//   const end = props.event.end_datetime ? new Date(props.event.end_datetime) : null
  
//   const dateOpts: Intl.DateTimeFormatOptions = { 
//     weekday: 'short', 
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric'
//   }
//   const timeOpts: Intl.DateTimeFormatOptions = { 
//     hour: '2-digit', 
//     minute: '2-digit',
//     hour12: true
//   }
  
//   const startDateStr = start.toLocaleDateString('en-US', dateOpts)
//   const startTime = start.toLocaleTimeString('en-US', timeOpts)
  
//   if (end) {
//     const endDateStr = end.toLocaleDateString('en-US', dateOpts)
//     const endTime = end.toLocaleTimeString('en-US', timeOpts)
    
//     // Check if same day
//     if (startDateStr === endDateStr) {
//       return `${startDateStr} at ${startTime} - ${endTime}`
//     }
//     return `${startDateStr} at ${startTime} - ${endDateStr} at ${endTime}`
//   }
  
//   return `${startDateStr} at ${startTime}`
// })

// Computed: Venue name
const venueName = computed(() => {
  return props.locationDetails?.venue_name || 
         props.event?.venue_name || 
         props.event?.city || 
         t('dateLocation.notSpecified')
})

// Computed: Full address
const fullAddress = computed(() => {
  if (props.locationDetails?.full_address) {
    return props.locationDetails.full_address
  }
  
  const parts = []
  if (props.event?.address) parts.push(props.event.address)
  if (props.event?.city) parts.push(props.event.city)
  if (props.event?.country) parts.push(props.event.country)
  
  return parts.length > 0 ? parts.join(', ') : null
})

// Computed: Has public transport info
const hasPublicTransport = computed(() => {
  const pt = props.locationDetails?.public_transport
  return pt?.subway || pt?.bus || (pt?.tram && pt.tram.length > 0) || pt?.train_station || pt?.train
})

// Computed: Has parking info
const hasParkingInfo = computed(() => {
  const pi = props.locationDetails?.parking_info
  return pi?.available || (pi?.lots && pi.lots.length > 0)
})

// Methods
// function addToCalendar() {
//   if (!props.event?.start_datetime) return
  
//   const start = new Date(props.event.start_datetime)
//   const end = props.event.end_datetime ? new Date(props.event.end_datetime) : new Date(start.getTime() + 2 * 60 * 60 * 1000)
  
//   const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '')
  
//   const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(props.event.title || '')}&dates=${formatDate(start)}/${formatDate(end)}&location=${encodeURIComponent(fullAddress.value || '')}&details=${encodeURIComponent(props.event.description || '')}`
  
//   window.open(googleCalendarUrl, '_blank')
// }

function viewOnMap() {
  const lat = props.locationDetails?.latitude || props.event?.latitude
  const lng = props.locationDetails?.longitude || props.event?.longitude
  
  if (props.locationDetails?.map_url) {
    window.open(props.locationDetails.map_url, '_blank')
  } else if (lat && lng) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
  } else if (fullAddress.value) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress.value)}`, '_blank')
  }
  
  emit('viewMap', props.event)
}

function openRoute() {
  const lat = props.locationDetails?.latitude || props.event?.latitude
  const lng = props.locationDetails?.longitude || props.event?.longitude
  
  if (lat && lng) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank')
  } else if (fullAddress.value) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress.value)}`, '_blank')
  }
  
  emit('route', props.event)
}
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
