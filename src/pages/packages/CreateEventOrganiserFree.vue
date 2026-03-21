<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-10 tw:px-6">
    <div class="tw:w-full tw:max-w-7xl tw:flex tw:gap-6">
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
      <EventSidebar :menuItems="menuItems"
        @back="handleBack" @event-selected="handleEventSelected" />

      <!-- ================= RIGHT CARD ================= -->
      <div class="tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-3xl tw:shadow-sm tw:p-6 tw:space-y-6">
        <!-- Organiser TITLE SECTION -->
        <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Name Event Organiser
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
        <div class="tw:bg-white tw:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-6">

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

            <!-- No file chosen -->
            <span id="file-name" class="tw:px-4 tw:py-2 tw:text-sm tw:text-gray-500 tw:flex-1">
              No File Chosen
            </span>

            <input type="file" accept="image/*" class="tw:hidden"
              onchange="document.getElementById('file-name').innerText = this.files[0]?.name || 'No file chosen'" />
          </label>
        </div>

        <!-- GENRE SECTION -->
        <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
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
          <div class="tw:flex tw:gap-4">
            <!-- Category Dropdown -->
            <div class="tw:flex-1">
              <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
                Category <span class="tw:text-red-500">*</span>
              </label>
              <div class="tw:relative">
                <select v-model="selectedCategory" @change="handleCategoryChangeWithValidation"
                  :disabled="isLoadingCategories || categoriesError" :class="[
                    'tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                    categoryError ? 'tw:border-red-500' : 'tw:border-gray-200',
                    (isLoadingCategories || categoriesError) ? 'tw:bg-gray-100 tw:cursor-not-allowed' : ''
                  ]">
                  <option value="">
                    {{ isLoadingCategories ? 'Loading...' : (categoriesError ? 'Error loading categories' :
                    'Select Category') }}
                  </option>
                  <option v-for="category in categories.filter(c => c.name.toLowerCase() == 'organiser')" :key="category.id" :value="category.name">
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
                  (!selectedCategory || categoriesError) ? 'disabled' : '',
                  subcategoryError ? 'error' : ''
                ]">
                  <div class="subcategory-input-content">
                    <span class="subcategory-input-text">
                      {{ selectedSubcategories.length > 0
                          ? `${selectedSubcategories.length} selected`
                          : (selectedCategory ? 'Select Subcategories' : 'Select Category First')
                      }}
                    </span>
                    <ChevronDown :class="[
                      'dropdown-chevron',
                      showSubcategoryDropdown ? 'rotated' : ''
                    ]" />
                  </div>
                </div>

                <!-- Dropdown Options -->
                <div v-if="showSubcategoryDropdown && selectedCategory && !categoriesError" class="subcategory-dropdown"
                  ref="dropdownMenu">
                  <div class="dropdown-content">
                    <div v-for="subcategory in availableSubcategories" :key="subcategory" class="dropdown-option"
                      :class="{
                        'selected': selectedSubcategories.includes(subcategory),
                        'disabled': !selectedSubcategories.includes(subcategory) && selectedSubcategories.length >= 1
                      }" @click="toggleSubcategory(subcategory)">
                      <input type="checkbox" :id="`subcategory-${subcategory}`" :value="subcategory"
                        v-model="selectedSubcategories"
                        :disabled="!selectedSubcategories.includes(subcategory) && selectedSubcategories.length >= 1"
                        @change="handleSubcategoryChange" @click.stop class="option-checkbox">
                      <label :for="`subcategory-${subcategory}`" class="option-label" @click.stop>
                        {{ subcategory }}
                      </label>
                    </div>
                  </div>

                  <!-- Max selection notice -->
                  <div v-if="selectedSubcategories.length >= 5" class="max-selection-notice">
                    Maximum 5 subcategories selected
                  </div>
                </div>
              </div>

              <!-- Selected Tags Display -->
              <div v-if="selectedSubcategories.length > 0" class="selected-tags">
                <span v-for="subcategory in selectedSubcategories" :key="subcategory" class="selected-tag">
                  {{ subcategory }}
                  <button @click="removeSubcategory(subcategory)" class="tag-remove">
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

        <!-- EVENT LOCATION SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:border tw:border-[#E8E1D5] tw:p-6">
          <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
            Event Location <span class="tw:text-red-500">*</span>
          </h3>

          <!-- Address Search Input with Loading Spinner -->
          <div class="tw:relative tw:mb-4">
            <input v-model="searchAddress" @input="onSearchInput" type="text" placeholder="Search Address..."
              class="tw:w-full tw:bg-white tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-gray-700 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

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
          <div id="event-map" class="tw:w-full tw:h-[300px] tw:rounded-lg tw:overflow-hidden tw:mb-4"></div>

          <!-- Selected Address -->
          <div class="tw:space-y-2">
            <label class="tw:block tw:text-sm tw:text-gray-600">
              Selected Address
            </label>
            <input v-model="selectedAddress" type="text" readonly placeholder="Address Will Auto Fill Here"
              class="tw:w-full tw:bg-gray-50 tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:px-4 tw:py-2.5 tw:text-gray-700 placeholder:tw:text-gray-400 tw:cursor-not-allowed" />
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
          <div class="tw:flex tw:w-full tw:items-center tw:justify-between">
            <button class="tw:px-6 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md 
               tw:border tw:border-orange-500 tw:text-[#0061FF]
               tw:bg-white hover:tw:bg-orange-50 tw:transition-all">
              Buy Tickets
            </button>
            <button @click="handleSubmit" :disabled="isSubmitting" class="tw:px-6 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md 
               tw:border tw:border-blue-500 tw:text-blue-600
               tw:bg-white hover:tw:bg-blue-50 tw:transition-all
               disabled:tw:opacity-50 disabled:tw:cursor-not-allowed">
              {{ isSubmitting ? 'Saving...' : 'Save Organiser' }}
            </button>
          </div>
          <span class="tw:text-red-500 tw:text-sm tw:mt-2 tw:block">Soon available</span>
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
  Upload,
  Plus,
  User,
  SkipBackIcon,
} from "lucide-vue-next"

import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue"
import { useRouter, useRoute } from "vue-router"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import InviteSection from "@/components/invite/InviteSection.vue"
import eventService from "@/services/eventService"
import { useFormValidation } from "@/composables/useFormValidation"
import { useToast } from "@/composables/useToast"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

const router = useRouter()
const route = useRoute()
const toast = useToast()

const activeTab = ref("home")
const isSubmitting = ref(false)

const formData = reactive({
  organiserTitle: '',
  category: '',
  subcategories: [],
})

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
const categories = ref([])
const isLoadingCategories = ref(false)
const categoriesError = ref(null)
const showSubcategoryDropdown = ref(false)

const dropdownContainer = ref(null)
const dropdownMenu = ref(null)

const availableSubcategories = computed(() => {
  if (!selectedCategory.value) return []
  const selectedCategoryData = categories.value.find(cat => cat.name === selectedCategory.value)
  return selectedCategoryData ? selectedCategoryData.subcategories.map(sub => sub.name) : []
})

async function fetchCategories() {
  try {
    isLoadingCategories.value = true
    categoriesError.value = null
    const response = await eventService.getCategories()
    if (response.success) {
      categories.value = response.data
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
  selectedSubcategories.value = []
  subcategoryError.value = false
  subcategoryValidationError.value = false
  categoryError.value = false
  showSubcategoryDropdown.value = false
}

function toggleSubcategoryDropdown() {
  if (!selectedCategory.value || categoriesError.value) return
  showSubcategoryDropdown.value = !showSubcategoryDropdown.value
}

function toggleSubcategory(subcategory) {
  if (!selectedSubcategories.value.includes(subcategory) && selectedSubcategories.value.length >= 1) {
    return
  }
  const index = selectedSubcategories.value.indexOf(subcategory)
  if (index > -1) {
    selectedSubcategories.value.splice(index, 1)
  } else {
    selectedSubcategories.value.push(subcategory)
  }
  handleSubcategoryChange()
}

function handleSubcategoryChange() {
  subcategoryError.value = false
  if (selectedSubcategories.value.length > 5) {
    const lastItem = selectedSubcategories.value[selectedSubcategories.value.length - 1]
    selectedSubcategories.value = selectedSubcategories.value.slice(0, 5)
    subcategoryValidationError.value = true
    setTimeout(() => { subcategoryValidationError.value = false }, 3000)
  } else {
    subcategoryValidationError.value = false
  }
}

function removeSubcategory(subcategoryToRemove) {
  const index = selectedSubcategories.value.indexOf(subcategoryToRemove)
  if (index > -1) {
    selectedSubcategories.value.splice(index, 1)
    subcategoryValidationError.value = false
  }
}

function validateGenre() {
  categoryError.value = !selectedCategory.value
  subcategoryError.value = selectedSubcategories.value.length === 0
  return selectedCategory.value && selectedSubcategories.value.length > 0
}

// Event Location refs (same behavior as CreateEventFree)
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
  fileName.value = file ? file.name : 'No File Chosen'
}

function handleBack() {
  router.push('/')
}

function handleEventSelected(eventId) {
  console.log('Event selected for editing:', eventId)
}

function handleMenuClick(item) {
  if (item.route) {
    console.log("Navigating to:", item.route);
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
  formData.category = selectedCategory.value
  formData.subcategories = selectedSubcategories.value
}

async function handleSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true

  syncFormData()

  const isValid = validate()

  // Also validate genre fields (existing logic)
  const genreValid = validateGenre()

  if (!isValid || !genreValid) {
    await scrollToFirstError()
    isSubmitting.value = false
    return
  }

  toast.success('This feature will be available in future')
  isSubmitting.value = false
}

onMounted(() => {
  fetchCategories()

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
  if (map.value) map.value.remove()
})
</script>