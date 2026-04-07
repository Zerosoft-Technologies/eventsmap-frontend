<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6 tw:overflow-x-hidden">
    <div class="tw:w-full tw:max-w-7xl tw:flex tw:flex-col tw:md:flex-row tw:gap-4 tw:md:gap-6 tw:md:items-start">
      <!-- Mobile Header -->
      <div class="tw:md:hidden tw:flex tw:items-center tw:justify-between tw:bg-white tw:rounded-xl tw:shadow-sm tw:px-4 tw:py-3">
        <button type="button" @click="handleBack" class="tw:text-sm tw:font-medium tw:text-[#0061FF]">Event Map</button>
        <button type="button" @click="toggleMobileSidebar" aria-label="Open menu" class="tw:text-2xl tw:leading-none tw:text-gray-700">☰</button>
      </div>

      <!-- Mobile Sidebar Drawer -->
      <div v-if="mobileSidebarOpen" class="tw:md:hidden tw:fixed tw:inset-0 tw:z-50">
        <div class="tw:absolute tw:inset-0 tw:bg-black/30" @click="closeMobileSidebar"></div>
        <div class="tw:absolute tw:left-0 tw:top-0 tw:h-screen tw:max-w-[92vw] tw:w-full tw:p-2">
          <OrganiserSidebar :menuItems="menuItems" @back="handleBack" @organiser-selected="handleEventSelected" @chatbox-click="handleChatboxClick" @menu-click="closeMobileSidebar" />
        </div>
      </div>
      <!-- ================= LEFT CARD ================= -->
      <!-- <div
        class="tw:w-[400px] tw:bg-[#F3F2EE] tw:rounded-lg tw:border-[10px] tw:border-[#F6F1E7] tw:flex tw:max-h-[85vh] tw:sticky tw:top-10">

        
        <div
          class="tw:w-[90px] tw:bg-[#FFFFFF] tw:flex tw:flex-col tw:items-center tw:py-8 tw:space-y-6 tw:rounded-l-lg tw:border-r tw:border-gray-200">
          <div v-for="item in menuItems" :key="item.id" class="tw:relative tw:group">
            <button @click="handleMenuClick(item)" :class="[
              'tw:flex tw:items-center tw:justify-center tw:transition-all',
              isActive(item)
                ? 'tw:bg-white tw:text-gray-700'
                : 'tw:text-gray-400 hover:tw:bg-white'
            ]" class="tw:border tw:border-[#DFE1E7] tw:rounded-[6px] tw:px-[12px] tw:py-[9px]">
              <component :is="item.icon" class="tw:w-5 tw:h-5" />
            </button>

            
            <div class="tw:absolute tw:left-16 tw:top-1/2 tw:-translate-y-1/2
         tw:bg-white tw:text-gray-700 tw:text-xs
         tw:px-3 tw:py-1 tw:rounded-md
         tw:border tw:border-[#DFE1E7]
         tw:opacity-0 tw:group-hover:opacity-100
         tw:transition tw:whitespace-nowrap tw:shadow-sm">
              {{ item.label }}
            </div>
          </div>
        </div>

        
        <div class="tw:flex-1 tw:bg-[#FFFFFF] tw:rounded-r-lg tw:overflow-hidden">

          
          <div class="tw:px-6 tw:py-6 tw:border-b tw:border-gray-300">
            <button
              class="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:text-[#0061FF] hover:tw:text-black tw:font-medium">
              <ChevronLeft class="tw:w-4 tw:h-4" />
              Back To Events
            </button>
          </div>

          
          <div class="tw:p-6">
            
            <div class="tw:bg-[#F6F1E7] tw:rounded-2xl tw:p-5 tw:space-y-4 tw:border tw:border-gray-200">

              <h2 class="tw:text-xl tw:font-semibold tw:text-[#0061FF]">
                Event Title
              </h2>

              <div class="tw:flex tw:items-center tw:text-sm tw:text-[#1E3A8A] tw:gap-2">
                <Calendar class="tw:w-4 tw:h-4" />
                <span>05.03.2026, 18:30 CET</span>
              </div>

              <button
                class="tw:inline-flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:bg-white tw:text-[#0061FF] tw:rounded-md tw:border tw:border-[#FF7700] hover:tw:bg-gray-50 tw:transition">
                Draft
                <ChevronDown class="tw:w-4 tw:h-4" />
              </button>

            </div>
          </div>

        </div>
      </div> -->
      <!-- ================= LEFT CARD (Sidebar Component) ================= -->
      <div class="tw:hidden tw:md:block">
        <OrganiserSidebar :menuItems="menuItems"
          @back="handleBack" @organiser-selected="handleEventSelected" />
      </div>

      <!-- ================= RIGHT CARD ================= -->
      <div class="tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4 tw:md:space-y-6">
        <!-- Organiser TITLE SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Name Event Organiser <span class="tw:text-red-500">*</span>
            </h3>
            <!-- <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button> -->
          </div>

          <input v-model="formData.organiserTitle" type="text" placeholder="Enter Organiser Title"
            data-field="organiserTitle"
            @input="formErrors.organiserTitle && clearError('organiserTitle')"
            :class="[
              'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all',
              formErrors.organiserTitle ? 'tw:border-red-500' : 'tw:border-gray-200'
            ]" />
          <p v-if="formErrors.organiserTitle" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ formErrors.organiserTitle }}</p>
        </div>

        <!-- Organiser IMAGE SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">

          <!-- Header -->
          <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
            <h3 class="tw:text-lg tw:font-semibold tw:text-gray-800">
              Organiser Image (Max 1) <span class="tw:text-red-500">*</span>
              <span class="tw:text-xs tw:text-gray-500"> Recommended (1200x800) </span>
            </h3>

            <!-- <button type="button"
              class="tw:w-8 tw:h-8 tw:rounded-full tw:bg-blue-100 tw:text-blue-600 tw:flex tw:items-center tw:justify-center">
              <Plus class="tw:w-4 tw:h-4" />
            </button> -->
          </div>

          <!-- Custom File Input -->
          <label
            class="tw:flex tw:items-center tw:w-full tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:overflow-hidden tw:bg-white tw:cursor-pointer">

            <!-- Choose File -->
            <span class="tw:px-4 tw:py-2 tw:bg-[#F6F1E7] tw:text-sm tw:text-gray-700 tw:border-r tw:border-[#E8E1D5]">
              Choose File
            </span>

            <!-- File name display -->
            <span class="tw:px-4 tw:py-2 tw:text-sm tw:text-gray-500 tw:flex-1">
              {{ fileName || 'No File Chosen' }}
            </span>

            <input type="file" accept="image/*" class="tw:hidden"
              @change="handleFileChange" />
          </label>

          <!-- Image Preview -->
          <div v-if="imagePreviewUrl" class="tw:relative tw:mt-4 tw:w-full">
            <img :src="imagePreviewUrl" alt="Preview" class="tw:w-full tw:h-[50vh] tw:rounded-lg tw:border tw:border-gray-200" />
            <button type="button" @click="removeMainImage"
              class="tw:absolute tw:top-2 tw:right-2 tw:w-6 tw:h-6 tw:bg-(--secondary-color) tw:text-white tw:rounded-full tw:flex tw:items-center tw:justify-center hover:tw:bg-(--secondary-color) tw:transition-colors">
              <svg class="tw:w-4 tw:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
          <p v-if="fieldErrors.image_path" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ fieldErrors.image_path[0] }}</p>

        </div>

        <!-- GENRE SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Genre <span class="tw:text-red-500">*</span>
            </h3>
            <!-- <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button> -->
          </div>

          <!-- Error Display -->
          <div v-if="categoriesError" class="tw:bg-red-50 tw:border tw:border-red-200 tw:rounded-lg tw:p-4 tw:mb-4">
            <div class="tw:flex tw:items-center">
              <svg class="tw:w-5 tw:h-5 tw:text-red-400 tw:mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"></path>
              </svg>
              <p class="tw:text-red-800 tw:text-sm">{{ categoriesError }}</p>
              <button @click="fetchCategories"
                class="tw:ml-auto tw:text-red-600 tw:text-sm tw:font-medium hover:tw:text-red-700">
                Retry
              </button>
            </div>
          </div>

          <!-- Category and Subcategory Dropdowns -->
          <div class="tw:flex tw:flex-col tw:md:flex-row tw:gap-4">
            <!-- Category Dropdown -->
            <div class="tw:flex-1">
              <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
                Category <span class="tw:text-red-500">*</span>
              </label>
              <div class="tw:relative">
                <select v-model="form.organiser_category_id" @change="handleCategoryChangeWithValidation"
                  :disabled="isLoadingCategories || categoriesError" :class="[
                    'tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                    categoryError ? 'tw:border-red-500' : 'tw:border-gray-200',
                    (isLoadingCategories || categoriesError) ? 'tw:bg-gray-100 tw:cursor-not-allowed' : ''
                  ]">
                  <option value="">
                    {{ isLoadingCategories ? 'Loading...' : (categoriesError ? 'Error loading categories' :
                    'Select Category') }}
                  </option>
                  <option v-for="category in categoriesOrganisers" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
                <ChevronDown
                  class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-gray-400 tw:pointer-events-none" />
              </div>
              <p v-if="categoryError" class="tw:text-red-500 tw:text-sm tw:mt-1">Category is required</p>
            </div>

            <!-- Subcategory Multi-Select -->
            <div class="tw:flex-1">
              <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
                Subcategories <span class="tw:text-red-500">*</span>
              </label>

              <!-- Multi-Select Input Field -->
              <div class="subcategory-dropdown-container" ref="dropdownContainer">
                <div @click="toggleSubcategoryDropdown" :class="[
                  'subcategory-input',
                  (!form.organiser_category_id || categoriesError) ? 'disabled' : '',
                  subcategoryError ? 'error' : ''
                ]">
                  <div class="subcategory-input-content">
                    <span class="subcategory-input-text">
                      {{ form.organiser_subcategory_ids.length > 0
                          ? `${form.organiser_subcategory_ids.length} selected`
                          : (form.organiser_category_id ? 'Select Subcategories' : 'Select Category First')
                      }}
                    </span>
                    <ChevronDown :class="[
                      'dropdown-chevron',
                      showSubcategoryDropdown ? 'rotated' : ''
                    ]" />
                  </div>
                </div>

                <!-- Dropdown Options -->
                <div v-if="showSubcategoryDropdown && form.organiser_category_id && !categoriesError" class="subcategory-dropdown"
                  ref="dropdownMenu">
                  <div class="dropdown-content">
                    <div v-for="subcategory in availableSubcategories" :key="subcategory.id" class="dropdown-option"
                      :class="{
                        'selected': form.organiser_subcategory_ids.includes(subcategory.id),
                        'disabled': !form.organiser_subcategory_ids.includes(subcategory.id) && form.organiser_subcategory_ids.length >= 1
                      }" @click="toggleSubcategory(subcategory.id)">
                      <input type="checkbox" :id="`subcategory-${subcategory.id}`" :value="subcategory.id"
                        v-model="form.organiser_subcategory_ids"
                        :disabled="!form.organiser_subcategory_ids.includes(subcategory.id) && form.organiser_subcategory_ids.length >= 1"
                        @change="handleSubcategoryChange" @click.stop class="option-checkbox">
                      <label :for="`subcategory-${subcategory.id}`" class="option-label" @click.stop>
                        {{ subcategory.name }}
                      </label>
                    </div>
                  </div>

                  <!-- Max selection notice -->
                  <div v-if="form.organiser_subcategory_ids.length >= 5" class="max-selection-notice">
                    Maximum 5 subcategories selected
                  </div>
                </div>
              </div>

              <!-- Selected Tags Display -->
              <div v-if="form.organiser_subcategory_ids.length > 0" class="selected-tags">
                <span v-for="subcategoryId in form.organiser_subcategory_ids" :key="subcategoryId" class="selected-tag">
                  {{ availableSubcategories.find(s => s.id === subcategoryId)?.name }}
                  <button @click="removeSubcategory(subcategoryId)" class="tag-remove">
                    <svg class="tag-remove-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </span>
              </div>

              <!-- Validation Message -->
              <p v-if="subcategoryValidationError" class="validation-error">
                You can select maximum 5 subcategories only.
              </p>
              <p v-else-if="subcategoryError" class="validation-error">Please select at least one subcategory</p>
            </div>
          </div>
        </div>

        <!-- ORGANISER LOCATION SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">
          <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
            Organiser Location <span class="tw:text-red-500">*</span>
          </h3>

          <!-- Address Search Input with Loading Spinner -->
          <div class="tw:relative tw:mb-4">
            <input v-model="searchAddress" @input="onSearchInput" type="text" placeholder="Search Address..."
              class="tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-base tw:md:text-[16px] tw:text-gray-700 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

            <!-- Loading Spinner -->
            <div v-if="isLoading" class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2">
              <svg class="tw:animate-spin tw:h-5 tw:w-5 tw:text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="tw:opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="tw:opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>

            <!-- Suggestions Dropdown -->
            <div v-if="suggestions.length > 0"
              class="tw:absolute tw:top-full tw:left-0 tw:right-0 tw:mt-1 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-gray-200 tw:z-10 tw:max-h-60 tw:overflow-y-auto">
              <button v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)"
                class="tw:w-full tw:px-4 tw:py-3 tw:text-left tw:text-sm tw:text-gray-700 hover:tw:bg-gray-50 tw:transition-colors tw:border-b tw:border-gray-100 last:tw:border-b-0">
                {{ suggestion.display_name }}
              </button>
            </div>
          </div>

          <!-- Map Container -->
          <div id="event-map" class="tw:w-full tw:h-[240px] tw:md:h-[300px] tw:rounded-lg tw:overflow-hidden tw:mb-4"></div>

          <!-- Selected Address -->
          <div class="tw:space-y-2">
            <label class="tw:block tw:text-sm tw:text-gray-600">
              Selected Address
            </label>
            <input v-model="selectedAddress" type="text" readonly placeholder="Address Will Auto Fill Here"
              class="tw:w-full tw:h-12 tw:md:h-auto tw:bg-gray-50 tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:px-4 tw:py-2.5 tw:text-base tw:md:text-[16px] tw:text-gray-700 placeholder:tw:text-gray-400 tw:cursor-not-allowed" />
            <p v-if="fieldErrors.address" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ fieldErrors.address[0] }}</p>
          </div>
        </div>

        <!-- INVITE SECTION -->
        <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">Invite</h3>
          </div>
          <p class="tw:text-sm tw:text-gray-600">
            Make your event stand out even more. These sections help attendees find information and answer their
            questions.
          </p>
          <div class="tw:space-y-3">
            <InviteSection role="talent" :has-border="true" />
            <InviteSection role="venue"     :has-border="false" />
            <InviteSection role="organizer" :has-border="false" />
          </div>
        </div> -->

        <!-- SAVE Organiser BUTTON -->
        <div class="tw:w-full tw:pt-4">
          <div class="tw:flex tw:flex-col tw:md:flex-row tw:w-full tw:items-stretch tw:md:items-center tw:justify-end">
            <!-- <button class="tw:w-full tw:md:w-auto tw:px-6 tw:py-3 tw:md:py-2 tw:text-sm tw:font-medium tw:rounded-md 
               tw:border tw:border-orange-500 tw:text-[#0061FF]
               tw:bg-white hover:tw:bg-orange-50 tw:transition-all">
              Buy Tickets
            </button> -->
            <div class="tw:flex tw:flex-col tw:md:flex-row tw:gap-2">
              <button v-if="isEditMode" @click="cancelEdit" type="button"
                class="tw:w-full tw:md:w-auto tw:px-6 tw:py-3 tw:md:py-2 tw:text-sm tw:font-medium tw:rounded-md 
                   tw:border tw:border-orange-500 tw:text-blue-600
                   tw:bg-white hover:tw:bg-blue-50 tw:transition-all">
                Cancel
              </button>
              <button @click="handleSubmit" :disabled="isSubmitting" class="tw:w-full tw:md:w-auto tw:px-6 tw:py-3 tw:md:py-2 tw:text-sm tw:font-medium tw:rounded-md 
                 tw:border tw:border-orange-500 tw:text-blue-600
                 tw:bg-white hover:tw:bg-blue-50 tw:transition-all
                 disabled:tw:opacity-50 disabled:tw:cursor-not-allowed">
                {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Organiser' : 'Save Organiser') }}
              </button>
            </div>
          </div>
          <!-- <span class="tw:text-red-500 tw:text-sm tw:mt-2 tw:block">Soon available</span> -->
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import {
  Home,
  FileText,
  BarChart3,
  Settings,
  Calendar,
  ChevronLeft,
  ChevronDown,
  Upload,
  Plus,
  User,
  SkipBackIcon,
} from "lucide-vue-next"

import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue"
import { useRouter, useRoute } from "vue-router"
import OrganiserSidebar from "./eventsidebar/OrganiserSidebar.vue"
import InviteSection from "@/components/invite/InviteSection.vue"
import eventService from "@/services/eventService"
import { useFormValidation } from "@/composables/useFormValidation"
import { useToast } from "@/composables/useToast"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

const router = useRouter()
const route = useRoute()
const toast = useToast()
const mobileSidebarOpen = ref(false)

function toggleMobileSidebar() {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

function closeMobileSidebar() {
  mobileSidebarOpen.value = false
}

// ── Edit mode state ────────────────────────────────────────────────────
const isEditMode = ref(false)
const editingOrganiserId = ref(null)

const activeTab = ref("home")
const isSubmitting = ref(false)

const formData = reactive({
  organiserTitle: '',
  category: '',
  subcategories: [],
})

// Image state: holds File object (new upload) or UUID string (existing)
const mainImage = ref(null)
const imagePreviewUrl = ref(null)
const fieldErrors = ref({})

const organiserSchema = {
  organiserTitle: { type: 'text', required: true, min: 3, max: 100, label: 'Organiser Title' },
  category: { type: 'select', required: true, label: 'Category' },
  subcategories: { type: 'multiselect', required: true, min: 1, max: 5, label: 'Subcategories' },
}

const { errors: formErrors, validate, clearError, resetErrors, scrollToFirstError } = useFormValidation(organiserSchema, formData)

const selectedCategory = ref("")
const selectedSubcategories = ref([])
const categoryError = ref(false)
const subcategoryError = ref(false)
const subcategoryValidationError = ref(false)
const categoriesOrganisers = ref([])
const isLoadingCategories = ref(false)
const categoriesError = ref(null)
const showSubcategoryDropdown = ref(false)

// Form for organiser categories
const form = reactive({
  organiser_category_id: "",
  organiser_subcategory_ids: []
})

const dropdownContainer = ref(null)
const dropdownMenu = ref(null)

const availableSubcategories = computed(() => {
  if (!form.organiser_category_id) return []
  const selectedCategoryData = categoriesOrganisers.value.find(cat => cat.id === form.organiser_category_id)
  return selectedCategoryData ? selectedCategoryData.subcategories : []
})

// Computed property for selected category details
const selectedCategoryDetails = computed(() => {
  return categoriesOrganisers.value.find(cat => cat.id === form.organiser_category_id)
})

async function fetchCategories() {
  try {
    isLoadingCategories.value = true
    categoriesError.value = null
    const response = await eventService.getCategoriesOrganisers()
    if (response.success) {
      categoriesOrganisers.value = response.data
    } else {
      categoriesError.value = 'Failed to fetch categories'
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    categoriesError.value = 'Error loading categories. Please try again.'
  } finally {
    isLoadingCategories.value = false
  }
}

function handleCategoryChangeWithValidation() {
  form.organiser_subcategory_ids = []
  subcategoryError.value = false
  subcategoryValidationError.value = false
  categoryError.value = false
  showSubcategoryDropdown.value = false
}

function toggleSubcategoryDropdown() {
  if (!form.organiser_category_id || categoriesError.value) return
  showSubcategoryDropdown.value = !showSubcategoryDropdown.value
}

function toggleSubcategory(subcategoryId) {
  if (!form.organiser_subcategory_ids.includes(subcategoryId) && form.organiser_subcategory_ids.length >= 1) {
    return
  }
  const index = form.organiser_subcategory_ids.indexOf(subcategoryId)
  if (index > -1) {
    form.organiser_subcategory_ids.splice(index, 1)
  } else {
    form.organiser_subcategory_ids.push(subcategoryId)
  }
  handleSubcategoryChange()
}

function handleSubcategoryChange() {
  subcategoryError.value = false
  if (form.organiser_subcategory_ids.length > 5) {
    form.organiser_subcategory_ids = form.organiser_subcategory_ids.slice(0, 5)
    subcategoryValidationError.value = true
    setTimeout(() => { subcategoryValidationError.value = false }, 3000)
  } else {
    subcategoryValidationError.value = false
  }
}

function removeSubcategory(subcategoryIdToRemove) {
  const index = form.organiser_subcategory_ids.indexOf(subcategoryIdToRemove)
  if (index > -1) {
    form.organiser_subcategory_ids.splice(index, 1)
    subcategoryValidationError.value = false
  }
}

function validateGenre() {
  categoryError.value = !form.organiser_category_id
  subcategoryError.value = form.organiser_subcategory_ids.length === 0
  return form.organiser_category_id && form.organiser_subcategory_ids.length > 0
}

// ── Location refs ──────────────────────────────────────────────────────
const searchAddress = ref("")
const selectedAddress = ref("")
const map = ref(null)
const marker = ref(null)
const suggestions = ref([])
const isLoading = ref(false)
const debounceTimer = ref(null)

const latitude = ref(null)
const longitude = ref(null)

function debounce(func, delay) {
  return function (...args) {
    clearTimeout(debounceTimer.value)
    debounceTimer.value = setTimeout(() => func.apply(this, args), delay)
  }
}

const onSearchInput = debounce(async () => {
  if (!searchAddress.value.trim()) {
    suggestions.value = []
    return
  }

  isLoading.value = true
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress.value)}&limit=5&addressdetails=1`,
      { headers: { "User-Agent": "EventMap App" } }
    )

    if (response.ok) {
      const data = await response.json()
      suggestions.value = data
    } else {
      suggestions.value = []
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error)
    suggestions.value = []
  } finally {
    isLoading.value = false
  }
}, 400)

function selectSuggestion(suggestion) {
  const { lat, lon, display_name } = suggestion
  searchAddress.value = display_name
  suggestions.value = []
  selectedAddress.value = display_name

  latitude.value = parseFloat(lat)
  longitude.value = parseFloat(lon)

  if (map.value) {
    map.value.flyTo({ center: [lon, lat], zoom: 15, essential: true })
    updateMarker(lon, lat)
  }
}

function updateMarker(lng, lat) {
  if (marker.value) marker.value.remove()

  const el = document.createElement("div")
  el.style.width = "60px"
  el.style.height = "60px"
  el.style.cursor = "pointer"
  el.style.backgroundImage = "url(/marker.png)"
  el.style.backgroundSize = "contain"
  el.style.backgroundRepeat = "no-repeat"
  el.style.backgroundPosition = "center"

  marker.value = new maplibregl.Marker({ element: el })
    .setLngLat([lng, lat])
    .addTo(map.value)
}

async function reverseGeocode(lng, lat) {
  isLoading.value = true
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { "User-Agent": "EventMap App" } }
    )

    if (response.ok) {
      const data = await response.json()
      selectedAddress.value = data.display_name || "Address not found"
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error)
    selectedAddress.value = "Error fetching address"
  } finally {
    isLoading.value = false
  }
}

const selectedOrganiser = ref("")
const selectedTalent = ref("")
const eventDate = ref("05.03.2026, 18:30 CET")
const eventStatus = ref("Draft")
const fileName = ref("")

const menuItems = [
  { id: "home", icon: Home, label: "Home", route: "/create-organiser-free" },
  { id: "details", icon: FileText, label: "Details", route: "/create-organiser-free" },
  { id: "analytics", icon: BarChart3, route: "/create-organiser-free/report", label: "Analytics" },
  { id: "settings", icon: Settings, route: "/create-organiser-free/settings", label: "Settings" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
]

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    mainImage.value = file
    fileName.value = file.name
    imagePreviewUrl.value = URL.createObjectURL(file)
    fieldErrors.value = { ...fieldErrors.value }
    delete fieldErrors.value.image_path
  }
}

function removeMainImage() {
  mainImage.value = null
  imagePreviewUrl.value = null
  fileName.value = ''
}

function handleBack() {
  closeMobileSidebar()
  router.push('/')
}

async function handleEventSelected(eventId) {
  closeMobileSidebar()
  await loadOrganiser(eventId)
}

function handleMenuClick(item) {
  if (item.route) {
    router.push(item.route)
  } else {
    activeTab.value = item.id
  }
}

function isActive(item) {
  if (item.route) {
    return route.path === item.route
  }
  return activeTab.value === item.id && !route.path.includes('/report') && !route.path.includes('/settings')
}

function syncFormData() {
  formData.category = selectedCategoryDetails.value?.name || ''
  formData.subcategories = availableSubcategories.value
    .filter(s => form.organiser_subcategory_ids.includes(s.id))
    .map(s => s.name)
}

// ── Build FormData (shared by create & update) ────────────────────────
function buildFormData() {
  const fd = new FormData()

  fd.append('title', formData.organiserTitle)
  fd.append('event_type', 'free')

  // Organiser Category ID
  if (form.organiser_category_id) {
    fd.append('organiser_category_id', form.organiser_category_id)
  }

  // Organiser Subcategory IDs
  form.organiser_subcategory_ids.forEach(id => {
    fd.append('organiser_subcategory_ids[]', id)
  })

  fd.append('address', selectedAddress.value)
  if (latitude.value != null) fd.append('latitude', latitude.value)
  if (longitude.value != null) fd.append('longitude', longitude.value)

  // Main image: File or UUID
  if (mainImage.value instanceof File) {
    fd.append('image_path', mainImage.value)
  } else if (typeof mainImage.value === 'string' && mainImage.value) {
    fd.append('image_path', mainImage.value)
  }

  return fd
}

// ── Load for edit ──────────────────────────────────────────────────────
async function loadOrganiser(id) {
  try {
    if (!categoriesOrganisers.value.length) await fetchCategories()

    const response = await eventService.getOrganiserById(id)
    const d = response.data || response

    isEditMode.value = true
    editingOrganiserId.value = id

    formData.organiserTitle = d.title || ''
    selectedAddress.value = d.address || ''

    if (d.latitude) latitude.value = d.latitude
    if (d.longitude) longitude.value = d.longitude

    // Category / subcategory hydration
    if (d.organiser_category_id) {
      form.organiser_category_id = d.organiser_category_id
      if (d.organiser_subcategories && Array.isArray(d.organiser_subcategories)) {
        form.organiser_subcategory_ids = d.organiser_subcategories.map(s => s.id)
      }
    }

    // Image
    mainImage.value = null
    imagePreviewUrl.value = null
    fileName.value = ''
    if (d.image_path) {
      mainImage.value = d.image_path
      imagePreviewUrl.value = d.image_url || d.image_path
      fileName.value = 'Current image'
    }

    // Center map if coordinates exist
    if (d.latitude && d.longitude && map.value) {
      map.value.flyTo({ center: [d.longitude, d.latitude], zoom: 15, essential: true })
      updateMarker(d.longitude, d.latitude)
    }
  } catch (error) {
    console.error('Error loading organiser:', error)
    toast.error('Failed to load organiser data')
  }
}

function resetForm() {
  formData.organiserTitle = ''
  formData.category = ''
  formData.subcategories = []
  form.organiser_category_id = ''
  form.organiser_subcategory_ids = []
  selectedCategory.value = ''
  selectedSubcategories.value = []
  selectedAddress.value = ''
  searchAddress.value = ''
  latitude.value = null
  longitude.value = null
  mainImage.value = null
  imagePreviewUrl.value = null
  fileName.value = ''
  categoryError.value = false
  subcategoryError.value = false
  subcategoryValidationError.value = false
  isEditMode.value = false
  editingOrganiserId.value = null
  resetErrors()
}

// ── Handle Submit ───────────────────────────────────────────────────────
async function handleSubmit() {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  syncFormData()

  const isValid = validate()
  const genreValid = validateGenre()

  // Frontend validation for address and image
  let hasExtraErrors = false
  const extraErrors = { ...fieldErrors.value }
  if (!selectedAddress.value || !selectedAddress.value.trim()) {
    extraErrors.address = ['Address is required']
    hasExtraErrors = true
  } else {
    delete extraErrors.address
  }
  if (!mainImage.value) {
    extraErrors.image_path = ['Main image is required']
    hasExtraErrors = true
  } else {
    delete extraErrors.image_path
  }
  fieldErrors.value = extraErrors

  if (!isValid || !genreValid || hasExtraErrors) {
    await scrollToFirstError()
    isSubmitting.value = false
    return
  }

  try {
    if (isEditMode.value) {
      await updateOrganiser()
    } else {
      await createOrganiser()
    }
  } finally {
    isSubmitting.value = false
  }
}

function handleClickOutside(event) {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    showSubcategoryDropdown.value = false
  }
}

onMounted(() => {
  fetchCategories()
  document.addEventListener('click', handleClickOutside)

  // Initialize map
  map.value = new maplibregl.Map({
    container: "event-map",
    style: "https://api.maptiler.com/maps/streets-v2/style.json?key=4Rm2OIdojZoTFcWWjJPY",
    center: [4.895168, 52.370216],
    zoom: 12
  })

  map.value.on("click", async (e) => {
    const { lng, lat } = e.lngLat
    latitude.value = lat
    longitude.value = lng
    updateMarker(lng, lat)
    await reverseGeocode(lng, lat)
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (map.value) map.value.remove()
})
</script>