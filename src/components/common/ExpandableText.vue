<template>
  <div v-if="text?.trim()">
    <p class="tw:text-sm tw:text-gray-700 tw:leading-relaxed tw:whitespace-pre-line">
      {{ displayText }}
    </p>
    <button
      v-if="needsTruncate"
      type="button"
      class="tw:mt-1.5 tw:text-sm tw:font-medium tw:text-[#1a73e8] hover:tw:underline tw:underline-offset-2"
      @click="expanded = !expanded"
    >
      {{ expanded ? lessLabel : moreLabel }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  maxLength: { type: Number, default: 280 },
  moreLabel: { type: String, default: 'View more' },
  lessLabel: { type: String, default: 'View less' },
})

const expanded = ref(false)

const needsTruncate = computed(() => (props.text?.trim()?.length ?? 0) > props.maxLength)

const displayText = computed(() => {
  const value = props.text?.trim() ?? ''
  if (!needsTruncate.value || expanded.value) return value
  const slice = value.slice(0, props.maxLength).trimEnd()
  return `${slice}…`
})

watch(
  () => props.text,
  () => {
    expanded.value = false
  },
)
</script>
