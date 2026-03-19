<template>
  <div ref="mapContainer" class="tw:w-full tw:h-full tw:rounded-xl tw:overflow-hidden"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import maplibregl from 'maplibre-gl'
import type { Event, MapCenter, MapBounds } from '../../types/events'

const props = defineProps<{
  events: Event[]
  center: MapCenter
  selectedEventId: number | null
}>()

const emit = defineEmits<{
  (e: 'mapMove', center: MapCenter): void
  (e: 'mapViewport', payload: { center: MapCenter; bounds: MapBounds; zoom: number }): void
  (e: 'selectEvent', id: number): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: maplibregl.Map | null = null
let markerById = new Map<number, { marker: maplibregl.Marker; el: HTMLElement }>()
let moveTimeout: ReturnType<typeof setTimeout> | null = null

const mapStyle = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm-layer',
      type: 'raster' as const,
      source: 'osm'
    }
  ]
}

const createMarkerElement = (event: Event, isSelected: boolean): HTMLElement => {
  const el = document.createElement('div')
  el.className = 'event-marker'
  el.style.cssText = `
    width: 40px;
    height: 40px;
    background-color: ${isSelected ? '#0061FF' : event.is_live_now ? '#EF4444' : '#FF7700'};
    border: 3px solid white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, background-color 0.2s;
    ${isSelected ? 'transform: scale(1.2);' : ''}
  `
  
  // Add live indicator
  if (event.is_live_now) {
    const pulse = document.createElement('div')
    pulse.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #EF4444;
      animation: pulse 2s infinite;
      opacity: 0.5;
    `
    el.appendChild(pulse)
  }

  // Add inner icon
  const inner = document.createElement('div')
  inner.style.cssText = `
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 50%;
    z-index: 1;
  `
  el.appendChild(inner)

  return el
}

const createPopupContent = (event: Event): string => {
  const liveHtml = event.is_live_now 
    ? '<span style="color: #EF4444; font-size: 11px; font-weight: 600;">● LIVE NOW</span>' 
    : ''
  
  const distanceHtml = event.distance_km != null 
    ? `<div style="color: #0061FF; font-size: 12px; margin-top: 4px;">${event.distance_km.toFixed(1)} km away</div>` 
    : ''

  return `
    <div style="padding: 12px; min-width: 200px; font-family: Inter, sans-serif;">
      <div style="display: flex; justify-content: space-between; align-items: start; gap: 8px;">
        <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #0061FF; line-height: 1.3;">${event.title}</h4>
        ${liveHtml}
      </div>
      <div style="font-size: 12px; color: #666; margin-top: 4px; text-transform: capitalize;">${event.category}</div>
      ${event.address ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">${event.address}</div>` : ''}
      ${distanceHtml}
      <button 
        onclick="window.dispatchEvent(new CustomEvent('viewEvent', { detail: ${event.id} }))"
        style="margin-top: 8px; padding: 6px 12px; background: #0061FF; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; width: 100%;"
      >
        View Details
      </button>
    </div>
  `
}

const removeAllMarkers = () => {
  markerById.forEach(({ marker }) => marker.remove())
  markerById.clear()
}

const syncMarkers = () => {
  if (!map) return
  
  const nextIds = new Set<number>()

  props.events.forEach(event => {
    if (event.latitude == null || event.longitude == null) return
    nextIds.add(event.id)
    
    const isSelected = event.id === props.selectedEventId

    const existing = markerById.get(event.id)
    if (!existing) {
      const el = createMarkerElement(event, isSelected)

      const popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: '280px',
        offset: [0, -20]
      }).setHTML(createPopupContent(event))

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([event.longitude, event.latitude])
        .setPopup(popup)
        .addTo(map!)

      el.addEventListener('click', () => {
        emit('selectEvent', event.id)
      })

      if (isSelected) {
        marker.togglePopup()
      }

      markerById.set(event.id, { marker, el })
    } else {
      // Update selection styling without recreating marker
      existing.el.style.backgroundColor = isSelected ? '#0061FF' : event.is_live_now ? '#EF4444' : '#FF7700'
    }
  })

  // Prune markers that are no longer in the current dataset
  for (const [id, { marker }] of markerById.entries()) {
    if (!nextIds.has(id)) {
      marker.remove()
      markerById.delete(id)
    }
  }
}

const centerOnEvent = (eventId: number) => {
  const event = props.events.find(e => e.id === eventId)
  if (!event || event.latitude == null || event.longitude == null || !map) return
  
  map.easeTo({
    center: [event.longitude, event.latitude],
    zoom: Math.max(map.getZoom(), 14),
    duration: 500
  })
}

// Initialize map
onMounted(async () => {
  await nextTick()
  
  if (!mapContainer.value) return
  
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: mapStyle,
    center: [props.center.lng, props.center.lat],
    zoom: 11
  })
  
  // Add navigation controls
  map.addControl(new maplibregl.NavigationControl(), 'top-right')
  
  // Handle map move with debounce
  map.on('moveend', () => {
    if (moveTimeout) clearTimeout(moveTimeout)
    
    moveTimeout = setTimeout(() => {
      if (!map) return
      const center = map.getCenter()
      const b = map.getBounds()
      const bounds: MapBounds = {
        minLat: b.getSouthWest().lat,
        maxLat: b.getNorthEast().lat,
        minLng: b.getSouthWest().lng,
        maxLng: b.getNorthEast().lng
      }
      const zoom = map.getZoom()
      emit('mapMove', { lat: center.lat, lng: center.lng })
      emit('mapViewport', { center: { lat: center.lat, lng: center.lng }, bounds, zoom })
    }, 300)
  })

  map.on('zoomend', () => {
    if (moveTimeout) clearTimeout(moveTimeout)
    moveTimeout = setTimeout(() => {
      if (!map) return
      const center = map.getCenter()
      const b = map.getBounds()
      const bounds: MapBounds = {
        minLat: b.getSouthWest().lat,
        maxLat: b.getNorthEast().lat,
        minLng: b.getSouthWest().lng,
        maxLng: b.getNorthEast().lng
      }
      const zoom = map.getZoom()
      emit('mapViewport', { center: { lat: center.lat, lng: center.lng }, bounds, zoom })
    }, 300)
  })
  
  // Add markers when map loads
  map.on('load', () => {
    syncMarkers()
    // Emit initial viewport so parent can fetch by bounds
    const center = map!.getCenter()
    const b = map!.getBounds()
    const bounds: MapBounds = {
      minLat: b.getSouthWest().lat,
      maxLat: b.getNorthEast().lat,
      minLng: b.getSouthWest().lng,
      maxLng: b.getNorthEast().lng
    }
    emit('mapViewport', { center: { lat: center.lat, lng: center.lng }, bounds, zoom: map!.getZoom() })
  })
  
  // Listen for viewEvent custom event from popup
  const handleViewEvent = (e: CustomEvent) => {
    emit('selectEvent', e.detail)
  }
  window.addEventListener('viewEvent', handleViewEvent as EventListener)
})

// Cleanup
onUnmounted(() => {
  if (moveTimeout) clearTimeout(moveTimeout)
  removeAllMarkers()
  if (map) {
    map.remove()
    map = null
  }
})

// Watch for events changes
watch(() => props.events, () => {
  if (map && map.loaded()) {
    syncMarkers()
  }
}, { deep: true })

// Watch for selected event changes
watch(() => props.selectedEventId, (newId) => {
  if (map && map.loaded()) {
    syncMarkers()
    if (newId != null) {
      centerOnEvent(newId)
    }
  }
})

// Watch for center changes from parent
watch(() => props.center, (newCenter) => {
  if (map && map.loaded()) {
    const currentCenter = map.getCenter()
    const threshold = 0.001 // Small threshold to avoid infinite loops
    
    if (
      Math.abs(currentCenter.lat - newCenter.lat) > threshold ||
      Math.abs(currentCenter.lng - newCenter.lng) > threshold
    ) {
      map.easeTo({
        center: [newCenter.lng, newCenter.lat],
        duration: 500
      })
    }
  }
}, { deep: true })

// Expose method to parent
defineExpose({
  centerOnEvent
})
</script>

<style>
@import "maplibre-gl/dist/maplibre-gl.css";

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.maplibregl-popup-content {
  padding: 0 !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
}

.maplibregl-popup-close-button {
  font-size: 18px;
  padding: 4px 8px;
  color: #666;
}

.maplibregl-popup-close-button:hover {
  color: #0061FF;
  background: transparent;
}
</style>
