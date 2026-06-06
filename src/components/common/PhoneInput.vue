<template>
  <div class="phone-input-host tw:w-full">
    <input
      ref="telInputRef"
      type="tel"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="inputClass"
      autocomplete="tel"
      @blur="onBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import intlTelInput, { NUMBER_FORMAT, type Iti, type Iso2 } from 'intl-tel-input'
import 'intl-tel-input/styles'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    inputClass?: string
    /** ISO 3166-1 alpha-2 default when no number is set */
    initialCountry?: Iso2
  }>(),
  {
    modelValue: '',
    placeholder: '',
    disabled: false,
    inputClass: '',
    initialCountry: 'nl',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()

const telInputRef = ref<HTMLInputElement | null>(null)
let iti: Iti | null = null
let syncingFromProp = false

function emitE164() {
  if (!iti) return
  const e164 = iti.getNumber(NUMBER_FORMAT.E164) || ''
  if (e164 !== (props.modelValue ?? '')) {
    emit('update:modelValue', e164)
  }
}

function onBlur() {
  emitE164()
  emit('blur')
}

onMounted(async () => {
  const el = telInputRef.value
  if (!el) return

  iti = intlTelInput(el, {
    initialCountry: props.initialCountry,
    countryOrder: ['nl', 'be', 'gb', 'fr', 'de'],
    formatAsYouType: true,
    loadUtils: () => import('intl-tel-input/utils'),
  })

  await iti.promise

  if (props.modelValue?.trim()) {
    syncingFromProp = true
    iti.setNumber(props.modelValue)
    syncingFromProp = false
  }

  el.addEventListener('countrychange', emitE164)
  el.addEventListener('input', () => {
    if (!syncingFromProp) emitE164()
  })
})

onBeforeUnmount(() => {
  const el = telInputRef.value
  if (el) {
    el.removeEventListener('countrychange', emitE164)
  }
  iti?.destroy()
  iti = null
})

watch(
  () => props.modelValue,
  async (next) => {
    if (!iti) return
    await iti.promise
    const current = iti.getNumber(NUMBER_FORMAT.E164) || ''
    const normalized = (next ?? '').trim()
    if (normalized === current) return
    syncingFromProp = true
    if (normalized) {
      iti.setNumber(normalized)
    } else {
      iti.setNumber('')
      if (telInputRef.value) telInputRef.value.value = ''
    }
    syncingFromProp = false
  },
)
</script>

<style scoped>
.phone-input-host :deep(.iti) {
  width: 100%;
  display: block;
}

.phone-input-host :deep(.iti input) {
  width: 100%;
}
</style>
