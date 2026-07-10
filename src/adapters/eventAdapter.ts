import type {
  ContactInfo,
  Event,
  EventAdditionalImage,
  InvitedEventProfile,
  InvitedVenueObject,
  PaginationMeta,
  Talent
} from '@/types/events'

/**
 * Raw event from API v2 response
 * This interface captures possible field variations from the backend
 */
export interface EventV2Raw {
  id: number
  title: string
  slug?: string
  description?: string | null
  
  // Image fields - backend might return different names
  image?: string
  image_url?: string
  image_path?: string
  cover_image?: string
  images?: string[]
  additional_images?: Array<{ id?: unknown; url?: string; caption?: string | null } | string>
  social_media_urls?: Record<string, unknown>

  // Category - might be object or string
  category?: {
    id: number
    name: string
    slug?: string
  } | string
  category_id?: number
  category_name?: string
  
  // Subcategory
  subcategory?: {
    id: number
    name: string
    slug?: string
  }
  subcategories?: Array<{
    id: number
    name: string
    slug?: string
  }>
  subcategory_id?: number
  
  // Date and time
  event_date?: string
  start_time?: string
  end_time?: string
  start_datetime?: string
  end_datetime?: string
  formatted_date?: string
  is_overnight?: boolean
  
  // Location
  address?: string | null
  venue_name?: string
  location_name?: string
  city?: string
  country?: string
  latitude?: number | string | null
  longitude?: number | string | null
  lat?: number | string | null
  lng?: number | string | null
  
  // Price
  price?: string | null
  min_price?: number | string | null
  max_price?: number | string | null
  entrance_fee?: string
  entrance_status?: string
  formatted_price?: string
  currency?: string
  
  // Additional fields
  dresscode?: string | null
  dress_code?: string | null
  formatted_dresscode?: string
  min_age?: number | null
  max_age?: number | null
  age_limit?: string
  
  // Organizer
  organizer_name?: string
  organizer_id?: number | null
  organisers?: unknown[]  // Will be cast to Talent[] if needed
  
  // Status flags
  is_published?: boolean
  is_live_now?: boolean
  is_featured?: boolean
  is_cancelled?: boolean
  is_postponed?: boolean
  status?: string
  computed_status?: string
  is_approved?: boolean

  // Recurring series occurrence linkage
  series_id?: number | null
  is_modified?: boolean
  is_series_instance?: boolean
  
  // Time of day
  morning?: boolean
  afternoon?: boolean
  evening?: boolean
  night?: boolean
  
  // Additional API v2 fields
  venue?: unknown
  talents?: unknown[]  // Will be cast to Talent[] if needed
  is_free_package?: boolean
  view_count?: number
  like_count?: number
  
  // Distance (when geo filter applied)
  distance_meters?: number | string
  distance_km?: number
  
  // Timestamps
  created_at?: string
  updated_at?: string
  published_at?: string
  
  // Any other fields
  [key: string]: unknown
}

/**
 * API v2 response structure
 */
export interface EventsV2Response {
  success: boolean
  message?: string
  data: {
    events: EventV2Raw[]  // API returns "events" not "data"
    pagination: {
      current_page: number
      last_page: number
      per_page: number
      total: number
      from?: number
      to?: number
    }
  }
}

function pickSocialMediaUrls(raw: unknown): Record<string, string> | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === 'string' && v.trim()) out[k] = v.trim()
  }
  return Object.keys(out).length ? out : undefined
}

function pickStr(...vals: unknown[]): string | undefined {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return undefined
}

function pickBool(...vals: unknown[]): boolean {
  for (const v of vals) {
    if (v === true || v === 1 || v === '1' || v === 'true') return true
    if (v === false || v === 0 || v === '0' || v === 'false') return false
  }
  return false
}

function pickOrganizerProfileImageUrl(ev: EventV2Raw): string | undefined {
  const e = ev as Record<string, unknown>
  const top = pickStr(
    e.organizer_profile_image_url,
    e.organizer_image_url,
    e.organizer_avatar_url,
    e.host_image_url,
  )
  if (top) return top
  const org = e.organizer
  if (!org || typeof org !== 'object' || Array.isArray(org)) return undefined
  const o = org as Record<string, unknown>
  return pickStr(o.profile_image_url, o.avatar_url, o.image_url, o.profile_photo_url)
}

function pickUserId(ev: EventV2Raw): number | null | undefined {
  const e = ev as Record<string, unknown>
  const v = e.user_id ?? e.created_by ?? e.owner_id
  if (v == null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

function pickContactInfo(raw: unknown): ContactInfo | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined
  const o = raw as Record<string, unknown>
  const phone = pickStr(o.phone, o.telephone, o.contact_phone)
  const email = pickStr(o.email, o.contact_email)
  const website = pickStr(o.website, o.contact_website, o.event_website, o.url)
  const out: ContactInfo = {}
  if (phone) out.phone = phone
  if (email) out.email = email
  if (website) out.website = website
  return Object.keys(out).length ? out : undefined
}

function buildContactInfoFromEvent(event: EventV2Raw): ContactInfo | undefined {
  const nestedRaw = event.contact_info
  const nested = pickContactInfo(nestedRaw)
  const nestedRec =
    nestedRaw && typeof nestedRaw === 'object' && !Array.isArray(nestedRaw)
      ? (nestedRaw as Record<string, unknown>)
      : undefined
  const e = event as Record<string, unknown>
  // Root-level contact_* from API takes precedence; nested contact_info fills gaps
  const phone = pickStr(e.contact_phone, nested?.phone, e.phone, e.telephone)
  const email = pickStr(e.contact_email, nested?.email, e.email)
  const website = pickStr(
    e.contact_website,
    nested?.website,
    e.website,
    e.event_website,
    e.external_url
  )
  const designMessage = pickStr(
    e.contact_box_design_message,
    nestedRec?.contact_box_design_message,
    nestedRec?.design_message,
  )
  const boxMessage = pickStr(e.contact_box_message, nestedRec?.contact_box_message)

  const out: ContactInfo = {}
  if (phone) out.phone = phone
  if (email) out.email = email
  if (website) out.website = website
  if (designMessage) out.design_message = designMessage
  if (boxMessage) out.box_message = boxMessage
  return Object.keys(out).length ? out : undefined
}

/**
 * Map a single event from API v2 format to UI format
 * Handles field name variations and ensures proper types
 */
export function mapEventV2ToUI(event: EventV2Raw): Event {
  // Extract category name from various formats
  const getCategoryName = (): string => {
    if (event.category_name) return event.category_name
    if (typeof event.category === 'string') return event.category
    if (event.category && typeof event.category === 'object') {
      return event.category.name || ''
    }
    return ''
  }

  // Extract category object
  const getCategory = () => {
    if (typeof event.category === 'object' && event.category) {
      return event.category
    }
    return getCategoryName()
  }

  // Get image URL from various possible fields
  const getImageUrl = (): string | undefined => {
    return event.image_url ||  // API v2 returns image_url
           event.cover_image || 
           event.image_path || 
           event.image ||
           (event.images && event.images.length > 0 ? event.images[0] : undefined)
  }

  // Parse latitude safely - ensure number type
  const getLatitude = (): number | null => {
    const lat = event.latitude ?? event.lat
    if (lat == null) return null
    const parsed = Number(lat)
    return isNaN(parsed) ? null : parsed
  }

  // Parse longitude safely - ensure number type
  const getLongitude = (): number | null => {
    const lng = event.longitude ?? event.lng
    if (lng == null) return null
    const parsed = Number(lng)
    return isNaN(parsed) ? null : parsed
  }

  // Get dresscode from various fields
  const getDresscode = (): string | null => {
    return event.dress_code ||  // API v2 returns dress_code
           event.formatted_dresscode || 
           event.dresscode || 
           null
  }

  // Get price info
  const getPrice = (): string | null => {
    return event.formatted_price || 
           event.price || 
           event.entrance_fee || 
           null
  }

  // Build datetime strings
  const getStartDatetime = (): string => {
    if (event.start_datetime) return event.start_datetime
    if (event.event_date && event.start_time) {
      return `${event.event_date}T${event.start_time}`
    }
    return event.event_date || ''
  }

  const getEndDatetime = (): string => {
    if (event.end_datetime) return event.end_datetime
    if (event.event_date && event.end_time) {
      return `${event.event_date}T${event.end_time}`
    }
    return ''
  }

  // Get formatted date
  const getFormattedDate = (): string => {
    if (event.formatted_date) return event.formatted_date
    if (event.event_date) return event.event_date
    if (event.start_datetime) {
      const date = new Date(event.start_datetime)
      return date.toLocaleDateString()
    }
    return ''
  }

  return {
    id: event.id,
    title: event.title || '',
    slug: event.slug,
    description: event.description || null,
    
    // Category
    category: getCategory(),
    category_id: event.category_id,
    subcategory: event.subcategory,
    subcategory_id: event.subcategory_id,
    
    // Price
    price: getPrice(),
    min_price: event.min_price,
    max_price: event.max_price,
    currency: event.currency,
    formatted_price: event.formatted_price,
    
    // Dress code and age
    dresscode: getDresscode(),
    formatted_dresscode: event.formatted_dresscode,
    min_age: event.min_age ?? (event.age_limit ? parseInt(event.age_limit) : null),
    max_age: event.max_age,
    age_limit: event.age_limit,
    
    // Date/time - handle separate date/time fields from API v2
    start_datetime: getStartDatetime(),
    end_datetime: getEndDatetime(),
    formatted_date: getFormattedDate(),
    event_date: event.event_date,
    start_time: event.start_time,
    end_time: event.end_time,
    is_overnight: event.is_overnight,
    
    // Location - CRITICAL: ensure numbers for map markers
    venue_name: event.venue_name || event.location_name,
    location_name: event.location_name || event.venue_name,
    city: event.city || '',
    country: event.country,
    address: event.address || null,
    latitude: getLatitude(),
    longitude: getLongitude(),
    
    // Distance
    distance_meters: event.distance_meters,
    distance_km: event.distance_km,
    
    // Organizer
    organizer_name: event.organizer_name,
    organizer_id: event.organizer_id,
    organizer_profile_image_url: pickOrganizerProfileImageUrl(event),
    user_id: pickUserId(event),
    contact_phone: pickStr((event as Record<string, unknown>).contact_phone),
    contact_email: pickStr((event as Record<string, unknown>).contact_email),
    contact_website: pickStr((event as Record<string, unknown>).contact_website),
    contact_box_message: pickStr((event as Record<string, unknown>).contact_box_message),
    contact_box_design_message: pickStr((event as Record<string, unknown>).contact_box_design_message),

    // Images
    cover_image: getImageUrl(),
    images: event.images,
    additional_images: Array.isArray(event.additional_images)
      ? (event.additional_images as Array<EventAdditionalImage | string>)
      : undefined,
    
    // Status flags
    is_published: event.is_published ?? true,
    is_live_now: event.is_live_now ?? false,
    is_featured: event.is_featured,
    is_cancelled: event.is_cancelled,
    is_postponed: event.is_postponed,
    status: event.status,
    computed_status: event.computed_status,
    is_approved: event.is_approved,
    
    // Time of day
    morning: event.morning,
    afternoon: event.afternoon,
    evening: event.evening,
    night: event.night,
    
    // Additional fields from API v2
    entrance_status: event.entrance_status,
    event_type: pickStr(
      (event as Record<string, unknown>).event_type,
      (event as Record<string, unknown>).eventType
    ),
    show_photo_map_marker: pickBool(
      (event as Record<string, unknown>).show_photo_map_marker,
    ),
    booking_instructions:
      pickStr(
        (event as Record<string, unknown>).booking_instructions,
        (event as Record<string, unknown>).bookingInstructions
      ) ?? null,
    social_media_urls: pickSocialMediaUrls(event.social_media_urls),
    contact_info: buildContactInfoFromEvent(event),
    venue: event.venue,
    organisers: (event.organisers || []) as Talent[],  // Cast to Talent[]
    talents: (event.talents || []) as Talent[],  // Cast to Talent[]
    is_free_package: event.is_free_package,
    view_count: event.view_count || 0,
    like_count: event.like_count || 0,
    subcategories: event.subcategories || [],

    // API v2 invited entities (list responses include full objects)
    invited_talents: Array.isArray(event.invited_talents)
      ? (event.invited_talents as Array<string | number>)
      : undefined,
    invited_organisers: Array.isArray(event.invited_organisers)
      ? (event.invited_organisers as Array<string | number>)
      : undefined,
    invited_venues: Array.isArray(event.invited_venues)
      ? (event.invited_venues as Array<string | number>)
      : undefined,
    invited_talents_objects: (Array.isArray(event.invited_talents_objects)
      ? event.invited_talents_objects
      : []) as InvitedEventProfile[],
    invited_organisers_objects: (Array.isArray(event.invited_organisers_objects)
      ? event.invited_organisers_objects
      : []) as InvitedEventProfile[],
    invited_venues_objects: (Array.isArray(event.invited_venues_objects)
      ? event.invited_venues_objects
      : []) as InvitedVenueObject[],

    // Recurring series occurrence linkage
    series_id: event.series_id ?? null,
    is_modified: pickBool(event.is_modified),
    is_series_instance: pickBool(event.is_series_instance) || event.series_id != null,
    
    // Timestamps
    created_at: event.created_at || '',
    updated_at: event.updated_at || ''
  }
}

/**
 * Map array of events from API v2 to UI format
 */
export function mapEventsV2ToUI(events: EventV2Raw[]): Event[] {
  if (!Array.isArray(events)) {
    console.warn('mapEventsV2ToUI: Expected array, got:', typeof events)
    return []
  }
  return events.map(mapEventV2ToUI)
}

/**
 * Extract pagination meta from API v2 response
 */
export function extractPaginationMeta(response: EventsV2Response['data']): PaginationMeta {
  return {
    current_page: response.pagination?.current_page || 1,
    last_page: response.pagination?.last_page || 1,
    per_page: response.pagination?.per_page || 20,
    total: response.pagination?.total || 0
  }
}

/**
 * Safely extract events data from API v2 response
 * Handles nested response structure: response.data.events
 */
export function extractEventsFromV2Response(
  responseData: unknown
): { events: Event[]; meta: PaginationMeta } {
  // Default empty result
  const emptyResult = {
    events: [],
    meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 }
  }

  if (!responseData || typeof responseData !== 'object') {
    console.warn('extractEventsFromV2Response: Invalid response data')
    return emptyResult
  }

  const data = responseData as Record<string, unknown>

  // Check for success flag
  if (data.success === false) {
    console.warn('extractEventsFromV2Response: API returned success: false')
    return emptyResult
  }

  // Navigate to the events array
  // Structure: { success, data: { events: [...events], pagination: {...} } }
  const innerData = data.data as Record<string, unknown> | undefined

  if (!innerData) {
    console.warn('extractEventsFromV2Response: No data property')
    return emptyResult
  }

  // Events array is in innerData.events
  const eventsArray = innerData.events as EventV2Raw[] | undefined

  if (!Array.isArray(eventsArray)) {
    console.warn('extractEventsFromV2Response: Events data is not an array')
    return emptyResult
  }

  return {
    events: mapEventsV2ToUI(eventsArray),
    meta: extractPaginationMeta(innerData as EventsV2Response['data'])
  }
}
