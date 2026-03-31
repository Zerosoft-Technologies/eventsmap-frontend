<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="tw:fixed tw:inset-0 tw:z-[100] tw:flex tw:items-end tw:sm:items-center tw:justify-center tw:p-0 tw:sm:p-4">
        
        <!-- Backdrop -->
        <div class="tw:absolute tw:inset-0 tw:bg-gray-900/40 tw:backdrop-blur-sm" @click="handleClose"></div>
        
        <!-- Modal Panel -->
        <div class="tw:relative tw:bg-white tw:rounded-t-2xl tw:sm:rounded-2xl tw:w-full tw:sm:max-w-4xl tw:max-h-[92vh] tw:sm:max-h-[85vh] tw:flex tw:flex-col tw:shadow-2xl tw:overflow-hidden">
          
          <!-- Header -->
          <div class="tw:flex tw:items-center tw:justify-between tw:px-5 tw:py-4 tw:border-b tw:border-[#E8E1D5] tw:bg-white tw:shrink-0">
            <div>
              <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900">
                {{ multiple ? 'Select Images' : 'Select Image' }}
              </h2>
              <p v-if="multiple" class="tw:text-xs tw:text-gray-400 tw:mt-0.5">
                {{ selectedImages.length }}{{ maxSelection ? ` / ${maxSelection}` : '' }} selected
              </p>
            </div>
            <button
              @click="handleClose"
              class="tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center tw:rounded-lg tw:text-gray-400 hover:tw:text-gray-600 hover:tw:bg-[#F6F1E7] tw:transition-colors"
            >
              <svg class="tw:w-5 tw:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Tabs -->
          <div class="tw:flex tw:border-b tw:border-[#E8E1D5] tw:bg-white tw:shrink-0">
            <button
              @click="activeTab = 'library'"
              :class="[
                'tw:flex tw:items-center tw:gap-2 tw:flex-1 tw:px-4 tw:py-3 tw:text-sm tw:font-medium tw:transition-colors',
                activeTab === 'library'
                  ? 'tw:text-orange-500 tw:border-b-2 tw:border-orange-500 tw:bg-[#FFF8F0]'
                  : 'tw:text-gray-500 hover:tw:text-gray-700 hover:tw:bg-gray-50'
              ]"
            >
              <svg class="tw:w-4 tw:h-4 tw:shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>Media Library</span>
            </button>
            <button
              @click="activeTab = 'upload'"
              :class="[
                'tw:flex tw:items-center tw:gap-2 tw:flex-1 tw:px-4 tw:py-3 tw:text-sm tw:font-medium tw:transition-colors',
                activeTab === 'upload'
                  ? 'tw:text-orange-500 tw:border-b-2 tw:border-orange-500 tw:bg-[#FFF8F0]'
                  : 'tw:text-gray-500 hover:tw:text-gray-700 hover:tw:bg-gray-50'
              ]"
            >
              <svg class="tw:w-4 tw:h-4 tw:shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <span>Upload from Computer</span>
            </button>
          </div>

          <!-- Content -->
          <div class="tw:flex-1 tw:overflow-hidden tw:flex tw:flex-col tw:min-h-0">

            <!-- ── Media Library Tab ── -->
            <div v-if="activeTab === 'library'" class="tw:flex tw:flex-col tw:h-full tw:min-h-0">

              <!-- Search -->
              <div class="tw:px-4 tw:py-3 tw:border-b tw:border-[#E8E1D5] tw:bg-[#FAFAF9] tw:shrink-0">
                <div class="tw:relative">
                  <svg class="tw:absolute tw:left-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search images..."
                    class="tw:w-full tw:pl-9 tw:pr-4 tw:py-2 tw:text-sm tw:bg-white tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:text-gray-700 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-orange-400 focus:tw:border-transparent tw:transition-all"
                  />
                </div>
              </div>

              <!-- Images Grid -->
              <div class="tw:flex-1 tw:overflow-y-auto tw:p-4">
                <!-- Loading -->
                <div v-if="loading" class="tw:flex tw:items-center tw:justify-center tw:h-48">
                  <div class="tw:flex tw:flex-col tw:items-center tw:gap-3">
                    <div class="tw:w-8 tw:h-8 tw:border-2 tw:border-orange-500 tw:border-t-transparent tw:rounded-full tw:animate-spin"></div>
                    <p class="tw:text-sm tw:text-gray-400">Loading images...</p>
                  </div>
                </div>

                <!-- Empty state -->
                <div v-else-if="filteredImages.length === 0" class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:h-48 tw:text-center">
                  <div class="tw:w-14 tw:h-14 tw:rounded-full tw:bg-[#F6F1E7] tw:flex tw:items-center tw:justify-center tw:mb-3">
                    <svg class="tw:w-7 tw:h-7 tw:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <p class="tw:text-sm tw:font-medium tw:text-gray-700">No images found</p>
                  <p class="tw:text-xs tw:text-gray-400 tw:mt-1">Try uploading images first</p>
                </div>

                <!-- Grid -->
                <div class="tw:grid tw:grid-cols-2 tw:sm:grid-cols-3 tw:md:grid-cols-4 tw:gap-3">
                  <div
                    v-for="image in filteredImages"
                    :key="image.image_id"
                    :data-image-id="image.image_id"
                    @click="toggleImageSelection(image)"
                    :class="[
                      'tw:relative tw:cursor-pointer tw:rounded-xl tw:overflow-hidden tw:border-2 tw:transition-all tw:group',
                      selectedImages.includes(image.image_id)
                        ? 'tw:border-orange-500 tw:shadow-md tw:shadow-orange-100'
                        : 'tw:border-[#E8E1D5] hover:tw:border-orange-300 hover:tw:shadow-sm'
                    ]"
                  >
                    <img
                      :src="image.image_url"
                      :alt="image.image_alt_text || image.file_name"
                      class="tw:w-full tw:h-32 tw:sm:h-36 tw:object-cover tw:bg-gray-100"
                    />

                    <!-- Selected overlay -->
                    <div v-if="selectedImages.includes(image.image_id)" class="tw:absolute tw:inset-0 tw:bg-orange-500/10 tw:flex tw:items-start tw:justify-end tw:p-2">
                      <div class="tw:w-6 tw:h-6 tw:rounded-full tw:bg-orange-500 tw:flex tw:items-center tw:justify-center tw:shadow">
                        <svg class="tw:w-3.5 tw:h-3.5 tw:text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                      </div>
                    </div>

                    <!-- Hover filename -->
                    <div class="tw:absolute tw:bottom-0 tw:inset-x-0 tw:bg-gradient-to-t tw:from-black/60 tw:to-transparent tw:px-2 tw:py-2 tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity">
                      <p class="tw:text-white tw:text-xs tw:truncate">{{ image.file_name }}</p>
                    </div>

                    <!-- 3-dot menu button -->
                    <div class="tw:absolute tw:top-2 tw:left-2 tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity">
                      <button
                        @click.stop="toggleDropdown(image.image_id)"
                        class="tw:w-7 tw:h-7 tw:rounded-lg tw:bg-white/90 tw:backdrop-blur-sm tw:shadow-sm tw:flex tw:items-center tw:justify-center hover:tw:bg-white tw:transition-colors"
                      >
                        <svg class="tw:w-4 tw:h-4 tw:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                        </svg>
                      </button>
                    </div>

                    <!-- Dropdown menu -->
                    <div
                      v-if="isDropdownOpen(image.image_id)"
                      v-click-outside="() => toggleDropdownState(image.image_id)"
                      class="tw:fixed tw:z-[200] tw:mt-1 tw:py-1 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-[#E8E1D5] tw:min-w-[140px]"
                      :style="getDropdownPosition(image.image_id)"
                    >
                      <button
                        @click.stop="viewImage(image)"
                        class="tw:w-full tw:px-3.5 tw:py-2 tw:text-sm tw:text-gray-700 hover:tw:bg-[#F6F1E7] tw:transition-colors tw:flex tw:items-center tw:gap-2"
                      >
                        <svg class="tw:w-4 tw:h-4 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View
                      </button>
                      <button
                        @click.stop="deleteImage(image)"
                        class="tw:w-full tw:px-3.5 tw:py-2 tw:text-sm tw:text-red-600 hover:tw:bg-red-50 tw:transition-colors tw:flex tw:items-center tw:gap-2"
                      >
                        <svg class="tw:w-4 tw:h-4 tw:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Load More -->
              <div v-if="hasMore && !loading" class="tw:px-4 tw:py-3 tw:border-t tw:border-[#E8E1D5] tw:shrink-0">
                <button
                  @click="loadMore"
                  class="tw:w-full tw:py-2 tw:text-sm tw:font-medium tw:text-gray-600 tw:bg-[#F6F1E7] hover:tw:bg-[#EDE8DC] tw:rounded-lg tw:transition-colors"
                >
                  Load more images
                </button>
              </div>
            </div>

            <!-- ── Upload Tab ── -->
            <div v-if="activeTab === 'upload'" class="tw:flex-1 tw:flex tw:flex-col tw:items-center tw:justify-center tw:p-6">
              <div class="tw:w-full tw:max-w-sm tw:border-2 tw:border-dashed tw:border-[#E8E1D5] tw:rounded-2xl tw:bg-[#FAFAF9] tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:px-6 tw:text-center hover:tw:border-orange-400 hover:tw:bg-[#FFF8F0] tw:transition-colors">
                <div class="tw:w-14 tw:h-14 tw:rounded-full tw:bg-[#F6F1E7] tw:flex tw:items-center tw:justify-center tw:mb-4">
                  <svg class="tw:w-7 tw:h-7 tw:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <p class="tw:text-base tw:font-semibold tw:text-gray-800 tw:mb-1">Upload Images</p>
                <p class="tw:text-sm tw:text-gray-400 tw:mb-5">PNG, JPG, GIF — up to 10MB each</p>

                <input
                  ref="fileInput"
                  type="file"
                  :multiple="multiple"
                  accept="image/*"
                  class="tw:hidden"
                  @change="handleFileSelect"
                />

                <button
                  @click="$refs.fileInput.click()"
                  :disabled="uploading"
                  class="tw:px-5 tw:py-2.5 tw:text-sm tw:font-medium tw:text-white tw:bg-orange-500 hover:tw:bg-orange-600 tw:rounded-lg tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed tw:shadow-sm"
                >
                  {{ uploading ? 'Uploading...' : 'Choose Files' }}
                </button>

                <!-- Progress -->
                <div v-if="uploading && uploadProgress > 0" class="tw:w-full tw:mt-5">
                  <div class="tw:flex tw:items-center tw:justify-between tw:mb-1.5">
                    <span class="tw:text-xs tw:text-gray-500">Uploading...</span>
                    <span class="tw:text-xs tw:font-medium tw:text-orange-500">{{ uploadProgress }}%</span>
                  </div>
                  <div class="tw:w-full tw:bg-[#E8E1D5] tw:rounded-full tw:h-1.5">
                    <div
                      class="tw:bg-orange-500 tw:h-1.5 tw:rounded-full tw:transition-all"
                      :style="{ width: `${uploadProgress}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="tw:flex tw:items-center tw:justify-between tw:px-5 tw:py-4 tw:border-t tw:border-[#E8E1D5] tw:bg-[#FAFAF9] tw:shrink-0">
            <button
              @click="handleClose"
              class="tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-600 tw:bg-white tw:border tw:border-[#E8E1D5] hover:tw:bg-[#F6F1E7] tw:rounded-lg tw:transition-colors"
            >
              Cancel
            </button>

            <button
              @click="handleConfirm"
              :disabled="selectedImages.length === 0"
              class="tw:px-5 tw:py-2 tw:text-sm tw:font-medium tw:text-white tw:bg-orange-500 hover:tw:bg-orange-600 tw:rounded-lg tw:transition-colors disabled:tw:opacity-40 disabled:tw:cursor-not-allowed tw:shadow-sm"
            >
              {{ multiple
                ? `Select ${selectedImages.length} Image${selectedImages.length !== 1 ? 's' : ''}`
                : 'Select Image'
              }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { galleryApi } from '@/api/gallery'
import { Loader2, Search, X, Upload, Image as ImageIcon, FolderOpen } from 'lucide-vue-next'
import { useDropdownState } from '@/composables/useDropdownState'

// Simple click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}

const props = defineProps({
  visible: Boolean,
  multiple: Boolean,
  maxSelection: Number,
  preselectedIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select', 'close', 'image-updated'])

// State
const activeTab = ref('library')
const selectedImages = ref([...props.preselectedIds])
const images = ref([])
const loading = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const searchQuery = ref('')
const currentPage = ref(1)
const hasMore = ref(true)
const fileInput = ref()
const { toggleDropdown: toggleDropdownState, isDropdownOpen } = useDropdownState()
const dropdownPositions = ref({})

// Computed
const filteredImages = computed(() => {
  if (!searchQuery.value) return images.value
  const query = searchQuery.value.toLowerCase()
  return images.value.filter(img =>
    img.file_name.toLowerCase().includes(query) ||
    img.image_alt_text?.toLowerCase().includes(query)
  )
})

// Methods
const fetchImages = async (page = 1, append = false) => {
  loading.value = true
  try {
    const response = await galleryApi.fetchImages(page, 20)
    
    if (append) {
      images.value = [...images.value, ...response.data.images]
    } else {
      images.value = response.data.images
    }
    
    hasMore.value = response.data.pagination.current_page < response.data.pagination.last_page
  } catch (error) {
    console.error('Error fetching images:', error)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (!loading.value && hasMore.value) {
    currentPage.value++
    fetchImages(currentPage.value, true)
  }
}

const toggleImageSelection = (image) => {
  const index = selectedImages.value.indexOf(image.image_id)
  
  if (index > -1) {
    // Deselect
    selectedImages.value.splice(index, 1)
  } else {
    // Select
    if (props.multiple && props.maxSelection && selectedImages.value.length >= props.maxSelection) {
      // Replace oldest selection if at max
      selectedImages.value.shift()
      selectedImages.value.push(image.image_id)
    } else {
      selectedImages.value.push(image.image_id)
    }
    
    // For single selection, replace
    if (!props.multiple) {
      selectedImages.value = [image.image_id]
    }
  }
}

const handleFileSelect = async (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return
  
  uploading.value = true
  uploadProgress.value = 0
  
  try {
    const uploadPromises = Array.from(files).map(file =>
      galleryApi.uploadImage(file, undefined, undefined, (progress) => {
        uploadProgress.value = progress
      })
    )
    
    const responses = await Promise.all(uploadPromises)
    
    // Add uploaded images to the gallery
    const newImages = responses.map(res => res.data)
    images.value = [...newImages, ...images.value]
    
    // Emit uploaded images to parent to update their gallery state
    emit('image-updated', newImages)
    
    // Auto-select uploaded images
    if (props.multiple) {
      const availableSlots = props.maxSelection ? props.maxSelection - selectedImages.value.length : files.length
      const toSelect = newImages.slice(0, Math.max(0, availableSlots)).map(img => img.image_id)
      selectedImages.value = [...selectedImages.value, ...toSelect]
    } else if (newImages.length > 0) {
      selectedImages.value = [newImages[0].image_id]
    }
    
    // Switch to library tab to show uploaded images
    activeTab.value = 'library'
    
    // Clear file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    console.error('Error uploading images:', error)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// Dropdown methods
const toggleDropdown = (imageId) => {
  if (isDropdownOpen(imageId)) {
    toggleDropdownState(imageId) // Close it
  } else {
    toggleDropdownState(imageId) // Open it
    // Store position for dropdown
    nextTick(() => {
      const element = document.querySelector(`[data-image-id="${imageId}"]`)
      if (element) {
        const rect = element.getBoundingClientRect()
        dropdownPositions.value[imageId] = {
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        }
      }
    })
  }
}

const getDropdownPosition = (imageId) => {
  const pos = dropdownPositions.value[imageId]
  if (!pos) return {}
  return {
    top: `${pos.top}px`,
    left: `${pos.left}px`
  }
}

const viewImage = (image) => {
  window.open(image.image_url, '_blank')
  toggleDropdownState(image.image_id)
}

const deleteImage = async (image) => {
  if (confirm('Are you sure you want to delete this image?')) {
    try {
      await galleryApi.deleteImage(image.image_id)
      // Remove from local state
      const index = images.value.findIndex(img => img.image_id === image.image_id)
      if (index > -1) {
        images.value.splice(index, 1)
      }
      // Remove from selection if selected
      const selectedIndex = selectedImages.value.indexOf(image.image_id)
      if (selectedIndex > -1) {
        selectedImages.value.splice(selectedIndex, 1)
      }
      toggleDropdownState(image.image_id)
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Failed to delete image')
    }
  }
}

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('select', [...selectedImages.value])
  handleClose()
}

// Watch for visibility changes
watch(() => props.visible, (visible) => {
  if (visible) {
    selectedImages.value = [...props.preselectedIds]
    if (images.value.length === 0) {
      fetchImages()
    }
  }
})

// Initialize
onMounted(() => {
  if (props.visible && images.value.length === 0) {
    fetchImages()
  }
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
.tw\:overflow-y-auto::-webkit-scrollbar,
div::-webkit-scrollbar {
  width: 5px;
}
div::-webkit-scrollbar-track {
  background: #f6f1e7;
  border-radius: 4px;
}
div::-webkit-scrollbar-thumb {
  background: #d0c8bc;
  border-radius: 4px;
}
div::-webkit-scrollbar-thumb:hover {
  background: #b0a89c;
}
</style>
