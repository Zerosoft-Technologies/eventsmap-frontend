import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChatUser } from '@/services/chatService'

export const useChatStore = defineStore('chat', () => {
  const isOpen = ref(false)
  /** When set, ChatSidebar opens this conversation after init */
  const pendingConversationUser = ref<ChatUser | null>(null)

  const open = () => {
    isOpen.value = true
  }

  const openWithUser = (user: Pick<ChatUser, 'id' | 'name'> & Partial<ChatUser>) => {
    pendingConversationUser.value = {
      id: user.id,
      name: user.name,
      profile_type: user.profile_type ?? 'talent',
      account_type: user.account_type ?? 'premium',
      avatar: user.avatar ?? null,
    }
    isOpen.value = true
  }

  const clearPendingConversation = () => {
    pendingConversationUser.value = null
  }

  const close = () => {
    isOpen.value = false
    pendingConversationUser.value = null
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    pendingConversationUser,
    open,
    openWithUser,
    clearPendingConversation,
    close,
    toggle,
  }
})
