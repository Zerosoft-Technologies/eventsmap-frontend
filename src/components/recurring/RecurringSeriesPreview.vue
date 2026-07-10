<template>
  <section
    class="tw:rounded-xl tw:border tw:border-gray-200 tw:bg-white tw:p-4 tw:shadow-sm"
    aria-labelledby="recurring-series-preview-heading"
  >
    <h4 id="recurring-series-preview-heading" class="tw:text-sm tw:font-semibold tw:text-gray-900 tw:mb-3">
      Schedule preview
    </h4>

    <dl class="tw:space-y-3 tw:text-sm">
      <div>
        <dt class="tw:text-xs tw:font-medium tw:uppercase tw:tracking-wide tw:text-gray-500">Repeats every</dt>
        <dd class="tw:mt-1 tw:text-gray-900 tw:whitespace-pre-line">{{ summary.repeatLabel }}</dd>
      </div>

      <div class="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:gap-3">
        <div>
          <dt class="tw:text-xs tw:font-medium tw:uppercase tw:tracking-wide tw:text-gray-500">Start</dt>
          <dd class="tw:mt-1 tw:text-gray-900">{{ summary.startLabel }}</dd>
        </div>
        <div>
          <dt class="tw:text-xs tw:font-medium tw:uppercase tw:tracking-wide tw:text-gray-500">End</dt>
          <dd class="tw:mt-1 tw:text-gray-900">{{ summary.endLabel }}</dd>
        </div>
      </div>

      <div>
        <dt class="tw:text-xs tw:font-medium tw:uppercase tw:tracking-wide tw:text-gray-500">Timezone</dt>
        <dd class="tw:mt-1 tw:text-gray-900">{{ summary.timezoneLabel }}</dd>
      </div>
    </dl>

    <p class="tw:mt-3 tw:text-xs tw:text-gray-500">
      Occurrences generate for up to {{ summary.horizonLabel }} from the start date.
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RecurringSeriesPayload } from '@/api/recurringSeries'
import { formatRecurringScheduleSummary } from '@/utils/recurringScheduleFormat'

const props = defineProps<{
  schedule: RecurringSeriesPayload
}>()

const summary = computed(() => formatRecurringScheduleSummary(props.schedule))
</script>
