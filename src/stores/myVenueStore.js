import { defineStore } from 'pinia'
import { ref } from 'vue'
import VenueService from '@/services/VenueService'

export const useMyVenueStore = defineStore('myVenues', () => {
  const venues = ref([])
  const selectedVenueId = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchMyVenues() {
    loading.value = true
    error.value = null
    try {
      const response = await VenueService.getMyVenues()
      if (response.success && Array.isArray(response.data)) {
        venues.value = response.data
      } else {
        venues.value = []
      }
    } catch (err) {
      console.error('Failed to fetch my venues:', err)
      error.value = err?.response?.data?.message || err?.message || 'Failed to load venues'
      venues.value = []
    } finally {
      loading.value = false
    }
  }

  function selectVenue(id) {
    selectedVenueId.value = id
  }

  return {
    venues,
    selectedVenueId,
    loading,
    error,
    fetchMyVenues,
    selectVenue,
  }
})
