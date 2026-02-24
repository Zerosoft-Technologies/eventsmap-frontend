<template>
  <div class="tw:min-h-screen tw:bg-gray-50">
    <!-- Dashboard Header -->
    <div class="tw:bg-white tw:border-b tw:border-gray-200">
      <div class="tw:max-w-6xl tw:mx-auto tw:px-4 tw:py-4 tw:flex tw:items-center tw:justify-between">
        <div>
          <h1 class="tw:text-xl tw:font-bold" style="color: var(--primary-color)">Dashboard</h1>
          <p class="tw:text-sm tw:text-gray-500" v-if="authStore.user">
            Welcome back, {{ authStore.user.name }}
          </p>
        </div>
        <!-- <button
          @click="handleLogout"
          :disabled="authStore.loading"
          class="no-hover tw:text-sm tw:font-medium tw:px-4 tw:py-2 tw:rounded-lg tw:border tw:border-gray-300 tw:text-gray-600 hover:tw:bg-gray-100 tw:transition tw:disabled:opacity-50"
        >
          Sign Out
        </button> -->
      </div>
    </div>

    <!-- Dashboard Content -->
    <div class="tw:max-w-6xl tw:mx-auto tw:px-4 tw:py-8">
      <!-- User Info Card -->
      <div v-if="authStore.user" class="tw:bg-white tw:rounded-2xl tw:shadow tw:p-6 tw:mb-6">
        <h2 class="tw:text-lg tw:font-semibold tw:mb-4" style="color: var(--primary-color)">Account Information</h2>
        <div class="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
          <div>
            <p class="tw:text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide">Name</p>
            <p class="tw:text-gray-800 tw:font-medium">{{ authStore.user.name }}</p>
          </div>
          <div>
            <p class="tw:text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide">Email</p>
            <p class="tw:text-gray-800 tw:font-medium">{{ authStore.user.email }}</p>
          </div>
          <div>
            <p class="tw:text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide">Profile Type</p>
            <p class="tw:text-gray-800 tw:font-medium tw:capitalize">{{ authStore.user.profile_type }}</p>
          </div>
          <div>
            <p class="tw:text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide">Account Type</p>
            <span class="tw:inline-block tw:bg-green-100 tw:text-green-700 tw:text-xs tw:font-semibold tw:px-2.5 tw:py-0.5 tw:rounded-full tw:capitalize">
              {{ authStore.user.account_type }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="tw:bg-white tw:rounded-2xl tw:shadow tw:p-6">
        <h2 class="tw:text-lg tw:font-semibold tw:mb-4" style="color: var(--primary-color)">Quick Actions</h2>
        <div class="tw:grid tw:grid-cols-1 sm:tw:grid-cols-2 lg:tw:grid-cols-3 tw:gap-4">
          <router-link
            to="/"
            class="no-hover tw:flex tw:items-center tw:gap-3 tw:p-4 tw:rounded-xl tw:border tw:border-gray-200 hover:tw:border-[var(--primary-color)] tw:transition"
          >
            <span class="tw:text-2xl">🗺️</span>
            <div>
              <p class="tw:font-semibold tw:text-gray-800">Events Map</p>
              <p class="tw:text-xs tw:text-gray-500">Explore events on the map</p>
            </div>
          </router-link>

          <router-link
            to="/create-profile"
            class="no-hover tw:flex tw:items-center tw:gap-3 tw:p-4 tw:rounded-xl tw:border tw:border-gray-200 hover:tw:border-[var(--primary-color)] tw:transition"
          >
            <span class="tw:text-2xl">👤</span>
            <div>
              <p class="tw:font-semibold tw:text-gray-800">Create Profile</p>
              <p class="tw:text-xs tw:text-gray-500">Set up your profile</p>
            </div>
          </router-link>

          <!-- Placeholder for future premium features -->
          <div class="tw:flex tw:items-center tw:gap-3 tw:p-4 tw:rounded-xl tw:border tw:border-dashed tw:border-gray-300 tw:opacity-50">
            <span class="tw:text-2xl">⭐</span>
            <div>
              <p class="tw:font-semibold tw:text-gray-800">Premium Features</p>
              <p class="tw:text-xs tw:text-gray-500">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'Login' })
}
</script>
