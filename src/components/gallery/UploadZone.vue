<template>
  <div class="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-200 tw:shadow-sm tw:p-4 md:tw:p-6 tw:mb-6">
    <h2 class="tw:text-base md:tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">Upload New Image</h2>

    <!-- Drop Zone -->
    <div
      ref="dropZoneRef"
      :class="[
        'tw:relative tw:border-2 tw:border-dashed tw:rounded-xl tw:transition-colors tw:cursor-pointer tw:flex tw:flex-col tw:items-center tw:justify-center tw:text-center',
        'tw:h-[120px] md:tw:h-[140px] lg:tw:h-[160px]',
        isDragging
          ? 'tw:border-blue-500 tw:bg-blue-50'
          : 'tw:border-gray-300 tw:bg-gray-50 hover:tw:border-blue-400 hover:tw:bg-blue-50/50'
      ]"
      @click="openFilePicker"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <!-- Uploading state -->
      <template v-if="uploading">
        <Loader2 class="tw:w-8 tw:h-8 tw:text-blue-500 tw:animate-spin tw:mb-2" />
        <p class="tw:text-sm tw:font-medium tw:text-blue-600">Uploading... {{ uploadProgress }}%</p>
        <div class="tw:w-48 tw:h-1.5 tw:bg-gray-200 tw:rounded-full tw:mt-2 tw:overflow-hidden">
          <div
            class="tw:h-full tw:bg-blue-500 tw:rounded-full tw:transition-all tw:duration-300"
            :style="{ width: `${uploadProgress}%` }"
          ></div>
        </div>
      </template>

      <!-- Default state -->
      <template v-else>
        <ImagePlus class="tw:w-8 tw:h-8 tw:text-gray-400 tw:mb-2" />
        <p class="tw:text-sm tw:font-medium tw:text-gray-600">
          {{ isDragging ? 'Drop your image here' : 'Click to upload or drag & drop images here' }}
        </p>
        <p class="tw:text-xs tw:text-gray-400 tw:mt-1">Supported: JPG, PNG, GIF, WebP &middot; Maximum 5MB</p>
      </template>

      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        class="tw:hidden"
        @change="onFileSelected"
      />
    </div>

    <!-- Alt Text Input + Upload Button (shown after file selected) -->
    <div v-if="selectedFile && !uploading" class="tw:mt-4 tw:space-y-3">
      <div class="tw:flex tw:items-center tw:gap-3 tw:text-sm tw:text-gray-700 tw:bg-gray-50 tw:rounded-lg tw:px-3 tw:py-2">
        <FileImage class="tw:w-4 tw:h-4 tw:text-gray-400 tw:flex-shrink-0" />
        <span class="tw:truncate">{{ selectedFile.name }}</span>
        <span class="tw:text-gray-400 tw:flex-shrink-0">({{ formatSize(selectedFile.size) }})</span>
        <button type="button" @click="clearFile" class="tw:ml-auto tw:text-gray-400 hover:tw:text-red-500 tw:transition-colors">
          <X class="tw:w-4 tw:h-4" />
        </button>
      </div>

      <!-- Alt Text -->
      <div>
        <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
          Image description (alt text)
          <span class="tw:text-gray-400 tw:font-normal tw:ml-1">optional</span>
        </label>
        <input
          v-model="altText"
          type="text"
          maxlength="500"
          placeholder="Describe what's in this image..."
          class="tw:w-full tw:px-3 tw:py-2 tw:text-sm tw:border tw:border-gray-300 tw:rounded-lg tw:outline-none focus:tw:border-blue-500 focus:tw:ring-1 focus:tw:ring-blue-500"
        />
        <p class="tw:text-xs tw:text-gray-400 tw:mt-1 tw:flex tw:justify-between">
          <span>This helps with accessibility</span>
          <span>{{ altText.length }} / 500</span>
        </p>
      </div>

      <!-- Upload Button -->
      <button
        type="button"
        @click="handleUpload"
        class="tw:w-full sm:tw:w-auto tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:px-6 tw:py-2.5 tw:text-sm tw:font-medium tw:text-white tw:bg-blue-600 tw:rounded-lg hover:tw:bg-blue-700 tw:transition-colors"
      >
        <Upload class="tw:w-4 tw:h-4" />
        Upload Image
      </button>
    </div>

    <!-- Supported formats info -->
    <div v-if="!selectedFile && !uploading" class="tw:mt-3 tw:flex tw:flex-col sm:tw:flex-row tw:gap-2 tw:text-xs tw:text-gray-500">
      <span class="tw:flex tw:items-center tw:gap-1"><Check class="tw:w-3.5 tw:h-3.5 tw:text-emerald-500" /> JPG, PNG, GIF, WebP formats supported</span>
      <span class="tw:flex tw:items-center tw:gap-1"><Check class="tw:w-3.5 tw:h-3.5 tw:text-emerald-500" /> Maximum 5MB per file</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ImagePlus, Upload, Loader2, FileImage, X, Check } from 'lucide-vue-next'

const props = defineProps<{
  uploading: boolean
  uploadProgress: number
}>()

const emit = defineEmits<{
  (e: 'upload', file: File, altText: string): void
}>()

const dropZoneRef = ref<HTMLDivElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const selectedFile = ref<File | null>(null)
const altText = ref('')

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

function openFilePicker() {
  if (props.uploading) return
  fileInputRef.value?.click()
}

function onDragOver() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) selectFile(file)
}

function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) selectFile(file)
  // Reset input so same file can be selected again
  if (input) input.value = ''
}

function selectFile(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    // Emit will not happen; parent validates too but show inline feedback
    import('@/composables/useToast').then(({ useToast }) => {
      useToast().error('File size exceeds 5MB limit')
    })
    return
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    import('@/composables/useToast').then(({ useToast }) => {
      useToast().error('Invalid image format - JPG, PNG, GIF, WebP only')
    })
    return
  }
  selectedFile.value = file
}

function clearFile() {
  selectedFile.value = null
  altText.value = ''
}

function handleUpload() {
  if (!selectedFile.value || props.uploading) return
  emit('upload', selectedFile.value, altText.value)
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Expose clearFile so parent can reset after successful upload
defineExpose({ clearFile })
</script>
