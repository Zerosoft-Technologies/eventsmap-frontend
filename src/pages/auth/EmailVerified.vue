<template>
  <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:px-4 tw:py-12">
    <div class="tw:w-full tw:max-w-md tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-8 tw:text-center animate-fade-in">
      
      <!-- Success Icon -->
      <div class="tw:flex tw:justify-center tw:mb-6">
        <div class="tw:relative">
          <div class="tw:w-20 tw:h-20 tw:rounded-full tw:bg-green-100 tw:flex tw:items-center tw:justify-center animate-scale-in">
            <svg class="tw:w-10 tw:h-10 tw:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="tw:absolute tw:inset-0 tw:rounded-full tw:bg-green-400 tw:opacity-20 animate-ping-slow"></div>
        </div>
      </div>

      <!-- Title -->
      <h1 class="tw:text-2xl tw:font-bold tw:text-gray-800 tw:mb-2">
        Email Verified Successfully
      </h1>

      <!-- Email Display -->
      <p v-if="email" class="tw:text-gray-600 tw:text-sm tw:mb-3">
        <span class="tw:font-medium tw:text-green-600">{{ email }}</span> has been verified
      </p>

      <!-- Success Message -->
      <p class="tw:text-gray-500 tw:text-sm tw:mb-8">
        Your account has been verified. You can now login and access all features.
      </p>

      <!-- Auto-redirect Countdown -->
      <div v-if="countdown > 0" class="tw:bg-green-50 tw:border tw:border-green-200 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-6">
        <p class="tw:text-green-700 tw:text-sm">
          Redirecting to login in <span class="tw:font-bold">{{ countdown }}</span> second{{ countdown !== 1 ? 's' : '' }}...
        </p>
      </div>

      <!-- Manual Login Button -->
      <button
        @click="goToLogin"
        class="no-hover tw:w-full tw:text-white tw:font-semibold tw:py-3 tw:rounded-xl tw:transition hover:tw:opacity-90 tw:shadow-md hover:tw:shadow-lg"
        style="background-color: var(--primary-color)"
      >
        Go to Login
      </button>

      <!-- Additional Info -->
      <p class="tw:text-xs tw:text-gray-400 tw:mt-6">
        Having trouble logging in?
        <router-link to="/forgot-password" class="no-hover tw:underline hover:tw:text-gray-600">
          Reset your password
        </router-link>
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const email = ref<string>('')
const countdown = ref(5)
let countdownInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  email.value = (route.query.email as string) || ''

  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearCountdown()
      goToLogin()
    }
  }, 1000)
})

onBeforeUnmount(() => {
  clearCountdown()
})

function clearCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

function goToLogin() {
  clearCountdown()
  router.push({ name: 'Login', query: { verified: 'success' } })
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.animate-scale-in {
  animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scaleIn {
  from { 
    transform: scale(0); 
    opacity: 0;
  }
  to { 
    transform: scale(1); 
    opacity: 1;
  }
}

.animate-ping-slow {
  animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes pingSlow {
  0% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
