<template>
  <div class="create-redirect">
    <div v-if="isLoading" class="create-redirect__loader">
      <svg
        class="create-redirect__spinner"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p>Redirecting…</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getCreateRoute } from '@/utils/routeResolver'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = computed(() => authStore.loading || !authStore.authReady)

onMounted(async () => {
  // Ensure auth is initialised and user data is loaded
  if (!authStore.authReady) {
    await authStore.initializeAuth()
  }

  if (!authStore.user && authStore.token) {
    await authStore.fetchUser()
  }

  // No authenticated user → send to home
  if (!authStore.user) {
    return router.replace('/')
  }

  const route = getCreateRoute(
    authStore.user.profile_type,
    authStore.user.account_type,
  )

  router.replace(route)
})
</script>

<style scoped>
.create-redirect {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.create-redirect__loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
}

.create-redirect__spinner {
  width: 2.5rem;
  height: 2.5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
