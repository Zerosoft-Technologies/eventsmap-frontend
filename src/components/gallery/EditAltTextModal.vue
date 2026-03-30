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
            class="tw:bg-white tw:rounded-xl tw:shadow-xl tw:max-w-md tw:w-full tw:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-alt-modal-title"
          >
            <h3 id="edit-alt-modal-title" class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-1">Edit Alt Text</h3>
            <p class="tw:text-sm tw:text-gray-500 tw:mb-4">{{ image.file_name }}</p>

            <div class="tw:mb-4">
              <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">Image description</label>
              <textarea
                v-model="localAltText"
                maxlength="500"
                rows="3"
                placeholder="Describe what's in this image..."
                class="tw:w-full tw:px-3 tw:py-2 tw:text-sm tw:border tw:border-gray-300 tw:rounded-lg tw:outline-none focus:tw:border-blue-500 focus:tw:ring-1 focus:tw:ring-blue-500 tw:resize-none"
              ></textarea>
              <p class="tw:text-xs tw:text-gray-400 tw:mt-1 tw:text-right">{{ localAltText.length }} / 500</p>
            </div>

            <p class="tw:text-xs tw:text-amber-600 tw:bg-amber-50 tw:rounded-lg tw:px-3 tw:py-2 tw:mb-4">
              Note: Alt text editing will be available in a future update.
            </p>

            <div class="tw:flex tw:items-center tw:justify-end tw:gap-3">
              <button
                type="button"
                @click="$emit('close')"
                class="tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-700 tw:bg-gray-100 tw:rounded-lg hover:tw:bg-gray-200 tw:transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { GalleryImage } from '@/api/gallery'

const props = defineProps<{
  visible: boolean
  image: GalleryImage | null
}>()

defineEmits<{
  (e: 'close'): void
}>()

const localAltText = ref('')

watch(() => props.image, (img) => {
  localAltText.value = img?.image_alt_text || ''
}, { immediate: true })
</script>
