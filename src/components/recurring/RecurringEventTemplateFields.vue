<template>
  <div class="tw:space-y-6 tw:border-t tw:border-gray-200 tw:pt-6">
    <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900">Event template</h3>
    <p class="tw:text-sm tw:text-gray-600">
      Default details applied to each generated occurrence. You can customize individual dates later.
    </p>

    <div>
      <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">Title <span class="tw:text-red-500">*</span></label>
      <input
        :value="modelValue.title"
        type="text"
        class="tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 tw:text-sm"
        placeholder="Event title"
        @input="updateField('title', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="errors?.['event_template.title']" class="tw:text-xs tw:text-red-600 tw:mt-1">{{ errors['event_template.title'][0] }}</p>
    </div>

    <div>
      <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">Description</label>
      <textarea
        :value="modelValue.description ?? ''"
        rows="3"
        class="tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 tw:text-sm"
        @input="updateField('description', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div>
      <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">Category <span class="tw:text-red-500">*</span></label>
      <select
        :value="modelValue.category_id ?? ''"
        class="tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 tw:text-sm"
        @change="updateField('category_id', Number(($event.target as HTMLSelectElement).value))"
      >
        <option disabled value="">Select category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <p v-if="errors?.['event_template.category_id']" class="tw:text-xs tw:text-red-600 tw:mt-1">{{ errors['event_template.category_id'][0] }}</p>
    </div>

    <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
      <div>
        <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">Start time <span class="tw:text-red-500">*</span></label>
        <input
          :value="modelValue.start_time"
          type="time"
          class="tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 tw:text-sm"
          @input="updateField('start_time', normalizeTime(($event.target as HTMLInputElement).value))"
        />
        <p v-if="errors?.['event_template.start_time']" class="tw:text-xs tw:text-red-600 tw:mt-1">{{ errors['event_template.start_time'][0] }}</p>
      </div>
      <div>
        <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">End time <span class="tw:text-red-500">*</span></label>
        <input
          :value="modelValue.end_time"
          type="time"
          class="tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 tw:text-sm"
          @input="updateField('end_time', normalizeTime(($event.target as HTMLInputElement).value))"
        />
        <p v-if="errors?.['event_template.end_time']" class="tw:text-xs tw:text-red-600 tw:mt-1">{{ errors['event_template.end_time'][0] }}</p>
      </div>
    </div>

    <div>
      <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">Venue name</label>
      <input
        :value="modelValue.venue_name ?? ''"
        type="text"
        class="tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 tw:text-sm"
        @input="updateField('venue_name', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div>
      <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">Address <span class="tw:text-red-500">*</span></label>
      <input
        :value="modelValue.address"
        type="text"
        class="tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 tw:text-sm"
        placeholder="Street, city"
        @input="updateField('address', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="errors?.['event_template.address']" class="tw:text-xs tw:text-red-600 tw:mt-1">{{ errors['event_template.address'][0] }}</p>
    </div>

    <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
      <div>
        <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">Latitude <span class="tw:text-red-500">*</span></label>
        <input
          :value="modelValue.latitude"
          type="number"
          step="any"
          class="tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 tw:text-sm"
          @input="updateField('latitude', Number(($event.target as HTMLInputElement).value))"
        />
      </div>
      <div>
        <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">Longitude <span class="tw:text-red-500">*</span></label>
        <input
          :value="modelValue.longitude"
          type="number"
          step="any"
          class="tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 tw:text-sm"
          @input="updateField('longitude', Number(($event.target as HTMLInputElement).value))"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecurringEventTemplate } from '@/api/recurringSeries'

const props = defineProps<{
  modelValue: RecurringEventTemplate
  categories: Array<{ id: number; name: string }>
  errors?: Record<string, string[]>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: RecurringEventTemplate): void
}>()

function updateField<K extends keyof RecurringEventTemplate>(key: K, value: RecurringEventTemplate[K]) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value,
  })
}

function normalizeTime(value: string): string {
  if (!value) return ''
  const parts = value.split(':')
  const hours = parts[0] ?? '00'
  const minutes = parts[1] ?? '00'
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`
}
</script>
