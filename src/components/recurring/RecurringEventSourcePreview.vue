<template>
  <div class="tw:rounded-lg tw:border tw:border-blue-100 tw:bg-blue-50 tw:p-4 tw:space-y-2">
    <p class="tw:text-sm tw:font-medium tw:text-blue-900">Template event</p>
    <p class="tw:text-base tw:font-semibold tw:text-gray-900">{{ sourceEvent.title }}</p>
    <p v-if="sourceEvent.event_date" class="tw:text-sm tw:text-gray-600">
      {{ formatDate(sourceEvent.event_date, sourceEvent.start_time) }}
    </p>
    <p v-if="sourceEvent.category?.name" class="tw:text-xs tw:text-gray-500">
      Category: {{ sourceEvent.category.name }}
    </p>
    <p class="tw:text-xs tw:text-gray-600">
      Future occurrences copy this event's details. You can adjust schedule and times below.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { RecurringEventSourceSummary } from '@/api/recurringSeries'

defineProps<{
  sourceEvent: RecurringEventSourceSummary
}>()

function formatDate(date: string, time?: string | null): string {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const timePart = time ? `, ${time.substring(0, 5)}` : ''
  return `${day}.${month}.${year}${timePart}`
}
</script>
