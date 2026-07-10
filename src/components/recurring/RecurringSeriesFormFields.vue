<template>
  <div class="tw:space-y-6">
    <div>
      <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2" for="recurring-type-weekly">
        Recurrence type
      </label>
      <input
        id="recurring-type-weekly"
        type="text"
        value="Weekly"
        disabled
        class="tw:w-full tw:rounded-lg tw:border tw:border-gray-200 tw:bg-gray-50 tw:px-3 tw:py-2 tw:text-sm tw:text-gray-600"
      />
      <p class="tw:text-xs tw:text-gray-500 tw:mt-1">Other recurrence types will be available in a future release.</p>
    </div>

    <RecurringSeriesWeekdaySelector
      v-model="weekdays"
      :error="errors?.['recurrence_rules.weekdays']?.[0]"
    />

    <div>
      <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2" for="recurring-timezone">
        Timezone (IANA) <span class="tw:text-red-500" aria-hidden="true">*</span>
      </label>
      <input
        id="recurring-timezone"
        type="text"
        list="iana-timezones"
        :value="modelValue.timezone"
        placeholder="e.g. Europe/Amsterdam"
        autocomplete="off"
        class="tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 tw:text-sm focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent"
        :aria-invalid="!!errors?.timezone"
        :aria-describedby="errors?.timezone ? 'recurring-timezone-error' : undefined"
        @input="updateField('timezone', ($event.target as HTMLInputElement).value)"
      />
      <datalist id="iana-timezones">
        <option v-for="tz in commonTimezones" :key="tz" :value="tz" />
      </datalist>
      <p v-if="errors?.timezone" id="recurring-timezone-error" class="tw:text-xs tw:text-red-600 tw:mt-1" role="alert">
        {{ errors.timezone[0] }}
      </p>
    </div>

    <div class="tw:rounded-lg tw:border tw:border-amber-100 tw:bg-amber-50 tw:px-3 tw:py-2.5">
      <p class="tw:text-xs tw:text-amber-900">
        <span class="tw:font-medium">Generation horizon:</span>
        Occurrences are generated for up to {{ horizonText }} from the series start date.
        Leave end date empty to use the full {{ horizonText }} window.
      </p>
    </div>

    <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
      <div>
        <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2" for="recurring-start-date">
          Series start date <span class="tw:text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="recurring-start-date"
          type="date"
          :value="modelValue.start_date"
          class="tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 tw:text-sm"
          :aria-invalid="!!errors?.start_date"
          :aria-describedby="errors?.start_date ? 'recurring-start-date-error' : undefined"
          @input="onStartDateChange(($event.target as HTMLInputElement).value)"
        />
        <p v-if="errors?.start_date" id="recurring-start-date-error" class="tw:text-xs tw:text-red-600 tw:mt-1" role="alert">
          {{ errors.start_date[0] }}
        </p>
      </div>
      <div>
        <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2" for="recurring-end-date">
          Series end date (optional)
        </label>
        <input
          id="recurring-end-date"
          type="date"
          :value="modelValue.end_date ?? ''"
          :min="modelValue.start_date"
          :max="maxEndDate"
          class="tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 tw:text-sm"
          :aria-invalid="!!errors?.end_date"
          :aria-describedby="errors?.end_date ? 'recurring-end-date-error' : 'recurring-end-date-hint'"
          @input="onEndDateChange(($event.target as HTMLInputElement).value)"
        />
        <p id="recurring-end-date-hint" class="tw:text-xs tw:text-gray-500 tw:mt-1">Latest allowed: {{ maxEndDate }}</p>
        <p v-if="errors?.end_date" id="recurring-end-date-error" class="tw:text-xs tw:text-red-600 tw:mt-1" role="alert">
          {{ errors.end_date[0] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RecurringSeriesPayload } from '@/api/recurringSeries'
import RecurringSeriesWeekdaySelector from '@/components/recurring/RecurringSeriesWeekdaySelector.vue'
import { horizonLabel, isSeriesEndDateWithinHorizon, maxSeriesEndDate } from '@/utils/recurringHorizon'

const props = defineProps<{
  modelValue: RecurringSeriesPayload
  errors?: Record<string, string[]>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: RecurringSeriesPayload): void
}>()

const horizonText = horizonLabel()

const maxEndDate = computed(() =>
  props.modelValue.start_date ? maxSeriesEndDate(props.modelValue.start_date) : ''
)

const weekdays = computed({
  get: () => props.modelValue.recurrence_rules.weekdays ?? [],
  set: (value: number[]) => {
    emit('update:modelValue', {
      ...props.modelValue,
      recurrence_rules: { ...props.modelValue.recurrence_rules, weekdays: value },
    })
  },
})

const commonTimezones = [
  'Europe/Amsterdam',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Australia/Sydney',
  'UTC',
]

function updateField<K extends keyof RecurringSeriesPayload>(key: K, value: RecurringSeriesPayload[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function onStartDateChange(value: string) {
  let endDate = props.modelValue.end_date
  if (endDate && !isSeriesEndDateWithinHorizon(value, endDate)) {
    endDate = maxSeriesEndDate(value)
  }
  emit('update:modelValue', {
    ...props.modelValue,
    start_date: value,
    end_date: endDate,
  })
}

function onEndDateChange(raw: string) {
  const value = raw || null
  if (value && props.modelValue.start_date && !isSeriesEndDateWithinHorizon(props.modelValue.start_date, value)) {
    updateField('end_date', maxSeriesEndDate(props.modelValue.start_date))
    return
  }
  updateField('end_date', value)
}
</script>
