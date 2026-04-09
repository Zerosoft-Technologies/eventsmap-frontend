import { defineStore } from 'pinia'
import { ref } from 'vue'
import TalentService from '@/services/TalentService'

export const useMyTalentStore = defineStore('myTalents', () => {
  const talents = ref([])
  const selectedTalentId = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchMyTalents() {
    loading.value = true
    error.value = null
    try {
      const response = await TalentService.getMyTalents()
      if (response.success && Array.isArray(response.data)) {
        talents.value = response.data
      } else {
        talents.value = []
      }
    } catch (err) {
      console.error('Failed to fetch my talents:', err)
      error.value = err?.response?.data?.message || err?.message || 'Failed to load talents'
      talents.value = []
    } finally {
      loading.value = false
    }
  }

  function selectTalent(id) {
    selectedTalentId.value = id
  }

  return {
    talents,
    selectedTalentId,
    loading,
    error,
    fetchMyTalents,
    selectTalent,
  }
})
