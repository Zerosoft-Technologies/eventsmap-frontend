<template>
  <div class="nationality-multi">
    <CountrySelect
      v-model="draftCode"
      :placeholder="atMax ? 'Maximum nationalities selected' : placeholder"
      :disabled="disabled || atMax"
      :has-error="hasError"
      :variant="variant"
      @update:model-value="onPick"
    />
    <p class="nationality-multi__hint">Choose from the ISO 3166-1 country list. Up to {{ max }} nationalities.</p>

    <div v-if="modelValue.length > 0" class="nationality-multi__tags">
      <span v-for="code in modelValue" :key="code" class="nationality-multi__tag">
        <span class="nationality-multi__flag" aria-hidden="true">{{ flagFor(code) }}</span>
        <span>{{ labelFor(code) }}</span>
        <button
          type="button"
          class="nationality-multi__remove"
          :aria-label="`Remove ${labelFor(code)}`"
          :disabled="disabled"
          @click="removeCode(code)"
        >
          ×
        </button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CountrySelect from '@/components/common/CountrySelect.vue'
import { fetchCountries, type CountryOption } from '@/api/referenceData'
import { countryCodeToFlagEmoji } from '@/utils/countryFlag'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    max?: number
    placeholder?: string
    disabled?: boolean
    hasError?: boolean
    variant?: 'default' | 'premium'
  }>(),
  {
    max: 2,
    placeholder: 'Search and select nationality…',
    disabled: false,
    hasError: false,
    variant: 'default',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const countries = ref<CountryOption[]>([])
const draftCode = ref('')

const atMax = computed(() => props.modelValue.length >= props.max)

function flagFor(code: string): string {
  const hit = countries.value.find((c) => c.code === code)
  return hit?.flag || countryCodeToFlagEmoji(code)
}

function labelFor(code: string): string {
  return countries.value.find((c) => c.code === code)?.name ?? code
}

function onPick(code: string) {
  if (!code || props.modelValue.includes(code) || atMax.value) {
    draftCode.value = ''
    return
  }
  emit('update:modelValue', [...props.modelValue, code].slice(0, props.max))
  draftCode.value = ''
}

function removeCode(code: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter((c) => c !== code),
  )
}

onMounted(async () => {
  try {
    countries.value = await fetchCountries()
  } catch {
    countries.value = []
  }
})
</script>

<style scoped>
.nationality-multi__hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: rgb(107 114 128);
}

.nationality-multi__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.nationality-multi__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.6rem;
  border-radius: 9999px;
  background: rgb(239 246 255);
  color: rgb(29 78 216);
  font-size: 0.875rem;
}

.nationality-multi__flag {
  font-size: 1rem;
  line-height: 1;
}

.nationality-multi__remove {
  border: none;
  background: transparent;
  color: rgb(107 114 128);
  font-size: 1.125rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.15rem;
}
</style>
