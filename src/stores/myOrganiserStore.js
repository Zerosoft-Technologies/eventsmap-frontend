import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import eventService from '@/services/eventService'

export const useMyOrganiserStore = defineStore('myOrganisers', () => {
  const organisers = ref([])
  const selectedOrganiserId = ref(null)
  /** Set before navigating to the organiser form from a sub-route */
  const pendingEditorOrganiserId = ref(null)
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

  async function fetchMyOrganisers() {
    fetchSeq += 1
    const seq = fetchSeq

    if (abortController) {
      abortController.abort()
    }
    abortController = new AbortController()
    const { signal } = abortController

    loading.value = true
    try {
      const response = await eventService.getMyOrganisers({ signal })
      if (seq !== fetchSeq) return
      if (response.success && Array.isArray(response.data)) {
        organisers.value = response.data
      } else {
        organisers.value = []
      }
    } catch (error) {
      if (seq !== fetchSeq) return
      if (isCanceledError(error)) return
      console.error('Failed to fetch my organisers:', error)
      organisers.value = []
    } finally {
      if (seq === fetchSeq) {
        loading.value = false
      }
    }
  }

  function selectOrganiser(id) {
    selectedOrganiserId.value = id
  }

  function setPendingEditorOrganiserId(id) {
    pendingEditorOrganiserId.value = id != null ? Number(id) : null
  }

  /** Returns the pending id once and clears it (used when the form page mounts). */
  function takePendingEditorOrganiserId() {
    const id = pendingEditorOrganiserId.value
    pendingEditorOrganiserId.value = null
    return id
  }

  return {
    organisers,
    selectedOrganiserId,
    loading,
    fetchMyOrganisers,
    selectOrganiser,
    setPendingEditorOrganiserId,
    takePendingEditorOrganiserId,
  }
})
