import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import VenueService from '@/services/VenueService'

export const useMyVenueStore = defineStore('myVenues', () => {
  const venues = ref([])
  const selectedVenueId = ref(null)
  /** Set before navigating to the venue form from a sub-route; avoids `?edit=` in the URL */
  const pendingEditorVenueId = ref(null)
  const loading = ref(false)
  const error = ref(null)

  let fetchSeq = 0
  let abortController = null

  function isCanceledError(err) {
    return (
      axios.isCancel?.(err) === true ||
      err?.code === 'ERR_CANCELED' ||
      err?.name === 'CanceledError' ||
      err?.name === 'AbortError'
    )
  }

  async function fetchMyVenues() {
    fetchSeq += 1
    const seq = fetchSeq

    if (abortController) {
      abortController.abort()
    }
    abortController = new AbortController()
    const { signal } = abortController

    loading.value = true
    error.value = null
    try {
      const response = await VenueService.getMyVenues({ signal })
      if (seq !== fetchSeq) return
      if (response.success && Array.isArray(response.data)) {
        venues.value = response.data
      } else {
        venues.value = []
      }
    } catch (err) {
      if (seq !== fetchSeq) return
      if (isCanceledError(err)) return
      console.error('Failed to fetch my venues:', err)
      error.value = err?.response?.data?.message || err?.message || 'Failed to load venues'
      venues.value = []
    } finally {
      if (seq === fetchSeq) {
        loading.value = false
      }
    }
  }

  function selectVenue(id) {
    selectedVenueId.value = id
  }

  function setPendingEditorVenueId(id) {
    pendingEditorVenueId.value = id != null ? Number(id) : null
  }

  /** Returns the pending id once and clears it (used when the form page mounts). */
  function takePendingEditorVenueId() {
    const id = pendingEditorVenueId.value
    pendingEditorVenueId.value = null
    return id
  }

  function mergeListItem(id, fields) {
    const idx = venues.value.findIndex((t) => Number(t.id) === Number(id))
    if (idx === -1) return
    const prev = venues.value[idx]
    venues.value[idx] = { ...prev, ...fields }
  }

  return {
    venues,
    selectedVenueId,
    loading,
    error,
    fetchMyVenues,
    selectVenue,
    setPendingEditorVenueId,
    takePendingEditorVenueId,
    mergeListItem,
  }
})
