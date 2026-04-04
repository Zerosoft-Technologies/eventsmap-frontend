import { defineStore } from 'pinia'
import { ref } from 'vue'
import eventService from '@/services/eventService'

export const useMyOrganiserStore = defineStore('myOrganisers', () => {
  const organisers = ref([])
  const selectedOrganiserId = ref(null)
  const loading = ref(false)

  async function fetchMyOrganisers() {
    loading.value = true
    try {
      const response = await eventService.getMyOrganisers()
      if (response.success && Array.isArray(response.data)) {
        organisers.value = response.data
      } else {
        organisers.value = []
      }
    } catch (error) {
      console.error('Failed to fetch my organisers:', error)
      organisers.value = []
    } finally {
      loading.value = false
    }
  }

  function selectOrganiser(id) {
    selectedOrganiserId.value = id
  }

  return {
    organisers,
    selectedOrganiserId,
    loading,
    fetchMyOrganisers,
    selectOrganiser
  }
})
