<template>
  <span
    v-if="label"
    class="tw:inline-flex tw:items-center tw:rounded-full tw:px-2 tw:py-0.5 tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-wide"
    :class="badgeClass"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MyEventOccurrence } from '@/utils/recurringSeriesManagement'
import {
  isCustomOccurrence,
  isRepeatsWeeklyOccurrence,
  isSeriesInstanceEvent,
} from '@/utils/recurringSeriesManagement'

const props = defineProps<{
  event: MyEventOccurrence
  /** Discovery surfaces: only show "Repeats Weekly" for any series instance */
  discovery?: boolean
}>()

const label = computed(() => {
  if (!isSeriesInstanceEvent(props.event)) return ''
  if (props.discovery) return 'Repeats Weekly'
  if (isCustomOccurrence(props.event)) return 'Custom Occurrence'
  if (isRepeatsWeeklyOccurrence(props.event)) return 'Repeats Weekly'
  return ''
})

const badgeClass = computed(() => {
  if (isCustomOccurrence(props.event)) {
    return 'tw:bg-violet-100 tw:text-violet-800'
  }
  return 'tw:bg-sky-100 tw:text-sky-800'
})
</script>
