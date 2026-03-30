<template>
  <div class="tw:mb-6">
    <div class="tw:flex tw:flex-col sm:tw:flex-row sm:tw:items-center sm:tw:justify-between tw:gap-2">
      <div>
        <h1 class="tw:text-xl md:tw:text-[28px] tw:font-bold tw:text-gray-900">Media Library</h1>
        <p class="tw:text-sm md:tw:text-base tw:text-gray-500 tw:mt-1">Your uploaded images</p>
      </div>
      <div class="tw:flex tw:items-center tw:gap-3">
        <span class="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-sm tw:font-medium tw:text-emerald-700 tw:bg-emerald-50 tw:px-3 tw:py-1 tw:rounded-full tw:border tw:border-emerald-200">
          <CheckCircle class="tw:w-4 tw:h-4" />
          Premium Member
        </span>
        <span v-if="totalImages > 0" class="tw:text-sm tw:text-gray-500">
          Total: {{ totalImages }} image{{ totalImages !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle } from 'lucide-vue-next'

defineProps<{
  totalImages: number
}>()
</script>
