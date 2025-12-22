# Events API Integration Guide

This document describes how the Events browsing feature integrates with the Laravel backend API.

## Configuration

### API Base URL

Set the API base URL in your environment file:

```bash
# .env
VITE_API_BASE_URL=http://localhost:8000
```

For production, set this to your actual API domain.

## API Endpoints

### 1. GET /api/v1/events

Fetches a paginated list of events with optional filters.

**Query Parameters (all optional):**

| Parameter | Type | Description |
|-----------|------|-------------|
| `lat` | float | Latitude (-90 to 90) |
| `lng` | float | Longitude (-180 to 180) |
| `radius` | float | Search radius in km |
| `from_date` | string | Start date (YYYY-MM-DD) |
| `to_date` | string | End date (YYYY-MM-DD) |
| `min_price` | float | Minimum price |
| `max_price` | float | Maximum price |
| `category` | string | Event category (music\|dance\|theatre\|nightlife\|film) |
| `live_now` | string | Set to "true" for live events |
| `page` | int | Page number |
| `per_page` | int | Items per page (default: 20) |

**Example Requests:**

```typescript
// Events near Amsterdam with radius
/events?lat=52.37&lng=4.89&radius=10

// Live events only
/events?live_now=true

// Music events with price range
/events?category=music&min_price=20&max_price=50

// Events in date range
/events?from_date=2025-01-01&to_date=2025-01-31
```

**Response Format:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Amsterdam Night Party",
      "description": "...",
      "category": "nightlife",
      "price": "€25",
      "dresscode": "Smart Casual",
      "min_age": 18,
      "start_datetime": "2025-01-15T20:00:00",
      "end_datetime": "2025-01-16T02:00:00",
      "city": "Amsterdam",
      "address": "De Melkweg, Lijnbaansgracht 234A",
      "is_published": true,
      "is_live_now": false,
      "latitude": 52.3676,
      "longitude": 4.8837,
      "distance_km": 2.5
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 20,
    "total": 100
  }
}
```

### 2. GET /api/v1/events/{id}

Fetches a single event by ID.

**Response Format:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Amsterdam Night Party",
    // ... same fields as above
  }
}
```

## Frontend Architecture

### File Structure

```
src/
├── api/
│   ├── config.ts       # API configuration
│   ├── events.ts       # Events API client
│   └── index.ts        # Barrel export
├── composables/
│   ├── useEvents.ts    # Events state management
│   └── index.ts
├── components/
│   └── events/
│       ├── EventCard.vue       # Single event card
│       ├── EventsFilters.vue   # Filter controls
│       ├── EventsList.vue      # Events list with pagination
│       ├── EventsMap.vue       # MapLibre map component
│       └── index.ts
├── pages/
│   └── Events.vue      # Main events page
└── types/
    ├── events.ts       # TypeScript interfaces
    └── index.ts
```

### Usage Examples

#### Basic Usage

```vue
<script setup lang="ts">
import { useEvents } from '@/composables/useEvents'

const {
  events,
  loading,
  error,
  load,
  loadMore,
  setCategory,
  setLiveNow
} = useEvents()

// Load events on mount
onMounted(() => load())

// Filter by category
setCategory('music')

// Show only live events
setLiveNow(true)
</script>
```

#### Direct API Usage

```typescript
import { fetchEvents, fetchEventById } from '@/api/events'

// Fetch events with filters
const { data, meta } = await fetchEvents({
  lat: 52.37,
  lng: 4.89,
  radius: 10,
  category: 'music',
  live_now: true
})

// Fetch single event
const event = await fetchEventById(123)
```

### Behavior Notes

1. **Geo Sorting**: When `lat`, `lng`, and `radius` are provided, the backend sorts by distance (nearest first). The `distance_km` field is included in the response.

2. **Date Sorting**: When geo params are not provided, events are sorted by `start_datetime` ascending.

3. **Live Now**: The `is_live_now` field is computed by the backend (authoritative). The frontend displays a LIVE badge when `is_live_now === true`.

4. **Map Integration**:
   - Moving the map updates the center coordinates with debounce (400ms)
   - Events with coordinates show as markers
   - Clicking a marker or list item selects the event

5. **Pagination**: Uses "Load More" pattern. Call `loadMore()` to fetch the next page and append results.

## Running Locally

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Update `VITE_API_BASE_URL` with your backend URL
4. Install dependencies: `npm install`
5. Start dev server: `npm run dev`
6. Navigate to `/events` route
