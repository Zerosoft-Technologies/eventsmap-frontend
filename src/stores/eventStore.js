import { defineStore } from 'pinia'
import { fetchEvents } from '@/api/events'

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    events: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchEventsByLocation(params = {}) {
      this.loading = true
      this.error = null
      try {
        const result = await fetchEvents(params)
        this.events = result.data || []
      } catch (error) {
        this.error = error
        console.error('Error fetching events:', error)
        this.events = []
      } finally {
        this.loading = false
      }
    },
  },
})
