import api from '@/services/api'
import type { AxiosResponse } from 'axios'

// ── Types ──────────────────────────────────────────────────────────────────
export interface CreateEventPayload {
  title: string
  category_id: number | null
  subcategory_ids: number[]
  event_date: string
  start_time: string
  end_time: string
  address: string
  latitude: number | null
  longitude: number | null
  dress_code: string
  age_limit: string
  entrance_fee: string
}

export interface EventResponse {
  success: boolean
  message?: string
  data?: {
    id: number
    slug: string
    title: string
    [key: string]: unknown
  }
  errors?: Record<string, string[]>
}

export interface Category {
  id: number
  name: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: number
  name: string
}

export interface CategoriesResponse {
  success: boolean
  data: Category[]
  message?: string
}

export interface MyEvent {
  id: number
  title: string
  event_date: string
  start_time: string
  status: string
  image_url: string
}

export interface MyEventsResponse {
  success: boolean
  message?: string
  data: MyEvent[]
}

export interface EventDetailData {
  id: number
  title: string
  event_type: string
  category_id: number
  subcategory_ids: number[]
  event_date: string
  start_time: string
  end_time: string
  address: string
  description: string
  image_url?: string
  [key: string]: unknown
}

export interface EventDetailResponse {
  success: boolean
  message?: string
  data: EventDetailData
}

export interface UpdateEventPayload {
  title: string
  event_type: string
  category_id: number
  subcategory_ids: number[]
  event_date: string
  start_time: string
  end_time: string
  address: string
  description: string
}

export interface WishlistToggleResponse {
  success: boolean
  message?: string
  data: {
    is_wishlisted: boolean
  }
}

export interface WishlistListResponse {
  success: boolean
  message?: string
  data: unknown[]
}

// ── Event Service ──────────────────────────────────────────────────────────
const eventService = {
  /**
   * Create a new event
   * Uses API v2 endpoint
   */
  async createEvent(formData: FormData): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await api.post(
      '/v2/events',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  },

  /**
   * Get event by slug
   */
  async getEventBySlug(slug: string): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await api.get(`/v2/events/${slug}`)
    return response.data
  },

  /**
   * Fetch all categories with subcategories
   */
  async getCategories(): Promise<CategoriesResponse> {
    const response: AxiosResponse<CategoriesResponse> = await api.get('/v1/categories')
    return response.data
  },

  /**
   * Update an existing event
   */
  async updateEvent(slug: string, formData: FormData): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await api.post(
      `/v2/events/${slug}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  },

  /**
   * Delete an event
   */
  async deleteEvent(slug: string): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await api.delete(`/v2/events/${slug}`)
    return response.data
  },

  /**
   * Fetch a single event by id (for loading into form)
   */
  async getEventById(id: number): Promise<EventDetailResponse> {
    const response: AxiosResponse<EventDetailResponse> = await api.get(`/v2/events/${id}`)
    return response.data
  },

  /**
   * Update an existing event by id (PUT)
   */
  async updateEventById(id: number, payload: UpdateEventPayload): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await api.put(`/v2/events/${id}`, payload)
    return response.data
  },

  /**
   * Fetch authenticated user's events
   */
  async getMyEvents(): Promise<MyEventsResponse> {
    const response: AxiosResponse<MyEventsResponse> = await api.get('/v2/my-events')
    return response.data
  },

  /**
   * Fetch authenticated user's wishlist events
   */
  async getWishlistEvents(): Promise<WishlistListResponse> {
    const response: AxiosResponse<WishlistListResponse> = await api.get('/v2/my-wishlist')
    return response.data
  },

  /**
   * Toggle wishlist status for an event
   */
  async toggleWishlist(eventId: number): Promise<WishlistToggleResponse> {
    const response: AxiosResponse<WishlistToggleResponse> = await api.post(`/v2/events/${eventId}/wishlist`)
    return response.data
  }
}

export default eventService
