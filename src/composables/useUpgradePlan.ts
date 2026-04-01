import { ref, nextTick } from 'vue'
import api from '@/services/api'

export interface BillingState {
  type: 'private' | 'business' | ''
  fullName: string
  companyName: string
  vatNumber: string
  country: string
  address: string
  postalCode: string
  city: string
  vatValidated: boolean
}

interface UpgradeResponse {
  checkout_url: string
}

/**
 * Shared billing + upgrade composable.
 * Used by both Register.vue (step 2/3) and PlanManagement.vue.
 * Keeps plan upgrade logic in one place — single source of truth.
 */
export function useUpgradePlan() {
  const billing = ref<BillingState>({
    type: '',
    fullName: '',
    companyName: '',
    vatNumber: '',
    country: '',
    address: '',
    postalCode: '',
    city: '',
    vatValidated: false,
  })

  const billingErrors = ref<Record<string, string>>({})
  const vatValidating = ref(false)
  const vatValidationState = ref<'idle' | 'valid' | 'invalid'>('idle')
  const redirectingToStripe = ref(false)
  const submitError = ref<string | null>(null)
  const submitting = ref(false)

  // Element refs for focus-on-error
  const el_fullName    = ref<HTMLInputElement | null>(null)
  const el_companyName = ref<HTMLInputElement | null>(null)
  const el_vatNumber   = ref<HTMLInputElement | null>(null)
  const el_country     = ref<HTMLInputElement | null>(null)
  const el_address     = ref<HTMLInputElement | null>(null)
  const el_postalCode  = ref<HTMLInputElement | null>(null)
  const el_city        = ref<HTMLInputElement | null>(null)

  function clearBillingError(field: string) {
    delete billingErrors.value[field]
  }

  function onVatInput() {
    clearBillingError('vatNumber')
    vatValidationState.value = 'idle'
    billing.value.vatValidated = false
  }

  function isValidVatFormat(vat: string): boolean {
    return /^[A-Z]{2}[0-9A-Z]{2,12}$/.test(vat.toUpperCase().replace(/\s/g, ''))
  }

  async function validateVat() {
    if (!billing.value.vatNumber) return
    vatValidating.value = true
    await new Promise(r => setTimeout(r, 500))
    const valid = isValidVatFormat(billing.value.vatNumber)
    vatValidationState.value = valid ? 'valid' : 'invalid'
    billing.value.vatValidated = valid
    vatValidating.value = false
    if (!valid) billingErrors.value.vatNumber = 'Invalid VAT number. Please check and try again.'
  }

  function validateBillingType(): boolean {
    if (!billing.value.type) {
      billingErrors.value.type = 'Please select a billing type to continue.'
      return false
    }
    delete billingErrors.value.type
    return true
  }

  function validateBillingDetails(): boolean {
    const e: Record<string, string> = {}
    const b = billing.value

    // Alphabetic validation regex (allows letters, spaces, hyphens, apostrophes)
    const alphabeticRegex = /^[A-Za-z\s\-']+$/
    // Numeric validation regex
    const numericRegex = /^[0-9]+$/

    if (b.type === 'private') {
      if (!b.fullName.trim()) e.fullName = 'Full name is required.'
      else if (!alphabeticRegex.test(b.fullName.trim())) e.fullName = 'Full name must contain only alphabetic characters.'
    } else {
      if (!b.companyName.trim()) e.companyName = 'Company name is required.'
      else if (!alphabeticRegex.test(b.companyName.trim())) e.companyName = 'Company name must contain only alphabetic characters.'
      if (!b.vatNumber.trim())   e.vatNumber   = 'VAT number is required.'
      else if (vatValidationState.value !== 'valid') e.vatNumber = 'Please enter a valid VAT number.'
    }

    if (!b.country.trim())    e.country    = 'Country is required.'
    else if (!alphabeticRegex.test(b.country.trim())) e.country = 'Country must contain only alphabetic characters.'
    if (!b.address.trim())    e.address    = 'Address is required.'
    if (!b.postalCode.trim()) e.postalCode = 'Postal code is required.'
    else if (!numericRegex.test(b.postalCode.trim())) e.postalCode = 'Postal code must contain only numbers.'
    if (!b.city.trim())       e.city       = 'City is required.'
    else if (!alphabeticRegex.test(b.city.trim())) e.city = 'City must contain only alphabetic characters.'

    billingErrors.value = e

    if (Object.keys(e).length > 0) {
      nextTick(() => {
        const map: Record<string, typeof el_fullName> = {
          fullName:    el_fullName,
          companyName: el_companyName,
          vatNumber:   el_vatNumber,
          country:     el_country,
          address:     el_address,
          postalCode:  el_postalCode,
          city:        el_city,
        }
        const first = Object.keys(e)[0] as string
        map[first]?.value?.focus()
      })
      return false
    }
    return true
  }

  /**
   * Submits upgrade request for an already-registered user.
   * Calls POST /api/user/upgrade-plan with billing details.
   * On success: redirects to Stripe checkout_url.
   */
  async function submitUpgrade(): Promise<boolean> {
    if (billing.value.type === 'business' && billing.value.vatNumber && vatValidationState.value === 'idle') {
      await validateVat()
    }
    if (!validateBillingDetails()) return false

    submitting.value = true
    redirectingToStripe.value = true
    submitError.value = null

    const payload: Record<string, unknown> = {
      billing_type: billing.value.type,
      country:      billing.value.country,
      address:      billing.value.address,
      postal_code:  billing.value.postalCode,
      city:         billing.value.city,
    }

    if (billing.value.type === 'private') {
      payload.full_name    = billing.value.fullName
      payload.company_name = null
      payload.vat_number   = null
    } else {
      payload.company_name  = billing.value.companyName
      payload.vat_number    = billing.value.vatNumber
      payload.vat_validated = billing.value.vatValidated
    }

    try {
      const response = await api.post<UpgradeResponse>('user/upgrade-plan', payload)
      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url
        return true
      }
      throw new Error('No checkout URL received.')
    } catch (err: unknown) {
      redirectingToStripe.value = false
      submitting.value = false
      const axiosErr = err as { response?: { data?: { message?: string } } }
      submitError.value = axiosErr.response?.data?.message || 'Failed to initiate upgrade. Please try again.'
      return false
    }
  }

  // Style helpers (same as Register.vue — single source)
  function inputClass(hasError?: string): string[] {
    return [
      'tw:w-full tw:border tw:rounded-lg tw:px-4 tw:py-2.5 tw:outline-none tw:transition',
      hasError
        ? 'tw:border-red-400 tw:bg-red-50 focus:tw:border-red-400'
        : 'tw:border-gray-300 focus:tw:border-[var(--secondary-color)]',
    ]
  }

  function billingTypeCardClass(active: boolean): string[] {
    return [
      'no-hover tw:w-full tw:flex tw:items-center tw:gap-4 tw:p-4 tw:rounded-xl tw:border-2 tw:transition-all tw:duration-200 tw:text-left',
      active ? 'tw:border-[var(--primary-color)] tw:bg-blue-50' : 'tw:border-gray-200 hover:tw:border-gray-300',
    ]
  }

  function radioCircleClass(active: boolean): string[] {
    return [
      'tw:w-5 tw:h-5 tw:flex-shrink-0',
      'tw:rounded-full tw:border-2 tw:flex tw:items-center tw:justify-center tw:transition-all',
      active ? 'tw:border-[var(--primary-color)]' : 'tw:border-gray-300',
    ]
  }

  function resetBilling() {
    billing.value = {
      type: '',
      fullName: '',
      companyName: '',
      vatNumber: '',
      country: '',
      address: '',
      postalCode: '',
      city: '',
      vatValidated: false,
    }
    billingErrors.value = {}
    vatValidationState.value = 'idle'
    vatValidating.value = false
    submitError.value = null
    submitting.value = false
    redirectingToStripe.value = false
  }

  return {
    // State
    billing,
    billingErrors,
    vatValidating,
    vatValidationState,
    redirectingToStripe,
    submitError,
    submitting,
    // Element refs
    el_fullName,
    el_companyName,
    el_vatNumber,
    el_country,
    el_address,
    el_postalCode,
    el_city,
    // Methods
    clearBillingError,
    onVatInput,
    validateVat,
    validateBillingType,
    validateBillingDetails,
    submitUpgrade,
    resetBilling,
    // Style helpers
    inputClass,
    billingTypeCardClass,
    radioCircleClass,
  }
}
