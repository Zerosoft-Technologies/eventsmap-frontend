import { getApiUrl } from './config'
import type { 
  Event, 
  EventsResponse, 
  EventResponse, 
  EventFilters 
} from '../types/events'

/**
 * API Error class for handling non-200 responses
 */
export class ApiError extends Error {
  public status: number;
  public response?: unknown;

  constructor(
    message: string,
    status: number,
    response?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status;
    this.response = response;
  }
}

/**
 * Build query string from filters
 * Only includes params that are set and valid
 */
export function buildQueryParams(filters: EventFilters): URLSearchParams {
  const params = new URLSearchParams()

  // Search param
  if (filters.search && filters.search.trim()) {
    params.set('search', filters.search.trim())
  }

  // Geo params
  if (filters.lat != null && !isNaN(filters.lat)) {
    params.set('lat', filters.lat.toString())
  }
  if (filters.lng != null && !isNaN(filters.lng)) {
    params.set('lng', filters.lng.toString())
  }
  if (filters.radius != null && !isNaN(filters.radius) && filters.radius > 0) {
    params.set('radius', filters.radius.toString())
  }

  // Date params
  if (filters.from_date) {
    params.set('from_date', filters.from_date)
  }
  if (filters.to_date) {
    params.set('to_date', filters.to_date)
  }

  // Price params
  if (filters.min_price != null && !isNaN(filters.min_price)) {
    params.set('min_price', filters.min_price.toString())
  }
  if (filters.max_price != null && !isNaN(filters.max_price)) {
    params.set('max_price', filters.max_price.toString())
  }

  // Category
  if (filters.category) {
    params.set('category', filters.category)
  }

  // Subcategory
  if (filters.subcategory) {
    params.set('subcategory', filters.subcategory)
  }

  if (filters.sessions) {
    params.set('sessions', filters.sessions)
  }

  if(filters.morning) {
    params.set('morning', 'true')
  } 

  if(filters.afternoon) {
    params.set('afternoon', 'true')
  }

  if(filters.evening) {
    params.set('evening', 'true')
  }

  if(filters.night) {
    params.set('night', 'true')
  }

  // Live now - pass as "true" string when enabled
  if (filters.live_now === true) {
    params.set('live_now', 'true')
  }

  // Pagination
  if (filters.page != null && filters.page > 0) {
    params.set('page', filters.page.toString())
  }
  if (filters.per_page != null && filters.per_page > 0) {
    params.set('per_page', filters.per_page.toString())
  }

  return params
}

/**
 * Fetch events with filters and pagination
 * 
 * @example
 * // Get events near Amsterdam with radius
 * const result = await fetchEvents({ lat: 52.37, lng: 4.89, radius: 10 })
 * 
 * @example
 * // Get live events
 * const result = await fetchEvents({ live_now: true })
 * 
 * @example
 * // Get music events with price range
 * const result = await fetchEvents({ category: 'music', min_price: 20, max_price: 50 })
 */
export async function fetchEvents(
  filters: EventFilters = {}
): Promise<{ data: Event[]; meta: EventsResponse['meta'] }> {
  const params = buildQueryParams(filters)
  const queryString = params.toString()
  const url = getApiUrl('/events') + (queryString ? `?${queryString}` : '')

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        `Failed to fetch events: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    const result: EventsResponse = await response.json()
    
    if (!result.success) {
      throw new ApiError('API returned success: false', 400, result)
    }

    return {
      data: result.data,
      meta: result.meta
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}

/**
 * Fetch a single event by ID
 * 
 * @example
 * const event = await fetchEventById(123)
 */
export async function fetchEventById(id: number): Promise<Event> {
  const url = getApiUrl(`/events/${id}`)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        `Failed to fetch event: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    const result: EventResponse = await response.json()
    
    if (!result.success) {
      throw new ApiError('API returned success: false', 400, result)
    }

    return result.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}
