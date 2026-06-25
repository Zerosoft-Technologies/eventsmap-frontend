import api from '@/services/api'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

// ── Types ──────────────────────────────────────────────────────────────────
export interface CreateEventPayload {
  title: string
  category_id: number | null
  subcategory_ids: number[]
  event_date: string
  start_time: string
  end_time: string
  address: string
  /** Display name of the venue / location (optional). */
  venue_name?: string
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
  booking_instructions?: string
  category_id: number
  subcategory_ids: number[]
  event_date: string
  start_time: string
  end_time: string
  address: string
  venue_name?: string
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
  venue_name?: string
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

/** JSON body for POST /v2/talents and PUT /v2/talents/{id} — gallery `image_id` UUIDs (same as events_v2) */
export interface TalentV2Payload {
  title: string
  description?: string
  event_type: string
  /** Main image: gallery_images.image_id (UUID) */
  image_path: string
  /** Gallery extras: UUIDs from gallery_images.image_id */
  additional_images: string[]
  category_id: number
  subcategory_ids: number[]
  genre?: string
  location?: string
  address?: string
  latitude?: number | null
  longitude?: number | null
  city?: string
  contact_phone?: string
  contact_email?: string
  contact_website?: string
  contact_box_design_message?: string
  facebook_url?: string
  instagram_url?: string
  tiktok_url?: string
  fan_club_url?: string
  nationality?: string
  nationalities?: string[]
  show_nationality?: string
  /** ISO date YYYY-MM-DD */
  date_of_birth?: string
  age?: string | number
  show_age?: string
  languages?: string[] | string
  highlights?: string
  show_upcoming_events?: string | boolean
  show_past_events?: string | boolean
}

/** JSON body for POST /v2/venues and PUT /v2/venues/{id} — gallery `image_id` UUIDs (same as events_v2) */
/** One row per calendar day when closed, or one row per time period when open (same `day` may repeat). */
export interface VenueOpeningHoursDayPayload {
  day: string
  is_open: boolean
  open: string
  close: string
  /** Optional nested periods when API uses a single object per weekday. */
  slots?: Array<{ open: string; close: string }>
}

export interface VenueV2Payload {
  title: string
  description?: string
  event_type: string
  image_path: string
  additional_images: string[]
  category_id: number
  subcategory_ids: number[]
  location?: string
  address?: string
  latitude?: number | null
  longitude?: number | null
  allowance_of_dogs?: string
  wheelchair_accessible?: boolean
  accessible_parking_close_to_entrance?: boolean
  valet_parking?: boolean
  childrens_play_area?: boolean
  accessibility_description?: string
  description_items?: string[]
  contact_phone?: string
  contact_email?: string
  contact_website?: string
  contact_box_design_message?: string
  opening_hours?: VenueOpeningHoursDayPayload[] | string | string[] | Record<string, string>
  facebook_url?: string
  instagram_url?: string
  tiktok_url?: string
  show_upcoming_events?: string | boolean
  show_past_events?: string | boolean
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
   * Fetch categories for talents
   */
  async getCategoriesTalents(): Promise<CategoriesResponse> {
    const response: AxiosResponse<CategoriesResponse> = await api.get('/v1/categories-talents')
    return response.data
  },

  /**
   * Fetch categories for organisers
   */
  async getCategoriesOrganisers(): Promise<CategoriesResponse> {
    const response: AxiosResponse<CategoriesResponse> = await api.get('/v1/categories-organisers')
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
  async getMyEvents(config?: AxiosRequestConfig): Promise<MyEventsResponse> {
    const response: AxiosResponse<MyEventsResponse> = await api.get('/v2/my-events', config)
    return response.data
  },

  async getMyOrganisers(config?: AxiosRequestConfig): Promise<MyEventsResponse> {
    const response: AxiosResponse<MyEventsResponse> = await api.get('/v2/my-organisers', config)
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
  },

  // ── Organiser CRUD ────────────────────────────────────────────────────

  /**
   * Create a new organiser
   */
  async createOrganiser(formData: FormData): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await api.post(
      '/v2/organisers',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  },

  /**
   * Get organiser by id
   */
  async getOrganiserById(id: number): Promise<EventDetailResponse> {
    const response: AxiosResponse<EventDetailResponse> = await api.get(`/v2/organisers/${id}`)
    return response.data
  },

  /**
   * Update an existing organiser (POST with _method=PUT)
   */
  async updateOrganiser(id: number, formData: FormData): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await api.post(
      `/v2/organisers/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  },

  // ── Talent CRUD (talents_v2) — premium: JSON + gallery UUIDs; free: multipart + file `image_path`) ──

  async createTalent(payload: TalentV2Payload): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await api.post('/v2/talents', payload)
    return response.data
  },

  /** Free talent profile: same pattern as `createEvent` — binary `image_path` in FormData */
  async createTalentFormData(formData: FormData): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await api.post('/v2/talents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async getTalentById(id: number): Promise<EventDetailResponse> {
    const response: AxiosResponse<EventDetailResponse> = await api.get(`/v2/talents/${id}`)
    return response.data
  },

  async updateTalent(id: number, payload: TalentV2Payload): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await api.put(`/v2/talents/${id}`, payload)
    return response.data
  },

  /** Free talent update: POST + `_method=PUT` (Laravel) when uploading a new file */
  async updateTalentFormData(id: number, formData: FormData): Promise<EventResponse> {
    formData.append('_method', 'PUT')
    const response: AxiosResponse<EventResponse> = await api.post(`/v2/talents/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // ── Venue CRUD (venues_v2) — premium: JSON; free: multipart + file `image_path`) ────────────────────

  async createVenue(payload: VenueV2Payload): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await api.post('/v2/venues', payload)
    return response.data
  },

  async createVenueFormData(formData: FormData): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await api.post('/v2/venues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async getVenueById(id: number): Promise<EventDetailResponse> {
    const response: AxiosResponse<EventDetailResponse> = await api.get(`/v2/venues/${id}`)
    return response.data
  },

  async updateVenue(id: number, payload: VenueV2Payload): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await api.put(`/v2/venues/${id}`, payload)
    return response.data
  },

  async updateVenueFormData(id: number, formData: FormData): Promise<EventResponse> {
    formData.append('_method', 'PUT')
    const response: AxiosResponse<EventResponse> = await api.post(`/v2/venues/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}

export default eventService
