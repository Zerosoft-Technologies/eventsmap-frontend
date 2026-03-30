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
        v-if="visible && image"
        class="tw:fixed tw:inset-0 tw:z-[9998] tw:flex tw:items-center tw:justify-center tw:bg-black/50 tw:p-4"
        @click.self="$emit('close')"
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
            v-if="visible && image"
            class="tw:bg-white tw:rounded-xl tw:shadow-xl tw:max-w-lg tw:w-full tw:overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="details-modal-title"
          >
            <!-- Image Preview -->
            <div class="tw:bg-gray-100 tw:flex tw:items-center tw:justify-center tw:max-h-[300px] tw:overflow-hidden">
              <img
                :src="image.image_url"
                :alt="image.image_alt_text || image.file_name"
                class="tw:max-w-full tw:max-h-[300px] tw:object-contain"
              />
            </div>

            <!-- Details -->
            <div class="tw:p-5 tw:space-y-3">
              <h3 id="details-modal-title" class="tw:text-lg tw:font-semibold tw:text-gray-900">Image Details</h3>

              <div class="tw:space-y-2 tw:text-sm">
                <div class="tw:flex tw:items-start tw:gap-2">
                  <span class="tw:text-gray-500 tw:w-24 tw:flex-shrink-0">File name</span>
                  <span class="tw:text-gray-900 tw:break-all">{{ image.file_name }}</span>
                </div>
                <div class="tw:flex tw:items-start tw:gap-2">
                  <span class="tw:text-gray-500 tw:w-24 tw:flex-shrink-0">File size</span>
                  <span class="tw:text-gray-900">{{ formatSize(image.file_size) }}</span>
                </div>
                <div class="tw:flex tw:items-start tw:gap-2">
                  <span class="tw:text-gray-500 tw:w-24 tw:flex-shrink-0">Type</span>
                  <span class="tw:text-gray-900">{{ image.file_type }}</span>
                </div>
                <div class="tw:flex tw:items-start tw:gap-2">
                  <span class="tw:text-gray-500 tw:w-24 tw:flex-shrink-0">Uploaded</span>
                  <span class="tw:text-gray-900">{{ formatDate(image.upload_date) }}</span>
                </div>
                <div v-if="image.image_alt_text" class="tw:flex tw:items-start tw:gap-2">
                  <span class="tw:text-gray-500 tw:w-24 tw:flex-shrink-0">Alt text</span>
                  <span class="tw:text-gray-900">{{ image.image_alt_text }}</span>
                </div>
              </div>

              <div class="tw:flex tw:justify-end tw:pt-2">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-700 tw:bg-gray-100 tw:rounded-lg hover:tw:bg-gray-200 tw:transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { GalleryImage } from '@/api/gallery'

defineProps<{
  visible: boolean
  image: GalleryImage | null
}>()

defineEmits<{
  (e: 'close'): void
}>()

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Unknown'
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
