import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SelectedLocation {
  lat: number
  lng: number
  name?: string
}

export const useMapStore = defineStore('map', () => {
  // Location currently applied to map views
  const appliedLocation = ref<SelectedLocation>({
    lat: 52.3676,
    lng: 4.9041,
    name: 'Amsterdam',
  })

  // Location chosen in the UI but not yet applied
  const pendingLocation = ref<SelectedLocation | null>(null)

  function setPendingLocation(loc: SelectedLocation) {
    pendingLocation.value = { ...loc }
  }

  function applyPendingLocation() {
    if (!pendingLocation.value) return
    appliedLocation.value = { ...pendingLocation.value }
    pendingLocation.value = null
  }

  function setAppliedLocation(loc: SelectedLocation) {
    appliedLocation.value = { ...loc }
  }

  return {
    appliedLocation,
    pendingLocation,
    setPendingLocation,
    applyPendingLocation,
    setAppliedLocation,
  }
})

