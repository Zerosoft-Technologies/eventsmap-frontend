import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import eventService from '@/services/eventService'

export const useMyEventStore = defineStore('myEvents', () => {
  const events = ref([])
  const selectedEventId = ref(null)
  /** Set before navigating to the event form from a sub-route; avoids `?edit=` in the URL */
  const pendingEditorEventId = ref(null)
  const loading = ref(false)

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

  async function fetchMyEvents() {
    fetchSeq += 1
    const seq = fetchSeq

    if (abortController) {
      abortController.abort()
    }
    abortController = new AbortController()
    const { signal } = abortController

    loading.value = true
    try {
      const response = await eventService.getMyEvents({ signal })
      if (seq !== fetchSeq) return
      if (response.success && Array.isArray(response.data)) {
        events.value = response.data
      } else {
        events.value = []
      }
    } catch (error) {
      if (seq !== fetchSeq) return
      if (isCanceledError(error)) return
      console.error('Failed to fetch my events:', error)
      events.value = []
    } finally {
      if (seq === fetchSeq) {
        loading.value = false
      }
    }
  }

  function selectEvent(id) {
    selectedEventId.value = id
  }

  function setPendingEditorEventId(id) {
    pendingEditorEventId.value = id != null ? id : null
  }

  /** Returns the pending id once and clears it (used when the form page mounts). */
  function takePendingEditorEventId() {
    const id = pendingEditorEventId.value
    pendingEditorEventId.value = null
    return id
  }

  function mergeListItem(id, fields) {
    const idx = events.value.findIndex((e) => Number(e.id) === Number(id))
    if (idx === -1) return
    const prev = events.value[idx]
    events.value[idx] = { ...prev, ...fields }
  }

  return {
    events,
    selectedEventId,
    loading,
    fetchMyEvents,
    selectEvent,
    setPendingEditorEventId,
    takePendingEditorEventId,
    mergeListItem,
  }
})
