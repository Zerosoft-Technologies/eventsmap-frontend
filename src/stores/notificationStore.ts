import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { subscribeToInvitationNotifications } from '@/services/notificationFirestore'
import type { InvitationNotificationWithId } from '@/services/notificationFirestore'
import { useAuthStore } from '@/stores/auth'

export const useNotificationStore = defineStore('notification', () => {
  const authStore = useAuthStore()
  const invitations = ref<InvitationNotificationWithId[]>([])
  let unsubscribe: (() => void) | null = null

  function startListening() {
    const userId = authStore.user?.id
    if (userId == null || userId <= 0) {
      invitations.value = []
      return
    }
    unsubscribe = subscribeToInvitationNotifications(
      userId,
      (list) => {
        invitations.value = list
      }
    )
  }

  function stopListening() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    invitations.value = []
  }

  const pendingInvitations = computed(() =>
    invitations.value.filter((n) => n.status === 'pending')
  )
  const pendingCount = computed(() => pendingInvitations.value.length)

  watch(
    () => authStore.isAuthenticated && authStore.user?.id,
    (active) => {
      if (active) {
        startListening()
      } else {
        stopListening()
      }
    },
    { immediate: true }
  )

  return {
    invitations,
    pendingInvitations,
    pendingCount,
    startListening,
    stopListening,
  }
})
