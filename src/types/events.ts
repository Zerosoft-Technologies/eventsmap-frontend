/**
 * Event entity from the API
 */
export interface Event {
  id: number
  title: string
  description: string | null
  category: string
  price: string | null
  dresscode: string | null
  min_age: number | null
  start_datetime: string
  end_datetime: string
  city: string
  address: string | null
  is_published: boolean
  created_at: string
  updated_at: string
  
  // Added by backend model accessor
  is_live_now: boolean
  
  // Added by query scope withCoordinates()
  latitude: number | null
  longitude: number | null
  
  // Only present if geo filter is used
  distance_meters?: number
  distance_km?: number
}

/**
 * Pagination meta from the API
 */
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

/**
 * API response for GET /events
 */
export interface EventsResponse {
  success: boolean
  data: Event[]
  meta: PaginationMeta
}

/**
 * API response for GET /events/{id}
 */
export interface EventResponse {
  success: boolean
  data: Event
}

/**
 * Filters for querying events
 */
export interface EventFilters {
  // Search filter
  search?: string | null
  
  // Geo filters
  lat?: number | null
  lng?: number | null
  radius?: number | null // in km
  
  // Date filters
  from_date?: string | null // YYYY-MM-DD
  to_date?: string | null   // YYYY-MM-DD
  
  // Price filters
  min_price?: number | null
  max_price?: number | null
  
  // Category filter (use slug from categories API)
  category?: string | null
  
  // Subcategory filter (use slug from categories API)
  subcategory?: string | null
  
  // Live now filter
  live_now?: boolean
  
  // Pagination
  page?: number
  per_page?: number

  sessions?: string | null
  morning?: boolean | null
  afternoon?: boolean | null
  evening?: boolean | null
  night?: boolean | null
}

/**
 * Map center coordinates
 */
export interface MapCenter {
  lat: number
  lng: number
}

/**
 * Default map center (Amsterdam)
 */
export const DEFAULT_MAP_CENTER: MapCenter = {
  lat: 52.3676,
  lng: 4.9041
}

/**
 * Default radius in km
 */
export const DEFAULT_RADIUS_KM = 10

/**
 * Default per_page for pagination
 */
export const DEFAULT_PER_PAGE = 20
