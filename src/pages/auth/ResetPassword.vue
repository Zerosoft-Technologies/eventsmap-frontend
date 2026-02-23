<template>
  <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:px-4 tw:py-12">
    <div class="tw:w-full tw:max-w-md tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-6 md:tw:p-8 animate-fade-in">
      <h1 class="tw:text-2xl tw:font-bold tw:text-center tw:mb-1" style="color: var(--primary-color)">
        Reset Password
      </h1>
      <p class="tw:text-gray-500 tw:text-center tw:mb-6 tw:text-sm">Enter your new password below</p>

      <!-- Error Banner -->
      <div v-if="authStore.error" class="tw:bg-red-50 tw:border tw:border-red-200 tw:text-red-700 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-4 tw:text-sm">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="handleReset" class="tw:space-y-4">
        <div>
          <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="you@example.com"
            class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2.5 tw:outline-none tw:transition focus:tw:border-[var(--secondary-color)]"
          />
          <p v-if="fieldError('email')" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ fieldError('email') }}</p>
        </div>

        <div>
          <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">New Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="Min 8 characters"
            class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2.5 tw:outline-none tw:transition focus:tw:border-[var(--secondary-color)]"
          />
          <p v-if="fieldError('password')" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ fieldError('password') }}</p>
        </div>

        <div>
          <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Confirm Password</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            required
            placeholder="Repeat your password"
            class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2.5 tw:outline-none tw:transition focus:tw:border-[var(--secondary-color)]"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="no-hover tw:w-full tw:text-white tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
          :style="{ backgroundColor: authStore.loading ? '#93b4f5' : 'var(--primary-color)' }"
        >
          <span v-if="authStore.loading">Resetting...</span>
          <span v-else>Reset Password</span>
        </button>
      </form>

      <p class="tw:text-center tw:text-sm tw:text-gray-500 tw:mt-6">
        <router-link to="/login" class="no-hover tw:font-semibold hover:tw:underline" style="color: var(--primary-color)">
          Back to Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  email: (route.query.email as string) || '',
  password: '',
  password_confirmation: '',
})

function fieldError(field: string): string | null | undefined {
  const errors = authStore.validationErrors[field]
  return errors?.length ? errors[0] : null
}

async function handleReset() {
  const token = (route.query.token as string) || ''
  const msg = await authStore.resetPassword({
    token,
    ...form.value,
  })
  if (msg) {
    router.push({ name: 'Login', query: { reset: 'success' } })
  }
}
</script>
