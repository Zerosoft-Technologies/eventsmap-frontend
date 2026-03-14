<template>
  <!-- Header -->
  <div class="tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-4 tw:border-b tw:border-gray-100 tw:flex-shrink-0">
    <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900">Messages</h2>
    <button
      @click="$emit('close')"
      class="tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center tw:rounded-full hover:tw:bg-gray-100 tw:transition-colors"
      title="Close chat"
    >
      <X class="tw:w-5 tw:h-5 tw:text-gray-500" />
    </button>
  </div>

  <!-- Loading -->
  <div v-if="loading" class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:flex-1 tw:gap-3 tw:text-gray-400">
    <Loader2 class="tw:w-8 tw:h-8 tw:animate-spin tw:text-blue-500" />
    <span class="tw:text-sm">Loading participants...</span>
  </div>

  <!-- Error -->
  <div v-else-if="error" class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:flex-1 tw:gap-3 tw:px-6 tw:text-center">
    <WifiOff class="tw:w-10 tw:h-10 tw:text-red-400" />
    <p class="tw:text-sm tw:text-red-500">{{ error }}</p>
    <button
      @click="loadChatList"
      class="tw:px-4 tw:py-2 tw:text-sm tw:bg-blue-500 tw:text-white tw:rounded-lg hover:tw:bg-blue-600 tw:transition-colors"
    >
      Retry
    </button>
  </div>

  <!-- Empty -->
  <div v-else-if="users.length === 0" class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:flex-1 tw:gap-3 tw:px-6 tw:text-center">
    <MessageCircle class="tw:w-12 tw:h-12 tw:text-gray-300" />
    <p class="tw:text-sm tw:font-medium tw:text-gray-500">No participants yet</p>
    <p class="tw:text-xs tw:text-gray-400">Premium users you can chat with will appear here</p>
  </div>

  <!-- User list -->
  <div v-else class="tw:flex-1 tw:overflow-y-auto">
    <button
      v-for="user in users"
      :key="user.id"
      @click="$emit('select-user', user)"
      class="tw:w-full tw:flex tw:items-center tw:gap-3 tw:px-4 tw:py-3 hover:tw:bg-gray-50 tw:transition-colors tw:text-left tw:border-b tw:border-gray-50"
    >
      <!-- Avatar -->
      <div class="tw:relative tw:flex-shrink-0">
        <div class="tw:w-12 tw:h-12 tw:rounded-full tw:bg-gradient-to-br tw:from-blue-400 tw:to-blue-600 tw:flex tw:items-center tw:justify-center tw:text-white tw:font-semibold tw:text-lg tw:overflow-hidden">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.name"
            class="tw:w-full tw:h-full tw:object-cover"
          />
          <span v-else>{{ getInitials(user.name) }}</span>
        </div>
        <!-- Online indicator -->
        <span
          v-if="presenceMap[user.id]?.online"
          class="tw:absolute tw:bottom-0 tw:right-0 tw:w-3 tw:h-3 tw:bg-green-500 tw:rounded-full tw:border-2 tw:border-white"
          title="Online"
        />
        <!-- Premium badge -->
        <span
          v-if="user.account_type === 'premium'"
          class="tw:absolute tw:-bottom-0.5 tw:-right-0.5 tw:w-4 tw:h-4 tw:bg-yellow-400 tw:rounded-full tw:border-2 tw:border-white tw:flex tw:items-center tw:justify-center"
          title="Premium member"
        >
          <span class="tw:text-[8px]">★</span>
        </span>
      </div>

      <!-- Info -->
      <div class="tw:flex-1 tw:min-w-0">
        <div class="tw:flex tw:items-center tw:justify-between tw:mb-0.5">
          <span class="tw:font-medium tw:text-sm tw:text-gray-900 tw:truncate">{{ user.name }}</span>
          <span
            v-if="user.last_message_at"
            class="tw:text-xs tw:text-gray-400 tw:flex-shrink-0 tw:ml-2"
          >
            {{ formatTime(user.last_message_at) }}
          </span>
        </div>

        <div class="tw:flex tw:items-center tw:justify-between">
          <p class="tw:text-xs tw:text-gray-500 tw:truncate tw:flex-1">
            {{ user.last_message || capitalize(user.profile_type) }}
          </p>

          <!-- Unread badge -->
          <span
            v-if="user.unread_count && user.unread_count > 0"
            class="tw:ml-2 tw:flex-shrink-0 tw:w-5 tw:h-5 tw:bg-blue-500 tw:text-white tw:text-xs tw:rounded-full tw:flex tw:items-center tw:justify-center tw:font-semibold"
          >
            {{ user.unread_count > 99 ? '99+' : user.unread_count }}
          </span>
        </div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { X, Loader2, MessageCircle, WifiOff } from 'lucide-vue-next'
import { chatService, type ChatUser } from '@/services/chatService'
import {
  subscribeToConversationsForUser,
  type ConversationWithMeta,
} from '@/services/chatFirestore'
import { subscribeToPresence, type PresenceDoc } from '@/services/chatPresence'
import type { Timestamp } from 'firebase/firestore'

const props = defineProps<{
  currentUserId: number
}>()

defineEmits<{
  (e: 'select-user', user: ChatUser): void
  (e: 'close'): void
}>()

const users = ref<ChatUser[]>([])
const apiUserMap = ref<Map<number, ChatUser>>(new Map())
const loading = ref(true)
const error = ref<string | null>(null)
const presenceMap = reactive<Record<number, PresenceDoc | null>>({})
const unsubPresence: (() => void)[] = []

function mergeConversationsToUsers(conversations: ConversationWithMeta[]) {
  const premiumUsers = Array.from(apiUserMap.value.values())
  const userMap = new Map(premiumUsers.map(u => [u.id, { ...u }]))
  const result: ChatUser[] = []
  const seenIds = new Set<number>()

  for (const conv of conversations) {
    const otherId = conv.otherParticipantId
    seenIds.add(otherId)
    const base = userMap.get(otherId) ?? {
      id: otherId,
      name: conv.participant_names?.[String(otherId)] ?? `User ${otherId}`,
      profile_type: 'user',
      account_type: 'premium' as const,
    }
    const lastTime = conv.last_message_time as Timestamp | null | undefined
    result.push({
      ...base,
      name: conv.participant_names?.[String(otherId)] ?? base.name,
      last_message: conv.last_message ?? base.last_message ?? null,
      last_message_at: lastTime ? lastTime.toDate().toISOString() : base.last_message_at ?? null,
      unread_count: conv.unread_count?.[String(props.currentUserId)] ?? base.unread_count ?? 0,
    })
  }

  for (const u of premiumUsers) {
    if (!seenIds.has(u.id)) {
      result.push(u)
    }
  }

  users.value = result

  // Subscribe to presence for displayed users
  const ids = new Set(result.map(u => u.id))
  for (const fn of unsubPresence) fn()
  unsubPresence.length = 0
  for (const id of ids) {
    const unsub = subscribeToPresence(id, (data) => {
      presenceMap[id] = data
    })
    unsubPresence.push(unsub)
  }
}

async function initChatList() {
  loading.value = true
  error.value = null
  try {
    const apiUsers = await chatService.getChatUsers()
    const premium = apiUsers.filter(
      u => u.id !== props.currentUserId && u.account_type === 'premium'
    )
    apiUserMap.value = new Map(premium.map(u => [u.id, { ...u }]))

    const unsub = subscribeToConversationsForUser(props.currentUserId, (conversations) => {
      mergeConversationsToUsers(conversations)
    }, (err) => {
      console.error('Conversations listener error:', err)
      error.value = 'Failed to load conversations.'
    })

    loading.value = false
    return unsub
  } catch (err) {
    error.value = 'Failed to load chat list. Please try again.'
    console.error('Error loading chat list:', err)
    loading.value = false
    return () => {}
  }
}

function loadChatList() {
  initChatList()
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function capitalize(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

let unsubConversations: (() => void) = () => {}

onMounted(async () => {
  unsubConversations = await initChatList()
})

onUnmounted(() => {
  unsubConversations()
  for (const fn of unsubPresence) fn()
})
</script>
