<template>
  <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:px-4">

    <!-- Processing State -->
    <div v-if="state === 'processing' || state === 'verifying'"
      class="tw:w-full tw:max-w-md tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-8 tw:text-center animate-fade-in">
      <div class="tw:flex tw:justify-center tw:mb-6">
        <svg class="tw:w-16 tw:h-16 tw:animate-spin" style="color: var(--primary-color)" fill="none" viewBox="0 0 24 24">
          <circle class="tw:opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
          <path class="tw:opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <h1 class="tw:text-xl tw:font-bold tw:text-gray-800 tw:mb-2">
        {{ state === 'processing' ? 'Processing Payment...' : 'Confirming with Stripe...' }}
      </h1>
      <p class="tw:text-gray-500 tw:text-sm">
        This usually takes a few seconds. Please don't close this page.
      </p>
      <div class="tw:mt-6 tw:flex tw:justify-center tw:gap-1">
        <span v-for="i in 3" :key="i"
          class="tw:w-2 tw:h-2 tw:rounded-full tw:animate-pulse"
          :style="{ backgroundColor: 'var(--primary-color)', animationDelay: `${i * 200}ms` }" />
      </div>
    </div>

    <!-- Success State -->
    <div v-else-if="state === 'success'"
      class="tw:w-full tw:max-w-md tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-8 tw:text-center animate-fade-in">
      <div class="tw:flex tw:justify-center tw:mb-6">
        <svg class="tw:w-20 tw:h-20 tw:text-green-500" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="4" class="success-circle" />
          <path d="M30 52 L43 65 L70 35" stroke="currentColor" stroke-width="5" fill="none"
            stroke-linecap="round" stroke-linejoin="round" class="success-check" />
        </svg>
      </div>
      <h1 class="tw:text-2xl tw:font-bold tw:text-gray-800 tw:mb-2">Payment Successful!</h1>
      <p class="tw:text-gray-500 tw:text-sm tw:mb-6">
        Your account has been activated. Redirecting to your profile...
      </p>

      <!-- Session Info -->
      <div v-if="sessionId" class="tw:bg-gray-50 tw:rounded-lg tw:p-3 tw:mb-6">
        <p class="tw:text-xs tw:text-gray-400 tw:mb-1">Session ID</p>
        <div class="tw:flex tw:items-center tw:justify-center tw:gap-2">
          <code class="tw:text-xs tw:text-gray-600 tw:break-all">{{ sessionId }}</code>
          <button @click="copyToClipboard(sessionId)"
            class="no-hover tw:text-gray-400 hover:tw:text-gray-600 tw:transition tw:flex-shrink-0"
            :title="copied ? 'Copied!' : 'Copy'">
            <svg v-if="!copied" class="tw:w-4 tw:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-width="2" />
            </svg>
            <svg v-else class="tw:w-4 tw:h-4 tw:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div class="tw:text-sm tw:text-gray-400 tw:mb-4">
        Redirecting in {{ redirectCountdown }}s...
      </div>

      <button @click="goToProfile"
        class="no-hover tw:w-full tw:text-white tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition hover:tw:opacity-90"
        style="background-color: var(--primary-color)">
        Go to my profile
      </button>
    </div>

    <!-- Error State -->
    <div v-else-if="state === 'error'"
      class="tw:w-full tw:max-w-md tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-8 tw:text-center animate-fade-in">
      <div class="tw:flex tw:justify-center tw:mb-6">
        <div class="tw:w-16 tw:h-16 tw:rounded-full tw:bg-red-100 tw:flex tw:items-center tw:justify-center">
          <svg class="tw:w-8 tw:h-8 tw:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
        </div>
      </div>
      <h1 class="tw:text-xl tw:font-bold tw:text-gray-800 tw:mb-2">Payment Verification Failed</h1>

      <div class="tw:bg-red-50 tw:border tw:border-red-300 tw:text-red-700 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-6 tw:text-sm">
        {{ errorMessage }}
      </div>

      <div class="tw:flex tw:flex-col tw:gap-3">
        <button @click="retryVerification"
          class="no-hover tw:w-full tw:text-white tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition hover:tw:opacity-90"
          style="background-color: var(--primary-color)">
          Retry Now
        </button>
        <button @click="router.push('/register')"
          class="no-hover tw:w-full tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition tw:border tw:border-gray-300 tw:text-gray-700 hover:tw:bg-gray-50">
          Back to Register
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getCreateRoute } from '@/utils/routeResolver'
import api from '@/services/api'
import type { User } from '@/stores/auth'
import type { AxiosError } from 'axios'

type PaymentState = 'processing' | 'verifying' | 'success' | 'error'

interface VerifyResponse {
  success: boolean
  token?: string
  user?: User
  payment_status?: string
  message?: string
}

interface VerifyErrorResponse {
  message?: string
  payment_status?: string
}

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const state = ref<PaymentState>('processing')
const errorMessage = ref('Unable to confirm payment. Please try again.')
const sessionId = ref('')
const copied = ref(false)
const redirectCountdown = ref(3)

let attempt = 0
const maxAttempts = 6
let isVerifying = false
let retryTimeout: ReturnType<typeof setTimeout> | null = null
let countdownInterval: ReturnType<typeof setInterval> | null = null

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

function goToProfile() {
  clearTimers()
  router.push(getCreateRoute(authStore.user?.profile_type, authStore.user?.account_type))
}

function clearTimers() {
  if (retryTimeout) {
    clearTimeout(retryTimeout)
    retryTimeout = null
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

function getErrorMessage(error: unknown): string {
  const axiosErr = error as AxiosError<VerifyErrorResponse>
  const status = axiosErr.response?.status
  const data = axiosErr.response?.data
  const msg = data?.message?.toLowerCase() || ''
  const paymentStatus = data?.payment_status

  if (!axiosErr.response) {
    return 'Network issue. Retrying...'
  }
  if (status === 404 || msg.includes('session not found') || msg.includes('not found')) {
    return 'Payment session not found. Please contact support.'
  }
  if (msg.includes('expired')) {
    return 'Payment session has expired. Please try registering again.'
  }
  if (paymentStatus && paymentStatus !== 'paid') {
    return 'Payment is still processing. We will keep checking.'
  }
  if (status === 500 || msg.includes('stripe')) {
    return 'Unable to confirm payment. Please try again.'
  }
  return data?.message || 'Unable to confirm payment. Please try again.'
}

function handleSuccess(data: VerifyResponse) {
  if (data.token) {
    authStore.setToken(data.token)
  }
  if (data.user) {
    authStore.setUser(data.user)
  }

  state.value = 'success'

  redirectCountdown.value = 3
  countdownInterval = setInterval(() => {
    redirectCountdown.value--
    if (redirectCountdown.value <= 0) {
      clearTimers()
      router.push(getCreateRoute(authStore.user?.profile_type, authStore.user?.account_type))
    }
  }, 1000)
}

async function verifyPayment() {
  if (isVerifying) return
  isVerifying = true

  try {
    state.value = 'verifying'

    const response = await api.post<VerifyResponse>('payment/verify', {
      session_id: sessionId.value,
    })

    if (response.data.success) {
      isVerifying = false
      handleSuccess(response.data)
      return
    }

    throw new Error('Not paid yet')
  } catch (error) {
    isVerifying = false
    attempt++

    if (attempt >= maxAttempts) {
      state.value = 'error'
      errorMessage.value = getErrorMessage(error)
      return
    }

    const isNetworkError = !(error as AxiosError).response
    if (isNetworkError && attempt < maxAttempts) {
      errorMessage.value = 'Network issue. Retrying...'
    }

    const delay = Math.pow(2, attempt) * 1000
    retryTimeout = setTimeout(verifyPayment, delay)
  }
}

function retryVerification() {
  attempt = 0
  isVerifying = false
  state.value = 'processing'
  errorMessage.value = 'Unable to confirm payment. Please try again.'
  clearTimers()
  verifyPayment()
}

onMounted(() => {
  const id = route.query.session_id as string
  if (!id) {
    state.value = 'error'
    errorMessage.value = 'No payment session found. Please try registering again.'
    return
  }
  sessionId.value = id
  verifyPayment()
})

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.success-circle {
  stroke-dasharray: 283;
  stroke-dashoffset: 283;
  animation: drawCircle 0.6s ease-out forwards;
}

.success-check {
  stroke-dasharray: 80;
  stroke-dashoffset: 80;
  animation: drawCheck 0.4s 0.5s ease-out forwards;
}

@keyframes drawCircle {
  to { stroke-dashoffset: 0; }
}

@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}
</style>
