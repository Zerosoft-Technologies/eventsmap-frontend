import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import eventService from '@/services/eventService'
import { useToast } from '@/composables/useToast'

export const useWishlistStore = defineStore('wishlistStore', () => {
  // ── State ──────────────────────────────────────────────
  const wishlistEvents = ref([])
  const wishlistedIds = ref(new Set())
  /** Event IDs with an in-flight wishlist toggle (ignore duplicate clicks). */
  const pendingWishlistIds = ref(new Set())
  const loading = ref(false)
  const error = ref(null)
  const fetched = ref(false)

  // ── Getters ────────────────────────────────────────────
  function isWishlisted(eventId) {
    return wishlistedIds.value.has(eventId)
  }

  function isWishlistPending(eventId) {
    return pendingWishlistIds.value.has(eventId)
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
   * Toggle wishlist for an event (optimistic UI + rollback + toast on failure).
   * @param {Object} event - Full event object (needed to add to local list)
   * @returns {Promise<boolean|undefined|null>} New wishlisted state; `undefined` if skipped (duplicate in-flight); `null` on API failure after rollback
   */
  async function toggleWishlist(event) {
    const eventId = event.id
    if (pendingWishlistIds.value.has(eventId)) {
      return undefined
    }

    pendingWishlistIds.value.add(eventId)
    pendingWishlistIds.value = new Set(pendingWishlistIds.value)

    const wasWishlisted = wishlistedIds.value.has(eventId)

    // Optimistic update (instant UI)
    if (wasWishlisted) {
      wishlistedIds.value.delete(eventId)
      wishlistedIds.value = new Set(wishlistedIds.value)
      wishlistEvents.value = wishlistEvents.value.filter(e => e.id !== eventId)
    } else {
      wishlistedIds.value.add(eventId)
      wishlistedIds.value = new Set(wishlistedIds.value)
      wishlistEvents.value = [...wishlistEvents.value, event]
    }

    const toast = useToast()

    try {
      const response = await eventService.toggleWishlist(eventId)
      const isNowWishlisted = response.data.is_wishlisted

      // If server disagrees with optimistic update, correct it
      if (isNowWishlisted !== !wasWishlisted) {
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

      let raw =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message
      if (Array.isArray(raw)) raw = raw[0]
      const finalMsg =
        typeof raw === 'string' && raw.trim() ? raw.trim() : 'Something went wrong'
      toast.error(finalMsg)

      return null
    } finally {
      pendingWishlistIds.value.delete(eventId)
      pendingWishlistIds.value = new Set(pendingWishlistIds.value)
    }
  }

  /**
   * Clear wishlist state (e.g. on logout)
   */
  function clearWishlist() {
    wishlistEvents.value = []
    wishlistedIds.value = new Set()
    pendingWishlistIds.value = new Set()
    fetched.value = false
    error.value = null
  }

  return {
    // state
    wishlistEvents,
    wishlistedIds,
    pendingWishlistIds,
    loading,
    error,
    fetched,
    // getters
    isWishlisted,
    isWishlistPending,
    count,
    // actions
    fetchWishlist,
    toggleWishlist,
    clearWishlist,
  }
})
