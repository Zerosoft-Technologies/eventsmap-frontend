import { createApp } from 'vue'
import EventPopup from '../components/EventPopup.vue'
import maplibregl from 'maplibre-gl'
import * as turf from "@turf/turf";


export function addEventMarker(map, event) {    
  const popupEl = document.createElement('div')  
  createApp(EventPopup, { event }).mount(popupEl)
  const popup = new maplibregl.Popup({ closeButton: false, maxWidth: '435px', anchor: "bottom", offset: [0, -45] }).setDOMContent(popupEl)  
  const marker = new maplibregl.Marker({ color: "#0061FF" })
  .setLngLat([event.lat, event.lng])
  .setPopup(popup)
  .addTo(map)
   const circle = turf.circle(
    [event.lat, event.lng],
    1000 / 1000, 
    { steps: 64, units: "kilometers" }
  );

  map.addSource(`circle-${event.id}`, {
    type: "geojson",
    data: circle
  });  
  
  map.addLayer({
    id: `circle-fill-${event.id}`,
    type: "fill",
    source: `circle-${event.id}`,
    paint: {
      "fill-color": "#0061FF",    
      "fill-opacity": 0.4
    }
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