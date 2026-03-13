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
      <p class="tw:text-xs tw:text-gray-400 tw:capitalize">{{ selectedUser.profile_type }}</p>
    </div>

    <button @click="$emit('close')"
      class="tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center tw:rounded-full hover:tw:bg-gray-100 tw:transition-colors"
      title="Close">
      <X class="tw:w-5 tw:h-5 tw:text-gray-500" />
    </button>
  </div>

  <!-- Messages body -->
  <div ref="messagesContainer" class="tw:flex-1 tw:overflow-y-auto tw:px-4 tw:py-4 tw:space-y-3 tw:bg-gray-50">
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
    <input v-model="inputText" type="text" placeholder="Type a message..." maxlength="2000"
      class="tw:flex-1 tw:bg-gray-100 tw:rounded-full tw:px-4 tw:py-2.5 tw:text-sm tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-400 tw:transition-all"
      @keydown.enter.prevent="sendMessage" :disabled="isSendDisabled" />
    <button @click="sendMessage" :disabled="isSendDisabled || !inputText.trim()"
      class="tw:w-10 tw:h-10 tw:flex tw:items-center tw:justify-center tw:rounded-full tw:bg-blue-500 tw:text-white hover:tw:bg-blue-600 tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed tw:flex-shrink-0">
      <Send v-if="!isSending" class="tw:w-4 tw:h-4" />
      <Loader2 v-else class="tw:w-4 tw:h-4 tw:animate-spin" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'
import {
  ArrowLeft, X, Send, Loader2, MessageCircle, WifiOff, AlertTriangle,
} from 'lucide-vue-next'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  writeBatch,
  doc,
  Timestamp,
  type QuerySnapshot,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { chatService, type ChatUser } from '@/services/chatService'

interface FirestoreMessage {
  id: string
  room_id: string
  event_id: number
  sender_id: number
  receiver_id: number
  message: string
  message_type: string
  timestamp: Timestamp | null
  status: 'sent' | 'delivered' | 'read'
}

const props = defineProps<{
  currentUserId: number
  selectedUser: ChatUser
}>()

defineEmits<{
  (e: 'back'): void
  (e: 'close'): void
}>()

// ── State ────────────────────────────────────────────────────────────
const messages = ref<FirestoreMessage[]>([])
const inputText = ref('')
const loadingMessages = ref(true)
const isSending = ref(false)
const rateLimitMessage = ref<string | null>(null)
const connectionError = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
let unsubscribe: Unsubscribe | null = null
let rateLimitTimer: ReturnType<typeof setTimeout> | null = null

// ── Derived ─────────────────────────────────────────────────────────
const roomId = computed(() => {
  const ids = [props.currentUserId, props.selectedUser.id].sort((a, b) => a - b)
  return `global_${ids[0]}_${ids[1]}`
})

const isSendDisabled = computed(() => isSending.value || !!rateLimitMessage.value)

// ── Helpers ─────────────────────────────────────────────────────────
function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function formatMsgTime(ts: Timestamp | null): string {
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

// ── Firestore listener ───────────────────────────────────────────────
function startMessageListener() {
  const q = query(
    collection(firestore, 'messages'),
    where('room_id', '==', roomId.value),
    orderBy('timestamp', 'asc'),
  )

  unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      connectionError.value = false
      const incoming = snapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<FirestoreMessage, 'id'>),
      }))
      messages.value = incoming
      loadingMessages.value = false
      scrollToBottom()

      // Mark messages from the other user as read
      markMessagesAsRead(snapshot)
    },
    (err) => {
      console.error('Firestore listener error:', err)
      connectionError.value = true
      loadingMessages.value = false
    },
  )
}

async function markMessagesAsRead(snapshot: QuerySnapshot<DocumentData>) {
  try {
    const batch   = writeBatch(firestore)
    let   hasWork = false

    snapshot.docs.forEach((d) => {
      const data = d.data() as FirestoreMessage
      if (data.receiver_id === props.currentUserId && data.status !== 'read') {
        batch.update(doc(firestore, 'messages', d.id), { status: 'read' })
        hasWork = true
      }
    })

    if (hasWork) await batch.commit()
  } catch (err) {
    console.error('Error marking messages as read:', err)
  }
}

// ── Sending ──────────────────────────────────────────────────────────
async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isSendDisabled.value) return

  isSending.value = true

  try {
    // 1. Validate with Laravel backend
    const validation = await chatService.validateMessage()

    if (!validation.can_send) {
      rateLimitMessage.value = 'You are not allowed to send messages.'
      return
    }

    // 2. Write to Firestore (event_id: 0 for global chat)
    await addDoc(collection(firestore, 'messages'), {
      room_id: roomId.value,
      event_id: 0,
      sender_id: props.currentUserId,
      receiver_id: props.selectedUser.id,
      message: text,
      message_type: 'text',
      timestamp: serverTimestamp(),
      status: 'sent',
    })

    inputText.value = ''

  } catch (err: any) {
    if (err?.response?.status === 429) {
      // Rate limit
      rateLimitMessage.value = 'Too many messages. Please wait before sending more.'

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

// ── Lifecycle ────────────────────────────────────────────────────────
watch(() => props.selectedUser.id, () => {
  if (unsubscribe) unsubscribe()
  loadingMessages.value = true
  messages.value = []
  startMessageListener()
})

onMounted(() => {
  startMessageListener()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
  if (rateLimitTimer) clearTimeout(rateLimitTimer)
})
</script>
