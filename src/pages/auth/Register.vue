<template>
  <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:px-4 tw:py-12">
    <div class="tw:w-full tw:max-w-md">
      <!-- Profile Type Selection -->
      <div v-if="!selectedProfileType" class="tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-6 md:tw:p-8 animate-fade-in">
        <h1 class="tw:text-2xl tw:font-bold tw:text-center tw:mb-2" style="color: var(--primary-color)">
          Create Account
        </h1>
        <p class="tw:text-gray-500 tw:text-center tw:mb-8">Choose your profile type to get started</p>

        <div class="tw:grid tw:grid-cols-2 tw:gap-4">
          <button
            v-for="pType in profileTypes"
            :key="pType.value"
            @click="selectedProfileType = pType.value"
            class="no-hover tw:flex tw:flex-col tw:items-center tw:gap-2 tw:p-5 tw:rounded-xl tw:border-2 tw:border-gray-200 tw:transition-all tw:duration-200 hover:tw:border-[var(--primary-color)] hover:tw:bg-blue-50"
          >
            <span class="tw:text-3xl">{{ pType.icon }}</span>
            <span class="tw:font-semibold tw:text-gray-700">{{ pType.label }}</span>
          </button>
        </div>

        <p class="tw:text-center tw:text-sm tw:text-gray-500 tw:mt-6">
          Already have an account?
          <router-link to="/login" class="no-hover tw:font-semibold hover:tw:underline" style="color: var(--primary-color)">
            Sign In
          </router-link>
        </p>
      </div>

      <!-- Registration Form -->
      <div v-else class="tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-6 md:tw:p-8 animate-fade-in">
        <button
          @click="selectedProfileType = ''"
          class="no-hover tw:text-sm tw:text-gray-500 tw:mb-4 tw:flex tw:items-center tw:gap-1 hover:tw:text-gray-700"
        >
          ← Back
        </button>

        <h1 class="tw:text-2xl tw:font-bold tw:mb-1" style="color: var(--primary-color)">
          Register as {{ selectedProfileLabel }}
        </h1>
        <p class="tw:text-gray-500 tw:text-sm tw:mb-6">Fill in your details to create an account</p>

        <!-- Error Banner -->
        <div v-if="authStore.error" class="tw:bg-red-50 tw:border tw:border-red-200 tw:text-red-700 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-4 tw:text-sm">
          {{ authStore.error }}
        </div>

        <form @submit.prevent="handleRegister" class="tw:space-y-4">
          <div>
            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Your full name"
              class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2.5 tw:outline-none tw:transition focus:tw:border-[var(--secondary-color)]"
            />
            <p v-if="fieldError('name')" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ fieldError('name') }}</p>
          </div>

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
            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Password</label>
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
            <span v-if="authStore.loading">Creating account...</span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <p class="tw:text-center tw:text-sm tw:text-gray-500 tw:mt-6">
          Already have an account?
          <router-link to="/login" class="no-hover tw:font-semibold hover:tw:underline" style="color: var(--primary-color)">
            Sign In
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const profileTypes = [
  { value: 'event', label: 'Event', icon: '🎪' },
  { value: 'talent', label: 'Talent', icon: '🎤' },
  { value: 'organizer', label: 'Organizer', icon: '📋' },
  { value: 'venue', label: 'Venue', icon: '🏛️' },
]

const selectedProfileType = ref('')
const selectedProfileLabel = computed(() => {
  return profileTypes.find(p => p.value === selectedProfileType.value)?.label || ''
})

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

function fieldError(field: string): string | null {
  const errors = authStore.validationErrors[field]
  return errors?.length ? errors[0] : null
}

async function handleRegister() {
  const success = await authStore.register({
    ...form.value,
    profile_type: selectedProfileType.value,
  })
  if (success) {
    router.push({ name: 'Login', query: { verified: 'pending' } })
  }
}
</script>
