<template>
  <div
    class="tw:flex tw:gap-3 tw:rounded-xl tw:border tw:border-amber-200 tw:bg-amber-50 tw:p-4 tw:text-sm tw:text-amber-950"
    role="status"
  >
    <AlertCircle
      class="tw:w-5 tw:h-5 tw:shrink-0 tw:text-amber-600"
      aria-hidden="true"
    />
    <p class="tw:leading-relaxed">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    /** @default hints at account sidebar status control */
    message?: string
  }>(),
  {
    message:
      'This profile is still a draft. Set its publication status from the account sidebar (next to your profile in the list) when you are ready for it to appear as upcoming, completed, suspended, or cancelled.',
  },
)
</script>
