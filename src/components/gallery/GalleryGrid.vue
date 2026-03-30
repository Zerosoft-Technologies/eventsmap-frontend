<template>
  <div>
    <!-- Loading skeletons -->
    <div v-if="loading" class="gallery-grid tw:grid tw:gap-3 md:tw:gap-5">
      <ImageCardSkeleton v-for="i in 10" :key="'skeleton-' + i" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-16 tw:text-center">
      <AlertTriangle class="tw:w-12 tw:h-12 tw:text-amber-400 tw:mb-3" />
      <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-1">Failed to load gallery</h3>
      <p class="tw:text-sm tw:text-gray-500 tw:mb-4 tw:max-w-sm">There was an error loading your images. Please try again.</p>
      <button
        type="button"
        @click="$emit('retry')"
        class="tw:inline-flex tw:items-center tw:gap-2 tw:px-5 tw:py-2 tw:text-sm tw:font-medium tw:text-white tw:bg-blue-600 tw:rounded-lg hover:tw:bg-blue-700 tw:transition-colors"
      >
        <RefreshCw class="tw:w-4 tw:h-4" />
        Try Again
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="isEmpty" class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-16 tw:text-center">
      <Camera class="tw:w-16 tw:h-16 tw:text-gray-300 tw:mb-4" />
      <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-1">No Images Yet</h3>
      <p class="tw:text-sm tw:text-gray-500 tw:mb-4 tw:max-w-sm">Upload your first image to get started building your gallery.</p>
      <button
        type="button"
        @click="$emit('scroll-to-upload')"
        class="tw:inline-flex tw:items-center tw:gap-2 tw:px-5 tw:py-2 tw:text-sm tw:font-medium tw:text-white tw:bg-blue-600 tw:rounded-lg hover:tw:bg-blue-700 tw:transition-colors"
      >
        <Upload class="tw:w-4 tw:h-4" />
        Upload Image
      </button>
    </div>

    <!-- Images grid -->
    <div v-else class="gallery-grid tw:grid tw:gap-3 md:tw:gap-5">
      <ImageCard
        v-for="image in images"
        :key="image.image_id"
        :image="image"
        @delete="$emit('delete', $event)"
        @view-details="$emit('view-details', $event)"
        @edit-alt="$emit('edit-alt', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle, RefreshCw, Camera, Upload } from 'lucide-vue-next'
import ImageCard from './ImageCard.vue'
import ImageCardSkeleton from './ImageCardSkeleton.vue'
import type { GalleryImage } from '@/api/gallery'

defineProps<{
  images: GalleryImage[]
  loading: boolean
  error: string | null
  isEmpty: boolean
}>()

defineEmits<{
  (e: 'delete', image: GalleryImage): void
  (e: 'view-details', image: GalleryImage): void
  (e: 'edit-alt', image: GalleryImage): void
  (e: 'retry'): void
  (e: 'scroll-to-upload'): void
}>()
</script>

<style scoped>
.gallery-grid {
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 481px) and (max-width: 767px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) and (max-width: 1366px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1367px) and (max-width: 1920px) {
  .gallery-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (min-width: 1921px) {
  .gallery-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
