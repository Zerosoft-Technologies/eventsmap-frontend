import { ref, computed, watch, type Ref } from 'vue'
import { fetchPublicEvents, fetchEvents, fetchEventById } from '../api/events'
import type { 
  Event, 
  EventFilters, 
  PaginationMeta, 
  MapCenter,
  EventCategory,
  MapBounds
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
  const mapBounds = ref<MapBounds | null>(null)
  const mapZoom = ref<number | null>(null)
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

    // Map viewport filters (preferred for map-based fetching when available)
    if (mapBounds.value) {
      filters.min_lat = mapBounds.value.minLat
      filters.max_lat = mapBounds.value.maxLat
      filters.min_lng = mapBounds.value.minLng
      filters.max_lng = mapBounds.value.maxLng
    }
    if (mapZoom.value != null) {
      filters.zoom = mapZoom.value
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

  // Simple in-memory cache for map viewport queries
  type CacheEntry = { events: Event[]; meta: PaginationMeta; ts: number }
  const cache = new Map<string, CacheEntry>()
  const CACHE_TTL_MS = 2 * 60 * 1000

  const roundForKey = (n: number, decimals: number) => {
    const p = Math.pow(10, decimals)
    return Math.round(n * p) / p
  }

  const makeCacheKey = (filters: EventFilters) => {
    // Reduce key explosion by rounding bbox; precision based on zoom
    const zoom = filters.zoom ?? 0
    const decimals = zoom >= 14 ? 4 : zoom >= 11 ? 3 : zoom >= 8 ? 2 : 1

    const bboxKey = (filters.min_lat != null && filters.max_lat != null && filters.min_lng != null && filters.max_lng != null)
      ? [
          roundForKey(filters.min_lat, decimals),
          roundForKey(filters.max_lat, decimals),
          roundForKey(filters.min_lng, decimals),
          roundForKey(filters.max_lng, decimals)
        ].join(',')
      : 'no-bbox'

    const dateKey = `${filters.from_date ?? ''}:${filters.to_date ?? ''}`
    const catKey = `${filters.category ?? ''}:${filters.live_now ? 'live' : ''}`
    return `publicEvents|z=${Math.round(zoom)}|bbox=${bboxKey}|date=${dateKey}|cat=${catKey}|page=${filters.page ?? 1}|pp=${filters.per_page ?? DEFAULT_PER_PAGE}`
  }

  const mergeById = (base: Event[], incoming: Event[]) => {
    const map = new Map<number, Event>()
    for (const e of base) map.set(e.id, e)
    for (const e of incoming) map.set(e.id, e)
    return Array.from(map.values())
  }

  // Fetch events
  const load = async (append = false) => {
    loading.value = true
    error.value = null

    try {
      const filters = buildFilters()

      // If we have a bbox, prefer the public endpoint (map-ready) + cache.
      const shouldUsePublic = !!filters.min_lat && !!filters.max_lat && !!filters.min_lng && !!filters.max_lng
      if (shouldUsePublic) {
        const key = makeCacheKey(filters)
        const cached = cache.get(key)
        const now = Date.now()
        if (cached && now - cached.ts < CACHE_TTL_MS) {
          events.value = append ? mergeById(events.value, cached.events) : cached.events
          meta.value = cached.meta
          return
        }

        const result = await fetchPublicEvents(filters)
        const nextEvents = append ? mergeById(events.value, result.data) : result.data
        events.value = nextEvents
        meta.value = result.meta
        cache.set(key, { events: result.data, meta: result.meta, ts: now })
        return
      }

      // Fallback to existing authenticated endpoint (list pages etc.)
      const result = await fetchEvents(filters)
      
      if (append) {
        events.value = mergeById(events.value, result.data)
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

  // Update map viewport (bounds + zoom + center)
  const setMapViewport = (center: MapCenter, bounds: MapBounds, zoom: number) => {
    mapCenter.value = center
    mapBounds.value = bounds
    mapZoom.value = zoom
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
    mapBounds,
    mapZoom,
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
    setMapViewport,
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
