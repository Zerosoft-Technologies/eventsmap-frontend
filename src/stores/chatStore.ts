import { defineStore } from 'pinia'
import { ref } from 'vue'
import { chatService, type ChatUser, type BlockedChatUser } from '@/services/chatService'

export const useChatStore = defineStore('chat', () => {
  const isOpen = ref(false)
  /** When set, ChatSidebar opens this conversation after init */
  const pendingConversationUser = ref<ChatUser | null>(null)
  const blockedUserIds = ref<number[]>([])
  const blockedByUserIds = ref<number[]>([])
  const blockedUsers = ref<BlockedChatUser[]>([])
  const blocksLoaded = ref(false)

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

  async function loadBlocks(force = false) {
    if (blocksLoaded.value && !force) return
    const data = await chatService.getBlocks()
    blockedUserIds.value = data.blocked
    blockedByUserIds.value = data.blocked_by
    blockedUsers.value = data.blocked_users
    blocksLoaded.value = true
  }

  function isBlockedByMe(userId: number): boolean {
    return blockedUserIds.value.includes(userId)
  }

  function hasBlockedMe(userId: number): boolean {
    return blockedByUserIds.value.includes(userId)
  }

  function isMessagingBlocked(userId: number): boolean {
    return isBlockedByMe(userId) || hasBlockedMe(userId)
  }

  async function blockUser(userId: number, profile?: Partial<BlockedChatUser>) {
    await chatService.blockUser(userId)
    if (!blockedUserIds.value.includes(userId)) {
      blockedUserIds.value = [...blockedUserIds.value, userId]
    }
    if (profile?.name) {
      const existing = blockedUsers.value.find((u) => u.id === userId)
      if (existing) {
        blockedUsers.value = blockedUsers.value.map((u) =>
          u.id === userId ? { ...u, ...profile, id: userId, name: profile.name ?? u.name } : u,
        )
      } else {
        blockedUsers.value = [
          ...blockedUsers.value,
          {
            id: userId,
            name: profile.name,
            profile_type: profile.profile_type ?? null,
            avatar: profile.avatar ?? null,
          },
        ]
      }
    } else {
      await loadBlocks(true)
    }
  }

  async function unblockUser(userId: number) {
    await chatService.unblockUser(userId)
    blockedUserIds.value = blockedUserIds.value.filter((id) => id !== userId)
    blockedUsers.value = blockedUsers.value.filter((u) => u.id !== userId)
  }

  function resetBlocks() {
    blockedUserIds.value = []
    blockedByUserIds.value = []
    blockedUsers.value = []
    blocksLoaded.value = false
  }

  return {
    isOpen,
    pendingConversationUser,
    blockedUserIds,
    blockedByUserIds,
    blockedUsers,
    blocksLoaded,
    open,
    openWithUser,
    clearPendingConversation,
    close,
    toggle,
    loadBlocks,
    isBlockedByMe,
    hasBlockedMe,
    isMessagingBlocked,
    blockUser,
    unblockUser,
    resetBlocks,
  }
})
