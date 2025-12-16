<template>
  <div ref="mapContainer" class="map-container tw:w-full tw:h-screen"></div>
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import {addEventMarker} from '../utils/useMapPopup.js'
import { ref, onMounted } from 'vue'
import events from '../assets/events.json'

const mapContainer = ref(null);
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

onMounted(() => {    
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: style, 
    center: [4.88428, 52.32797],
    zoom: 10
  });

  map.on("load", () => {    
    events.forEach((event) => {console.log(event); addEventMarker(map, event)});
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
