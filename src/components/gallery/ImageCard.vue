<template>
  <div class="tw:relative tw:group tw:aspect-square tw:rounded-lg tw:overflow-hidden tw:shadow-sm tw:border tw:border-gray-200 tw:bg-gray-100">
    <!-- Image -->
    <img
      v-if="!imgError"
      :src="image.image_url"
      :alt="image.image_alt_text || image.file_name"
      class="tw:w-full tw:h-full tw:object-cover"
      loading="lazy"
      @error="imgError = true"
    />

    <!-- Image load error fallback -->
    <div v-if="imgError" class="tw:w-full tw:h-full tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-2 tw:bg-gray-100 tw:text-gray-400">
      <ImageOff class="tw:w-8 tw:h-8" />
      <span class="tw:text-xs">Failed to load</span>
      <button
        type="button"
        @click="imgError = false"
        class="tw:text-xs tw:text-blue-500 hover:tw:underline"
      >Retry</button>
    </div>

    <!-- Desktop hover overlay -->
    <div class="tw:absolute tw:inset-0 tw:bg-black/0 group-hover:tw:bg-black/30 tw:transition-all tw:duration-200 tw:pointer-events-none tw:hidden md:tw:block"></div>

    <!-- Action buttons — desktop: show on hover, mobile: always visible -->
    <div :class="[
      'tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:flex tw:items-center tw:justify-end tw:gap-2 tw:p-2',
      'md:tw:opacity-0 md:group-hover:tw:opacity-100 tw:transition-opacity tw:duration-200'
    ]">
      <button
        type="button"
        @click.stop="$emit('delete', image)"
        class="tw:w-9 tw:h-9 md:tw:w-8 md:tw:h-8 tw:flex tw:items-center tw:justify-center tw:rounded-lg tw:bg-white/90 tw:text-red-500 hover:tw:bg-red-500 hover:tw:text-white tw:transition-colors tw:shadow-sm"
        :title="'Delete ' + image.file_name"
        aria-label="Delete image"
      >
        <Trash2 class="tw:w-4 tw:h-4" />
      </button>

      <!-- More options -->
      <div class="tw:relative" ref="moreMenuRef">
        <button
          type="button"
          @click.stop="showMenu = !showMenu"
          class="tw:w-9 tw:h-9 md:tw:w-8 md:tw:h-8 tw:flex tw:items-center tw:justify-center tw:rounded-lg tw:bg-white/90 tw:text-gray-600 hover:tw:bg-gray-200 tw:transition-colors tw:shadow-sm"
          aria-label="More options"
        >
          <MoreVertical class="tw:w-4 tw:h-4" />
        </button>

        <!-- Dropdown Menu -->
        <Transition
          enter-active-class="tw:transition tw:duration-150 tw:ease-out"
          enter-from-class="tw:opacity-0 tw:scale-95"
          enter-to-class="tw:opacity-100 tw:scale-100"
          leave-active-class="tw:transition tw:duration-100 tw:ease-in"
          leave-from-class="tw:opacity-100 tw:scale-100"
          leave-to-class="tw:opacity-0 tw:scale-95"
        >
          <div
            v-if="showMenu"
            class="tw:absolute tw:right-0 tw:bottom-full tw:mb-1 tw:w-48 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-gray-200 tw:py-1 tw:z-50"
          >
            <button
              type="button"
              @click.stop="handleAction('details')"
              class="tw:w-full tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:text-sm tw:text-gray-700 hover:tw:bg-gray-50 tw:transition-colors"
            >
              <Eye class="tw:w-4 tw:h-4" /> View Details
            </button>
            <button
              type="button"
              @click.stop="handleAction('editAlt')"
              class="tw:w-full tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:text-sm tw:text-gray-700 hover:tw:bg-gray-50 tw:transition-colors"
            >
              <Pencil class="tw:w-4 tw:h-4" /> Edit Alt Text
            </button>
            <button
              type="button"
              @click.stop="handleAction('copyUrl')"
              class="tw:w-full tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:text-sm tw:text-gray-700 hover:tw:bg-gray-50 tw:transition-colors"
            >
              <Copy class="tw:w-4 tw:h-4" /> Copy Image URL
            </button>
            <button
              type="button"
              @click.stop="handleAction('download')"
              class="tw:w-full tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:text-sm tw:text-gray-700 hover:tw:bg-gray-50 tw:transition-colors"
            >
              <Download class="tw:w-4 tw:h-4" /> Download
            </button>
            <div class="tw:border-t tw:border-gray-100 tw:my-1"></div>
            <button
              type="button"
              @click.stop="handleAction('delete')"
              class="tw:w-full tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:text-sm tw:text-red-600 hover:tw:bg-red-50 tw:transition-colors"
            >
              <Trash2 class="tw:w-4 tw:h-4" /> Delete
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Trash2, MoreVertical, Eye, Pencil, Copy, Download, ImageOff } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import type { GalleryImage } from '@/api/gallery'

const props = defineProps<{
  image: GalleryImage
}>()

const emit = defineEmits<{
  (e: 'delete', image: GalleryImage): void
  (e: 'view-details', image: GalleryImage): void
  (e: 'edit-alt', image: GalleryImage): void
}>()

const toast = useToast()
const showMenu = ref(false)
const imgError = ref(false)
const moreMenuRef = ref<HTMLElement | null>(null)

function handleAction(action: string) {
  showMenu.value = false
  switch (action) {
    case 'details':
      emit('view-details', props.image)
      break
    case 'editAlt':
      emit('edit-alt', props.image)
      break
    case 'copyUrl':
      navigator.clipboard.writeText(props.image.image_url).then(() => {
        toast.success('URL copied to clipboard')
      }).catch(() => {
        toast.error('Failed to copy URL')
      })
      break
    case 'download':
      downloadImage()
      break
    case 'delete':
      emit('delete', props.image)
      break
  }
}

function downloadImage() {
  const a = document.createElement('a')
  a.href = props.image.image_url
  a.download = props.image.file_name
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function handleClickOutside(e: MouseEvent) {
  if (showMenu.value && moreMenuRef.value && !moreMenuRef.value.contains(e.target as Node)) {
    showMenu.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>
