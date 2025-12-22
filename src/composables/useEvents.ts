import { ref, computed, watch, type Ref } from 'vue'
import { fetchEvents, fetchEventById } from '../api/events'
import type { 
  Event, 
  EventFilters, 
  PaginationMeta, 
  MapCenter,
  EventCategory 
} from '../types/events'
import { DEFAULT_MAP_CENTER, DEFAULT_RADIUS_KM, DEFAULT_PER_PAGE } from '../types/events'

/**
 * Debounce utility
 */
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Main composable for events with filters, pagination, and map integration
 */
export function useEvents() {
  // State
  const events = ref<Event[]>([])
  const meta = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedEventId = ref<number | null>(null)

  // Filter state
  const search = ref<string | null>(null)
  const mapCenter = ref<MapCenter>({ ...DEFAULT_MAP_CENTER })
  const radius = ref<number>(DEFAULT_RADIUS_KM)
  const category = ref<EventCategory>('')
  const minPrice = ref<number | null>(null)
  const maxPrice = ref<number | null>(null)
  const fromDate = ref<string | null>(null)
  const toDate = ref<string | null>(null)
  const liveNow = ref(false)
  const useGeoFilter = ref(true)

  // Pagination
  const currentPage = ref(1)
  const perPage = ref(DEFAULT_PER_PAGE)

  // Computed
  const selectedEvent = computed(() => 
    events.value.find(e => e.id === selectedEventId.value) || null
  )

  const hasMore = computed(() => {
    if (!meta.value) return false
    return meta.value.current_page < meta.value.last_page
  })

  const totalEvents = computed(() => meta.value?.total ?? 0)

  const eventsWithCoordinates = computed(() => 
    events.value.filter(e => e.latitude != null && e.longitude != null)
  )

  const isGeoSorted = computed(() => 
    useGeoFilter.value && mapCenter.value.lat != null && mapCenter.value.lng != null
  )

  // Build filters object
  const buildFilters = (): EventFilters => {
    const filters: EventFilters = {
      page: currentPage.value,
      per_page: perPage.value
    }

    // Search filter
    if (search.value && search.value.trim()) {
      filters.search = search.value.trim()
    }

    // Geo filters - only include if useGeoFilter is enabled
    if (useGeoFilter.value) {
      filters.lat = mapCenter.value.lat
      filters.lng = mapCenter.value.lng
      filters.radius = radius.value
    }

    // Category
    if (category.value) {
      filters.category = category.value
    }

    // Price range
    if (minPrice.value != null) {
      filters.min_price = minPrice.value
    }
    if (maxPrice.value != null) {
      filters.max_price = maxPrice.value
    }

    // Date range
    if (fromDate.value) {
      filters.from_date = fromDate.value
    }
    if (toDate.value) {
      filters.to_date = toDate.value
    }

    // Live now
    if (liveNow.value) {
      filters.live_now = true
    }

    return filters
  }

  // Fetch events
  const load = async (append = false) => {
    loading.value = true
    error.value = null

    try {
      const filters = buildFilters()
      const result = await fetchEvents(filters)
      
      if (append) {
        events.value = [...events.value, ...result.data]
      } else {
        events.value = result.data
      }
      
      meta.value = result.meta
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load events'
      console.error('Failed to fetch events:', e)
    } finally {
      loading.value = false
    }
  }

  // Load more (pagination)
  const loadMore = async () => {
    if (!hasMore.value || loading.value) return
    currentPage.value++
    await load(true)
  }

  // Reset to page 1 and refetch
  const refresh = async () => {
    currentPage.value = 1
    await load(false)
  }

  // Debounced refresh for map moves
  const debouncedRefresh = debounce(() => {
    refresh()
  }, 400)

  // Update map center
  const setMapCenter = (lat: number, lng: number) => {
    mapCenter.value = { lat, lng }
    debouncedRefresh()
  }

  // Update radius
  const setRadius = (newRadius: number) => {
    radius.value = newRadius
    refresh()
  }

  // Update search
  const setSearch = (newSearch: string | null) => {
    search.value = newSearch
    refresh()
  }

  // Update category
  const setCategory = (newCategory: EventCategory) => {
    category.value = newCategory
    refresh()
  }

  // Update price range
  const setPriceRange = (min: number | null, max: number | null) => {
    minPrice.value = min
    maxPrice.value = max
    refresh()
  }

  // Update date range
  const setDateRange = (from: string | null, to: string | null) => {
    fromDate.value = from
    toDate.value = to
    refresh()
  }

  // Toggle live now
  const toggleLiveNow = () => {
    liveNow.value = !liveNow.value
    refresh()
  }

  // Set live now directly
  const setLiveNow = (value: boolean) => {
    liveNow.value = value
    refresh()
  }

  // Toggle geo filter
  const toggleGeoFilter = () => {
    useGeoFilter.value = !useGeoFilter.value
    refresh()
  }

  // Select an event
  const selectEvent = (id: number | null) => {
    selectedEventId.value = id
  }

  // Reset all filters
  const resetFilters = () => {
    search.value = null
    category.value = ''
    minPrice.value = null
    maxPrice.value = null
    fromDate.value = null
    toDate.value = null
    liveNow.value = false
    radius.value = DEFAULT_RADIUS_KM
    refresh()
  }

  // Get user location and set map center
  const useUserLocation = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          mapCenter.value = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          resolve(true)
        },
        () => {
          // Keep default center on error
          resolve(false)
        },
        { enableHighAccuracy: true, timeout: 5000 }
      )
    })
  }

  return {
    // State
    events,
    meta,
    loading,
    error,
    selectedEventId,
    selectedEvent,
    
    // Filter state
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
    
    // Pagination
    currentPage,
    perPage,
    hasMore,
    totalEvents,
    
    // Computed
    eventsWithCoordinates,
    isGeoSorted,
    
    // Actions
    load,
    loadMore,
    refresh,
    setSearch,
    setMapCenter,
    setRadius,
    setCategory,
    setPriceRange,
    setDateRange,
    toggleLiveNow,
    setLiveNow,
    toggleGeoFilter,
    selectEvent,
    resetFilters,
    useUserLocation
  }
}

/**
 * Composable for fetching a single event by ID
 */
export function useEventDetail(eventId: Ref<number | null>) {
  const event = ref<Event | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const load = async () => {
    if (eventId.value == null) {
      event.value = null
      return
    }

    loading.value = true
    error.value = null

    try {
      event.value = await fetchEventById(eventId.value)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load event'
      console.error('Failed to fetch event:', e)
    } finally {
      loading.value = false
    }
  }

  // Auto-fetch when ID changes
  watch(eventId, () => {
    load()
  }, { immediate: true })

  return {
    event,
    loading,
    error,
    reload: load
  }
}

/**
 * Composable for live now badge refresh
 * Re-renders every 60 seconds to update UI (backend is authoritative)
 */
export function useLiveNowRefresh(onRefresh: () => void) {
  const tick = ref(0)
  let intervalId: ReturnType<typeof setInterval> | null = null

  const start = () => {
    if (intervalId) return
    intervalId = setInterval(() => {
      tick.value++
      onRefresh()
    }, 60000) // 60 seconds
  }

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  return {
    tick,
    start,
    stop
  }
}
