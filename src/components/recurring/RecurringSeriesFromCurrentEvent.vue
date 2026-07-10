<template>
  <div class="tw:space-y-5">
    <div class="tw:rounded-xl tw:border tw:border-blue-100 tw:bg-gradient-to-br tw:from-blue-50 tw:to-white tw:p-4">
      <div class="tw:flex tw:items-start tw:gap-3">
        <div class="tw:mt-0.5 tw:flex tw:h-9 tw:w-9 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-blue-100 tw:text-blue-700">
          <Repeat class="tw:h-4 tw:w-4" aria-hidden="true" />
        </div>
        <div class="tw:min-w-0">
          <p class="tw:text-sm tw:font-semibold tw:text-gray-900">Recurring schedule</p>
          <p class="tw:text-sm tw:text-gray-600 tw:mt-1">
            This event's details become the template for each occurrence. Set how often it repeats below.
          </p>
          <p
            v-if="eventTitle"
            class="tw:mt-2 tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-full tw:bg-white tw:px-3 tw:py-1 tw:text-xs tw:font-medium tw:text-blue-800 tw:border tw:border-blue-100"
          >
            Template: {{ eventTitle }}
          </p>
        </div>
      </div>
    </div>

    <RecurringSeriesFormFields v-model="schedule" :errors="mergedErrors" />

    <RecurringSeriesPreview :schedule="schedule" />

    <div class="tw:flex tw:flex-col tw:sm:flex-row tw:items-stretch tw:sm:items-center tw:gap-3 tw:pt-1">
      <button
        type="button"
        class="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:px-5 tw:py-2.5 tw:text-sm tw:font-medium tw:text-white tw:bg-blue-600 tw:rounded-lg hover:tw:bg-blue-700 disabled:tw:opacity-60 tw:shadow-sm focus:tw:outline-none focus-visible:tw:ring-2 focus-visible:tw:ring-blue-500 focus-visible:tw:ring-offset-2"
        :disabled="disabled || loading"
        @click="emitCreate"
      >
        <Loader2 v-if="loading" class="tw:w-4 tw:h-4 tw:animate-spin" aria-hidden="true" />
        <Repeat v-else class="tw:h-4 tw:w-4" aria-hidden="true" />
        {{ loading ? 'Creating series...' : 'Create recurring series' }}
      </button>
      <p class="tw:text-xs tw:text-gray-500">
        Saves this event first, then generates occurrences for up to {{ horizonText }}.
      </p>
    </div>

    <p
      v-if="scheduleError"
      class="tw:text-sm tw:text-red-600 tw:bg-red-50 tw:border tw:border-red-100 tw:rounded-lg tw:px-3 tw:py-2"
      role="alert"
    >
      {{ scheduleError }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Loader2, Repeat } from 'lucide-vue-next'
import RecurringSeriesFormFields from '@/components/recurring/RecurringSeriesFormFields.vue'
import RecurringSeriesPreview from '@/components/recurring/RecurringSeriesPreview.vue'
import type { RecurringSeriesPayload } from '@/api/recurringSeries'
import { horizonLabel, isSeriesEndDateWithinHorizon, maxSeriesEndDate } from '@/utils/recurringHorizon'
import { isoWeekdayFromDate } from '@/utils/recurringScheduleFormat'
import { validateRecurringSchedule } from '@/utils/recurringScheduleValidation'

const props = defineProps<{
  eventTitle?: string
  eventDate?: string
  disabled?: boolean
  loading?: boolean
  errors?: Record<string, string[]>
  isPremium?: boolean
}>()

const emit = defineEmits<{
  (e: 'create', schedule: RecurringSeriesPayload): void
}>()

const scheduleError = ref('')
const localErrors = ref<Record<string, string[]>>({})
const horizonText = horizonLabel()

const mergedErrors = computed(() => ({
  ...(props.errors ?? {}),
  ...localErrors.value,
}))

function defaultSchedule(): RecurringSeriesPayload {
  const weekdays = props.eventDate ? [isoWeekdayFromDate(props.eventDate)] : [1]
  const start = props.eventDate || new Date().toISOString().slice(0, 10)
  return {
    recurrence_type: 'weekly',
    recurrence_rules: { weekdays },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Amsterdam',
    start_date: start,
    end_date: null,
  }
}

const schedule = ref<RecurringSeriesPayload>(defaultSchedule())

watch(
  () => props.eventDate,
  (date) => {
    if (!date) return
    schedule.value.start_date = date
    const weekday = isoWeekdayFromDate(date)
    const current = schedule.value.recurrence_rules.weekdays ?? []
    if (!current.includes(weekday)) {
      schedule.value.recurrence_rules = {
        ...schedule.value.recurrence_rules,
        weekdays: [...current, weekday].sort((a, b) => a - b),
      }
    }
    if (schedule.value.end_date && !isSeriesEndDateWithinHorizon(date, schedule.value.end_date)) {
      schedule.value.end_date = maxSeriesEndDate(date)
    }
  },
)

function emitCreate() {
  scheduleError.value = ''
  localErrors.value = {}

  const result = validateRecurringSchedule(schedule.value, {
    isPremium: props.isPremium !== false,
  })

  if (!result.valid) {
    localErrors.value = result.fieldErrors
    scheduleError.value = result.message ?? 'Please fix the schedule before continuing.'
    return
  }

  emit('create', { ...schedule.value })
}
</script>
