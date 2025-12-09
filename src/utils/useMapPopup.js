import { createApp } from 'vue'
import EventPopup from '../components/EventPopup.vue'
import maplibregl from 'maplibre-gl'
import * as turf from "@turf/turf";


export function addEventMarker(map, event) {    
  const popupEl = document.createElement('div')  
  createApp(EventPopup, { event }).mount(popupEl)
  const popup = new maplibregl.Popup({ closeButton: false, maxWidth: "none", anchor: "bottom", offset: [0, -45] }).setDOMContent(popupEl)  
  const markerEl = document.createElement('div');
  markerEl.style.backgroundImage = 'url(http://localhost:5173/marker.png)';
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

  // marker.getElement().addEventListener("click", () => {
  //   const target = [event.lat, event.lng];

  //   map.easeTo({
  //     center: target,
  //     zoom: Math.max(map.getZoom(), 15), // zoom to 15 unless already closer
  //     offset: [0, -150], // Pan upward so popup is fully visible
  //     duration: 600
  //   });

  //   popup.setLngLat(target).addTo(map);
  // });
}