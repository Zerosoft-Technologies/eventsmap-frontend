<template>
  <div ref="mapContainer" class="map-container tw:w-full tw:h-screen"></div>
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import { addEventMarker, clearAllMarkers } from '../utils/useMapPopup.js'
import { ref, onMounted, watch } from 'vue'
import { fetchEvents } from '../api/events'
import { useMapStore } from '@/stores/mapStore'

const mapContainer = ref(null);
const events = ref([]);
const loading = ref(false);
const error = ref(null);
let map;  
const mapStore = useMapStore()

const style = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm-layer',
      type: 'raster',
      source: 'osm'
    }
  ]
}

// Load events from API with no filters (all events)
async function loadEvents() {
  loading.value = true;
  error.value = null;
  
  try {
    // Call API with no filters to get all events
    const result = await fetchEvents({
      per_page: 100 // Get more events for the map
    });


    console.log('API response:', result);
    // Events are already transformed by the adapter
    events.value = result.data;
    
    // Add markers to map if map is loaded
    if (map && map.loaded()) {
      addMarkersToMap();
    }
  } catch (e) {
    console.error('Failed to load events:', e);
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

// Add all event markers to the map
function addMarkersToMap() {
  clearAllMarkers();
  events.value.forEach((event) => {
    addEventMarker(map, event);
  });
}

onMounted(() => {    
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: style, 
    center: [mapStore.appliedLocation.lng, mapStore.appliedLocation.lat],
    zoom: 10
  });

  map.on("load", () => {    
    // Load events from API when map is ready
    loadEvents();
  });
});

// Recenter map when user changes location in Header
watch(
  () => mapStore.appliedLocation,
  (loc) => {
    if (!map || !loc) return
    // Smooth "camera" animation (similar to the snippet you shared)
    map.flyTo({
      center: [loc.lng, loc.lat],
      zoom: Math.max(map.getZoom(), 12),
      speed: 1.2,
      curve: 1.42,
      easing: (t) => t,
      essential: true
    })
  },
  { deep: true }
)

</script>

<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";
.maplibregl-popup.custom-popup {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}
.maplibregl-popup-content {
  background: none !important;
  padding: 0 !important;
  box-shadow: none !important;
}
.maplibregl-popup-tip {
  display: none !important;
}
</style>
