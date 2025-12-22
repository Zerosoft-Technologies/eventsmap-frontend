<template>
  <div class="tw:flex tw:flex-col tw:h-screen tw:bg-gray-50">
    <!-- Mobile Filter Toggle -->
    <div class="tw:lg:hidden tw:p-4 tw:bg-white tw:border-b tw:border-gray-200">
      <div class="tw:flex tw:items-center tw:gap-3">
        <button 
          @click="showMobileFilters = !showMobileFilters"
          class="tw:flex-1 tw:py-2.5 tw:px-4 tw:bg-gray-100 tw:rounded-lg tw:flex tw:items-center tw:justify-center tw:gap-2"
        >
          <FilterIcon class="tw:w-4 tw:h-4" />
          <span>{{ showMobileFilters ? 'Hide Filters' : 'Show Filters' }}</span>
          <span class="tw:text-xs tw:bg-[var(--primary-color)] tw:text-white tw:px-2 tw:py-0.5 tw:rounded-full">
            {{ activeFiltersCount }}
          </span>
        </button>
        <button 
          v-if="showMobileFilters"
          @click="showMobileFilters = false"
          class="tw:py-2.5 tw:px-4 tw:bg-gray-100 tw:rounded-lg tw:flex tw:items-center tw:justify-center"
        >
          <XIcon class="tw:w-4 tw:h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="tw:flex tw:flex-1 tw:overflow-hidden">
      <!-- Sidebar (Filters + List) -->
      <aside 
        :class="[
          'tw:flex tw:flex-col tw:bg-white tw:border-r tw:border-gray-200 tw:transition-all tw:duration-300',
          'tw:absolute tw:lg:relative tw:z-20 tw:lg:z-auto',
          sidebarWidth,
          'tw:h-[calc(100vh-120px)] tw:lg:h-auto',
          showMobileFilters ? 'tw:left-0' : 'tw:-left-full tw:lg:left-0'
        ]"
      >
        <!-- Filters Section (collapsible) -->
        <div class="tw:border-b tw:border-gray-200">
          <button 
            @click="showFiltersPanel = !showFiltersPanel"
            class="tw:w-full tw:p-4 tw:flex tw:items-center tw:justify-between tw:hover:bg-gray-50"
          >
            <div class="tw:flex tw:items-center tw:gap-2">
              <SlidersHorizontalIcon class="tw:w-5 tw:h-5 tw:text-[var(--primary-color)]" />
              <span class="tw:font-medium tw:text-[var(--primary-color)]">Filters</span>
              <span v-if="activeFiltersCount > 0" class="tw:text-xs tw:bg-[var(--primary-color)] tw:text-white tw:px-2 tw:py-0.5 tw:rounded-full">
                {{ activeFiltersCount }}
              </span>
            </div>
            <ChevronDownIcon 
              :class="[
                'tw:w-5 tw:h-5 tw:text-gray-400 tw:transition-transform',
                showFiltersPanel ? 'tw:rotate-180' : ''
              ]" 
            />
          </button>
          
          <transition name="slide">
            <div v-if="showFiltersPanel" class="tw:p-4 tw:pt-0">
              <EventsFilters
                :liveNow="liveNow"
                :category="category"
                :minPrice="minPrice"
                :maxPrice="maxPrice"
                :fromDate="fromDate"
                :toDate="toDate"
                :radius="radius"
                :useGeoFilter="useGeoFilter"
                @update:liveNow="setLiveNow"
                @update:category="setCategory"
                @update:minPrice="(v) => setPriceRange(v, maxPrice)"
                @update:maxPrice="(v) => setPriceRange(minPrice, v)"
                @update:fromDate="(v) => setDateRange(v, toDate)"
                @update:toDate="(v) => setDateRange(fromDate, v)"
                @update:radius="setRadius"
                @update:useGeoFilter="toggleGeoFilter"
                @reset="resetFilters"
              />
            </div>
          </transition>
        </div>

        <!-- Events List -->
        <div class="tw:flex-1 tw:overflow-hidden tw:p-4">
          <EventsList
            :events="events"
            :loading="loading"
            :error="error"
            :totalEvents="totalEvents"
            :hasMore="hasMore"
            :selectedEventId="selectedEventId"
            :isGeoSorted="isGeoSorted"
            @select="handleEventSelect"
            @view="handleEventView"
            @loadMore="loadMore"
            @retry="refresh"
          />
        </div>
      </aside>

      <!-- Map -->
      <main class="tw:flex-1 tw:relative">
        <EventsMap
          ref="mapRef"
          :events="eventsWithCoordinates"
          :center="mapCenter"
          :selectedEventId="selectedEventId"
          @mapMove="handleMapMove"
          @selectEvent="handleEventSelect"
        />

        <!-- Map overlay info -->
        <div class="tw:absolute tw:top-4 tw:left-4 tw:right-4 tw:flex tw:justify-between tw:pointer-events-none">
          <!-- Location info -->
          <div class="tw:bg-white tw:rounded-lg tw:shadow-lg tw:px-3 tw:py-2 tw:text-sm tw:pointer-events-auto">
            <div class="tw:flex tw:items-center tw:gap-2">
              <MapPinIcon class="tw:w-4 tw:h-4 tw:text-[var(--primary-color)]" />
              <span class="tw:text-gray-700">
                {{ mapCenter.lat.toFixed(4) }}, {{ mapCenter.lng.toFixed(4) }}
              </span>
            </div>
          </div>

          <!-- Results count -->
          <div class="tw:bg-white tw:rounded-lg tw:shadow-lg tw:px-3 tw:py-2 tw:text-sm tw:pointer-events-auto">
            <span class="tw:font-medium tw:text-[var(--primary-color)]">{{ eventsWithCoordinates.length }}</span>
            <span class="tw:text-gray-600"> markers on map</span>
          </div>
        </div>

        <!-- Center on user location button -->
        <button
          @click="centerOnUserLocation"
          class="tw:absolute tw:bottom-6 tw:right-6 tw:w-12 tw:h-12 tw:bg-white tw:rounded-full tw:shadow-lg tw:flex tw:items-center tw:justify-center tw:hover:bg-gray-50 tw:transition-colors"
          title="Center on my location"
        >
          <CrosshairIcon class="tw:w-5 tw:h-5 tw:text-[var(--primary-color)]" />
        </button>
      </main>
    </div>

    <!-- Mobile overlay backdrop -->
    <div 
      v-if="showMobileFilters"
      @click="showMobileFilters = false"
      class="tw:lg:hidden tw:fixed tw:inset-0 tw:bg-black/30 tw:z-10"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { 
  FilterIcon, 
  SlidersHorizontalIcon, 
  ChevronDownIcon, 
  MapPinIcon,
  CrosshairIcon,
  XIcon
} from 'lucide-vue-next'
import EventsFilters from '../components/events/EventsFilters.vue'
import EventsList from '../components/events/EventsList.vue'
import EventsMap from '../components/events/EventsMap.vue'
import { useEvents, useLiveNowRefresh } from '../composables/useEvents'
import type { MapCenter } from '../types/events'

// Get route to access query parameters
const route = useRoute()

// Use events composable
const {
  events,
  loading,
  error,
  selectedEventId,
  search,
  mapCenter,
  radius,
  category,
  minPrice,
  maxPrice,
  fromDate,
  toDate,
  liveNow,
  useGeoFilter,
  hasMore,
  totalEvents,
  eventsWithCoordinates,
  isGeoSorted,
  load,
  loadMore,
  refresh,
  setSearch,
  setMapCenter,
  setRadius,
  setCategory,
  setPriceRange,
  setDateRange,
  setLiveNow,
  toggleGeoFilter,
  selectEvent,
  resetFilters,
  useUserLocation
} = useEvents()

// UI state
const showMobileFilters = ref(false)
const showFiltersPanel = ref(true)
const mapRef = ref<InstanceType<typeof EventsMap> | null>(null)

// Expose mapRef for potential external use
defineExpose({ mapRef })

// Computed
const activeFiltersCount = computed(() => {
  let count = 0
  if (search.value) count++
  if (liveNow.value) count++
  if (category.value) count++
  if (minPrice.value != null) count++
  if (maxPrice.value != null) count++
  if (fromDate.value) count++
  if (toDate.value) count++
  return count
})

// Computed for sidebar width
const sidebarWidth = computed(() => {
  if (route.query.view === 'list') {
    return 'tw:w-full tw:sm:w-[500px] tw:lg:w-[600px]' // Wider when in list view
  }
  return 'tw:w-full tw:sm:w-96 tw:lg:w-[420px]' // Default width
})

// Handlers
const handleMapMove = (center: MapCenter) => {
  setMapCenter(center.lat, center.lng)
}

const handleEventSelect = (id: number) => {
  selectEvent(id)
  showMobileFilters.value = false
}

const handleEventView = (id: number) => {
  selectEvent(id)
  // Could navigate to event detail page here
  console.log('View event:', id)
}

const centerOnUserLocation = async () => {
  const success = await useUserLocation()
  if (success) {
    refresh()
  }
}

// Live now refresh
const { start: startLiveRefresh, stop: stopLiveRefresh } = useLiveNowRefresh(() => {
  // Re-render happens automatically due to tick ref change
  // We could also refresh data here if needed
})

// Watch for search query changes
watch(() => route.query.search, (newSearch) => {
  setSearch(newSearch as string || null)
}, { immediate: true })

// Watch for view query changes
watch(() => route.query.view, (newView) => {
  if (newView === 'list') {
    // Show mobile filters when view=list
    showMobileFilters.value = true
    // Expand filters panel on desktop
    showFiltersPanel.value = true
  }
}, { immediate: true })

// Initialize
onMounted(async () => {
  // Try to get user location, fallback to default (Amsterdam)
  await useUserLocation()
  
  // Load initial events
  await load()
  
  // Start live now refresh timer
  startLiveRefresh()
})

onUnmounted(() => {
  stopLiveRefresh()
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 600px;
  opacity: 1;
}
</style>
