import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import eventService from '@/services/eventService'

export const useWishlistStore = defineStore('wishlistStore', () => {
  // ── State ──────────────────────────────────────────────
  const wishlistEvents = ref([])
  const wishlistedIds = ref(new Set())
  const loading = ref(false)
  const error = ref(null)
  const fetched = ref(false)

  // ── Getters ────────────────────────────────────────────
  function isWishlisted(eventId) {
    return wishlistedIds.value.has(eventId)
  }

  const count = computed(() => wishlistEvents.value.length)

  // ── Actions ────────────────────────────────────────────

  /**
   * Fetch all wishlist events from backend
   */
  async function fetchWishlist() {
    loading.value = true
    error.value = null
    try {
      const response = await eventService.getWishlistEvents()
      wishlistEvents.value = response.data || []
      // Rebuild the ID set
      wishlistedIds.value = new Set(wishlistEvents.value.map(e => e.id))
      fetched.value = true
    } catch (err) {
      error.value = err
      console.error('Error fetching wishlist:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Toggle wishlist for an event (optimistic UI)
   * @param {Object} event - Full event object (needed to add to local list)
   * @returns {boolean|null} - New wishlisted state, or null on error
   */
  async function toggleWishlist(event) {
    const eventId = event.id
    const wasWishlisted = wishlistedIds.value.has(eventId)

    // Optimistic update
    if (wasWishlisted) {
      wishlistedIds.value.delete(eventId)
      wishlistedIds.value = new Set(wishlistedIds.value)
      wishlistEvents.value = wishlistEvents.value.filter(e => e.id !== eventId)
    } else {
      wishlistedIds.value.add(eventId)
      wishlistedIds.value = new Set(wishlistedIds.value)
      wishlistEvents.value = [...wishlistEvents.value, event]
    }

    try {
      const response = await eventService.toggleWishlist(eventId)
      const isNowWishlisted = response.data.is_wishlisted

      // If server disagrees with optimistic update, correct it
      if (isNowWishlisted !== !wasWishlisted) {
        // Refetch to get accurate state
        await fetchWishlist()
      }

      return isNowWishlisted
    } catch (err) {
      console.error('Error toggling wishlist:', err)

      // Rollback optimistic update
      if (wasWishlisted) {
        wishlistedIds.value.add(eventId)
        wishlistedIds.value = new Set(wishlistedIds.value)
        wishlistEvents.value = [...wishlistEvents.value, event]
      } else {
        wishlistedIds.value.delete(eventId)
        wishlistedIds.value = new Set(wishlistedIds.value)
        wishlistEvents.value = wishlistEvents.value.filter(e => e.id !== eventId)
      }

      return null
    }
  }

  /**
   * Clear wishlist state (e.g. on logout)
   */
  function clearWishlist() {
    wishlistEvents.value = []
    wishlistedIds.value = new Set()
    fetched.value = false
    error.value = null
  }

  return {
    // state
    wishlistEvents,
    wishlistedIds,
    loading,
    error,
    fetched,
    // getters
    isWishlisted,
    count,
    // actions
    fetchWishlist,
    toggleWishlist,
    clearWishlist,
  }
})
