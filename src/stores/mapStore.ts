import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type { DiscoveryProfile } from '@/api/discoveryProfiles'
import type { MapViewportBounds } from '@/utils/mapViewportFilter'

export type MapProfileItem = DiscoveryProfile & { profileType: string }

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

  /** Events to render as map markers (latest header listing query). */
  const mapEventItems = shallowRef<Record<string, unknown>[]>([])

  /** Profile items to show as map markers (non-event profile types) */
  const mapProfileItems = shallowRef<MapProfileItem[]>([])

  /** Current map viewport — list view filters to markers inside this box (map leads). */
  const mapViewportBounds = ref<MapViewportBounds | null>(null)

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

  function setMapEvents(items: Record<string, unknown>[]) {
    mapEventItems.value = Array.isArray(items) ? items : []
  }

  function clearMapEvents() {
    mapEventItems.value = []
  }

  function setMapProfiles(items: MapProfileItem[]) {
    mapProfileItems.value = items
  }

  function clearMapProfiles() {
    mapProfileItems.value = []
  }

  function setMapViewportBounds(bounds: MapViewportBounds | null) {
    mapViewportBounds.value = bounds
  }

  return {
    appliedLocation,
    pendingLocation,
    mapEventItems,
    mapProfileItems,
    mapViewportBounds,
    setPendingLocation,
    applyPendingLocation,
    setAppliedLocation,
    setMapEvents,
    clearMapEvents,
    setMapProfiles,
    clearMapProfiles,
    setMapViewportBounds,
  }
})

