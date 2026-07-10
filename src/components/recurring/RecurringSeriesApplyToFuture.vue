<template>
  <fieldset class="tw:rounded-lg tw:border tw:border-amber-200 tw:bg-amber-50 tw:p-4">
    <legend class="tw:text-sm tw:font-medium tw:text-gray-900 tw:px-1">
      Apply changes to future events?
    </legend>
    <p class="tw:text-xs tw:text-gray-600 tw:mt-1 tw:mb-3">
      Choose whether updates propagate to all future instances. Modified occurrences are never changed.
    </p>
    <div class="tw:flex tw:flex-wrap tw:gap-4" role="radiogroup" aria-label="Apply changes to future events">
      <label class="tw:inline-flex tw:items-center tw:gap-2 tw:cursor-pointer">
        <input
          type="radio"
          class="tw:text-blue-600 focus:tw:ring-blue-500"
          :checked="modelValue === true"
          @change="emit('update:modelValue', true)"
        />
        <span class="tw:text-sm tw:font-medium tw:text-gray-900">Yes</span>
      </label>
      <label class="tw:inline-flex tw:items-center tw:gap-2 tw:cursor-pointer">
        <input
          type="radio"
          class="tw:text-blue-600 focus:tw:ring-blue-500"
          :checked="modelValue === false"
          @change="emit('update:modelValue', false)"
        />
        <span class="tw:text-sm tw:font-medium tw:text-gray-900">No</span>
      </label>
    </div>
    <p v-if="modelValue" class="tw:text-xs tw:text-amber-900 tw:mt-3">
      Future events in this series will be updated. Removed dates may be cancelled or deleted when accepted invitations exist.
    </p>
  </fieldset>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
