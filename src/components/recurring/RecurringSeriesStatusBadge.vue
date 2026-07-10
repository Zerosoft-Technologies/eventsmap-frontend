<template>
  <div class="tw:flex tw:flex-wrap tw:gap-1.5">
    <span
      class="tw:inline-flex tw:px-2 tw:py-0.5 tw:rounded-full tw:text-xs tw:font-medium"
      :class="approvalClass"
    >
      {{ approvalLabel }}
    </span>
    <span
      class="tw:inline-flex tw:px-2 tw:py-0.5 tw:rounded-full tw:text-xs tw:font-medium"
      :class="scheduleClass"
    >
      {{ scheduleLabel }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RecurringSeries } from '@/api/recurringSeries'
import {
  getSeriesScheduleStatus,
  seriesApprovalStatusLabel,
  seriesScheduleStatusLabel,
  type MyEventOccurrence,
} from '@/utils/recurringSeriesManagement'

const props = defineProps<{
  series: RecurringSeries
  events?: MyEventOccurrence[]
}>()

const approvalLabel = computed(() => seriesApprovalStatusLabel(props.series))

const scheduleLabel = computed(() =>
  seriesScheduleStatusLabel(getSeriesScheduleStatus(props.series.id, props.events ?? [])),
)

const approvalClass = computed(() =>
  props.series.is_approved
    ? 'tw:bg-green-100 tw:text-green-800'
    : 'tw:bg-amber-100 tw:text-amber-800',
)

const scheduleClass = computed(() => {
  const status = getSeriesScheduleStatus(props.series.id, props.events ?? [])
  return status === 'active'
    ? 'tw:bg-blue-100 tw:text-blue-800'
    : 'tw:bg-gray-100 tw:text-gray-700'
})
</script>
