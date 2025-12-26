import { createApp } from 'vue'
import maplibregl from 'maplibre-gl'
import i18n from '../i18n'

// Store markers for cleanup
let markers = []

// Clear all markers from the map
export function clearAllMarkers() {
  markers.forEach(marker => marker.remove())
  markers = []
}

export function addEventMarker(map, event) {    
  const popupEl = document.createElement('div')
  popupEl.classList.add("tw:relative", "tw:bg-white", "tw:rounded-2xl", "tw:p-4")  
  
  // Dynamic import to avoid circular import issue
  import('../components/Event.vue').then(({ default: Event }) => {
    const app = createApp(Event, { event })
    app.use(i18n)
    app.mount(popupEl)
  })
  const popup = new maplibregl.Popup({ closeButton: false, maxWidth: "none", anchor: "bottom", offset: [0, -45] }).setDOMContent(popupEl)  
  const triangleDiv = document.createElement('div');
  triangleDiv.className = "tw:absolute tw:left-1/2 tw:-translate-x-1/2 tw:-bottom-2 tw:w-0 tw:h-0 tw:border-l-10 tw:border-l-transparent tw:border-r-10 tw:border-r-transparent tw:border-t-12 tw:border-t-white tw:shadow-md";
  popupEl.appendChild(triangleDiv)

  const markerEl = document.createElement('div');    
  markerEl.style.backgroundImage = `url(http://185.133.88.194:3001/marker.png)`;
  // markerEl.style.backgroundImage = `url(${import.meta.env.VITE_APP_URL}/marker.png)`;
  markerEl.style.width = '60px';
  markerEl.style.height = '60px';
  
  // Support both lat/lng and latitude/longitude formats
  const lng = event.lng ?? event.longitude
  const lat = event.lat ?? event.latitude
  
  const marker = new maplibregl.Marker({element: markerEl})
  .setLngLat([lng, lat])
  .setPopup(popup)
  .addTo(map)

  // Store marker for cleanup
  markers.push(marker)
  
  marker.getElement().addEventListener("click", (e) => {
    const target = [lng, lat];

    map.easeTo({
      center: target,
      zoom: Math.max(map.getZoom(), 12), 
      offset: [0, 250], 
      duration: 600
    });
  });
}