<template>
  <div class="lang-multi">
    <div class="lang-multi__row">
      <div ref="fieldWrap" class="lang-multi__field">
        <input
          ref="inputEl"
          v-model="draft"
          type="text"
          :placeholder="effectivePlaceholder"
          :disabled="disabled || atMax"
          class="lang-multi__input"
          autocomplete="off"
          @keydown.enter.prevent="addFromDraft"
          @keydown.down.prevent="moveHighlight(1)"
          @keydown.up.prevent="moveHighlight(-1)"
          @keydown.escape="closeSuggestions"
          @focus="onInputFocus"
          @click="onInputFocus"
          @input="onDraftInput"
        />
        <Teleport to="body">
          <ul
            v-if="openSuggestions && filteredSuggestions.length > 0"
            class="lang-multi__dropdown"
            :style="dropdownStyle"
            role="listbox"
          >
          <li
            v-for="(lang, idx) in filteredSuggestions"
            :key="lang"
            role="option"
            :aria-selected="idx === highlightIndex"
          >
            <button
              type="button"
              class="lang-multi__option"
              :class="{ 'lang-multi__option--active': idx === highlightIndex }"
              @mousedown.prevent="addLanguage(lang)"
            >
              {{ lang }}
            </button>
          </li>
        </ul>
        </Teleport>
      </div>
      <button
        v-if="!pickListOnly"
        type="button"
        class="lang-multi__add no-hover"
        :disabled="disabled || atMax || !draft.trim()"
        @click="addFromDraft"
      >
        <Plus class="tw:w-4 tw:h-4" />
        <span>Add</span>
      </button>
    </div>

    <p class="lang-multi__hint">
      <template v-if="pickListOnly">
        Choose from the list only. Up to {{ max }} languages.
      </template>
      <template v-else>
        Choose from the list or type a language and press Enter. Up to {{ max }} languages.
      </template>
    </p>

    <div v-if="modelValue.length > 0" class="selected-tags lang-multi__tags">
      <span v-for="lang in modelValue" :key="lang" class="selected-tag">
        {{ lang }}
        <button
          type="button"
          class="tag-remove"
          :aria-label="`Remove ${lang}`"
          :disabled="disabled"
          @click="removeLanguage(lang)"
        >
          <svg class="tag-remove-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </span>
    </div>

    <p v-else class="lang-multi__empty">No languages added yet.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { Plus } from 'lucide-vue-next'
import { COMMON_LANGUAGES } from '@/data/commonLanguages'
import { fetchTalentLanguages } from '@/api/referenceData'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    max?: number
    placeholder?: string
    disabled?: boolean
    /** When true, only predefined list items can be added (no custom text). */
    pickListOnly?: boolean
    /** Override language options; defaults to backend list when pickListOnly, else COMMON_LANGUAGES. */
    options?: string[]
  }>(),
  {
    max: 15,
    placeholder: 'Search or type a language…',
    disabled: false,
    pickListOnly: false,
    options: undefined,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const draft = ref('')
const openSuggestions = ref(false)
const highlightIndex = ref(-1)
const fieldWrap = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const dropdownStyle = ref<Record<string, string>>({})
const languageOptions = ref<string[]>([...COMMON_LANGUAGES])
const optionsLoading = ref(false)

const atMax = computed(() => props.modelValue.length >= props.max)
const isDisabled = computed(() => props.disabled)

const effectivePlaceholder = computed(() => {
  if (props.pickListOnly) return 'Search and select a language…'
  return props.placeholder
})

const filteredSuggestions = computed(() => {
  const q = draft.value.trim().toLowerCase()
  const selected = new Set(props.modelValue.map((l) => l.toLowerCase()))
  return languageOptions.value.filter((lang) => {
    if (selected.has(lang.toLowerCase())) return false
    if (!q) return true
    return lang.toLowerCase().includes(q)
  })
})

function updateDropdownPosition() {
  const el = inputEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  dropdownStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: '9999',
  }
}

function onInputFocus() {
  if (isDisabled.value || atMax.value) return
  openSuggestions.value = true
  nextTick(() => updateDropdownPosition())
}

function onDraftInput() {
  highlightIndex.value = -1
  if (props.pickListOnly) {
    openSuggestions.value = true
    nextTick(() => updateDropdownPosition())
  }
}

function normalizeLanguage(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ')
}

function addLanguage(raw: string) {
  const value = normalizeLanguage(raw)
  if (!value || props.disabled || atMax.value) return
  const exists = props.modelValue.some((l) => l.toLowerCase() === value.toLowerCase())
  if (exists) {
    draft.value = ''
    closeSuggestions()
    return
  }
  emit('update:modelValue', [...props.modelValue, value])
  draft.value = ''
  highlightIndex.value = -1
  if (props.pickListOnly) {
    openSuggestions.value = true
    nextTick(() => {
      updateDropdownPosition()
      inputEl.value?.focus()
    })
  } else {
    closeSuggestions()
  }
}

function addFromDraft() {
  if (!draft.value.trim()) return
  if (props.pickListOnly) {
    const exact = languageOptions.value.find(
      (lang) => lang.toLowerCase() === draft.value.trim().toLowerCase(),
    )
    if (exact) addLanguage(exact)
    else {
      const highlighted = filteredSuggestions.value[highlightIndex.value]
      if (highlighted) addLanguage(highlighted)
    }
    return
  }
  addLanguage(draft.value)
}

function removeLanguage(lang: string) {
  if (props.disabled) return
  emit(
    'update:modelValue',
    props.modelValue.filter((l) => l !== lang)
  )
}

function moveHighlight(delta: number) {
  if (!filteredSuggestions.value.length) return
  openSuggestions.value = true
  const len = filteredSuggestions.value.length
  if (highlightIndex.value < 0) {
    highlightIndex.value = delta > 0 ? 0 : len - 1
    return
  }
  highlightIndex.value = (highlightIndex.value + delta + len) % len
}

function closeSuggestions() {
  openSuggestions.value = false
  highlightIndex.value = -1
}

function onDocumentClick(e: MouseEvent) {
  if (!fieldWrap.value?.contains(e.target as Node)) {
    closeSuggestions()
  }
}

onMounted(async () => {
  document.addEventListener('click', onDocumentClick)
  window.addEventListener('resize', updateDropdownPosition)
  window.addEventListener('scroll', updateDropdownPosition, true)
  if (Array.isArray(props.options) && props.options.length > 0) {
    languageOptions.value = [...props.options]
    return
  }
  if (props.pickListOnly) {
    optionsLoading.value = true
    try {
      languageOptions.value = await fetchTalentLanguages()
    } catch {
      languageOptions.value = [...COMMON_LANGUAGES]
    } finally {
      optionsLoading.value = false
    }
  }
})

watch(
  () => props.options,
  (next) => {
    if (Array.isArray(next) && next.length > 0) {
      languageOptions.value = [...next]
    }
  },
)

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('resize', updateDropdownPosition)
  window.removeEventListener('scroll', updateDropdownPosition, true)
})
</script>

<style scoped>
.lang-multi__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: stretch;
}

.lang-multi__field {
  position: relative;
  flex: 1;
  min-width: min(100%, 14rem);
}

.lang-multi__input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  color: rgb(17 24 39);
  background: #fff;
  border: 1px solid rgb(229 231 235);
  border-radius: 0.75rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.lang-multi__input:focus {
  border-color: var(--primary-color, #0061ff);
  box-shadow: 0 0 0 3px rgb(0 97 255 / 0.12);
}

.lang-multi__input:disabled {
  background: rgb(249 250 251);
  cursor: not-allowed;
}

.lang-multi__dropdown {
  margin: 0;
  padding: 0.25rem 0;
  list-style: none;
  max-height: 16rem;
  overflow-y: auto;
  background: #fff;
  border: 1px solid rgb(229 231 235);
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgb(0 0 0 / 0.08);
}

.lang-multi__option {
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

.lang-multi__option:hover,
.lang-multi__option--active {
  background: rgb(239 246 255);
  color: var(--primary-color, #0061ff);
}

.lang-multi__add {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-color, #0061ff);
  background: #fff;
  border: 1px solid rgb(229 231 235);
  border-radius: 0.75rem;
  transition: background 0.2s, border-color 0.2s;
}

.lang-multi__add:hover:not(:disabled) {
  background: rgb(239 246 255);
  border-color: rgb(191 219 254);
}

.lang-multi__add:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.lang-multi__hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: rgb(107 114 128);
}

.lang-multi__empty {
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  color: rgb(156 163 175);
  font-style: italic;
}

.lang-multi__tags {
  margin-top: 0.75rem;
}
</style>
