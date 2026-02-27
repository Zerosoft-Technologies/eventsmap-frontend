<template>
  <button
    class="create-btn"
    :disabled="isLoading"
    @click="handleCreateClick"
  >
    <span v-if="isLoading">Loading…</span>
    <span v-else>Create</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getCreateRoute } from '@/utils/routeResolver'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = computed(() => authStore.loading || !authStore.authReady)

const handleCreateClick = () => {
  // Guard: do not redirect before user data loads
  if (isLoading.value) return
  if (!authStore.user) return

  const route = getCreateRoute(
    authStore.user.profile_type,
    authStore.user.account_type,
  )

  router.push(route)
}
</script>

<style scoped>
.create-btn {
  padding: 0.625rem 1.25rem;
  font-weight: 600;
  color: #fff;
  background-color: #4f46e5;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-btn:hover:not(:disabled) {
  background-color: #4338ca;
}

.create-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
