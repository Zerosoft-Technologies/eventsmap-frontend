import type { Event as ApiEvent, EventCategoryObject, EventSubcategory } from '../types/events'

/**
 * Transform API event data to the format expected by existing UI components
 */
export interface UIEvent {
  id: string
  title: string
  live: boolean
  image: string
  date: string 
  description: string
  location: string | undefined
  location_name: string | undefined
  category: string
  subcategory?: string
  price: string
  dresscode: string
  age: string
  lat: number
  lng: number
  latitude: number
  longitude: number
  start_datetime: string // ISO datetime for countdown
  end_datetime: string // ISO datetime for live calculation
  // Additional fields from API
  venue_name?: string
  country?: string
  organizer_name?: string
  cover_image?: string
  video_url?: string
  tags?: string[]
  talents?: any[]
  view_count?: number
  timezone?: string
  currency?: string
  min_price?: string | number | null
  max_price?: string | number | null
  is_featured?: boolean
  is_cancelled?: boolean
  is_postponed?: boolean
  distance_km?: number
  category_id?: number
  subcategory_id?: number
  contact_info?: {
    email?: string
    phone?: string
    website?: string
  }
  about?: any
  location_details?: any
  booking?: any
  social_links?: any
  images?: string[]
  event_images?: any[]
}

/**
 * Format datetime to readable string
 */
// function formatEventDate(startDatetime: string, endDatetime: string, timezone?: string): string {
//   const start = new Date(startDatetime)
//   const end = new Date(endDatetime)
  
//   const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
//   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  
//   const dayName = dayNames[start.getDay()]
//   const day = start.getDate()
//   const month = monthNames[start.getMonth()]
  
//   const formatTime = (date: Date) => {
//     let hours = date.getHours()
//     const minutes = date.getMinutes()
//     const ampm = hours >= 12 ? 'PM' : 'AM'
//     hours = hours % 12
//     hours = hours ? hours : 12
//     const minuteStr = minutes < 10 ? '0' + minutes : minutes
//     return `${hours}:${minuteStr} ${ampm}`
//   }
  
//   // Add timezone if available
//   const tzString = timezone ? ` (${timezone})` : ''
  
//   return `${dayName} ${day} ${month}, ${formatTime(start)} - ${formatTime(end)}${tzString}`
// }

/**
 * Extract category name from category object or string
 */
function getCategoryName(category: EventCategoryObject | string): string {
  if (typeof category === 'string') {
    return category
  }
  if (category && typeof category === 'object' && 'name' in category) {
    return category.name
  }
  return 'Unknown'
}

/**
 * Format price range
 */
// function formatPrice(event: ApiEvent): string {
//   if (!event.price && !event.min_price && !event.max_price) {
//     return 'Free'
//   }
  
//   // if (event.min_price && event.max_price) {
//   //   const currency = event.currency || 'USD'
//   //   const min = typeof event.min_price === 'string' ? parseFloat(event.min_price) : event.min_price
//   //   const max = typeof event.max_price === 'string' ? parseFloat(event.max_price) : event.max_price
//   //   return `${currency} ${min} - ${max}`
//   // }
  
//   if (event.price) {
//     const currency = event.currency || 'USD'
//     return `${currency} ${event.price}`
//   }
  
//   return 'Price varies'
// }

/**
 * Transform a single API event to UI format
 */
export function transformApiEventToUI(apiEvent: ApiEvent): UIEvent {
  const locationParts = []
  if (apiEvent.venue_name) locationParts.push(apiEvent.venue_name)
  if (apiEvent.address) locationParts.push(apiEvent.address)
  if (apiEvent.city) locationParts.push(apiEvent.city)
  if (apiEvent.country) locationParts.push(apiEvent.country)
  
  // Extract subcategory name if available
  const subcategoryName = apiEvent.subcategory && typeof apiEvent.subcategory === 'object' 
    ? (apiEvent.subcategory as EventSubcategory).name 
    : undefined
  
  return {
    id: String(apiEvent.id),
    title: apiEvent.title,
    live: apiEvent.is_live_now,
    image: apiEvent.cover_image || apiEvent.images?.[0] || `https://picsum.photos/300/200?random=${apiEvent.id}`,
    // date: formatEventDate(apiEvent.start_datetime, apiEvent.end_datetime, apiEvent.timezone),
    date: apiEvent.formatted_date,
    // location: locationParts.join(', ') || apiEvent.city,
    location: apiEvent.venue_name,
    location_name: apiEvent.location_name,
    category: getCategoryName(apiEvent.category),
    subcategory: subcategoryName,
    // price: formatPrice(apiEvent),
    price: apiEvent.formatted_price ?? 'Free',
    description: apiEvent.description || '',
    dresscode: apiEvent.formatted_dresscode || 'Any',
    age: apiEvent.min_age ? `${apiEvent.min_age}+` : 'All',
    lat: apiEvent.latitude || 0,
    lng: apiEvent.longitude || 0,
    latitude: apiEvent.latitude || 0,
    longitude: apiEvent.longitude || 0,
    start_datetime: apiEvent.start_datetime,
    end_datetime: apiEvent.end_datetime,
    // Additional fields
    venue_name: apiEvent.venue_name,
    country: apiEvent.country,
    organizer_name: apiEvent.organizer_name,
    cover_image: apiEvent.cover_image,
    video_url: apiEvent.video_url,
    tags: apiEvent.tags,
    talents: apiEvent.talents,
    view_count: apiEvent.view_count,
    timezone: apiEvent.timezone,
    currency: apiEvent.currency,
    min_price: apiEvent.min_price,
    max_price: apiEvent.max_price,
    is_featured: apiEvent.is_featured,
    is_cancelled: apiEvent.is_cancelled,
    is_postponed: apiEvent.is_postponed,
    distance_km: typeof apiEvent.distance_km === 'number' ? apiEvent.distance_km : parseFloat(apiEvent.distance_km || '0'),
    category_id: apiEvent.category_id,
    subcategory_id: apiEvent.subcategory_id,
    contact_info: apiEvent.contact_info,
    about: apiEvent.about,
    location_details: apiEvent.location_details,
    booking: apiEvent.booking,
    social_links: apiEvent.social_links,
    images: apiEvent.images,
    event_images: apiEvent.event_images
  }
}

/**
 * Transform array of API events to UI format
 */
export function transformApiEventsToUI(apiEvents: any[]): UIEvent[] {
  return apiEvents
    .filter(e => e.latitude != null && e.longitude != null) // Only events with coordinates
    .map(transformApiEventToUI)
}
