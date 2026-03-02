<template>
  <div class="tw:flex tw:flex-wrap tw:gap-2 tw:pt-2">
    <span
      v-for="user in users"
      :key="user.id"
      class="tw:inline-flex tw:items-center tw:gap-1.5 tw:pl-3 tw:pr-1.5 tw:py-1 tw:bg-blue-50 tw:border tw:border-blue-200 tw:rounded-full tw:text-sm tw:text-blue-700 tw:font-medium tw:transition-all"
    >
      {{ user.name }}
      <button
        type="button"
        @click="$emit('remove', user.id)"
        :aria-label="`Remove ${user.name}`"
        class="tw:flex-shrink-0 tw:w-5 tw:h-5 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-blue-400 hover:tw:text-white hover:tw:bg-blue-500 tw:transition-colors"
      >
        <svg class="tw:w-3 tw:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  </div>
</template>

<script setup>
defineProps({
  users: { type: Array, required: true },
})

defineEmits(['remove'])
</script>
