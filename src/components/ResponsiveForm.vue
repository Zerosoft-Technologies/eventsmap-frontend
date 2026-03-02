<template>
  <form @submit.prevent="$emit('submit')" class="tw-space-y-4 sm:tw:space-y-6">
    <!-- Form Sections -->
    <div
      v-for="(section, sectionIndex) in sections"
      :key="sectionIndex"
      class="tw:bg-white tw:rounded-xl tw:p-4 sm:tw:p-6 tw:shadow-sm"
    >
      <h3 v-if="section.title" class="tw-text-lg tw:font-semibold tw:text-gray-900 tw:mb-4 sm:tw:mb-6">
        {{ section.title }}
      </h3>

      <!-- Form Fields Grid -->
      <div :class="getFieldGridClass(section.fields)">
        <div
          v-for="field in section.fields"
          :key="field.name"
          :class="getFieldContainerClass(field)"
        >
          <!-- Label -->
          <label
            v-if="field.label"
            :for="field.name"
            class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2"
          >
            {{ field.label }}
            <span v-if="field.required" class="tw:text-red-500">*</span>
          </label>

          <!-- Text Input -->
          <input
            v-if="field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number'"
            :id="field.name"
            v-model="formData[field.name]"
            :type="field.type"
            :placeholder="field.placeholder"
            :required="field.required"
            :disabled="field.disabled"
            :class="getInputClass(field)"
            @input="$emit('input', field.name, $event.target.value)"
          />

          <!-- Textarea -->
          <textarea
            v-else-if="field.type === 'textarea'"
            :id="field.name"
            v-model="formData[field.name]"
            :placeholder="field.placeholder"
            :required="field.required"
            :disabled="field.disabled"
            :rows="field.rows || 4"
            :class="getTextareaClass(field)"
            @input="$emit('input', field.name, $event.target.value)"
          ></textarea>

          <!-- Select -->
          <select
            v-else-if="field.type === 'select'"
            :id="field.name"
            v-model="formData[field.name]"
            :required="field.required"
            :disabled="field.disabled"
            :class="getSelectClass(field)"
            @change="$emit('input', field.name, $event.target.value)"
          >
            <option value="">{{ field.placeholder || 'Select an option' }}</option>
            <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <!-- File Upload -->
          <div v-else-if="field.type === 'file'" class="tw-relative">
            <input
              :id="field.name"
              type="file"
              :accept="field.accept"
              :multiple="field.multiple"
              :required="field.required"
              :disabled="field.disabled"
              class="tw:sr-only"
              @change="handleFileUpload(field.name, $event)"
            />
            <label
              :for="field.name"
              :class="[
                'tw-flex tw-flex-col tw-items-center tw:justify-center tw:w-full tw:h-32 sm:tw:h-40 tw:rounded-lg tw:border-2 tw:border-dashed tw:cursor-pointer tw:transition-colors',
                hasError(field.name)
                  ? 'tw:border-red-400 tw:bg-red-50'
                  : 'tw:border-gray-300 hover:tw:border-gray-400 tw:bg-gray-50'
              ]"
            >
              <Upload class="tw:w-8 tw:h-8 tw:text-gray-400 tw:mb-2" />
              <span class="tw-text-sm tw:text-gray-600">{{ field.placeholder || 'Click to upload' }}</span>
              <span v-if="field.multiple" class="tw-text-xs tw:text-gray-500 tw:mt-1">
                Multiple files allowed
              </span>
            </label>
            <!-- File Preview -->
            <div v-if="formData[field.name]?.length" class="tw-mt-2 tw-space-y-1">
              <div
                v-for="(file, index) in formData[field.name]"
                :key="index"
                class="tw-flex tw-items-center tw-justify-between tw-text-xs tw:text-gray-600 tw:bg-gray-100 tw-rounded tw-px-2 tw-py-1"
              >
                <span class="tw-truncate">{{ file.name }}</span>
                <button
                  type="button"
                  @click="removeFile(field.name, index)"
                  class="tw-text-red-500 hover:tw:text-red-700"
                >
                  <X class="tw:w-3 tw:h-3" />
                </button>
              </div>
            </div>
          </div>

          <!-- Date Input -->
          <input
            v-else-if="field.type === 'date'"
            :id="field.name"
            v-model="formData[field.name]"
            type="date"
            :required="field.required"
            :disabled="field.disabled"
            :class="getInputClass(field)"
            @input="$emit('input', field.name, $event.target.value)"
          />

          <!-- Time Input -->
          <input
            v-else-if="field.type === 'time'"
            :id="field.name"
            v-model="formData[field.name]"
            type="time"
            :required="field.required"
            :disabled="field.disabled"
            :class="getInputClass(field)"
            @input="$emit('input', field.name, $event.target.value)"
          />

          <!-- Checkbox -->
          <label v-else-if="field.type === 'checkbox'" class="tw-flex tw-items-center tw-gap-3 tw-cursor-pointer">
            <input
              :id="field.name"
              v-model="formData[field.name]"
              type="checkbox"
              :required="field.required"
              :disabled="field.disabled"
              class="tw:w-4 tw:h-4 tw:text-blue-600 tw:rounded tw:focus:ring-blue-500"
              @change="$emit('input', field.name, $event.target.checked)"
            />
            <span class="tw-text-sm tw:text-gray-700">{{ field.label }}</span>
          </label>

          <!-- Error Message -->
          <p v-if="hasError(field.name)" class="tw-mt-1 tw-text-xs tw:text-red-600">
            {{ errors[field.name] }}
          </p>

          <!-- Help Text -->
          <p v-if="field.help" class="tw-mt-1 tw-text-xs tw:text-gray-500">
            {{ field.help }}
          </p>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="tw-flex tw-flex-col sm:tw:flex-row tw-gap-3 tw-justify-end">
      <button
        v-if="showCancel"
        type="button"
        @click="$emit('cancel')"
        class="tw:w-full sm:tw-w-auto tw:px-6 tw:py-3 tw:text-sm tw:font-medium tw:text-gray-700 tw-bg-white tw:border tw:border-gray-300 tw-rounded-lg hover:tw:bg-gray-50 tw:transition-colors"
      >
        {{ cancelText }}
      </button>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="tw:w-full sm:tw-w-auto tw-px-6 tw:py-3 tw:text-sm tw:font-medium tw-text-white tw-bg-blue-600 tw-border tw:border-transparent tw-rounded-lg hover:tw:bg-blue-700 tw:disabled:tw-opacity-50 tw:disabled:tw-cursor-not-allowed tw:transition-colors"
      >
        <span v-if="isSubmitting">Submitting...</span>
        <span v-else>{{ submitText }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Upload, X } from 'lucide-vue-next'

const props = defineProps({
  sections: { type: Array, required: true },
  initialData: { type: Object, default: () => ({}) },
  isSubmitting: { type: Boolean, default: false },
  showCancel: { type: Boolean, default: true },
  submitText: { type: String, default: 'Submit' },
  cancelText: { type: String, default: 'Cancel' },
  errors: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['submit', 'cancel', 'input'])

// Initialize form data
const formData = reactive({ ...props.initialData })

// Helper methods for responsive classes
function getFieldGridClass(fields) {
  const hasFullWidth = fields.some(f => f.fullWidth)
  if (hasFullWidth) {
    return 'tw-space-y-4'
  }
  return 'tw-grid tw-grid-cols-1 md:tw:grid-cols-2 tw-gap-4'
}

function getFieldContainerClass(field) {
  if (field.fullWidth) {
    return 'md:tw:col-span-2'
  }
  return ''
}

function getInputClass(field) {
  const base = 'tw-w-full tw:px-3 sm:tw:px-4 tw:py-3 tw:text-sm tw:rounded-lg tw:border tw:transition-colors focus:tw:outline-none focus:tw:ring-2'
  const error = hasError(field.name) ? 'tw:border-red-500 tw:ring-red-500' : 'tw:border-gray-300 focus:tw:border-blue-500 focus:tw:ring-blue-500'
  const disabled = field.disabled ? 'tw:bg-gray-100 tw:cursor-not-allowed' : 'tw-bg-white'
  return `${base} ${error} ${disabled}`
}

function getTextareaClass(field) {
  return getInputClass(field)
}

function getSelectClass(field) {
  return getInputClass(field)
}

function hasError(fieldName) {
  return !!props.errors[fieldName]
}

function handleFileUpload(fieldName, event) {
  const files = Array.from(event.target.files)
  formData[fieldName] = files
  emit('input', fieldName, files)
}

function removeFile(fieldName, index) {
  if (Array.isArray(formData[fieldName])) {
    formData[fieldName].splice(index, 1)
    emit('input', fieldName, formData[fieldName])
  }
}
</script>
