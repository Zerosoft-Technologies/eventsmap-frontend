<template>
  <!-- Header -->
  <div
    class="tw:flex tw:items-center tw:gap-3 tw:px-4 tw:py-3 tw:border-b tw:border-gray-100 tw:flex-shrink-0 tw:bg-white">
    <button @click="$emit('back')"
      class="tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center tw:rounded-full hover:tw:bg-gray-100 tw:transition-colors tw:flex-shrink-0"
      title="Back">
      <ArrowLeft class="tw:w-5 tw:h-5 tw:text-gray-600" />
    </button>

    <!-- Avatar -->
    <div
      class="tw:w-9 tw:h-9 tw:rounded-full tw:bg-gradient-to-br tw:from-blue-400 tw:to-blue-600 tw:flex tw:items-center tw:justify-center tw:text-white tw:font-semibold tw:text-sm tw:flex-shrink-0 tw:overflow-hidden">
      <img v-if="selectedUser.avatar" :src="selectedUser.avatar" :alt="selectedUser.name"
        class="tw:w-full tw:h-full tw:object-cover" />
      <span v-else>{{ getInitials(selectedUser.name) }}</span>
    </div>

    <div class="tw:flex-1 tw:min-w-0">
      <p class="tw:font-semibold tw:text-sm tw:text-gray-900 tw:truncate">{{ selectedUser.name }}</p>
      <p class="tw:text-xs tw:capitalize" :class="receiverChatActive ? 'tw:text-gray-400' : 'tw:text-slate-500 tw:font-medium'">
        {{ receiverChatActive ? selectedUser.profile_type : t('chat.unavailable') }}
      </p>
    </div>

    <button @click="$emit('close')"
      class="tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center tw:rounded-full hover:tw:bg-gray-100 tw:transition-colors"
      title="Close">
      <X class="tw:w-5 tw:h-5 tw:text-gray-500" />
    </button>
  </div>

  <ChatAvailabilityToggle :user-id="currentUserId" />

  <!-- Messages body -->
  <div
    ref="messagesContainer"
    class="tw:flex-1 tw:overflow-y-auto tw:px-4 tw:py-4 tw:space-y-3 tw:bg-gray-50"
    @scroll="onMessagesScroll"
  >
    <!-- Loading messages -->
    <div v-if="loadingMessages" class="tw:flex tw:items-center tw:justify-center tw:py-8 tw:gap-2 tw:text-gray-400">
      <Loader2 class="tw:w-5 tw:h-5 tw:animate-spin" />
      <span class="tw:text-sm">Loading messages...</span>
    </div>

    <!-- Empty state -->
    <div v-else-if="messages.length === 0"
      class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:h-full tw:gap-3 tw:text-center tw:text-gray-400">
      <MessageCircle class="tw:w-10 tw:h-10 tw:text-gray-300" />
      <p class="tw:text-sm">No messages yet</p>
      <p class="tw:text-xs">Start the conversation!</p>
    </div>

    <!-- Message bubbles -->
    <template v-else>
      <div v-for="msg in messages" :key="msg.id" :class="[
        'tw:flex',
        msg.sender_id === currentUserId ? 'tw:justify-end' : 'tw:justify-start'
      ]">
        <div :class="[
          'tw:max-w-[75%] tw:rounded-2xl tw:px-4 tw:py-2.5 tw:shadow-sm',
          msg.sender_id === currentUserId
            ? 'tw:bg-blue-500 tw:text-white tw:rounded-br-sm'
            : 'tw:bg-white tw:text-gray-900 tw:rounded-bl-sm'
        ]">
          <p class="tw:text-sm tw:leading-relaxed tw:break-words">{{ msg.message }}</p>
          <div :class="[
            'tw:flex tw:items-center tw:gap-1 tw:mt-1',
            msg.sender_id === currentUserId ? 'tw:justify-end' : 'tw:justify-start'
          ]">
            <span :class="[
              'tw:text-[10px]',
              msg.sender_id === currentUserId ? 'tw:text-blue-200' : 'tw:text-gray-400'
            ]">
              {{ formatMsgTime(msg.timestamp) }}
            </span>
            <!-- Status ticks for own messages -->
            <span v-if="msg.sender_id === currentUserId" class="tw:text-[10px] tw:text-blue-200">
              {{ msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓' }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Load older button -->
    <div v-if="hasMoreOlder && !loadingOlder" class="tw:flex tw:justify-center tw:py-2">
      <button
        @click="loadMoreOlder"
        class="tw:px-4 tw:py-2 tw:text-xs tw:text-blue-500 hover:tw:text-blue-600 tw:transition-colors"
      >
        Load older messages
      </button>
    </div>
    <div v-if="loadingOlder" class="tw:flex tw:justify-center tw:py-2">
      <Loader2 class="tw:w-4 tw:h-4 tw:animate-spin tw:text-gray-400" />
    </div>

    <!-- Typing indicator -->
    <div v-if="isTyping" class="tw:flex tw:items-center tw:gap-2 tw:py-2 tw:text-gray-500 tw:text-sm">
      <span class="tw:inline-flex tw:gap-1">
        <span class="tw:w-2 tw:h-2 tw:bg-gray-400 tw:rounded-full tw:animate-bounce" style="animation-delay: 0ms" />
        <span class="tw:w-2 tw:h-2 tw:bg-gray-400 tw:rounded-full tw:animate-bounce" style="animation-delay: 150ms" />
        <span class="tw:w-2 tw:h-2 tw:bg-gray-400 tw:rounded-full tw:animate-bounce" style="animation-delay: 300ms" />
      </span>
      <span>{{ selectedUser.name }} is typing...</span>
    </div>
  </div>

  <!-- Self unavailable -->
  <div
    v-if="!senderChatActive"
    class="tw:bg-slate-100 tw:border-t tw:border-slate-200 tw:px-4 tw:py-2.5 tw:flex-shrink-0"
  >
    <p class="tw:text-xs tw:text-slate-600 tw:flex tw:items-center tw:gap-2">
      <AlertTriangle class="tw:w-4 tw:h-4 tw:flex-shrink-0" />
      {{ t('chat.selfUnavailableBanner') }}
    </p>
  </div>

  <!-- Receiver unavailable -->
  <div
    v-else-if="!receiverChatActive"
    class="tw:bg-amber-50 tw:border-t tw:border-amber-200 tw:px-4 tw:py-2.5 tw:flex-shrink-0"
  >
    <p class="tw:text-xs tw:text-amber-800 tw:flex tw:items-center tw:gap-2">
      <AlertTriangle class="tw:w-4 tw:h-4 tw:flex-shrink-0" />
      {{ t('chat.receiverUnavailableBanner') }}
    </p>
  </div>

  <!-- Rate limit warning -->
  <div v-if="rateLimitMessage"
    class="tw:bg-orange-50 tw:border-t tw:border-orange-200 tw:px-4 tw:py-2 tw:flex-shrink-0">
    <p class="tw:text-xs tw:text-orange-600 tw:flex tw:items-center tw:gap-2">
      <AlertTriangle class="tw:w-4 tw:h-4 tw:flex-shrink-0" />
      {{ rateLimitMessage }}
    </p>
  </div>

  <!-- Connection error -->
  <div v-if="connectionError" class="tw:bg-red-50 tw:border-t tw:border-red-200 tw:px-4 tw:py-2 tw:flex-shrink-0">
    <p class="tw:text-xs tw:text-red-600 tw:flex tw:items-center tw:gap-2">
      <WifiOff class="tw:w-4 tw:h-4 tw:flex-shrink-0" />
      Connection lost. Messages may not send.
    </p>
  </div>

  <!-- Footer: input -->
  <div
    class="tw:flex tw:items-end tw:gap-2 tw:px-4 tw:py-3 tw:border-t tw:border-gray-100 tw:bg-white tw:flex-shrink-0">
    <input
      v-model="inputText"
      type="text"
      :placeholder="sendPlaceholder"
      maxlength="1000"
      class="tw:flex-1 tw:bg-gray-100 tw:rounded-full tw:px-4 tw:py-2.5 tw:text-sm tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-400 tw:transition-all disabled:tw:opacity-60"
      @input="onInputChange"
      @keydown.enter.prevent="sendMessage"
      :disabled="isSendDisabled"
    />
    <button @click="sendMessage" :disabled="isSendDisabled || !inputText.trim()"
      class="tw:w-10 tw:h-10 tw:flex tw:items-center tw:justify-center tw:rounded-full tw:bg-blue-500 tw:text-white hover:tw:bg-blue-600 tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed tw:flex-shrink-0">
      <Send v-if="!isSending" class="tw:w-4 tw:h-4" />
      <Loader2 v-else class="tw:w-4 tw:h-4 tw:animate-spin" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ArrowLeft, X, Send, Loader2, MessageCircle, WifiOff, AlertTriangle,
} from 'lucide-vue-next'
import { Timestamp } from 'firebase/firestore'
import type { ChatUser } from '@/services/chatService'
import { useAuthStore } from '@/stores/auth'
import {
  validateMessage,
  validateChatAvailability,
  createSpamState,
  updateSpamState,
  type SpamState,
} from '@/utils/chatValidation'
import {
  subscribeToPresence,
  isChatActive,
  type PresenceDoc,
} from '@/services/chatPresence'
import ChatAvailabilityToggle from '@/components/chat/ChatAvailabilityToggle.vue'
import {
  getConversationId,
  getOrCreateConversation,
  subscribeToMessages,
  subscribeToConversation,
  sendMessage as firestoreSendMessage,
  markMessagesAsRead,
  loadOlderMessages,
  setTyping,
  clearTyping,
  ChatUnavailableError,
  type MessageWithId,
} from '@/services/chatFirestore'

const { t } = useI18n()

const props = defineProps<{
  currentUserId: number
  selectedUser: ChatUser
}>()

defineEmits<{
  (e: 'back'): void
  (e: 'close'): void
}>()

// ── State ────────────────────────────────────────────────────────────
const olderMessages = ref<MessageWithId[]>([])
const recentMessages = ref<MessageWithId[]>([])
const messages = computed(() => [...olderMessages.value, ...recentMessages.value])
const inputText = ref('')
const loadingMessages = ref(true)
const isSending = ref(false)
const rateLimitMessage = ref<string | null>(null)
const connectionError = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const spamState = ref<SpamState>(createSpamState())
const isTyping = ref(false)
const loadingOlder = ref(false)
const hasMoreOlder = ref(true)
const ownPresence = ref<PresenceDoc | null>(null)
const otherPresence = ref<PresenceDoc | null>(null)
let typingDebounce: ReturnType<typeof setTimeout> | null = null
let unsubscribe: (() => void) | null = null
let unsubscribeConv: (() => void) | null = null
let unsubOwnPresence: (() => void) | null = null
let unsubOtherPresence: (() => void) | null = null
let rateLimitTimer: ReturnType<typeof setTimeout> | null = null

// ── Derived ─────────────────────────────────────────────────────────
const conversationId = computed(() =>
  getConversationId(props.currentUserId, props.selectedUser.id)
)

const senderChatActive = computed(() => isChatActive(ownPresence.value))
const receiverChatActive = computed(() => isChatActive(otherPresence.value))

const isSendDisabled = computed(
  () =>
    isSending.value
    || !!rateLimitMessage.value
    || !senderChatActive.value
    || !receiverChatActive.value,
)

const sendPlaceholder = computed(() => {
  if (!senderChatActive.value) return t('chat.placeholderSelfInactive')
  if (!receiverChatActive.value) return t('chat.placeholderReceiverInactive')
  return t('chat.placeholderDefault')
})

// ── Helpers ─────────────────────────────────────────────────────────
function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function formatMsgTime(ts: Timestamp | null | undefined): string {
  if (!ts) return ''
  const date = ts.toDate()
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// ── Load older messages ───────────────────────────────────────────────
async function loadMoreOlder() {
  const all = messages.value
  if (loadingOlder.value || all.length === 0) return
  const oldest = olderMessages.value.length > 0 ? olderMessages.value[0] : recentMessages.value[0]
  const ts = oldest?.timestamp
  if (!ts) return
  loadingOlder.value = true
  try {
    const older = await loadOlderMessages(conversationId.value, ts)
    if (older.length < 50) hasMoreOlder.value = false
    olderMessages.value = [...older, ...olderMessages.value]
  } catch (err) {
    console.error('Error loading older messages:', err)
  } finally {
    loadingOlder.value = false
  }
}

function onMessagesScroll() {
  const el = messagesContainer.value
  if (!el || loadingOlder.value || !hasMoreOlder.value || messages.value.length === 0) return
  if (el.scrollTop < 80) loadMoreOlder()
}

// ── Typing indicator ──────────────────────────────────────────────────
function onInputChange() {
  if (isSendDisabled.value) return
  if (typingDebounce) clearTimeout(typingDebounce)
  setTyping(conversationId.value, props.currentUserId)
  typingDebounce = setTimeout(() => {
    clearTyping(conversationId.value, props.currentUserId)
    typingDebounce = null
  }, 2000)
}

// ── Firestore: conversation setup + real-time messages ───────────────
function startMessageListener() {
  unsubscribe = subscribeToMessages(
    conversationId.value,
    props.currentUserId,
    async (incoming, snapshot) => {
      connectionError.value = false
      recentMessages.value = incoming
      loadingMessages.value = false
      scrollToBottom()
      await markMessagesAsRead(conversationId.value, props.currentUserId, snapshot)
    },
    () => {
      connectionError.value = true
      loadingMessages.value = false
    }
  )

  unsubscribeConv = subscribeToConversation(
    conversationId.value,
    (data) => {
      const otherTyping = data.typing_users?.[String(props.selectedUser.id)]
      isTyping.value = !!otherTyping
    },
    () => {}
  )
}

async function initAndListen() {
  loadingMessages.value = true
  olderMessages.value = []
  recentMessages.value = []
  isTyping.value = false
  hasMoreOlder.value = true

  const authStore = useAuthStore()
  const participantNames: { [key: number]: string } = {
    [props.currentUserId]: authStore.user?.name || authStore.user?.email || `User ${props.currentUserId}`,
    [props.selectedUser.id]: props.selectedUser.name,
  }

  try {
    await getOrCreateConversation(
      conversationId.value,
      props.currentUserId,
      props.selectedUser.id,
      participantNames
    )

    startMessageListener()
  } catch (err) {
    console.error('Error initializing conversation:', err)
    connectionError.value = true
    loadingMessages.value = false
  }
}

// ── Sending ──────────────────────────────────────────────────────────
async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isSendDisabled.value) return

  const availability = validateChatAvailability({
    senderChatActive: senderChatActive.value,
    receiverChatActive: receiverChatActive.value,
  })
  if (!availability.valid) {
    rateLimitMessage.value = availability.error ?? t('chat.cannotSend')
    if (rateLimitTimer) clearTimeout(rateLimitTimer)
    rateLimitTimer = setTimeout(() => { rateLimitMessage.value = null }, 5000)
    return
  }

  const validation = validateMessage(text, props.currentUserId, props.selectedUser.id, spamState.value)
  if (!validation.valid) {
    rateLimitMessage.value = validation.error ?? t('chat.cannotSend')
    if (rateLimitTimer) clearTimeout(rateLimitTimer)
    rateLimitTimer = setTimeout(() => { rateLimitMessage.value = null }, 5000)
    return
  }

  isSending.value = true

  clearTyping(conversationId.value, props.currentUserId)

  try {
    const senderName = useAuthStore().user?.name || useAuthStore().user?.email || `User ${props.currentUserId}`
    await firestoreSendMessage(
      conversationId.value,
      props.currentUserId,
      props.selectedUser.id,
      text,
      senderName,
      props.selectedUser.name
    )

    spamState.value = updateSpamState(spamState.value, text)
    inputText.value = ''
  } catch (err: any) {
    if (err instanceof ChatUnavailableError) {
      rateLimitMessage.value = err.message
      if (rateLimitTimer) clearTimeout(rateLimitTimer)
      rateLimitTimer = setTimeout(() => { rateLimitMessage.value = null }, 5000)
    } else if (err?.response?.status === 429) {
      rateLimitMessage.value = t('chat.rateLimit')
      if (rateLimitTimer) clearTimeout(rateLimitTimer)
      rateLimitTimer = setTimeout(() => {
        rateLimitMessage.value = null
      }, 30_000)
    } else {
      console.error('Error sending message:', err)
      connectionError.value = true
    }
  } finally {
    isSending.value = false
  }
}

function startPresenceListeners() {
  unsubOwnPresence?.()
  unsubOtherPresence?.()
  unsubOwnPresence = subscribeToPresence(props.currentUserId, (data) => {
    ownPresence.value = data
  })
  unsubOtherPresence = subscribeToPresence(props.selectedUser.id, (data) => {
    otherPresence.value = data
  })
}

function stopPresenceListeners() {
  unsubOwnPresence?.()
  unsubOtherPresence?.()
  unsubOwnPresence = null
  unsubOtherPresence = null
}

// ── Lifecycle ────────────────────────────────────────────────────────
watch(() => props.selectedUser.id, () => {
  if (unsubscribe) unsubscribe()
  if (unsubscribeConv) unsubscribeConv()
  if (typingDebounce) clearTimeout(typingDebounce)
  clearTyping(conversationId.value, props.currentUserId)
  spamState.value = createSpamState()
  startPresenceListeners()
  initAndListen()
})

onMounted(() => {
  startPresenceListeners()
  initAndListen()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
  if (unsubscribeConv) unsubscribeConv()
  stopPresenceListeners()
  if (typingDebounce) clearTimeout(typingDebounce)
  clearTyping(conversationId.value, props.currentUserId)
  if (rateLimitTimer) clearTimeout(rateLimitTimer)
})
</script>
