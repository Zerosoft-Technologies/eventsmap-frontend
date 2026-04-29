import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import TalentService from '@/services/TalentService'

export const useMyTalentStore = defineStore('myTalents', () => {
  const talents = ref([])
  const selectedTalentId = ref(null)
  /** Set before navigating to the talent form from a sub-route */
  const pendingEditorTalentId = ref(null)
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

  async function fetchMyTalents() {
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
      const response = await TalentService.getMyTalents({ signal })
      if (seq !== fetchSeq) return
      if (response.success && Array.isArray(response.data)) {
        talents.value = response.data
      } else {
        talents.value = []
      }
    } catch (err) {
      if (seq !== fetchSeq) return
      if (isCanceledError(err)) return
      console.error('Failed to fetch my talents:', err)
      error.value = err?.response?.data?.message || err?.message || 'Failed to load talents'
      talents.value = []
    } finally {
      if (seq === fetchSeq) {
        loading.value = false
      }
    }
  }

  function selectTalent(id) {
    selectedTalentId.value = id
  }

  function setPendingEditorTalentId(id) {
    pendingEditorTalentId.value = id != null ? Number(id) : null
  }

  function takePendingEditorTalentId() {
    const id = pendingEditorTalentId.value
    pendingEditorTalentId.value = null
    return id
  }

  /** Merge fields into a sidebar list row (e.g. after PATCH …/status). */
  function mergeListItem(id, fields) {
    const idx = talents.value.findIndex((t) => Number(t.id) === Number(id))
    if (idx === -1) return
    const prev = talents.value[idx]
    talents.value[idx] = { ...prev, ...fields }
  }

  return {
    talents,
    selectedTalentId,
    loading,
    error,
    fetchMyTalents,
    selectTalent,
    setPendingEditorTalentId,
    takePendingEditorTalentId,
    mergeListItem,
  }
})
