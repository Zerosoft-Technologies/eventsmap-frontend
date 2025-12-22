<template>
  <div ref="mapContainer" class="map-container tw:w-full tw:h-screen"></div>
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import { addEventMarker, clearAllMarkers } from '../utils/useMapPopup.js'
import { ref, onMounted } from 'vue'
import { fetchEvents } from '../api/events'
import { transformApiEventsToUI } from '../utils/eventTransformer'

const mapContainer = ref(null);
const events = ref([]);
const loading = ref(false);
const error = ref(null);
let map;  

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
    
    // Transform API data to UI format
    events.value = transformApiEventsToUI(result.data);
    
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
    center: [4.88428, 52.32797],
    zoom: 10
  });

  map.on("load", () => {    
    // Load events from API when map is ready
    loadEvents();
  });
});

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
