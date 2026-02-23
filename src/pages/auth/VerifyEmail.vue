<template>
  <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:px-4 tw:py-12">
    <div class="tw:w-full tw:max-w-md tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-6 md:tw:p-8 tw:text-center animate-fade-in">
      <!-- Loading -->
      <div v-if="loading">
        <div class="tw:animate-spin tw:w-10 tw:h-10 tw:border-4 tw:border-gray-200 tw:rounded-full tw:mx-auto tw:mb-4" style="border-top-color: var(--primary-color)"></div>
        <h2 class="tw:text-lg tw:font-semibold tw:text-gray-700">Verifying your email...</h2>
        <p class="tw:text-sm tw:text-gray-500 tw:mt-1">Please wait a moment.</p>
      </div>

      <!-- Success -->
      <div v-else-if="successMessage">
        <div class="tw:w-14 tw:h-14 tw:bg-green-100 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mx-auto tw:mb-4">
          <span class="tw:text-2xl">✓</span>
        </div>
        <h2 class="tw:text-xl tw:font-bold tw:text-green-700 tw:mb-2">Email Verified!</h2>
        <p class="tw:text-gray-600 tw:mb-6">{{ successMessage }}</p>
        <router-link
          to="/login?verified=success"
          class="no-hover tw:inline-block tw:text-white tw:font-semibold tw:px-6 tw:py-2.5 tw:rounded-lg tw:transition"
          style="background-color: var(--primary-color)"
        >
          Go to Login
        </router-link>
      </div>

      <!-- Error -->
      <div v-else>
        <div class="tw:w-14 tw:h-14 tw:bg-red-100 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mx-auto tw:mb-4">
          <span class="tw:text-2xl">✕</span>
        </div>
        <h2 class="tw:text-xl tw:font-bold tw:text-red-700 tw:mb-2">Verification Failed</h2>
        <p class="tw:text-gray-600 tw:mb-6">{{ authStore.error || 'The verification link is invalid or has expired.' }}</p>
        <router-link
          to="/login"
          class="no-hover tw:inline-block tw:text-white tw:font-semibold tw:px-6 tw:py-2.5 tw:rounded-lg tw:transition"
          style="background-color: var(--primary-color)"
        >
          Go to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const successMessage = ref('')

onMounted(async () => {
  const id = route.params.id as string
  const hash = route.params.hash as string
  const queryString = window.location.search

  const msg = await authStore.verifyEmail(id, hash, queryString)
  if (msg) {
    successMessage.value = msg
  }
  loading.value = false
})
</script>
