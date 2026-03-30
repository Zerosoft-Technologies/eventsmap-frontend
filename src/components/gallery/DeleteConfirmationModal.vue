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
        class="tw:fixed tw:inset-0 tw:z-[9998] tw:flex tw:items-center tw:justify-center tw:bg-black/50 tw:p-4"
        @click.self="$emit('cancel')"
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
            aria-labelledby="delete-modal-title"
          >
            <h3 id="delete-modal-title" class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-2">Delete Image?</h3>
            <p class="tw:text-sm tw:text-gray-600 tw:mb-3">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <p v-if="image" class="tw:text-sm tw:text-gray-500 tw:bg-gray-50 tw:rounded-lg tw:px-3 tw:py-2 tw:mb-5 tw:truncate">
              <span class="tw:font-medium tw:text-gray-700">Image:</span> {{ image.file_name }}
            </p>

            <div v-if="errorMsg" class="tw:text-sm tw:text-red-600 tw:bg-red-50 tw:rounded-lg tw:px-3 tw:py-2 tw:mb-4">
              {{ errorMsg }}
            </div>

            <div class="tw:flex tw:items-center tw:justify-end tw:gap-3">
              <button
                type="button"
                :disabled="deleting"
                @click="$emit('cancel')"
                class="tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-700 tw:bg-gray-100 tw:rounded-lg hover:tw:bg-gray-200 tw:transition-colors disabled:tw:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                :disabled="deleting"
                @click="$emit('confirm')"
                class="tw:inline-flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-white tw:bg-red-600 tw:rounded-lg hover:tw:bg-red-700 tw:transition-colors disabled:tw:opacity-50"
              >
                <Loader2 v-if="deleting" class="tw:w-4 tw:h-4 tw:animate-spin" />
                Delete
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import type { GalleryImage } from '@/api/gallery'

defineProps<{
  visible: boolean
  image: GalleryImage | null
  deleting: boolean
  errorMsg: string | null
}>()

defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()
</script>
