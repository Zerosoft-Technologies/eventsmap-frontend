<template>
  <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:px-4">
    <div class="tw:w-full tw:max-w-md tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-8 animate-fade-in">

      <!-- Warning Badge -->
      <div class="tw:flex tw:justify-center tw:mb-5">
        <span class="tw:inline-flex tw:items-center tw:gap-1.5 tw:bg-amber-100 tw:text-amber-700 tw:text-xs tw:font-semibold tw:px-3 tw:py-1.5 tw:rounded-full">
          <svg class="tw:w-3.5 tw:h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          Premium Payment Required
        </span>
      </div>

      <!-- Icon -->
      <div class="tw:flex tw:justify-center tw:mb-5">
        <div class="tw:w-16 tw:h-16 tw:rounded-full tw:bg-amber-50 tw:flex tw:items-center tw:justify-center">
          <svg class="tw:w-8 tw:h-8 tw:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      </div>

      <h1 class="tw:text-2xl tw:font-bold tw:text-gray-800 tw:text-center tw:mb-2">
        Complete Your Premium Payment
      </h1>
      <p class="tw:text-gray-500 tw:text-sm tw:text-center tw:mb-7">
        Your premium account is pending payment. Complete your payment to unlock full access to your dashboard and premium features.
      </p>

      <!-- Error Banner -->
      <div v-if="retryError"
        class="tw:bg-red-50 tw:border tw:border-red-300 tw:text-red-700 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-5 tw:text-sm">
        {{ retryError }}
      </div>

      <!-- Continue Payment Button -->
      <button
        @click="handleRetry"
        :disabled="retrying"
        class="no-hover tw:w-full tw:text-white tw:font-semibold tw:py-3 tw:rounded-xl tw:transition tw:disabled:opacity-60 tw:disabled:cursor-not-allowed tw:flex tw:items-center tw:justify-center tw:gap-2 tw:mb-3"
        style="background-color: var(--primary-color)"
      >
        <svg v-if="retrying" class="tw:animate-spin tw:w-4 tw:h-4" fill="none" viewBox="0 0 24 24">
          <circle class="tw:opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="tw:opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <svg v-else class="tw:w-4 tw:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <span>{{ retrying ? 'Preparing checkout...' : 'Continue Payment' }}</span>
      </button>

      <!-- Logout Button -->
      <button
        @click="handleLogout"
        :disabled="retrying || loggingOut"
        class="no-hover tw:w-full tw:font-semibold tw:py-2.5 tw:rounded-xl tw:transition tw:border tw:border-gray-300 tw:text-gray-600 hover:tw:bg-gray-50 tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
      >
        {{ loggingOut ? 'Signing out...' : 'Sign Out' }}
      </button>

      <p class="tw:text-xs tw:text-gray-400 tw:text-center tw:mt-6">
        Having trouble?
        <a href="mailto:support@eventsmap.com" class="no-hover tw:underline hover:tw:text-gray-600">Contact Support</a>
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

interface RetryResponse {
  checkout_url: string
}

const router = useRouter()
const authStore = useAuthStore()

const retrying = ref(false)
const loggingOut = ref(false)
const retryError = ref<string | null>(null)

onMounted(() => {
  if (authStore.user?.status === 'active') {
    router.push('/dashboard')
  }
})

async function handleRetry() {
  retrying.value = true
  retryError.value = null

  try {
    const response = await api.post<RetryResponse>('payment/retry')
    if (response.data.checkout_url) {
      window.location.href = response.data.checkout_url
    } else {
      retryError.value = 'Unable to create payment session. Please try again.'
      retrying.value = false
    }
  } catch {
    retryError.value = 'Failed to initiate payment. Please try again or contact support.'
    retrying.value = false
  }
}

async function handleLogout() {
  loggingOut.value = true
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
