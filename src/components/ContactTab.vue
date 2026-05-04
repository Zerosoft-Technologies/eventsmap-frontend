<template>
  <div class="tw:space-y-6">
    <!-- Telephone -->
    <div class="tw:flex tw:gap-3">
      <div
        class="tw:flex tw:h-11 tw:w-11 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-sky-100"
      >
        <Phone class="tw:h-5 tw:w-5 tw:text-[#0061FF]" :stroke-width="2" aria-hidden="true" />
      </div>
      <div class="tw:min-w-0 tw:flex-1">
        <p class="tw:text-base tw:font-semibold tw:text-gray-900">
          {{ $t('eventDetails.contact.telephone') }}
        </p>
        <a
          v-if="phoneDisplay"
          :href="phoneHref"
          class="tw:mt-0.5 tw:inline-block tw:text-sm tw:font-medium tw:text-[#0061FF] hover:tw:underline"
        >
          {{ phoneDisplay }}
        </a>
        <p v-else class="tw:mt-0.5 tw:text-sm tw:text-gray-400">
          {{ $t('eventDetails.contact.notProvided') }}
        </p>
        <p class="tw:mt-1 tw:text-sm tw:text-gray-600">
          {{ $t('eventDetails.contact.phoneDescription') }}
        </p>
        <p class="tw:mt-0.5 tw:text-xs tw:text-gray-400">
          {{ $t('eventDetails.contact.phoneHours') }}
        </p>
      </div>
    </div>

    <!-- Email -->
    <div class="tw:flex tw:gap-3">
      <div
        class="tw:flex tw:h-11 tw:w-11 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-orange-50"
      >
        <Mail class="tw:h-5 tw:w-5 tw:text-[#FF7700]" :stroke-width="2" aria-hidden="true" />
      </div>
      <div class="tw:min-w-0 tw:flex-1">
        <p class="tw:text-base tw:font-semibold tw:text-gray-900">
          {{ $t('eventDetails.contact.email') }}
        </p>
        <p class="tw:mt-1 tw:text-sm tw:text-gray-600">
          {{ $t('eventDetails.contact.emailDescription') }}
        </p>
        <a
          v-if="emailDisplay"
          :href="`mailto:${emailDisplay}`"
          class="tw:mt-1 tw:inline-block tw:break-all tw:text-sm tw:font-medium tw:text-[#0061FF] hover:tw:underline"
        >
          {{ emailDisplay }}
        </a>
        <p v-else class="tw:mt-1 tw:text-sm tw:text-gray-400">
          {{ $t('eventDetails.contact.notProvided') }}
        </p>
        <p class="tw:mt-0.5 tw:text-xs tw:text-gray-400">
          {{ $t('eventDetails.contact.emailResponse') }}
        </p>
      </div>
    </div>

    <!-- Website -->
    <div class="tw:flex tw:gap-3">
      <div
        class="tw:flex tw:h-11 tw:w-11 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-sky-100"
      >
        <Globe class="tw:h-5 tw:w-5 tw:text-[#0061FF]" :stroke-width="2" aria-hidden="true" />
      </div>
      <div class="tw:min-w-0 tw:flex-1">
        <p class="tw:text-base tw:font-semibold tw:text-gray-900">
          {{ $t('eventDetails.contact.website') }}
        </p>
        <p class="tw:mt-1 tw:text-sm tw:text-gray-600">
          {{ $t('eventDetails.contact.websiteDescription') }}
        </p>
        <a
          v-if="websiteRaw"
          :href="websiteHref"
          target="_blank"
          rel="noopener noreferrer"
          class="tw:mt-1 tw:inline-block tw:break-all tw:text-sm tw:font-medium tw:text-[#0061FF] hover:tw:underline"
        >
          {{ websiteLabel }}
        </a>
        <p v-else class="tw:mt-1 tw:text-sm tw:text-gray-400">
          {{ $t('eventDetails.contact.notProvided') }}
        </p>
        <p class="tw:mt-0.5 tw:text-xs tw:text-gray-400">
          {{ $t('eventDetails.contact.websiteHint') }}
        </p>
      </div>
    </div>

    <!-- Contact box copy from host / invited profiles (saved on organiser, venue, talent, or event) -->
    <div
      v-if="contactDesignBlocks.length > 0"
      class="tw:space-y-3 tw:rounded-2xl tw:border tw:border-orange-100 tw:bg-orange-50/60 tw:p-4"
    >
      <div
        v-for="(block, idx) in contactDesignBlocks"
        :key="`design-${idx}-${block.text.slice(0, 32)}`"
      >
        <p class="tw:text-sm tw:font-semibold tw:text-gray-900">
          <template v-if="block.kind === 'event'">{{ $t('eventDetails.contact.designMessageTitle') }}</template>
          <template v-else>
            {{ block.entityLabel }}
            <span v-if="block.entityName" class="tw:font-normal tw:text-gray-600"> — {{ block.entityName }}</span>
          </template>
        </p>
        <p class="tw:mt-1.5 tw:text-sm tw:leading-relaxed tw:text-gray-800 tw:whitespace-pre-wrap">
          {{ block.text }}
        </p>
      </div>
    </div>

    <h3 class="tw:pt-2 tw:text-lg tw:font-semibold tw:text-gray-900">
      {{ $t('eventDetails.contact.sendMessageTitle') }}
    </h3>

    <div class="tw:rounded-2xl tw:border tw:border-gray-200 tw:bg-white tw:p-4 tw:shadow-sm">
      <div class="tw:flex tw:gap-3 tw:pb-4">
        <div
          class="tw:flex tw:h-10 tw:w-10 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-orange-50"
        >
          <MessageCircle class="tw:h-5 tw:w-5 tw:text-[#FF7700]" :stroke-width="2" aria-hidden="true" />
        </div>
        <div>
          <p class="tw:font-semibold tw:text-gray-900">{{ $t('eventDetails.contact.formCardTitle') }}</p>
          <p class="tw:mt-0.5 tw:text-sm tw:text-gray-600">
            {{ $t('eventDetails.contact.formCardSubtitle') }}
          </p>
        </div>
      </div>

      <form class="tw:space-y-4" @submit.prevent="onSubmit">
        <div
          v-if="formSuccess"
          class="tw:rounded-lg tw:bg-green-50 tw:px-3 tw:py-2 tw:text-sm tw:text-green-800"
          role="status"
        >
          {{ $t('eventDetails.contact.formSuccess') }}
        </div>
        <div
          v-if="formError"
          class="tw:rounded-lg tw:bg-red-50 tw:px-3 tw:py-2 tw:text-sm tw:text-red-700"
          role="alert"
        >
          {{ formError }}
        </div>

        <div>
          <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-800" for="contact-full-name">
            {{ $t('eventDetails.contact.fullName') }}<span class="tw:text-red-500">&nbsp;*</span>
          </label>
          <input
            id="contact-full-name"
            v-model="formName"
            type="text"
            autocomplete="name"
            class="tw:mt-1.5 tw:block tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2.5 tw:text-sm tw:text-gray-900 tw:outline-none focus:tw:border-[#FF7700] focus:tw:ring-2 focus:tw:ring-[#FF7700]/20"
            :placeholder="$t('eventDetails.contact.fullNamePlaceholder')"
          />
        </div>
        <div>
          <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-800" for="contact-phone">
            {{ $t('eventDetails.contact.phoneLabel') }}
          </label>
          <input
            id="contact-phone"
            v-model="formPhone"
            type="tel"
            autocomplete="tel"
            class="tw:mt-1.5 tw:block tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2.5 tw:text-sm tw:text-gray-900 tw:outline-none focus:tw:border-[#FF7700] focus:tw:ring-2 focus:tw:ring-[#FF7700]/20"
            :placeholder="$t('eventDetails.contact.phonePlaceholder')"
          />
        </div>
        <div>
          <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-800" for="contact-message">
            {{ $t('eventDetails.contact.message') }}<span class="tw:text-red-500">&nbsp;*</span>
          </label>
          <textarea
            id="contact-message"
            v-model="formMessage"
            rows="4"
            class="tw:mt-1.5 tw:block tw:w-full tw:resize-y tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2.5 tw:text-sm tw:text-gray-900 tw:outline-none focus:tw:border-[#FF7700] focus:tw:ring-2 focus:tw:ring-[#FF7700]/20"
            :placeholder="$t('eventDetails.contact.messagePlaceholder')"
          />
        </div>

        <div class="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:pt-1">
          <p class="tw:text-xs tw:text-gray-500">{{ $t('eventDetails.contact.requiredNote') }}</p>
          <button
            type="submit"
            class="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-xl tw:bg-[#FF7700] tw:px-4 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white tw:shadow-sm tw:transition-colors hover:tw:bg-[#e86a00] focus:tw:outline-none focus-visible:tw:ring-2 focus-visible:tw:ring-[#FF7700]/50"
          >
            {{ $t('eventDetails.contact.sendButton') }}
            <Send class="tw:h-4 tw:w-4" :stroke-width="2" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Phone, Mail, Globe, MessageCircle, Send } from 'lucide-vue-next'

const props = defineProps({
  event: { type: Object, default: null }
})

const { t } = useI18n()

function firstNonEmptyString(...vals) {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return ''
}

const phoneDisplay = computed(() => {
  const ev = props.event
  if (!ev) return ''
  return firstNonEmptyString(ev.contact_phone, ev.contact_info?.phone)
})

const phoneHref = computed(() => {
  const p = phoneDisplay.value
  if (!p) return ''
  return `tel:${p.replace(/\s/g, '')}`
})

const emailDisplay = computed(() => {
  const ev = props.event
  if (!ev) return ''
  return firstNonEmptyString(ev.contact_email, ev.contact_info?.email)
})

const websiteRaw = computed(() => {
  const ev = props.event
  if (!ev) return ''
  return firstNonEmptyString(ev.contact_website, ev.contact_info?.website)
})

const websiteHref = computed(() => {
  const w = websiteRaw.value
  if (!w) return ''
  return /^https?:\/\//i.test(w) ? w : `https://${w}`
})

const websiteLabel = computed(() => {
  const w = websiteRaw.value
  if (!w) return ''
  return w.replace(/^https?:\/\//i, '').replace(/\/$/, '')
})

/**
 * Event-level contact copy (API may denormalise on the event), else per invited profile.
 */
const contactDesignBlocks = computed(() => {
  const ev = props.event
  if (!ev) return []

  const eventLevel = trimTxt(
    firstNonEmptyString(
      ev.contact_box_design_message,
      ev.contact_info?.design_message,
      ev.contact_box_message,
      ev.contact_info?.box_message,
    ),
  )
  if (eventLevel) {
    return [{ kind: 'event', entityLabel: '', entityName: '', text: eventLevel }]
  }

  const blocks = []
  const seen = new Set()

  function addBlock(kind, labelKey, name, textRaw) {
    const text = trimTxt(textRaw)
    if (!text) return
    const key = text.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    blocks.push({
      kind,
      entityLabel: t(labelKey),
      entityName: trimTxt(name),
      text,
    })
  }

  for (const o of ev.invited_organisers_objects || []) {
    addBlock('organiser', 'eventDetails.contact.fromOrganiser', o?.name, o?.contact_box_design_message)
  }
  for (const o of ev.invited_talents_objects || []) {
    addBlock('talent', 'eventDetails.contact.fromTalent', o?.name, o?.contact_box_design_message)
  }
  for (const o of ev.invited_venues_objects || []) {
    addBlock('venue', 'eventDetails.contact.fromVenue', o?.name, o?.contact_box_design_message)
  }

  return blocks
})

function trimTxt(s) {
  return typeof s === 'string' ? s.trim() : ''
}

const formName = ref('')
const formPhone = ref('')
const formMessage = ref('')
const formError = ref('')
const formSuccess = ref(false)

watch([formName, formMessage], () => {
  formError.value = ''
  formSuccess.value = false
})

function onSubmit() {
  formError.value = ''
  formSuccess.value = false
  if (!formName.value.trim() || !formMessage.value.trim()) {
    formError.value = t('eventDetails.contact.formRequired')
    return
  }
  formSuccess.value = true
  formName.value = ''
  formPhone.value = ''
  formMessage.value = ''
}
</script>
