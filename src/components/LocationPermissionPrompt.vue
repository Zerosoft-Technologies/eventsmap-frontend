<template>
  <transition name="fade-slide">
    <div
      v-if="show"
      class="tw:bg-blue-50 tw:border tw:border-blue-200 tw:rounded-lg tw:p-4 tw:mb-4 tw:relative"
    >
      <!-- Dismiss button -->
      <button
        @click="dismiss"
        class="tw:absolute tw:top-2 tw:right-2 tw:text-gray-400 hover:tw:text-gray-600 tw:transition-colors"
        aria-label="Dismiss"
      >
        <svg class="tw:w-5 tw:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Content -->
      <div class="tw:flex tw:items-start tw:gap-3">
        <!-- Icon -->
        <div class="tw:tw-flex-shrink-0 tw:mt-0.5">
          <svg class="tw:w-5 tw:h-5 tw:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <!-- Text and actions -->
        <div class="tw:flex-1">
          <p class="tw:text-sm tw:text-gray-700 tw:mb-3">
            We couldn't access your location yet. Enable it to see nearby events.
          </p>

          <!-- Browser instructions -->
          <div class="tw:bg-white tw:rounded-md tw:p-3 tw:mb-3 tw:border tw:border-blue-100">
            <p class="tw:text-xs tw:text-gray-600 tw:mb-1">To enable location:</p>
            <p class="tw:text-xs tw:text-gray-700 tw:font-medium">
              {{ browserInstructions }}
            </p>
          </div>

          <!-- Actions -->
          <div class="tw:flex tw:gap-2 tw:flex-wrap">
            <button
              @click="retry"
              :disabled="!canRetry"
              class="tw:px-4 tw:py-2 tw:text-sm tw:bg-blue-500 tw:text-white tw:rounded-md hover:tw:bg-blue-600 disabled:tw:bg-gray-300 disabled:tw:cursor-not-allowed tw:transition-colors"
            >
              {{ canRetry ? 'Try Again' : `Retry in ${retryCountdown}s` }}
            </button>
            <button
              @click="continueWithout"
              class="tw:px-4 tw:py-2 tw:text-sm tw:text-gray-700 tw:bg-white tw:border tw:border-gray-300 tw-rounded-md hover:tw:bg-gray-50 tw:transition-colors"
            >
              Continue without location
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import { useLocationPermission } from '../composables/useLocationPermission'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'dismiss'): void
  (e: 'continue-without'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  canRetryLocation,
  retryLocation,
  dismissLocationPrompt,
  getBrowserInstructions
} = useLocationPermission()

// Computed properties
const canRetry = computed(() => canRetryLocation.value)

const browserInstructions = computed(() => getBrowserInstructions())

// Retry countdown
const retryCountdown = ref(0)
let countdownInterval: number | null = null

const startCountdown = () => {
  if (countdownInterval) clearInterval(countdownInterval)
  
  retryCountdown.value = 10
  countdownInterval = setInterval(() => {
    retryCountdown.value--
    if (retryCountdown.value <= 0) {
      clearInterval(countdownInterval!)
      countdownInterval = null
    }
  }, 1000)
}

// Methods
const retry = async () => {
  if (!canRetry.value) return
  
  await retryLocation()
  if (!canRetry.value) {
    startCountdown()
  }
}

const dismiss = () => {
  dismissLocationPrompt()
  emit('dismiss')
}

const continueWithout = () => {
  dismissLocationPrompt()
  emit('continue-without')
}

// Cleanup
onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
/* Fade and slide animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
