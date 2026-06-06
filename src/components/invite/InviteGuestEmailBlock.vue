<template>
  <div class="invite-guest-block tw:mt-3 tw:pt-3 tw:border-t tw:border-dashed tw:border-gray-200">
    <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-500 tw:mb-2">
      {{ t('invite.guestTitle') }}
    </p>
    <p class="tw:text-xs tw:text-gray-500 tw:mb-3 tw:leading-relaxed">
      {{ t('invite.guestHint') }}
    </p>

    <div class="tw:flex tw:flex-col tw:sm:flex-row tw:gap-2">
      <div class="tw:flex-1 tw:min-w-0">
        <input
          v-model="emailInput"
          type="email"
          autocomplete="off"
          :placeholder="t('invite.guestEmailPlaceholder')"
          :disabled="!canInteract || sending"
          class="tw:w-full tw:rounded-lg tw:border tw:px-3 tw:py-2 tw:text-sm focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[var(--primary-color)]/30"
          :class="inputClass"
          @blur="onEmailBlur"
          @keydown.enter.prevent="trySend"
        />
        <input
          v-model="nameInput"
          type="text"
          :placeholder="t('invite.guestNamePlaceholder')"
          :disabled="!canInteract || sending"
          class="tw:w-full tw:mt-2 tw:rounded-lg tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:text-sm focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[var(--primary-color)]/30"
        />
      </div>
      <button
        type="button"
        class="no-hover tw:self-start tw:shrink-0 tw:rounded-lg tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
        :class="canSend ? 'tw:bg-[var(--primary-color)] tw:text-white hover:tw:opacity-90' : 'tw:bg-gray-100 tw:text-gray-400'"
        :disabled="!canSend"
        @click="trySend"
      >
        <span v-if="sending" class="tw:inline-flex tw:items-center tw:gap-1">
          <Loader2 class="tw:h-4 tw:w-4 tw:animate-spin" />
          {{ t('invite.guestSending') }}
        </span>
        <span v-else>{{ t('invite.guestSend') }}</span>
      </button>
    </div>

    <p v-if="statusMessage" class="tw:mt-2 tw:text-xs tw:leading-relaxed" :class="statusClass">
      {{ statusMessage }}
    </p>

    <ul v-if="sentInvites.length" class="tw:mt-3 tw:space-y-1.5 tw:m-0 tw:p-0 tw:list-none">
      <li
        v-for="item in sentInvites"
        :key="item.id ?? item.email"
        class="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:rounded-lg tw:bg-emerald-50 tw:border tw:border-emerald-100 tw:px-3 tw:py-2"
      >
        <div class="tw:min-w-0">
          <p class="tw:text-sm tw:font-medium tw:text-gray-800 tw:truncate">{{ item.email }}</p>
          <p v-if="item.name" class="tw:text-xs tw:text-gray-500 tw:truncate">{{ item.name }}</p>
        </div>
        <span class="tw:text-[10px] tw:font-semibold tw:uppercase tw:text-emerald-700 tw:shrink-0">
          {{ t('invite.guestSent') }}
        </span>
      </li>
    </ul>

    <ul v-if="queuedInvites.length && !eventId" class="tw:mt-3 tw:space-y-1.5 tw:m-0 tw:p-0 tw:list-none">
      <li
        v-for="(item, idx) in queuedInvites"
        :key="`${item.email}-${idx}`"
        class="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:rounded-lg tw:bg-amber-50 tw:border tw:border-amber-100 tw:px-3 tw:py-2"
      >
        <p class="tw:text-sm tw:text-gray-800 tw:truncate">{{ item.email }}</p>
        <button
          type="button"
          class="tw:text-xs tw:text-red-600 hover:tw:underline"
          @click="removeQueued(idx)"
        >
          Remove
        </button>
      </li>
    </ul>
    <p v-if="queuedInvites.length && !eventId" class="tw:mt-1 tw:text-[11px] tw:text-amber-700">
      {{ t('invite.guestQueuedHint') }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Loader2 } from 'lucide-vue-next'
import {
  validateGuestInvitationEmail,
  sendGuestInvitation,
} from '@/api/guestInvitations'

const props = defineProps({
  role: {
    type: String,
    required: true,
  },
  eventId: {
    type: [Number, String],
    default: null,
  },
})

const emit = defineEmits(['queued', 'sent'])

const { t } = useI18n()

const emailInput = ref('')
const nameInput = ref('')
const validationCode = ref(null)
const statusMessage = ref('')
const sending = ref(false)
const sentInvites = ref([])
const queuedInvites = ref([])

const canInteract = computed(() => Boolean(props.eventId) || true)

const canSend = computed(() => {
  if (sending.value) return false
  if (!emailInput.value.trim()) return false
  if (validationCode.value === 'USER_EXISTS' || validationCode.value === 'INVITATION_PENDING') {
    return false
  }
  return true
})

const inputClass = computed(() => {
  if (validationCode.value === 'USER_EXISTS' || validationCode.value === 'INVITATION_PENDING') {
    return 'tw:border-red-300 tw:bg-red-50/50'
  }
  if (validationCode.value === 'OK') {
    return 'tw:border-emerald-300 tw:bg-emerald-50/30'
  }
  return 'tw:border-gray-200'
})

const statusClass = computed(() => {
  if (validationCode.value === 'USER_EXISTS' || validationCode.value === 'INVITATION_PENDING') {
    return 'tw:text-red-600'
  }
  if (validationCode.value === 'OK') {
    return 'tw:text-emerald-600'
  }
  return 'tw:text-gray-500'
})

watch(emailInput, () => {
  if (validationCode.value) {
    validationCode.value = null
    statusMessage.value = ''
  }
})

function mapValidationMessage(code, fallback) {
  if (code === 'USER_EXISTS') return t('invite.guestUserExists')
  if (code === 'INVITATION_PENDING') return t('invite.guestAlreadyInvited')
  return fallback
}

async function onEmailBlur() {
  const email = emailInput.value.trim()
  if (!email || !props.eventId) return

  try {
    const res = await validateGuestInvitationEmail(Number(props.eventId), email, props.role)
    validationCode.value = res.code ?? (res.success ? 'OK' : null)
    statusMessage.value = mapValidationMessage(validationCode.value, res.message)
  } catch (err) {
    const data = err?.response?.data
    validationCode.value = data?.code ?? null
    statusMessage.value = mapValidationMessage(validationCode.value, data?.message ?? t('invite.guestValidateError'))
  }
}

async function trySend() {
  const email = emailInput.value.trim()
  if (!email) return

  if (props.eventId) {
    await onEmailBlur()
    if (!canSend.value) return

    sending.value = true
    try {
      const res = await sendGuestInvitation(Number(props.eventId), {
        email,
        name: nameInput.value.trim(),
        role: props.role,
      })
      if (res.success) {
        sentInvites.value.push({
          id: res.data?.id,
          email,
          name: nameInput.value.trim(),
        })
        statusMessage.value = t('invite.guestSendSuccess')
        validationCode.value = 'OK'
        emailInput.value = ''
        nameInput.value = ''
        emit('sent', { email, role: props.role })
      } else {
        validationCode.value = res.code ?? null
        statusMessage.value = mapValidationMessage(res.code, res.message)
      }
    } catch (err) {
      const data = err?.response?.data
      validationCode.value = data?.code ?? null
      statusMessage.value = mapValidationMessage(validationCode.value, data?.message ?? t('invite.guestSendError'))
    } finally {
      sending.value = false
    }
    return
  }

  queuedInvites.value.push({
    email,
    name: nameInput.value.trim(),
    role: props.role,
  })
  emit('queued', { email, name: nameInput.value.trim(), role: props.role })
  statusMessage.value = t('invite.guestQueued')
  emailInput.value = ''
  nameInput.value = ''
}

function removeQueued(index) {
  queuedInvites.value.splice(index, 1)
}

/** Flush queued invites after event is created (called from parent). */
async function flushQueued(eventId) {
  const queue = [...queuedInvites.value]
  queuedInvites.value = []
  for (const item of queue) {
    try {
      const res = await sendGuestInvitation(eventId, item)
      if (res.success) {
        sentInvites.value.push({ id: res.data?.id, email: item.email, name: item.name })
      }
    } catch {
      queuedInvites.value.push(item)
    }
  }
}

defineExpose({ flushQueued, queuedInvites })
</script>
