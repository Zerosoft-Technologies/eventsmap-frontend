<template>
  <div ref="rootEl" id="manage-subscription" :class="embedded ? '' : 'tw:mt-8'">
    <header
      v-if="!embedded"
      class="tw:flex tw:flex-col tw:md:flex-row tw:md:items-center tw:md:justify-between tw:gap-4 tw:mb-6"
    >
      <div>
        <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:tracking-tight">
          Subscription &amp; billing
        </h3>
        <p class="tw:text-sm tw:text-gray-500 tw:mt-0.5">Your plan, payment details, and billing address.</p>
      </div>
      <button
        type="button"
        class="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-600 tw:px-3 tw:py-2 tw:rounded-lg tw:border tw:border-gray-200/80 tw:bg-white hover:tw:bg-gray-50 disabled:tw:opacity-50 tw:transition-colors"
        :disabled="loading"
        @click="loadSubscription"
      >
        <RefreshCw :class="['tw:w-4 tw:h-4', loading ? 'tw:animate-spin' : '']" />
        Refresh
      </button>
    </header>

    <div v-else class="tw:flex tw:items-center tw:justify-end tw:mb-5">
      <button
        type="button"
        class="tw:flex tw:items-center tw:gap-1.5 tw:text-sm tw:font-medium tw:text-gray-500 hover:tw:text-gray-800 disabled:tw:opacity-50 tw:transition-colors"
        :disabled="loading"
        @click="loadSubscription"
      >
        <RefreshCw :class="['tw:w-3.5 tw:h-3.5', loading ? 'tw:animate-spin' : '']" />
        Refresh
      </button>
    </div>

    <div v-if="loadError && !overview" class="tw:rounded-2xl tw:border tw:border-red-100 tw:bg-red-50/50 tw:p-8 tw:text-center">
      <p class="tw:text-sm tw:text-red-700 tw:mb-4">{{ loadError }}</p>
      <button
        type="button"
        class="tw:text-sm tw:font-medium tw:text-[#2563eb] hover:tw:underline"
        @click="loadSubscription"
      >
        Try again
      </button>
    </div>

    <div
      v-else-if="loading && !overview"
      class="tw:rounded-2xl tw:border tw:border-gray-100 tw:bg-white tw:p-16 tw:text-center"
    >
      <Loader2 class="tw:w-7 tw:h-7 tw:text-gray-300 tw:animate-spin tw:mx-auto tw:mb-3" />
      <p class="tw:text-sm tw:text-gray-400">Loading billing details…</p>
    </div>

    <template v-else-if="overview">
      <!-- Alerts -->
      <div
        v-if="overview.account.requires_payment || overview.actions.can_retry_payment"
        class="tw:mb-6 tw:flex tw:flex-col tw:sm:flex-row tw:sm:items-center tw:justify-between tw:gap-4 tw:rounded-2xl tw:border tw:border-red-100 tw:bg-gradient-to-r tw:from-red-50/80 tw:to-white tw:px-5 tw:py-4"
      >
        <div class="tw:flex tw:gap-3 tw:items-start">
          <span class="tw:flex tw:h-9 tw:w-9 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-red-100">
            <AlertTriangle class="tw:w-4 tw:h-4 tw:text-red-600" />
          </span>
          <div>
            <p class="tw:text-sm tw:font-semibold tw:text-gray-900">Payment required</p>
            <p class="tw:text-xs tw:text-gray-500 tw:mt-0.5">Complete payment to restore premium access.</p>
          </div>
        </div>
        <button
          v-if="overview.actions.can_retry_payment"
          type="button"
          class="no-hover tw:shrink-0 tw:rounded-xl tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white tw:shadow-sm"
          style="background-color: var(--primary-color)"
          :disabled="retryingPayment"
          @click="handleRetryPayment"
        >
          {{ retryingPayment ? 'Preparing…' : 'Complete payment' }}
        </button>
      </div>

      <div
        v-if="overview.subscription?.cancel_at_period_end"
        class="tw:mb-6 tw:flex tw:gap-3 tw:items-start tw:rounded-2xl tw:border tw:border-amber-100 tw:bg-amber-50/40 tw:px-5 tw:py-4"
      >
        <span class="tw:flex tw:h-9 tw:w-9 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-amber-100">
          <AlertTriangle class="tw:w-4 tw:h-4 tw:text-amber-700" />
        </span>
        <p class="tw:text-sm tw:text-gray-700 tw:pt-1.5">
          <span class="tw:font-semibold tw:text-gray-900">Cancellation scheduled.</span>
          Premium access until
          {{ formatSubscriptionDate(subscriptionPeriodEnd(overview.subscription)) }}.
        </p>
      </div>

      <p
        v-if="retryPaymentError"
        class="tw:mb-6 tw:text-sm tw:text-red-600 tw:rounded-xl tw:bg-red-50 tw:px-4 tw:py-3"
      >
        {{ retryPaymentError }}
      </p>

      <!-- Plan summary -->
      <section class="tw:rounded-2xl tw:border tw:border-gray-200/80 tw:bg-white tw:shadow-sm tw:overflow-hidden tw:mb-6">
        <div
          class="tw:px-6 tw:py-5 tw:border-b tw:border-gray-100 tw:bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_55%,#fffbeb_100%)]"
        >
          <div class="tw:flex tw:flex-col tw:sm:flex-row tw:sm:items-end tw:sm:justify-between tw:gap-4">
            <div class="tw:min-w-0">
              <p class="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-widest tw:text-gray-400 tw:mb-1">
                Current plan
              </p>
              <h4 class="tw:text-2xl tw:md:text-[1.65rem] tw:font-bold tw:text-gray-900 tw:tracking-tight tw:truncate">
                {{ subscriptionPlanName(overview.subscription) }}
              </h4>
              <p class="tw:text-sm tw:text-gray-500 tw:mt-1">
                {{ subscriptionIntervalLabel(subscriptionInterval(overview.subscription)) }}
                <span class="tw:text-gray-300">·</span>
                <span class="tw:capitalize">{{ overview.account.account_type }}</span>
              </p>
            </div>
            <div class="tw:flex tw:items-center tw:gap-3 tw:shrink-0">
              <p
                v-if="subscriptionAmount(overview.subscription) > 0"
                class="tw:text-3xl tw:font-bold tw:text-gray-900 tw:tabular-nums"
              >
                {{
                  formatSubscriptionAmount(
                    subscriptionAmount(overview.subscription),
                    subscriptionCurrency(overview.subscription)
                  )
                }}
              </p>
              <span
                :class="[
                  'tw:inline-flex tw:px-3 tw:py-1.5 tw:rounded-full tw:text-xs tw:font-semibold',
                  statusBadgeClass(displayStatus),
                ]"
              >
                {{ displayStatusLabel }}
              </span>
            </div>
          </div>
        </div>

        <div class="tw:px-6 tw:py-5">
          <dl class="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-4 tw:gap-4">
            <div class="metric-tile">
              <dt class="metric-tile__label">
                <Calendar class="tw:w-3.5 tw:h-3.5" />
                {{ overview.subscription?.cancel_at_period_end ? 'Ends on' : 'Renews on' }}
              </dt>
              <dd class="metric-tile__value">
                {{ formatSubscriptionDate(subscriptionPeriodEnd(overview.subscription)) }}
              </dd>
            </div>
            <div class="metric-tile">
              <dt class="metric-tile__label">
                <Repeat class="tw:w-3.5 tw:h-3.5" />
                Billing cycle
              </dt>
              <dd class="metric-tile__value">
                {{ subscriptionIntervalLabel(subscriptionInterval(overview.subscription)) }}
              </dd>
            </div>
            <div class="metric-tile">
              <dt class="metric-tile__label">
                <ShieldCheck class="tw:w-3.5 tw:h-3.5" />
                Account
              </dt>
              <dd class="metric-tile__value tw:capitalize">
                {{ overview.account.is_premium_active ? 'Premium active' : overview.account.status }}
              </dd>
            </div>
            <div class="metric-tile">
              <dt class="metric-tile__label">
                <CreditCard class="tw:w-3.5 tw:h-3.5" />
                Payment method
              </dt>
              <dd class="metric-tile__value tw:capitalize">
                <template v-if="paymentMethodLast4(overview.payment_method)">
                  {{ paymentMethodBrand(overview.payment_method) || 'Card' }}
                  ····{{ paymentMethodLast4(overview.payment_method) }}
                </template>
                <template v-else>—</template>
              </dd>
            </div>
          </dl>

          <p
            v-if="overview.subscription?.trial_end"
            class="tw:mt-4 tw:text-xs tw:text-gray-500 tw:flex tw:items-center tw:gap-1.5"
          >
            <Sparkles class="tw:w-3.5 tw:h-3.5 tw:text-amber-500" />
            Trial ends {{ formatSubscriptionDate(overview.subscription.trial_end) }}
          </p>
        </div>
      </section>

      <!-- Billing profile -->
      <section
        v-if="hasBillingProfile"
        class="tw:rounded-2xl tw:border tw:border-gray-200/80 tw:bg-white tw:shadow-sm tw:overflow-hidden"
      >
        <div class="tw:px-6 tw:py-4 tw:border-b tw:border-gray-100 tw:flex tw:items-center tw:gap-2">
          <Building2 class="tw:w-4 tw:h-4 tw:text-gray-400" />
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-900">Billing profile</h4>
        </div>
        <div class="tw:px-6 tw:py-5">
          <dl class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-x-10 tw:gap-y-5">
            <div v-if="overview.billing.billing_type" class="billing-row">
              <dt class="billing-row__label">Account type</dt>
              <dd class="billing-row__value">{{ formatBillingType(overview.billing.billing_type) }}</dd>
            </div>
            <div v-if="formatBillingName(overview.billing)" class="billing-row">
              <dt class="billing-row__label">Legal name</dt>
              <dd class="billing-row__value">{{ formatBillingName(overview.billing) }}</dd>
            </div>
            <div v-if="overview.billing.vat_number" class="billing-row">
              <dt class="billing-row__label">VAT number</dt>
              <dd class="billing-row__value billing-row__value--mono">{{ overview.billing.vat_number }}</dd>
            </div>
            <div
              v-if="formatBillingAddress(overview.billing)"
              class="billing-row tw:md:col-span-2"
            >
              <dt class="billing-row__label">
                <span class="tw:inline-flex tw:items-center tw:gap-1.5">
                  <MapPin class="tw:w-3.5 tw:h-3.5 tw:text-gray-400" />
                  Billing address
                </span>
              </dt>
              <dd class="billing-row__value">{{ formatBillingAddress(overview.billing) }}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div
        v-else-if="overview.account.is_premium"
        class="tw:mt-6 tw:rounded-2xl tw:border tw:border-dashed tw:border-gray-200 tw:bg-gray-50/50 tw:px-6 tw:py-8 tw:text-center"
      >
        <Building2 class="tw:w-8 tw:h-8 tw:text-gray-300 tw:mx-auto tw:mb-2" />
        <p class="tw:text-sm tw:text-gray-500">No billing profile on file yet.</p>
      </div>

      <p
        v-if="overview.actions.can_view_invoices"
        class="tw:mt-6 tw:text-center"
      >
        <button
          type="button"
          class="no-hover tw:inline-flex tw:items-center tw:gap-1.5 tw:text-sm tw:font-medium tw:text-[#2563eb] hover:tw:underline"
          @click="emit('view-invoices')"
        >
          <FileText class="tw:w-4 tw:h-4" />
          View invoice history
        </button>
      </p>
    </template>

    <PaymentLoadingOverlay :visible="retryingPayment" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  AlertTriangle,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  RefreshCw,
  Repeat,
  ShieldCheck,
  Sparkles,
} from 'lucide-vue-next'
import api from '@/services/api'
import {
  fetchSubscription,
  formatBillingAddress,
  formatBillingName,
  formatBillingType,
  formatSubscriptionAmount,
  formatSubscriptionDate,
  subscriptionIntervalLabel,
  subscriptionPlanName,
  subscriptionAmount,
  subscriptionCurrency,
  subscriptionInterval,
  subscriptionPeriodEnd,
  paymentMethodBrand,
  paymentMethodLast4,
  accountStatusLabel,
  subscriptionStatusLabel,
  SubscriptionApiError,
  type SubscriptionOverview,
} from '@/api/subscription'
import PaymentLoadingOverlay from '@/components/ui/PaymentLoadingOverlay.vue'

const props = withDefaults(
  defineProps<{
    embedded?: boolean
    active?: boolean
  }>(),
  { embedded: false, active: true }
)

const emit = defineEmits<{
  'view-invoices': []
}>()

const rootEl = ref<HTMLElement | null>(null)
const overview = ref<SubscriptionOverview | null>(null)
const loading = ref(false)
const loadError = ref<string | null>(null)
const retryingPayment = ref(false)
const retryPaymentError = ref<string | null>(null)
const hasLoaded = ref(false)

const hasBillingProfile = computed(() => {
  const b = overview.value?.billing
  if (!b) return false
  return Boolean(
    b.billing_type || formatBillingName(b) || b.vat_number || formatBillingAddress(b)
  )
})

const displayStatus = computed(() => {
  const o = overview.value
  if (!o) return 'active'
  if (o.account.requires_payment) return 'past_due'
  return o.subscription?.status ?? o.account.status
})

const displayStatusLabel = computed(() => {
  const o = overview.value
  if (!o) return 'Active'
  if (o.account.requires_payment) return accountStatusLabel(o.account)
  if (o.subscription?.status) return subscriptionStatusLabel(o.subscription.status)
  return accountStatusLabel(o.account)
})

async function loadSubscription() {
  loading.value = true
  loadError.value = null
  retryPaymentError.value = null
  try {
    overview.value = await fetchSubscription()
    hasLoaded.value = true
  } catch (err) {
    overview.value = null
    loadError.value =
      err instanceof SubscriptionApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Failed to load subscription details'
  } finally {
    loading.value = false
  }
}

async function handleRetryPayment() {
  retryingPayment.value = true
  retryPaymentError.value = null
  try {
    const response = await api.post<{ checkout_url?: string; data?: { checkout_url?: string } }>(
      'payment/retry'
    )
    const url =
      response.data.checkout_url ??
      (response.data as { data?: { checkout_url?: string } }).data?.checkout_url
    if (url) {
      window.location.href = url
      return
    }
    retryPaymentError.value = 'Unable to create payment session. Please try again.'
  } catch {
    retryPaymentError.value = 'Failed to initiate payment. Please try again or contact support.'
  } finally {
    retryingPayment.value = false
  }
}

function statusBadgeClass(status: string): string {
  const s = (status || '').toLowerCase()
  if (s === 'active' || s === 'trialing') {
    return 'tw:bg-emerald-50 tw:text-emerald-700 tw:ring-1 tw:ring-emerald-600/15'
  }
  if (s === 'past_due' || s === 'unpaid' || s === 'pending_payment') {
    return 'tw:bg-red-50 tw:text-red-700 tw:ring-1 tw:ring-red-600/15'
  }
  if (s === 'canceled' || s === 'cancelled') return 'tw:bg-gray-100 tw:text-gray-600'
  return 'tw:bg-amber-50 tw:text-amber-800 tw:ring-1 tw:ring-amber-600/15'
}

watch(
  () => props.active,
  (isActive) => {
    if (isActive && !hasLoaded.value && !loading.value) {
      loadSubscription()
    }
  },
  { immediate: true }
)

function scrollIntoView() {
  rootEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

defineExpose({
  refresh: loadSubscription,
  scrollIntoView,
  getOverview: () => overview.value,
})
</script>

<style scoped>
.metric-tile {
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  background: rgb(249 250 251);
  border: 1px solid rgb(243 244 246);
}
.metric-tile__label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgb(156 163 175);
  margin-bottom: 0.375rem;
}
.metric-tile__value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgb(17 24 39);
  line-height: 1.35;
}

.billing-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid rgb(243 244 246);
}
.billing-row:last-child {
  border-bottom: none;
}
@media (min-width: 768px) {
  .billing-row {
    border-bottom: none;
    padding-bottom: 0;
  }
}
.billing-row__label {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(107 114 128);
}
.billing-row__value {
  font-size: 0.9375rem;
  font-weight: 500;
  color: rgb(17 24 39);
  line-height: 1.45;
}
.billing-row__value--mono {
  font-family: ui-monospace, monospace;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
}
</style>
