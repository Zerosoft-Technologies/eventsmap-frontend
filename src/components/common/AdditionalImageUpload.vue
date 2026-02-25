<template>
  <div class="tw:space-y-4">
    <!-- Upload Area -->
    <div
      @click="triggerFileInput"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      :class="[
        'tw:border-2 tw:border-dashed tw:rounded-xl tw:p-6 tw:text-center tw:cursor-pointer tw:transition-all tw:duration-200',
        isDragging
          ? 'tw:border-blue-500 tw:bg-blue-50'
          : 'tw:border-gray-300 hover:tw:border-blue-400 tw:bg-gray-50'
      ]"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        class="tw:hidden"
        @change="onFileSelect"
      />
      
      <div class="tw:flex tw:flex-col tw:items-center tw:gap-2">
        <div class="tw:w-12 tw:h-12 tw:rounded-full tw:bg-blue-100 tw:flex tw:items-center tw:justify-center">
          <svg class="tw:w-6 tw:h-6 tw:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="tw:text-sm tw:font-medium tw:text-gray-700">Click or Drag Images Here</p>
        <p class="tw:text-xs tw:text-gray-500">JPG, PNG, WEBP (Max {{ maxSizeMB }}MB each)</p>
      </div>
    </div>

    <!-- Image Count Indicator -->
    <div v-if="previewImages.length > 0" class="tw:flex tw:items-center tw:justify-between">
      <span class="tw:text-sm tw:text-gray-600">
        {{ previewImages.length }} / {{ maxFiles }} images selected
      </span>
      <button
        v-if="previewImages.length > 0"
        @click="clearAll"
        type="button"
        class="tw:text-sm tw:text-red-500 hover:tw:text-red-700 tw:transition-colors"
      >
        Clear All
      </button>
    </div>

    <!-- Preview Grid -->
    <div v-if="previewImages.length > 0" class="tw:grid tw:grid-cols-3 tw:gap-4">
      <div
        v-for="(image, index) in previewImages"
        :key="image.id"
        class="tw:relative tw:group tw:rounded-xl tw:overflow-hidden tw:border tw:border-gray-200 tw:bg-gray-100 tw:aspect-square"
      >
        <!-- Image Preview -->
        <img
          :src="image.url"
          :alt="image.name"
          class="tw:w-full tw:h-full tw:object-cover tw:transition-transform tw:duration-200 group-hover:tw:scale-105"
        />
        
        <!-- Overlay on Hover -->
        <div class="tw:absolute tw:inset-0 tw:bg-black/40 tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity tw:duration-200 tw:flex tw:items-center tw:justify-center">
          <span class="tw:text-white tw:text-xs tw:truncate tw:px-2 tw:max-w-full">{{ image.name }}</span>
        </div>

        <!-- Remove Button -->
        <button
          @click.stop="removeImage(index)"
          type="button"
          class="tw:absolute tw:top-2 tw:right-2 tw:w-6 tw:h-6 tw:rounded-full tw:bg-red-500 tw:text-white tw:flex tw:items-center tw:justify-center tw:opacity-0 group-hover:tw:opacity-100 tw:transition-all tw:duration-200 hover:tw:bg-red-600 tw:shadow-md"
        >
          <svg class="tw:w-4 tw:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="tw:text-red-500 tw:text-sm">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  files: {
    type: Array,
    default: () => []
  },
  maxFiles: {
    type: Number,
    default: 10
  },
  maxSizeMB: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['update:files'])

const fileInputRef = ref(null)
const selectedFiles = ref([])
const previewImages = ref([])
const isDragging = ref(false)
const errorMessage = ref('')

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// Trigger file input click
function triggerFileInput() {
  fileInputRef.value?.click()
}

// Handle file selection from input
function onFileSelect(event) {
  const files = event.target.files
  if (files) {
    processFiles(Array.from(files))
  }
  // Reset input so same file can be selected again
  event.target.value = ''
}

// Handle drag over
function onDragOver() {
  isDragging.value = true
}

// Handle drag leave
function onDragLeave() {
  isDragging.value = false
}

// Handle drop
function onDrop(event) {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files) {
    processFiles(Array.from(files))
  }
}

// Process and validate files
function processFiles(files) {
  errorMessage.value = ''

  // Check max files limit
  const remainingSlots = props.maxFiles - previewImages.value.length
  if (remainingSlots <= 0) {
    errorMessage.value = `Maximum ${props.maxFiles} images allowed`
    return
  }

  const filesToAdd = files.slice(0, remainingSlots)
  const maxSizeBytes = props.maxSizeMB * 1024 * 1024

  for (const file of filesToAdd) {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      errorMessage.value = `Invalid file type: ${file.name}. Only JPG, PNG, WEBP allowed.`
      continue
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      errorMessage.value = `File too large: ${file.name}. Max size is ${props.maxSizeMB}MB.`
      continue
    }

    // Generate preview URL
    const previewUrl = URL.createObjectURL(file)

    // Add to arrays
    const imageData = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file: file,
      url: previewUrl,
      name: file.name
    }

    selectedFiles.value.push(file)
    previewImages.value.push(imageData)
  }

  // Emit updated files to parent
  emitFiles()
}

// Remove image at index
function removeImage(index) {
  // Revoke object URL to free memory
  URL.revokeObjectURL(previewImages.value[index].url)

  // Remove from arrays
  previewImages.value.splice(index, 1)
  selectedFiles.value.splice(index, 1)

  // Emit updated files
  emitFiles()
}

// Clear all images
function clearAll() {
  // Revoke all object URLs
  previewImages.value.forEach(image => {
    URL.revokeObjectURL(image.url)
  })

  previewImages.value = []
  selectedFiles.value = []
  errorMessage.value = ''

  emitFiles()
}

// Emit files to parent
function emitFiles() {
  emit('update:files', [...selectedFiles.value])
}

// Sync with parent files prop on mount
watch(() => props.files, (newFiles) => {
  if (newFiles.length === 0 && selectedFiles.value.length > 0) {
    clearAll()
  }
}, { immediate: true })

// Cleanup on unmount
onBeforeUnmount(() => {
  previewImages.value.forEach(image => {
    URL.revokeObjectURL(image.url)
  })
})
</script>
