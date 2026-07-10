<template>
  <div>
    <span :id="labelId" class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
      Repeat on <span class="tw:text-red-500" aria-hidden="true">*</span>
    </span>
    <div
      role="group"
      :aria-labelledby="labelId"
      class="tw:flex tw:flex-wrap tw:gap-2"
    >
      <button
        v-for="day in WEEKDAY_OPTIONS"
        :key="day.value"
        type="button"
        class="tw:px-3 tw:py-1.5 tw:rounded-full tw:text-sm tw:border tw:transition-colors tw:min-w-[3rem] focus:tw:outline-none focus-visible:tw:ring-2 focus-visible:tw:ring-blue-500 focus-visible:tw:ring-offset-1"
        :class="selectedWeekdays.includes(day.value)
          ? 'tw:bg-blue-600 tw:text-white tw:border-blue-600 tw:shadow-sm'
          : 'tw:bg-white tw:text-gray-700 tw:border-gray-300 hover:tw:border-blue-400'"
        :aria-pressed="selectedWeekdays.includes(day.value)"
        :aria-label="day.fullLabel"
        @click="toggleWeekday(day.value)"
      >
        {{ day.label }}
      </button>
    </div>
    <p v-if="error" :id="errorId" class="tw:text-xs tw:text-red-600 tw:mt-1" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { WEEKDAY_OPTIONS } from '@/utils/recurringScheduleFormat'

const props = defineProps<{
  modelValue: number[]
  error?: string
  labelId?: string
  errorId?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void
}>()

const labelId = computed(() => props.labelId ?? 'recurring-weekday-label')
const errorId = computed(() => props.errorId ?? 'recurring-weekday-error')

const selectedWeekdays = computed(() => props.modelValue ?? [])

function toggleWeekday(day: number) {
  const current = [...selectedWeekdays.value]
  const idx = current.indexOf(day)
  if (idx >= 0) current.splice(idx, 1)
  else current.push(day)
  current.sort((a, b) => a - b)
  emit('update:modelValue', current)
}
</script>
