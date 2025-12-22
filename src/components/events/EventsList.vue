<template>
  <div class="tw:flex tw:flex-col tw:h-full">
    <!-- Header -->
    <div class="tw:flex tw:items-center tw:justify-between tw:mb-4">
      <div>
        <h3 class="tw:text-lg tw:font-semibold tw:text-[var(--primary-color)]">Events</h3>
        <p class="tw:text-sm tw:text-gray-500">
          {{ totalEvents }} {{ totalEvents === 1 ? 'event' : 'events' }} found
        </p>
      </div>
      
      <!-- Sort indicator -->
      <div v-if="isGeoSorted" class="tw:text-xs tw:text-gray-500 tw:flex tw:items-center tw:gap-1">
        <NavigationIcon class="tw:w-3 tw:h-3" />
        Sorted by distance
      </div>
      <div v-else class="tw:text-xs tw:text-gray-500 tw:flex tw:items-center tw:gap-1">
        <CalendarIcon class="tw:w-3 tw:h-3" />
        Sorted by date
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading && events.length === 0" class="tw:flex tw:items-center tw:justify-center tw:py-12">
      <div class="tw:flex tw:flex-col tw:items-center tw:gap-3">
        <LoaderIcon class="tw:w-8 tw:h-8 tw:text-[var(--primary-color)] tw:animate-spin" />
        <p class="tw:text-sm tw:text-gray-500">Loading events...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="tw:flex tw:items-center tw:justify-center tw:py-12">
      <div class="tw:flex tw:flex-col tw:items-center tw:gap-3 tw:text-center">
        <AlertCircleIcon class="tw:w-8 tw:h-8 tw:text-red-500" />
        <p class="tw:text-sm tw:text-red-600">{{ error }}</p>
        <button 
          @click="$emit('retry')"
          class="tw:text-sm tw:text-[var(--primary-color)] tw:font-medium tw:hover:underline"
        >
          Try again
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="events.length === 0" class="tw:flex tw:items-center tw:justify-center tw:py-12">
      <div class="tw:flex tw:flex-col tw:items-center tw:gap-3 tw:text-center">
        <CalendarIcon class="tw:w-12 tw:h-12 tw:text-gray-300" />
        <p class="tw:text-gray-600 tw:font-medium">No events found</p>
        <p class="tw:text-sm tw:text-gray-500">Try adjusting your filters or search area</p>
      </div>
    </div>

    <!-- Events list -->
    <div v-else class="tw:flex-1 tw:overflow-y-auto tw:space-y-3 tw:pr-1">
      <EventCard 
        v-for="event in events"
        :key="event.id"
        :event="event"
        :isSelected="selectedEventId === event.id"
        @select="$emit('select', $event)"
        @view="$emit('view', $event)"
      />
      
      <!-- Load more button -->
      <div v-if="hasMore" class="tw:py-4">
        <button
          @click="$emit('loadMore')"
          :disabled="loading"
          class="tw:w-full tw:py-3 tw:px-4 tw:bg-gray-100 tw:text-gray-700 tw:rounded-lg tw:font-medium tw:hover:bg-gray-200 tw:transition-colors tw:disabled:opacity-50 tw:disabled:cursor-not-allowed tw:flex tw:items-center tw:justify-center tw:gap-2"
        >
          <LoaderIcon v-if="loading" class="tw:w-4 tw:h-4 tw:animate-spin" />
          <span>{{ loading ? 'Loading...' : 'Load more events' }}</span>
        </button>
      </div>

      <!-- End of list -->
      <div v-else-if="events.length > 0" class="tw:py-4 tw:text-center tw:text-sm tw:text-gray-500">
        You've reached the end
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LoaderIcon, AlertCircleIcon, CalendarIcon, NavigationIcon } from 'lucide-vue-next'
import EventCard from './EventCard.vue'
import type { Event } from '../../types/events'

defineProps<{
  events: Event[]
  loading: boolean
  error: string | null
  totalEvents: number
  hasMore: boolean
  selectedEventId: number | null
  isGeoSorted: boolean
}>()

defineEmits<{
  (e: 'select', id: number): void
  (e: 'view', id: number): void
  (e: 'loadMore'): void
  (e: 'retry'): void
}>()
</script>
