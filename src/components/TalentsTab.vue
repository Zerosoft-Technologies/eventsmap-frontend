<template>
  <div class="tw:px-4 tw:py-4">
    <!-- Section Title -->
    <h3 class="tw:text-base tw:font-medium tw:text-gray-900 tw:mb-4">
      Talents join the event
    </h3>

    <!-- Talents Grid -->
    <div v-if="talents.length > 0" :class="['tw:flex tw:flex-wrap tw:gap-3', isExpanded ? 'tw:max-h-96 tw:overflow-y-auto' : '']">
      <!-- Display talents -->
      <div
        v-for="(talent, index) in displayedTalents"
        :key="index"
        class="tw:w-16 tw:h-16 tw:rounded-xl tw:overflow-hidden tw:border tw:border-gray-200 tw:transition-transform hover:tw:scale-105 tw-flex-shrink-0"
      >
        <img
          v-if="talent.image"
          :src="talent.image"
          :alt="talent.name"
          class="tw:w-full tw:h-full tw:object-cover tw:cursor-pointer"
        />
        <div
          v-else
          class="tw:w-full tw:h-full tw:bg-gray-200 tw:flex tw:items-center tw:justify-center"
        >
          <svg class="tw:w-8 tw:h-8 tw:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>

      <!-- More Count Badge -->
      <div
        v-if="remainingCount > 0"
        @click="toggleExpanded"
        class="tw:w-16 tw:h-16 tw:rounded-xl tw:bg-gray-100 tw:flex tw:flex-col tw:items-center tw:justify-center tw:cursor-pointer tw-transition-colors hover:tw:bg-gray-200 tw:flex-shrink-0"
      >
        <span class="tw-text-sm tw-font-medium tw:text-gray-700">{{ remainingCount }}+</span>
        <span class="tw-xs tw:text-gray-500">more</span>
      </div>
    </div>

    <!-- No Talents Message -->
    <div v-else class="tw:text-sm tw:text-gray-500 tw:py-4">
      No talents added for this event yet.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Talent {
  name: string
  image: string
}

interface Props {
  talents?: Talent[]
}

const props = withDefaults(defineProps<Props>(), {
  talents: () => []
})

const isExpanded = ref(false)

// Display talents based on expanded state
const displayedTalents = computed(() => {
  if (isExpanded.value || props.talents.length <= 8) {
    return props.talents
  }
  return props.talents.slice(0, 8)
})

// Calculate remaining count
const remainingCount = computed(() => {
  if (isExpanded.value || props.talents.length <= 8) {
    return 0
  }
  return props.talents.length - 8
})

// Toggle expanded state
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
