/**
 * Event category type
 */
export type EventCategory = string

/**
 * Category object from API
 */
export interface EventCategoryObject {
  id: number
  name: string
  slug?: string
}

/**
 * Subcategory object from API
 */
export interface EventSubcategory {
  id: number
  name: string
  slug?: string
}

/**
 * Contact info for organizer
 */
export interface ContactInfo {
  email?: string
  phone?: string
  website?: string
  /** Profile “contact box design” / instructions (API may nest under contact_info) */
  design_message?: string
  /** Event form contact instructions (contact_box_message) */
  box_message?: string
}

/**
 * Talent/Performer social links
 */
export interface TalentSocialLinks {
  spotify?: string
  instagram?: string
  website?: string | null
}

/**
 * Talent/Performer entity
 */
export interface Talent {
  id: number
  name: string
  image: string
  role?: string
  bio?: string
  social_links?: TalentSocialLinks
  sort_order?: number
}

/**
 * Accessibility options for About tab
 */
export interface EventAccessibility {
  wheelchair_accessible?: boolean
  wheelchair_entrance?: boolean
  wheelchair_parking?: boolean
  accessible_toilets?: boolean
  elevator_access?: boolean
}

/**
 * Planning options for About tab
 */
export interface EventPlanning {
  advance_booking_recommended?: boolean
  ticket_required?: boolean
  door_sales_available?: boolean
}

/**
 * Services options for About tab
 */
export interface EventServices {
  coat_check?: boolean
  wifi?: boolean
  parking?: boolean
  valet_parking?: boolean
  smoking_area?: boolean
  lockers?: boolean
}

/**
 * Amenities options for About tab
 */
export interface EventAmenities {
  restaurant?: boolean
  bar?: boolean
  terrace?: boolean
  vip_area?: boolean
  seating_area?: boolean
  dance_floor?: boolean
  food_court?: boolean
  merchandise?: boolean
  vip_lounge?: boolean
}

/**
 * Children options for About tab
 */
export interface EventChildren {
  suitable_for_children?: boolean
  baby_changing_table?: boolean
  kids_area?: boolean
  minimum_age?: number
}

/**
 * About section data
 */
export interface EventAbout {
  accessibility?: EventAccessibility
  planning?: EventPlanning
  services?: EventServices
  amenities?: EventAmenities
  children?: EventChildren
  description?: string
  rules?: string[]
  tips?: string[]
}

/**
 * Public transport info
 */
export interface PublicTransport {
  subway?: string
  bus?: string
  tram?: string[]
  metro?: string[]
  train_station?: string
  train?: string
}

/**
 * Parking info
 */
export interface ParkingInfo {
  available?: boolean
  price?: string
  lots?: string[]
  street_parking?: boolean
  parking_garage?: boolean
  parking_cost?: string
}

/**
 * Location details for Date & Location tab
 */
export interface EventLocationDetails {
  venue_name?: string
  address?: string
  city?: string
  country?: string
  latitude?: number
  longitude?: number
  full_address?: string
  directions?: string
  public_transport?: PublicTransport
  parking_info?: ParkingInfo
  map_url?: string
  venue_website?: string
}

/**
 * Booking information
 */
export interface EventBooking {
  required?: boolean
  ticket_url?: string
  phone_booking?: boolean
  capacity?: number
  booked_count?: number
  waiting_list_available?: boolean
  ticket_types?: Record<string, number>
}

/**
 * Social links for event
 */
export interface EventSocialLinks {
  website?: string
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
  spotify?: string
}

/**
 * Event image entity
 */
export interface EventImage {
  id: number
  url: string
  alt_text?: string
  caption?: string | null
  is_primary?: boolean
  sort_order?: number
}

/**
 * API v2 embedded profiles on event responses (invited_talents_objects, etc.)
 */
/** Nested talent/organiser v2 profile from event invited objects */
export interface InvitedProfileV2 {
  id?: number
  title?: string
  slug?: string
  profile_image?: string | null
  cover_image?: string | null
  image_path?: string | null
  city?: string | null
  address?: string | null
  description?: string | null
  category?: { id: number; name: string; slug?: string } | null
  subcategories?: Array<{ id: number; name: string; slug?: string }>
  talent_category?: { id: number; name: string; slug?: string } | null
  talent_subcategories?: Array<{ id: number; name: string; slug?: string }>
  organiser_category?: { id: number; name: string; slug?: string } | null
  [key: string]: unknown
}

/** Nested venue v2 profile from event invited_venues_objects */
export interface InvitedVenueV2 extends InvitedProfileV2 {
  opening_hours?: Array<{
    day: string
    is_open: boolean
    open: string | null
    close: string | null
  }>
  capacity?: number | null
  wheelchair_accessible?: boolean | null
  allow_dogs?: boolean | null
}

export interface InvitedEventProfile {
  id?: number
  name?: string
  email?: string
  role?: string
  is_active?: boolean
  profile_image?: string | null
  profile_image_url?: string | null
  profile_image_path?: string | null
  avatar_url?: string | null
  image_url?: string | null
  image?: string | null
  contact_box_design_message?: string | null
  /** Rich v2 profile nested by API (talent) */
  talent_v2?: InvitedProfileV2 | null
  /** Rich v2 profile nested by API (organiser) */
  organiser_v2?: InvitedProfileV2 | null
}

export interface InvitedVenueObject {
  id?: number
  name?: string
  address?: string
  slug?: string
  user_id?: number | null
  contact_box_design_message?: string | null
  description?: string | null
  /** Rich v2 profile nested by API */
  venue_v2?: InvitedVenueV2 | null
}

/** Gallery item from API (event additional_images) */
export interface EventAdditionalImage {
  id?: number | string | null
  url?: string | null
  caption?: string | null
}

/**
 * Event entity from the API
 */
export interface Event {
  location_name: string | undefined
  id: number
  title: string
  description: string | null
  slug?: string
  category: EventCategoryObject | string
  category_id?: number
  subcategory?: EventSubcategory
  subcategories?: EventSubcategory[]
  subcategory_id?: number
  price: string | null
  min_price?: number | string | null
  max_price?: number | string | null
  currency?: string
  dresscode: string | null
  min_age: number | null
  max_age?: number | null
  age_limit?: string
  start_datetime: string
  end_datetime: string
  event_date?: string
  start_time?: string
  end_time?: string
  is_overnight?: boolean
  timezone?: string
  venue_name?: string
  city: string
  country?: string
  address: string | null
  organizer_name?: string
  organizer_id?: number | null
  /** Host profile photo when API provides it (or inferred for current user in UI) */
  organizer_profile_image_url?: string | null
  user_id?: number | null
  /** Backend may send these at the root; UI merges them into contact display */
  contact_phone?: string
  contact_email?: string
  contact_website?: string
  /** Event listing: host instructions (Create Event premium: contact_box_message) */
  contact_box_message?: string | null
  /** Denormalised or host “contact box design” copy from organiser/venue/talent profiles */
  contact_box_design_message?: string | null
  contact_info?: ContactInfo
  images?: string[]
  event_images?: EventImage[]
  cover_image?: string
  /** Resolved image URLs for gallery (objects or plain strings from API) */
  additional_images?: Array<EventAdditionalImage | string>
  video_url?: string
  talents?: Talent[]
  about?: EventAbout
  location_details?: EventLocationDetails
  booking?: EventBooking
  social_links?: EventSocialLinks
  /** API v2: keyed social profile URLs (e.g. facebook, instagram, tiktok) */
  social_media_urls?: Record<string, string>
  is_published: boolean
  is_live_now: boolean
  is_featured?: boolean
  is_cancelled?: boolean
  is_postponed?: boolean
  cancellation_reason?: string
  meta_title?: string
  meta_description?: string
  tags?: string[]
  view_count?: number
  like_count?: number
  created_at: string
  updated_at: string
  published_at?: string

  // Time of day flags
  morning?: boolean
  afternoon?: boolean
  evening?: boolean
  night?: boolean

  // Added by query scope withCoordinates()
  latitude: number | null
  longitude: number | null

  // Only present if geo filter is used
  distance_meters?: number | string
  distance_km?: number
  formatted_date: string
  formatted_price?: string
  formatted_dresscode?: string
  
  // API v2 additional fields
  status?: string
  computed_status?: string
  is_approved?: boolean
  entrance_status?: string
  /** API: `free` | `premium` (controls Contact tab visibility, etc.) */
  event_type?: string
  /** Premium create form / API: host booking copy */
  booking_instructions?: string | null
  venue?: unknown
  organisers?: Array<unknown>
  is_free_package?: boolean

  /** API v2: ID lists for invites */
  invited_talents?: Array<string | number>
  invited_organisers?: Array<string | number>
  invited_venues?: Array<string | number>
  invited_talents_objects?: InvitedEventProfile[]
  invited_organisers_objects?: InvitedEventProfile[]
  invited_venues_objects?: InvitedVenueObject[]
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
 * API response for GET /events/{id}/talents
 */
export interface EventTalentsResponse {
  success: boolean
  data: Talent[]
}

/**
 * API response for GET /events/{id}/about
 */
export interface EventAboutResponse {
  success: boolean
  data: EventAbout
}

/**
 * API response for GET /events/{id}/location
 */
export interface EventLocationResponse {
  success: boolean
  data: EventLocationDetails
}

/**
 * API response for GET /events/{id}/images
 */
export interface EventImagesResponse {
  success: boolean
  data: EventImage[]
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

  // Map viewport filters (bounding box)
  min_lat?: number | null
  max_lat?: number | null
  min_lng?: number | null
  max_lng?: number | null
  zoom?: number | null

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

  /**
   * When filtering events, indicates which taxonomy `category` / `subcategory` slugs belong to.
   * Backend may use this to match invited talent/organiser/venue categories. Omit or `event` = default.
   */
  category_scope?: 'event' | 'talent' | 'organiser' | 'venue' | null

  /** Event start-time window (HH:MM or HH:MM:SS), e.g. filter sessions starting after this time */
  start_time?: string | null
  /** Event end-time window (HH:MM or HH:MM:SS) */
  end_time?: string | null

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
 * Map viewport bounds (south-west / north-east)
 */
export interface MapBounds {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
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
