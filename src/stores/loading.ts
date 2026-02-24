import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  // State
  const isLoading = ref(false)
  const progress = ref(0)
  const activeRequests = ref(0)
  const isPageLoading = ref(false)
  const isAuthChecking = ref(true)

  // Progress simulation interval
  let progressInterval: ReturnType<typeof setInterval> | null = null

  // Computed
  const showProgressBar = computed(() => isLoading.value || isPageLoading.value)

  // Start loading with progress simulation
  function startLoading() {
    activeRequests.value++
    
    if (activeRequests.value === 1) {
      isLoading.value = true
      progress.value = 20

      // Clear any existing interval
      if (progressInterval) {
        clearInterval(progressInterval)
      }

      // Simulate progress - slowly increase while waiting
      progressInterval = setInterval(() => {
        if (progress.value < 90) {
          // Slow down as we approach 90%
          const increment = Math.max(1, (90 - progress.value) / 10)
          progress.value = Math.min(90, progress.value + increment)
        }
      }, 200)
    }
  }

  // Complete loading
  function stopLoading() {
    activeRequests.value = Math.max(0, activeRequests.value - 1)

    if (activeRequests.value === 0) {
      // Clear progress interval
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }

      // Complete to 100%
      progress.value = 100

      // Hide after short delay for smooth animation
      setTimeout(() => {
        if (activeRequests.value === 0) {
          isLoading.value = false
          progress.value = 0
        }
      }, 300)
    }
  }

  // Force stop all loading (for error cases)
  function forceStop() {
    activeRequests.value = 0
    
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }

    progress.value = 100

    setTimeout(() => {
      isLoading.value = false
      progress.value = 0
    }, 300)
  }

  // Page navigation loading
  function startPageLoading() {
    isPageLoading.value = true
    progress.value = 20
  }

  function stopPageLoading() {
    progress.value = 100
    
    setTimeout(() => {
      isPageLoading.value = false
      if (!isLoading.value) {
        progress.value = 0
      }
    }, 300)
  }

  // Auth checking state
  function setAuthChecking(value: boolean) {
    isAuthChecking.value = value
  }

  // Reset state (useful for cleanup)
  function reset() {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
    isLoading.value = false
    progress.value = 0
    activeRequests.value = 0
    isPageLoading.value = false
  }

  return {
    // State
    isLoading,
    progress,
    activeRequests,
    isPageLoading,
    isAuthChecking,
    
    // Computed
    showProgressBar,
    
    // Actions
    startLoading,
    stopLoading,
    forceStop,
    startPageLoading,
    stopPageLoading,
    setAuthChecking,
    reset
  }
})
