<template>
  <Teleport to="body">
    <Transition
      enter-active-class="tw:transition tw:duration-200 tw:ease-out"
      enter-from-class="tw:opacity-0"
      enter-to-class="tw:opacity-100"
      leave-active-class="tw:transition tw:duration-150 tw:ease-in"
      leave-from-class="tw:opacity-100"
      leave-to-class="tw:opacity-0"
    >
      <div
        v-if="visible"
        class="tw:fixed tw:inset-0 tw:z-[10060] tw:flex tw:items-center tw:justify-center tw:bg-black/50 tw:p-4"
        @click.self="handleCancel"
      >
        <Transition
          enter-active-class="tw:transition tw:duration-200 tw:ease-out"
          enter-from-class="tw:opacity-0 tw:scale-95"
          enter-to-class="tw:opacity-100 tw:scale-100"
          leave-active-class="tw:transition tw:duration-150 tw:ease-in"
          leave-from-class="tw:opacity-100 tw:scale-100"
          leave-to-class="tw:opacity-0 tw:scale-95"
        >
          <div
            v-if="visible"
            class="tw:bg-white tw:rounded-xl tw:shadow-xl tw:max-w-md tw:w-full tw:p-6"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
          >
            <h3 :id="titleId" class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-2">
              {{ title }}
            </h3>
            <p class="tw:text-sm tw:text-gray-600 tw:mb-5 tw:leading-relaxed">
              {{ message }}
            </p>

            <div class="tw:flex tw:items-center tw:justify-end tw:gap-3">
              <button
                type="button"
                :disabled="loading"
                class="tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-700 tw:bg-gray-100 tw:rounded-lg hover:tw:bg-gray-200 tw:transition-colors disabled:tw:opacity-50"
                @click="handleCancel"
              >
                {{ cancelLabel }}
              </button>
              <button
                type="button"
                :disabled="loading"
                class="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-white tw:rounded-lg tw:transition-colors disabled:tw:opacity-50"
                :class="confirmButtonClass"
                @click="$emit('confirm')"
              >
                <Loader2 v-if="loading" class="tw:w-4 tw:h-4 tw:animate-spin" />
                {{ confirmLabel }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    visible: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'primary'
    loading?: boolean
  }>(),
  {
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    variant: 'primary',
    loading: false,
  },
)

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const titleId = `confirm-dialog-title-${Math.random().toString(36).slice(2, 9)}`

const confirmButtonClass = computed(() =>
  props.variant === 'danger'
    ? 'tw:bg-red-600 hover:tw:bg-red-700'
    : 'tw:bg-blue-600 hover:tw:bg-blue-700',
)

function handleCancel() {
  if (props.loading) return
  emit('cancel')
}
</script>
