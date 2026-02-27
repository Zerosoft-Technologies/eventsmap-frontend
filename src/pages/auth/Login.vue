<template>
  <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:px-4 tw:py-12">
    <div class="tw:w-full tw:max-w-md tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-6 md:tw:p-8 animate-fade-in">
      <h1 class="tw:text-2xl tw:font-bold tw:text-center tw:mb-1" style="color: var(--primary-color)">
        Welcome Back
      </h1>
      <p class="tw:text-gray-500 tw:text-center tw:mb-6 tw:text-sm">Sign in to your account</p>

      <!-- Success Messages -->
      <div v-if="route.query.verified === 'pending'" class="tw:bg-blue-50 tw:border tw:border-blue-200 tw:text-blue-700 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-4 tw:text-sm">
        Verification email sent. Please check your inbox and verify your email before signing in.
      </div>
      <div v-if="route.query.verified === 'success'" class="tw:bg-green-50 tw:border tw:border-green-200 tw:text-green-700 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-4 tw:text-sm">
        Email verified successfully! You may now sign in.
      </div>
      <div v-if="route.query.reset === 'success'" class="tw:bg-green-50 tw:border tw:border-green-200 tw:text-green-700 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-4 tw:text-sm">
        Password reset successfully! You may now sign in.
      </div>

      <!-- Error Banner -->
      <div v-if="authStore.error" class="tw:bg-red-50 tw:border tw:border-red-200 tw:text-red-700 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-4 tw:text-sm">
        {{ authStore.error }}
      </div>

      <!-- Unverified Email Banner -->
      <div v-if="showResendBanner" class="tw:bg-yellow-50 tw:border tw:border-yellow-200 tw:text-yellow-800 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-4 tw:text-sm">
        <p>Your email is not verified.</p>
        <button
          @click="handleResend"
          :disabled="resending"
          class="no-hover tw:mt-1 tw:font-semibold tw:underline hover:tw:no-underline tw:disabled:opacity-50"
          style="color: var(--primary-color)"
        >
          {{ resending ? 'Sending...' : 'Resend verification email' }}
        </button>
        <p v-if="resendMessage" class="tw:text-green-600 tw:mt-1">{{ resendMessage }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="tw:space-y-4">
        <div>
          <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="you@example.com"
            class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2.5 tw:outline-none tw:transition focus:tw:border-[var(--secondary-color)]"
          />
        </div>

        <div>
          <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="Enter your password"
            class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2.5 tw:outline-none tw:transition focus:tw:border-[var(--secondary-color)]"
          />
        </div>

        <div class="tw:flex tw:justify-end">
          <router-link
            to="/forgot-password"
            class="no-hover tw:text-sm tw:font-medium hover:tw:underline"
            style="color: var(--primary-color)"
          >
            Forgot Password?
          </router-link>
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="no-hover tw:w-full tw:text-white tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
          :style="{ backgroundColor: authStore.loading ? '#93b4f5' : 'var(--primary-color)' }"
        >
          <span v-if="authStore.loading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="tw:text-center tw:mt-4">
        <router-link to="/forgot-password" class="no-hover tw:text-sm tw:font-semibold hover:tw:underline" style="color: var(--primary-color)">
          Forgot your password?
        </router-link>
      </div>

      <p class="tw:text-center tw:text-sm tw:text-gray-500 tw:mt-6">
        Don't have an account?
        <router-link to="/register" class="no-hover tw:font-semibold hover:tw:underline" style="color: var(--primary-color)">
          Create Account
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getCreateRoute } from '@/utils/routeResolver'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
})

const showResendBanner = ref(false)
const resending = ref(false)
const resendMessage = ref('')

async function handleLogin() {
  showResendBanner.value = false
  resendMessage.value = ''
  authStore.clearErrors()

  const result = await authStore.login(form.value)

  if (result.success) {
    // Premium user with pending payment → must complete payment first
    if (
      authStore.user?.account_type === 'premium' &&
      authStore.user?.status === 'pending_payment'
    ) {
      return router.push({ name: 'PaymentRequired' })
    }

    // Check if there's a redirect query param
    const redirect = route.query.redirect as string | undefined
    if (redirect) {
      router.push(redirect)
    } else {
      // Redirect based on user's profile_type & account_type
      router.push(getCreateRoute(authStore.user?.profile_type, authStore.user?.account_type))
    }
  } else if (!result.emailVerified) {
    showResendBanner.value = true
  }
}

async function handleResend() {
  resending.value = true
  resendMessage.value = ''
  const msg = await authStore.resendVerification(form.value.email)
  if (msg) {
    resendMessage.value = msg
  }
  resending.value = false
}
</script>
