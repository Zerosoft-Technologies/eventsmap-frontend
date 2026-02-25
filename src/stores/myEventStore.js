import { defineStore } from 'pinia'
import { ref } from 'vue'
import eventService from '@/services/eventService'

export const useMyEventStore = defineStore('myEvents', () => {
  const events = ref([])
  const selectedEventId = ref(null)
  const loading = ref(false)

  async function fetchMyEvents() {
    loading.value = true
    try {
      const response = await eventService.getMyEvents()
      if (response.success && Array.isArray(response.data)) {
        events.value = response.data
      } else {
        events.value = []
      }
    } catch (error) {
      console.error('Failed to fetch my events:', error)
      events.value = []
    } finally {
      loading.value = false
    }
  }

  function selectEvent(id) {
    selectedEventId.value = id
  }

  return {
    events,
    selectedEventId,
    loading,
    fetchMyEvents,
    selectEvent
  }
})
