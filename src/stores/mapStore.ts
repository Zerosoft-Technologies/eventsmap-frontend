import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type { DiscoveryProfile } from '@/api/discoveryProfiles'

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

  /** Event IDs from latest header search result (home map pin highlight) */
  const searchHighlightEventIds = shallowRef<ReadonlySet<number>>(new Set())

  /** Profile items to show as map markers (non-event profile types) */
  const mapProfileItems = shallowRef<MapProfileItem[]>([])

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

  function setSearchHighlightEventIds(ids: Array<number | string | null | undefined>) {
    const next = new Set<number>()
    for (const raw of ids) {
      const n = typeof raw === 'number' ? raw : Number(raw)
      if (Number.isFinite(n)) next.add(n)
    }
    searchHighlightEventIds.value = next
  }

  function clearSearchHighlightEventIds() {
    searchHighlightEventIds.value = new Set()
  }

  function setMapProfiles(items: MapProfileItem[]) {
    mapProfileItems.value = items
  }

  function clearMapProfiles() {
    mapProfileItems.value = []
  }

  return {
    appliedLocation,
    pendingLocation,
    searchHighlightEventIds,
    mapProfileItems,
    setPendingLocation,
    applyPendingLocation,
    setAppliedLocation,
    setSearchHighlightEventIds,
    clearSearchHighlightEventIds,
    setMapProfiles,
    clearMapProfiles,
  }
})

