<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="chat-backdrop">
      <div
        v-if="isOpen"
        class="tw:fixed tw:inset-0 tw:bg-black/40 tw:z-40"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="chat-panel">
      <div
        v-if="isOpen"
        class="tw:fixed tw:top-0 tw:right-0 tw:h-full tw:w-full sm:tw:w-[400px] tw:max-w-full tw:bg-white tw:z-50 tw:shadow-2xl tw:flex tw:flex-col"
      >
        <!-- ── CHECKING ACCESS ── -->
        <div v-if="view === 'checking'" class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:flex-1 tw:gap-4 tw:text-gray-400">
          <Loader2 class="tw:w-10 tw:h-10 tw:animate-spin tw:text-blue-500" />
          <p class="tw:text-sm">Checking chat access...</p>
        </div>

        <!-- ── NO ACCESS ── -->
        <div v-else-if="view === 'no-access'" class="tw:flex tw:flex-col tw:h-full">
          <div class="tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-4 tw:border-b tw:border-gray-100">
            <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900">Chat</h2>
            <button
              @click="$emit('close')"
              class="tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center tw:rounded-full hover:tw:bg-gray-100 tw:transition-colors"
            >
              <X class="tw:w-5 tw:h-5 tw:text-gray-500" />
            </button>
          </div>
          <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:flex-1 tw:gap-4 tw:px-6 tw:text-center">
            <MessageSquareOff class="tw:w-14 tw:h-14 tw:text-gray-300" />
            <p class="tw:text-base tw:font-medium tw:text-gray-600">Chat not available</p>
            <p class="tw:text-sm tw:text-gray-400 tw:leading-relaxed">
              Chat is available only for premium users.
            </p>
          </div>
        </div>

        <!-- ── FIREBASE AUTH ERROR ── -->
        <div v-else-if="view === 'error'" class="tw:flex tw:flex-col tw:h-full">
          <div class="tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-4 tw:border-b tw:border-gray-100">
            <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900">Chat</h2>
            <button @click="$emit('close')" class="tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center tw:rounded-full hover:tw:bg-gray-100">
              <X class="tw:w-5 tw:h-5 tw:text-gray-500" />
            </button>
          </div>
          <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:flex-1 tw:gap-4 tw:px-6 tw:text-center">
            <WifiOff class="tw:w-14 tw:h-14 tw:text-red-300" />
            <p class="tw:text-sm tw:text-red-500">{{ errorMessage }}</p>
            <button
              @click="initChat"
              class="tw:px-5 tw:py-2 tw:bg-blue-500 tw:text-white tw:text-sm tw:rounded-lg hover:tw:bg-blue-600 tw:transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- ── USER LIST ── -->
        <template v-else-if="view === 'user-list'">
          <ChatUserList
            :current-user-id="currentUserId"
            @select-user="openConversation"
            @close="$emit('close')"
          />
        </template>

        <!-- ── CONVERSATION ── -->
        <template v-else-if="view === 'conversation' && selectedUser">
          <ChatConversation
            :current-user-id="currentUserId"
            :selected-user="selectedUser"
            @back="view = 'user-list'"
            @close="$emit('close')"
          />
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Loader2, X, WifiOff, MessageSquareOff } from 'lucide-vue-next'
import { signInWithCustomToken } from 'firebase/auth'
import { firebaseAuth } from '@/services/firebase'
import { chatService, type ChatUser } from '@/services/chatService'
import { setOnline, setOffline } from '@/services/chatPresence'
import { useAuthStore } from '@/stores/auth'
import ChatUserList from './ChatUserList.vue'
import ChatConversation from './ChatConversation.vue'

type ChatView = 'checking' | 'no-access' | 'user-list' | 'conversation' | 'error'

const props = defineProps<{
  isOpen: boolean
  currentUserId: number
}>()

defineEmits<{
  (e: 'close'): void
}>()

const authStore = useAuthStore()

// ── State ────────────────────────────────────────────────────────────
const view = ref<ChatView>('checking')
const selectedUser = ref<ChatUser | null>(null)
const errorMessage = ref<string>('')

// ── Initialization ───────────────────────────────────────────────────
async function initChat() {
  view.value = 'checking'
  errorMessage.value = ''

  try {
    // 1. Check if user is premium (no event dependency)
    if (authStore.user?.account_type !== 'premium') {
      view.value = 'no-access'
      return
    }

    // 2. Get Firebase custom token from backend
    const firebaseToken = await chatService.getFirebaseToken()

    // 3. Sign in to Firebase
    await signInWithCustomToken(firebaseAuth, firebaseToken)

    // 4. Set presence online
    const name = authStore.user?.name || authStore.user?.email || `User ${authStore.user?.id}`
    if (authStore.user?.id) await setOnline(authStore.user.id, name)

    // 5. Show user list
    view.value = 'user-list'

  } catch (err: any) {
    console.error('Chat initialization error:', err)
    errorMessage.value = err?.response?.data?.message
      || 'Failed to connect to chat. Please try again.'
    view.value = 'error'
  }
}

function openConversation(user: ChatUser) {
  selectedUser.value = user
  view.value         = 'conversation'
}

// ── Watchers ─────────────────────────────────────────────────────────
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      view.value         = 'checking'
      selectedUser.value = null
      initChat()
    } else {
      // Set offline when chat panel closes
      const uid = authStore.user?.id
      const name = authStore.user?.name || authStore.user?.email || `User ${uid}`
      if (uid) setOffline(uid, name)
    }
  },
  { immediate: false },
)
</script>

<style scoped>
/* Backdrop */
.chat-backdrop-enter-active,
.chat-backdrop-leave-active { transition: opacity 0.25s ease; }
.chat-backdrop-enter-from,
.chat-backdrop-leave-to     { opacity: 0; }

/* Panel slides in from right */
.chat-panel-enter-active,
.chat-panel-leave-active { transition: transform 0.3s ease; }
.chat-panel-enter-from,
.chat-panel-leave-to     { transform: translateX(100%); }
</style>
