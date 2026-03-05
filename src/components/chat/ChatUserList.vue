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
      @click="loadUsers"
      class="tw:px-4 tw:py-2 tw:text-sm tw:bg-blue-500 tw:text-white tw:rounded-lg hover:tw:bg-blue-600 tw:transition-colors"
    >
      Retry
    </button>
  </div>

  <!-- Empty -->
  <div v-else-if="users.length === 0" class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:flex-1 tw:gap-3 tw:px-6 tw:text-center">
    <MessageCircle class="tw:w-12 tw:h-12 tw:text-gray-300" />
    <p class="tw:text-sm tw:font-medium tw:text-gray-500">No participants yet</p>
    <p class="tw:text-xs tw:text-gray-400">Invite users to your event to start chatting</p>
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
import { ref, onMounted } from 'vue'
import { X, Loader2, MessageCircle, WifiOff } from 'lucide-vue-next'
import { chatService, type ChatUser } from '@/services/chatService'

const props = defineProps<{
  eventId: number
  currentUserId: number
}>()

defineEmits<{
  (e: 'select-user', user: ChatUser): void
  (e: 'close'): void
}>()

const users   = ref<ChatUser[]>([])
const loading = ref(false)
const error   = ref<string | null>(null)

async function loadUsers() {
  loading.value = true
  error.value   = null
  try {
    users.value = await chatService.getChatUsers(props.eventId)
    // Filter out the current user from the list
    users.value = users.value.filter(u => u.id !== props.currentUserId)
  } catch (err) {
    error.value = 'Failed to load participants. Please try again.'
    console.error('Error loading chat users:', err)
  } finally {
    loading.value = false
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

function capitalize(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  const now  = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' })
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

onMounted(loadUsers)
</script>
