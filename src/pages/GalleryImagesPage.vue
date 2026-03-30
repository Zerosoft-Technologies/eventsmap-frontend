<template>
  <div class="tw:min-h-screen tw:bg-gray-50">
    <div class="tw:max-w-7xl tw:mx-auto tw:px-3 tw:py-4 md:tw:px-6 md:tw:py-8 lg:tw:px-8">
      <!-- Header -->
      <GalleryHeader :totalImages="totalImages" />

      <!-- Upload Zone -->
      <UploadZone
        ref="uploadZoneRef"
        :uploading="uploading"
        :uploadProgress="uploadProgress"
        @upload="handleUpload"
      />

      <!-- Gallery Grid -->
      <GalleryGrid
        :images="images"
        :loading="loading"
        :error="error"
        :isEmpty="isEmpty"
        @delete="openDeleteModal"
        @view-details="openDetailsModal"
        @edit-alt="openEditAltModal"
        @retry="fetchImages"
        @scroll-to-upload="scrollToUpload"
      />

      <!-- Load More Button -->
      <div v-if="!loading && !error && images.length > 0" class="tw:flex tw:justify-center tw:mt-8 tw:mb-4">
        <button
          v-if="hasMore"
          type="button"
          :disabled="loadingMore"
          @click="loadMore"
          class="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:min-w-[300px] tw:px-6 tw:py-3 tw:text-base tw:font-medium tw:text-white tw:bg-blue-600 tw:rounded-lg hover:tw:bg-blue-700 tw:transition-colors disabled:tw:opacity-60 disabled:tw:cursor-not-allowed"
        >
          <Loader2 v-if="loadingMore" class="tw:w-5 tw:h-5 tw:animate-spin" />
          <template v-if="loadingMore">Loading...</template>
          <template v-else>Load More Images ({{ remaining }})</template>
        </button>
        <p v-else class="tw:text-sm tw:text-gray-400 tw:py-3">You've reached the end</p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      :visible="deleteModalVisible"
      :image="deleteTarget"
      :deleting="deleting"
      :errorMsg="deleteError"
      @cancel="closeDeleteModal"
      @confirm="confirmDelete"
    />

    <!-- Image Details Modal -->
    <ImageDetailsModal
      :visible="detailsModalVisible"
      :image="detailsTarget"
      @close="detailsModalVisible = false"
    />

    <!-- Edit Alt Text Modal -->
    <EditAltTextModal
      :visible="editAltModalVisible"
      :image="editAltTarget"
      @close="editAltModalVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { useGallery } from '@/composables/useGallery'
import type { GalleryImage } from '@/api/gallery'

import GalleryHeader from '@/components/gallery/GalleryHeader.vue'
import UploadZone from '@/components/gallery/UploadZone.vue'
import GalleryGrid from '@/components/gallery/GalleryGrid.vue'
import DeleteConfirmationModal from '@/components/gallery/DeleteConfirmationModal.vue'
import ImageDetailsModal from '@/components/gallery/ImageDetailsModal.vue'
import EditAltTextModal from '@/components/gallery/EditAltTextModal.vue'

const {
  images,
  loading,
  loadingMore,
  error,
  uploading,
  uploadProgress,
  deleting,
  deleteError,
  totalImages,
  hasMore,
  remaining,
  isEmpty,
  fetchImages,
  loadMore,
  uploadImage,
  deleteImage,
} = useGallery()

// Refs
const uploadZoneRef = ref<InstanceType<typeof UploadZone> | null>(null)

// Delete modal state
const deleteModalVisible = ref(false)
const deleteTarget = ref<GalleryImage | null>(null)

// Details modal state
const detailsModalVisible = ref(false)
const detailsTarget = ref<GalleryImage | null>(null)

// Edit Alt modal state
const editAltModalVisible = ref(false)
const editAltTarget = ref<GalleryImage | null>(null)

onMounted(() => {
  fetchImages()
})

// Upload handler
async function handleUpload(file: File, altText: string) {
  const success = await uploadImage(file, altText || undefined)
  if (success) {
    uploadZoneRef.value?.clearFile()
  }
}

// Delete handlers
function openDeleteModal(image: GalleryImage) {
  deleteTarget.value = image
  deleteModalVisible.value = true
}

function closeDeleteModal() {
  deleteModalVisible.value = false
  deleteTarget.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  const success = await deleteImage(deleteTarget.value.image_id)
  if (success) {
    closeDeleteModal()
  }
}

// Details modal
function openDetailsModal(image: GalleryImage) {
  detailsTarget.value = image
  detailsModalVisible.value = true
}

// Edit Alt modal
function openEditAltModal(image: GalleryImage) {
  editAltTarget.value = image
  editAltModalVisible.value = true
}

// Scroll to upload zone
function scrollToUpload() {
  uploadZoneRef.value?.$el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
