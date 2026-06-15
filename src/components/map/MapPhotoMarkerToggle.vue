<template>
  <div class="tw:space-y-2">
    <span class="tw:text-sm tw:font-medium tw:text-gray-700">{{ label }}</span>
    <p class="tw:text-xs tw:text-gray-500">{{ hint }}</p>
    <div class="tw:flex tw:gap-4">
      <label class="tw:inline-flex tw:items-center tw:gap-2 tw:cursor-pointer">
        <input
          type="radio"
          :name="inputName"
          :checked="modelValue"
          class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500"
          @change="$emit('update:modelValue', true)"
        />
        <span class="tw:text-sm tw:text-gray-800">{{ yesLabel }}</span>
      </label>
      <label class="tw:inline-flex tw:items-center tw:gap-2 tw:cursor-pointer">
        <input
          type="radio"
          :name="inputName"
          :checked="!modelValue"
          class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500"
          @change="$emit('update:modelValue', false)"
        />
        <span class="tw:text-sm tw:text-gray-800">{{ noLabel }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    inputName?: string
    label?: string
    hint?: string
    yesLabel?: string
    noLabel?: string
  }>(),
  {
    inputName: 'show-photo-map-marker',
    label: 'Show main picture in map marker',
    hint: 'Premium only. Displays your main image inside the circular part of your map pin.',
    yesLabel: 'Yes',
    noLabel: 'No',
  },
)

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>
