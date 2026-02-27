<template>
  <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:px-4">
    <div class="tw:w-full tw:max-w-md tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-8 tw:text-center animate-fade-in">

      <div class="tw:flex tw:justify-center tw:mb-6">
        <div class="tw:w-16 tw:h-16 tw:rounded-full tw:bg-amber-100 tw:flex tw:items-center tw:justify-center">
          <svg class="tw:w-8 tw:h-8 tw:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      <h1 class="tw:text-2xl tw:font-bold tw:text-gray-800 tw:mb-2">Payment Cancelled</h1>
      <p class="tw:text-gray-500 tw:text-sm tw:mb-8">
        Your payment was not completed. No charges have been made to your account.
      </p>

      <div class="tw:bg-amber-50 tw:border tw:border-amber-200 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-8 tw:text-sm tw:text-amber-700">
        You can try again anytime. Your registration details have been saved.
      </div>

      <div class="tw:flex tw:flex-col tw:gap-3">
        <button @click="router.push('/register')"
          class="no-hover tw:w-full tw:text-white tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition hover:tw:opacity-90"
          style="background-color: var(--primary-color)">
          Try Again
        </button>
        <button @click="router.push('/')"
          class="no-hover tw:w-full tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition tw:border tw:border-gray-300 tw:text-gray-700 hover:tw:bg-gray-50">
          Back to Home
        </button>
      </div>

      <p class="tw:text-xs tw:text-gray-400 tw:mt-6">
        Having trouble?
        <a href="mailto:support@eventsmap.com" class="no-hover tw:underline hover:tw:text-gray-600">Contact Support</a>
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
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
