<template>
  <div
    class="tw:flex tw:items-center tw:justify-between tw:gap-3 tw:px-4 tw:py-3 tw:border-b tw:border-gray-100 tw:flex-shrink-0"
    :class="chatActive ? 'tw:bg-emerald-50/60' : 'tw:bg-slate-50'"
  >
    <div class="tw:flex tw:items-center tw:gap-2.5 tw:min-w-0">
      <span
        class="tw:flex tw:h-8 tw:w-8 tw:flex-shrink-0 tw:items-center tw:justify-center tw:rounded-full"
        :class="chatActive ? 'tw:bg-emerald-100 tw:text-emerald-700' : 'tw:bg-slate-200 tw:text-slate-500'"
        aria-hidden="true"
      >
        <MessageCircle v-if="chatActive" class="tw:h-4 tw:w-4" />
        <MessageCircleOff v-else class="tw:h-4 tw:w-4" />
      </span>
      <div class="tw:min-w-0">
        <p class="tw:text-sm tw:font-medium tw:text-gray-900">{{ t('chat.availabilityTitle') }}</p>
        <p class="tw:text-xs tw:text-gray-500 tw:leading-snug">
          {{ chatActive ? t('chat.availabilityActiveHint') : t('chat.availabilityInactiveHint') }}
        </p>
      </div>
    </div>

    <button
      type="button"
      role="switch"
      class="no-hover tw:relative tw:inline-flex tw:h-7 tw:w-12 tw:flex-shrink-0 tw:cursor-pointer tw:rounded-full tw:border-2 tw:border-transparent tw:transition-colors tw:duration-200 focus:tw:outline-none focus-visible:tw:ring-2 focus-visible:tw:ring-blue-400 focus-visible:tw:ring-offset-2"
      :class="chatActive ? 'tw:bg-emerald-500' : 'tw:bg-slate-300'"
      :aria-checked="chatActive"
      :aria-label="chatActive ? t('chat.turnOffAvailability') : t('chat.turnOnAvailability')"
      :disabled="updating"
      @click="toggle"
    >
      <span
        class="tw:pointer-events-none tw:inline-block tw:h-6 tw:w-6 tw:transform tw:rounded-full tw:bg-white tw:shadow tw:ring-0 tw:transition tw:duration-200"
        :class="chatActive ? 'tw:translate-x-5' : 'tw:translate-x-0'"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MessageCircle, MessageCircleOff } from 'lucide-vue-next'
import {
  subscribeToPresence,
  setChatActive,
  isChatActive,
  type PresenceDoc,
} from '@/services/chatPresence'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()

const props = defineProps<{
  userId: number
}>()

const presence = ref<PresenceDoc | null>(null)
const updating = ref(false)
let unsubPresence: (() => void) | null = null

const chatActive = computed(() => isChatActive(presence.value))

const displayName = computed(
  () => authStore.user?.name || authStore.user?.email || `User ${props.userId}`,
)

async function toggle() {
  if (updating.value) return
  updating.value = true
  const next = !chatActive.value
  try {
    await setChatActive(props.userId, displayName.value, next)
  } catch (err) {
    console.error('Failed to update chat availability:', err)
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  unsubPresence = subscribeToPresence(props.userId, (data) => {
    presence.value = data
  })
})

onUnmounted(() => {
  unsubPresence?.()
  unsubPresence = null
})
</script>
