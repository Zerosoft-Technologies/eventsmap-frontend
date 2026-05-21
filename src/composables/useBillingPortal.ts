import { ref } from 'vue'
import {
  createBillingPortalSession,
  SubscriptionApiError,
} from '@/api/subscription'

/**
 * Opens Stripe Customer Portal for subscription self-service
 * (payment method, cancel, plan changes — configured in Stripe Dashboard).
 */
export function useBillingPortal() {
  const openingPortal = ref(false)
  const portalError = ref<string | null>(null)

  async function openBillingPortal(returnUrl?: string): Promise<boolean> {
    openingPortal.value = true
    portalError.value = null
    try {
      const url = await createBillingPortalSession(returnUrl)
      window.location.href = url
      return true
    } catch (err) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      portalError.value =
        err instanceof SubscriptionApiError
          ? err.message
          : axiosErr.response?.data?.message ||
            'Unable to open billing portal. Please try again or contact support.'
      openingPortal.value = false
      return false
    }
  }

  function clearPortalError() {
    portalError.value = null
  }

  return {
    openingPortal,
    portalError,
    openBillingPortal,
    clearPortalError,
  }
}
