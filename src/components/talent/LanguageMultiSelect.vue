<template>
  <div class="lang-multi">
    <div class="lang-multi__row">
      <div ref="fieldWrap" class="lang-multi__field">
        <input
          v-model="draft"
          type="text"
          :placeholder="placeholder"
          :disabled="disabled || atMax"
          class="lang-multi__input"
          autocomplete="off"
          @keydown.enter.prevent="addFromDraft"
          @keydown.down.prevent="moveHighlight(1)"
          @keydown.up.prevent="moveHighlight(-1)"
          @keydown.escape="closeSuggestions"
          @focus="openSuggestions = true"
          @input="highlightIndex = -1"
        />
        <ul
          v-if="openSuggestions && filteredSuggestions.length > 0"
          class="lang-multi__dropdown"
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
      </div>
      <button
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
      Choose from the list or type a language and press Enter. Up to {{ max }} languages.
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { COMMON_LANGUAGES } from '@/data/commonLanguages'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    max?: number
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    max: 15,
    placeholder: 'Search or type a language…',
    disabled: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const draft = ref('')
const openSuggestions = ref(false)
const highlightIndex = ref(-1)
const fieldWrap = ref<HTMLElement | null>(null)

const atMax = computed(() => props.modelValue.length >= props.max)

const filteredSuggestions = computed(() => {
  const q = draft.value.trim().toLowerCase()
  const selected = new Set(props.modelValue.map((l) => l.toLowerCase()))
  return COMMON_LANGUAGES.filter((lang) => {
    if (selected.has(lang.toLowerCase())) return false
    if (!q) return true
    return lang.toLowerCase().includes(q)
  }).slice(0, 12)
})

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
  closeSuggestions()
}

function addFromDraft() {
  if (!draft.value.trim()) return
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

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
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
  position: absolute;
  z-index: 40;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  margin: 0;
  padding: 0.25rem 0;
  list-style: none;
  max-height: 12rem;
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
