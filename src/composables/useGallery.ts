import { ref, computed } from 'vue'
import { galleryApi, type GalleryImage, type GalleryPagination } from '@/api/gallery'
import { useToast } from '@/composables/useToast'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export function useGallery() {
  const toast = useToast()

  const images = ref<GalleryImage[]>([])
  const pagination = ref<GalleryPagination | null>(null)
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref<string | null>(null)

  // Upload state
  const uploading = ref(false)
  const uploadProgress = ref(0)
  const uploadError = ref<string | null>(null)

  // Delete state
  const deleting = ref(false)
  const deleteError = ref<string | null>(null)

  const totalImages = computed(() => pagination.value?.total ?? 0)
  const currentPage = computed(() => pagination.value?.current_page ?? 0)
  const lastPage = computed(() => pagination.value?.last_page ?? 0)
  const hasMore = computed(() => currentPage.value < lastPage.value)
  const remaining = computed(() => {
    if (!pagination.value) return 0
    const loaded = pagination.value.current_page * pagination.value.per_page
    return Math.max(0, pagination.value.total - loaded)
  })
  const isEmpty = computed(() => !loading.value && images.value.length === 0 && !error.value)

  /**
   * Fetch gallery images (page 1, replaces current list)
   */
  async function fetchImages() {
    loading.value = true
    error.value = null
    try {
      const res = await galleryApi.fetchImages(1, 10)
      images.value = res.data.images
      pagination.value = res.data.pagination
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to load gallery images'
      error.value = msg
      console.error('Gallery fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Load more images (next page, appends to list)
   */
  async function loadMore() {
    if (!hasMore.value || loadingMore.value) return
    loadingMore.value = true
    try {
      const nextPage = currentPage.value + 1
      const res = await galleryApi.fetchImages(nextPage, 10)
      images.value = [...images.value, ...res.data.images]
      pagination.value = res.data.pagination
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to load more images'
      toast.error(msg)
      console.error('Gallery loadMore error:', err)
    } finally {
      loadingMore.value = false
    }
  }

  /**
   * Validate file before upload (client-side)
   */
  function validateFile(file: File): string | null {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit'
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid image format - JPG, PNG, GIF, WebP only'
    }
    return null
  }

  /**
   * Upload image with optional alt text
   */
  async function uploadImage(file: File, altText?: string, eventId?: number) {
    const validationError = validateFile(file)
    if (validationError) {
      toast.error(validationError)
      return false
    }

    uploading.value = true
    uploadProgress.value = 0
    uploadError.value = null

    try {
      const res = await galleryApi.uploadImage(file, altText, eventId, (percent) => {
        uploadProgress.value = percent
      })
      // Prepend the new image to the top of the grid
      images.value = [res.data, ...images.value]
      // Update total count
      if (pagination.value) {
        pagination.value = { ...pagination.value, total: pagination.value.total + 1 }
      }
      toast.success('Image uploaded successfully')
      return true
    } catch (err: any) {
      const data = err?.response?.data
      let msg = 'Upload failed - please try again'
      if (data?.errors) {
        const firstKey = Object.keys(data.errors)[0]
        if (firstKey && data.errors[firstKey].length > 0) {
          msg = data.errors[firstKey][0]
        }
      } else if (data?.message) {
        msg = data.message
      }
      uploadError.value = msg
      toast.error(msg)
      return false
    } finally {
      uploading.value = false
      uploadProgress.value = 0
    }
  }

  /**
   * Delete an image by UUID (image_id)
   */
  async function deleteImage(imageId: string) {
    deleting.value = true
    deleteError.value = null
    try {
      await galleryApi.deleteImage(imageId)
      // Remove from list
      images.value = images.value.filter((img) => img.image_id !== imageId)
      // Update total count
      if (pagination.value) {
        pagination.value = { ...pagination.value, total: Math.max(0, pagination.value.total - 1) }
      }
      toast.success('Image deleted successfully')
      return true
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to delete image'
      deleteError.value = msg
      toast.error(msg)
      return false
    } finally {
      deleting.value = false
    }
  }

  return {
    // State
    images,
    pagination,
    loading,
    loadingMore,
    error,
    uploading,
    uploadProgress,
    uploadError,
    deleting,
    deleteError,
    // Computed
    totalImages,
    currentPage,
    lastPage,
    hasMore,
    remaining,
    isEmpty,
    // Actions
    fetchImages,
    loadMore,
    validateFile,
    uploadImage,
    deleteImage,
  }
}
