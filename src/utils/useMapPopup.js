import { createApp } from 'vue'
import EventPopup from '../components/EventPopup.vue'
import maplibregl from 'maplibre-gl'
import * as turf from "@turf/turf";


export function addEventMarker(map, event) {    
  const popupEl = document.createElement('div')  
  createApp(EventPopup, { event }).mount(popupEl)
  const popup = new maplibregl.Popup({ closeButton: false, maxWidth: "none", anchor: "bottom", offset: [0, -45] }).setDOMContent(popupEl)  
  const markerEl = document.createElement('div');    
  markerEl.style.backgroundImage = `url(http://185.133.88.194:3001/marker.png)`;
  // markerEl.style.backgroundImage = `url(${import.meta.env.VITE_APP_URL}/marker.png)`;
  markerEl.style.width = '60px';
  markerEl.style.height = '60px';
  const marker = new maplibregl.Marker({element: markerEl})
  .setLngLat([event.lat, event.lng])
  .setPopup(popup)
  .addTo(map)
  
  marker.getElement().addEventListener("click", (e) => {
    const target = [event.lat, event.lng];

    map.easeTo({
      center: target,
      zoom: Math.max(map.getZoom(), 12), 
      offset: [0, 250], 
      duration: 600
    });
  });
}