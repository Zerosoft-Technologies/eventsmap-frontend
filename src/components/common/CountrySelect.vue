<template>
  <div class="country-select" :class="{ 'country-select--premium': variant === 'premium' }">
    <div ref="fieldWrap" class="country-select__field">
      <input
        v-model="search"
        type="text"
        :placeholder="selectedLabel || placeholder"
        :disabled="disabled || loading"
        class="country-select__input"
        :class="{
          'country-select__input--error': hasError,
          'country-select__input--premium': variant === 'premium',
        }"
        autocomplete="off"
        @focus="open = true"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.down.prevent="moveHighlight(1)"
        @keydown.up.prevent="moveHighlight(-1)"
        @keydown.escape="closeDropdown"
      />
      <button
        v-if="modelValue && !disabled"
        type="button"
        class="country-select__clear no-hover"
        aria-label="Clear nationality"
        @click="clearSelection"
      >
        ×
      </button>
      <ul
        v-if="open && filteredOptions.length > 0"
        class="country-select__dropdown"
        role="listbox"
      >
        <li
          v-for="(country, idx) in filteredOptions"
          :key="country.code"
          role="option"
          :aria-selected="idx === highlightIndex"
        >
          <button
            type="button"
            class="country-select__option"
            :class="{ 'country-select__option--active': idx === highlightIndex }"
            @mousedown.prevent="selectCountry(country)"
          >
            {{ country.flag ? `${country.flag} ` : '' }}{{ country.name }}
          </button>
        </li>
      </ul>
    </div>
    <p v-if="loading" class="country-select__hint">Loading countries…</p>
    <p v-else-if="loadError" class="country-select__error">{{ loadError }}</p>
    <p v-else-if="selectedLabel" class="country-select__hint">
      Selected: {{ selectedFlag }} {{ selectedLabel }} ({{ modelValue }})
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { fetchCountries, type CountryOption } from '@/api/referenceData'
import { resolveCountryCode } from '@/utils/countryIso3166'
import { countryCodeToFlagEmoji } from '@/utils/countryFlag'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    hasError?: boolean
    variant?: 'default' | 'premium'
  }>(),
  {
    modelValue: '',
    placeholder: 'Search and select nationality…',
    disabled: false,
    hasError: false,
    variant: 'default',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const countries = ref<CountryOption[]>([])
const loading = ref(true)
const loadError = ref('')
const search = ref('')
const open = ref(false)
const highlightIndex = ref(-1)
const fieldWrap = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  if (!props.modelValue) return ''
  return countries.value.find((c) => c.code === props.modelValue)?.name ?? ''
})

const selectedFlag = computed(() => {
  if (!props.modelValue) return ''
  const hit = countries.value.find((c) => c.code === props.modelValue)
  return hit?.flag || countryCodeToFlagEmoji(props.modelValue)
})

const filteredOptions = computed(() => {
  const q = search.value.trim().toLowerCase()
  return countries.value.filter((country) => {
    if (!q) return true
    return (
      country.name.toLowerCase().includes(q) ||
      country.code.toLowerCase().includes(q)
    )
  })
})

function selectCountry(country: CountryOption) {
  emit('update:modelValue', country.code)
  search.value = ''
  closeDropdown()
}

function clearSelection() {
  emit('update:modelValue', '')
  search.value = ''
  closeDropdown()
}

function selectHighlighted() {
  const option = filteredOptions.value[highlightIndex.value]
  if (option) selectCountry(option)
}

function moveHighlight(delta: number) {
  if (!filteredOptions.value.length) return
  open.value = true
  const len = filteredOptions.value.length
  if (highlightIndex.value < 0) {
    highlightIndex.value = delta > 0 ? 0 : len - 1
    return
  }
  highlightIndex.value = (highlightIndex.value + delta + len) % len
}

function closeDropdown() {
  open.value = false
  highlightIndex.value = -1
  search.value = ''
}

function onDocumentClick(e: MouseEvent) {
  if (!fieldWrap.value?.contains(e.target as Node)) {
    closeDropdown()
  }
}

watch(
  () => props.modelValue,
  (code) => {
    if (!code || countries.value.length === 0) return
    const resolved = resolveCountryCode(code, countries.value)
    if (resolved && resolved !== code) {
      emit('update:modelValue', resolved)
    }
  },
)

onMounted(async () => {
  document.addEventListener('click', onDocumentClick)
  try {
    countries.value = await fetchCountries()
    if (props.modelValue) {
      const resolved = resolveCountryCode(props.modelValue, countries.value)
      if (resolved && resolved !== props.modelValue) {
        emit('update:modelValue', resolved)
      }
    }
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Could not load countries.'
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
.country-select__field {
  position: relative;
}

.country-select__input {
  width: 100%;
  padding: 0.75rem 2.25rem 0.75rem 1rem;
  font-size: 0.9375rem;
  color: rgb(17 24 39);
  background: #fff;
  border: 1px solid rgb(229 231 235);
  border-radius: 0.75rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.country-select__input:focus {
  border-color: var(--primary-color, #0061ff);
  box-shadow: 0 0 0 3px rgb(0 97 255 / 0.12);
}

.country-select__input--premium:focus {
  border-color: #ff7700;
  box-shadow: 0 0 0 3px rgb(255 119 0 / 0.15);
}

.country-select__input--error {
  border-color: rgb(239 68 68);
}

.country-select__input--error:focus {
  border-color: rgb(239 68 68);
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.12);
}

.country-select__input:disabled {
  background: rgb(249 250 251);
  cursor: not-allowed;
}

.country-select__clear {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 9999px;
  background: rgb(243 244 246);
  color: rgb(107 114 128);
  font-size: 1.125rem;
  line-height: 1;
  cursor: pointer;
}

.country-select__dropdown {
  position: absolute;
  z-index: 40;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  margin: 0;
  padding: 0.25rem 0;
  list-style: none;
  max-height: 14rem;
  overflow-y: auto;
  background: #fff;
  border: 1px solid rgb(229 231 235);
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgb(0 0 0 / 0.08);
}

.country-select__option {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: rgb(55 65 81);
  background: transparent;
  border: none;
  cursor: pointer;
}

.country-select__option:hover,
.country-select__option--active {
  background: rgb(239 246 255);
  color: var(--primary-color, #0061ff);
}

.country-select--premium .country-select__option:hover,
.country-select--premium .country-select__option--active {
  background: rgb(255 247 237);
  color: #ff7700;
}

.country-select__hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: rgb(107 114 128);
}

.country-select__error {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: rgb(220 38 38);
}
</style>
