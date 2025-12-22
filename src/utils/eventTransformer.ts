import type { Event as ApiEvent } from '../types/events'

/**
 * Transform API event data to the format expected by existing UI components
 */
export interface UIEvent {
  id: string
  title: string
  live: boolean
  image: string
  date: string
  location: string
  category: string
  price: string
  dresscode: string
  age: string
  lat: number
  lng: number
  start_datetime: string // ISO datetime for countdown
  end_datetime: string // ISO datetime for live calculation
}

/**
 * Format datetime to readable string
 */
function formatEventDate(startDatetime: string, endDatetime: string): string {
  const start = new Date(startDatetime)
  const end = new Date(endDatetime)
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  
  const dayName = dayNames[start.getDay()]
  const day = start.getDate()
  const month = monthNames[start.getMonth()]
  
  const formatTime = (date: Date) => {
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const minuteStr = minutes < 10 ? '0' + minutes : minutes
    return `${hours}:${minuteStr} ${ampm}`
  }
  
  return `${dayName} ${day} ${month}, ${formatTime(start)} - ${formatTime(end)}`
}

/**
 * Transform a single API event to UI format
 */
export function transformApiEventToUI(apiEvent: ApiEvent): UIEvent {
  return {
    id: String(apiEvent.id),
    title: apiEvent.title,
    live: apiEvent.is_live_now,
    image: `https://picsum.photos/300/200?random=${apiEvent.id}`, // Placeholder image
    date: formatEventDate(apiEvent.start_datetime, apiEvent.end_datetime),
    location: apiEvent.address || apiEvent.city,
    category: apiEvent.category,
    price: apiEvent.price || 'Free',
    dresscode: apiEvent.dresscode || 'Any',
    age: apiEvent.min_age ? `${apiEvent.min_age}+` : 'All',
    lat: apiEvent.latitude || 0,
    lng: apiEvent.longitude || 0,
    start_datetime: apiEvent.start_datetime, // Include for countdown
    end_datetime: apiEvent.end_datetime // Include for live calculation
  }
}

/**
 * Transform array of API events to UI format
 */
export function transformApiEventsToUI(apiEvents: ApiEvent[]): UIEvent[] {
  return apiEvents
    .filter(e => e.latitude != null && e.longitude != null) // Only events with coordinates
    .map(transformApiEventToUI)
}
