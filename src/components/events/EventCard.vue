<template>
  <div 
    :class="[
      'tw:p-4 tw:bg-white tw:rounded-xl tw:border tw:border-gray-200 tw:cursor-pointer tw:transition-all tw:duration-200',
      isSelected ? 'tw:ring-2 tw:ring-[var(--primary-color)] tw:shadow-lg' : 'tw:hover:shadow-md'
    ]"
    @click="$emit('select', event.id)"
  >
    <!-- Header -->
    <div class="tw:flex tw:justify-between tw:items-start tw:gap-2">
      <h4 class="tw:text-base tw:font-semibold tw:text-[var(--primary-color)] tw:leading-tight tw:line-clamp-2">
        {{ event.title }}
      </h4>
      
      <!-- Live Badge -->
      <span 
        v-if="event.is_live_now"
        class="tw:flex-shrink-0 tw:px-2 tw:py-1 tw:text-xs tw:font-medium tw:text-red-500 tw:bg-red-50 tw:border tw:border-red-200 tw:rounded-md tw:flex tw:items-center tw:gap-1"
      >
        <span class="tw:w-2 tw:h-2 tw:bg-red-500 tw:rounded-full tw:animate-pulse"></span>
        LIVE
      </span>
    </div>

    <!-- Category -->
    <p class="tw:text-sm tw:text-gray-600 tw:mt-1 tw:capitalize">{{ event.category }}</p>

    <!-- Date/Time -->
    <div class="tw:flex tw:items-center tw:gap-2 tw:mt-3 tw:text-sm tw:text-gray-700">
      <CalendarIcon class="tw:w-4 tw:h-4 tw:text-gray-400" />
      <span>{{ formattedDate }}</span>
    </div>

    <!-- Location -->
    <div v-if="event.address || event.city" class="tw:flex tw:items-center tw:gap-2 tw:mt-2 tw:text-sm tw:text-gray-700">
      <MapPinIcon class="tw:w-4 tw:h-4 tw:text-gray-400" />
      <span class="tw:line-clamp-1">{{ event.address || event.city }}</span>
    </div>

    <!-- Distance (if geo sorted) -->
    <div v-if="event.distance_km != null" class="tw:flex tw:items-center tw:gap-2 tw:mt-2 tw:text-sm tw:text-[var(--primary-color)]">
      <NavigationIcon class="tw:w-4 tw:h-4" />
      <span>{{ formatDistance(event.distance_km) }} away</span>
    </div>

    <!-- Price -->
    <div v-if="event.price" class="tw:flex tw:items-center tw:gap-2 tw:mt-2 tw:text-sm tw:text-gray-700">
      <TicketIcon class="tw:w-4 tw:h-4 tw:text-gray-400" />
      <span>{{ event.price }}</span>
    </div>

    <!-- Footer -->
    <div class="tw:flex tw:items-center tw:justify-between tw:mt-4 tw:pt-3 tw:border-t tw:border-gray-100">
      <!-- Age & Dresscode -->
      <div class="tw:flex tw:items-center tw:gap-3 tw:text-xs tw:text-gray-500">
        <span v-if="event.min_age" class="tw:px-2 tw:py-0.5 tw:bg-gray-100 tw:rounded">
          {{ event.min_age }}+
        </span>
        <span v-if="event.dresscode" class="tw:px-2 tw:py-0.5 tw:bg-gray-100 tw:rounded tw:capitalize">
          {{ event.dresscode }}
        </span>
      </div>

      <!-- View button -->
      <button 
        class="tw:text-sm tw:text-[var(--primary-color)] tw:font-medium tw:flex tw:items-center tw:gap-1 tw:hover:underline"
        @click.stop="$emit('view', event.id)"
      >
        View
        <ChevronRightIcon class="tw:w-4 tw:h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CalendarIcon, MapPinIcon, NavigationIcon, TicketIcon, ChevronRightIcon } from 'lucide-vue-next'
import type { Event } from '../../types/events'

const props = defineProps<{
  event: Event
  isSelected?: boolean
}>()

defineEmits<{
  (e: 'select', id: number): void
  (e: 'view', id: number): void
}>()

const formattedDate = computed(() => {
  const start = new Date(props.event.start_datetime)
  const end = new Date(props.event.end_datetime)
  
  const dateOpts: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  }
  const timeOpts: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  }
  
  const dateStr = start.toLocaleDateString('en-US', dateOpts)
  const startTime = start.toLocaleTimeString('en-US', timeOpts)
  const endTime = end.toLocaleTimeString('en-US', timeOpts)
  
  return `${dateStr}, ${startTime} - ${endTime}`
})

const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  }
  return `${km.toFixed(1)}km`
}
</script>
