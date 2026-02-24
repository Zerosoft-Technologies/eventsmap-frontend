import { getApiUrl } from './config'
import api from '@/services/api'
import type { 
  Event, 
  EventResponse, 
  EventFilters,
  Talent,
  EventTalentsResponse,
  EventAbout,
  EventAboutResponse,
  EventLocationDetails,
  EventLocationResponse,
  EventImage,
  EventImagesResponse,
  PaginationMeta
} from '../types/events'
import { extractEventsFromV2Response } from '../adapters/eventAdapter'
import type { EventsV2Response } from '../adapters/eventAdapter'

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
 * Uses API v2 endpoint with adapter for field mapping
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
): Promise<{ data: Event[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters)
  const queryString = params.toString()
  // Use v2 API endpoint with relative path (Axios will add base URL)
  const endpoint = `/v2/events${queryString ? `?${queryString}` : ''}`

  try {
    // Use Axios instance which includes authentication headers
    const response = await api.get<EventsV2Response>(endpoint)

    // Axios already handles 401 errors globally via interceptor
    // Just check for success flag
    if (response.data.success === false) {
      throw new ApiError(response.data.message || 'API returned success: false', 400, response.data)
    }

    // Use adapter to extract and transform events from v2 response
    // v2 response structure: { success, data: { data: [...], current_page, ... } }
    const { events, meta } = extractEventsFromV2Response(response.data)

    return {
      data: events,
      meta
    }
  } catch (error) {
    // Axios interceptor already handles 401 globally
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

/**
 * Fetch talents for a specific event
 * 
 * @example
 * const talents = await fetchEventTalents(123)
 */
export async function fetchEventTalents(id: number): Promise<Talent[]> {
  const url = getApiUrl(`/events/${id}/talents`)

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
        `Failed to fetch event talents: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    const result: EventTalentsResponse = await response.json()
    
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

/**
 * Fetch about information for a specific event
 * 
 * @example
 * const about = await fetchEventAbout(123)
 */
export async function fetchEventAbout(id: number): Promise<EventAbout> {
  const url = getApiUrl(`/events/${id}/about`)

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
        `Failed to fetch event about info: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    const result: EventAboutResponse = await response.json()
    
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

/**
 * Fetch location details for a specific event
 * 
 * @example
 * const location = await fetchEventLocation(123)
 */
export async function fetchEventLocation(id: number): Promise<EventLocationDetails> {
  const url = getApiUrl(`/events/${id}/location`)

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
        `Failed to fetch event location: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    const result: EventLocationResponse = await response.json()
    
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

/**
 * Fetch images for a specific event
 * 
 * @example
 * const images = await fetchEventImages(123)
 */
export async function fetchEventImages(id: number): Promise<EventImage[]> {
  const url = getApiUrl(`/events/${id}/images`)

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
        `Failed to fetch event images: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    const result: EventImagesResponse = await response.json()
    
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
