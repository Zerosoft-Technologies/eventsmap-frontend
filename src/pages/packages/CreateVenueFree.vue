<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6 tw:overflow-x-hidden">
    <div class="tw:w-full tw:max-w-7xl tw:flex tw:flex-col tw:md:flex-row tw:gap-4 tw:md:gap-6">
      <div class="tw:md:hidden tw:flex tw:items-center tw:justify-between tw:bg-white tw:rounded-xl tw:shadow-sm tw:px-4 tw:py-3">
        <button type="button" @click="handleBack" class="tw:text-sm tw:font-medium tw:text-[#0061FF]">Event Map</button>
        <button type="button" @click="toggleMobileSidebar" aria-label="Open menu" class="tw:text-2xl tw:leading-none tw:text-gray-700">☰</button>
      </div>
      <div v-if="mobileSidebarOpen" class="tw:md:hidden tw:fixed tw:inset-0 tw:z-50">
        <div class="tw:absolute tw:inset-0 tw:bg-black/30" @click="closeMobileSidebar"></div>
        <div class="tw:absolute tw:left-0 tw:top-0 tw:h-screen tw:max-w-[92vw] tw:w-full tw:p-2">
          <EventSidebar :menuItems="menuItems"
            @back="handleBack" @event-selected="handleEventSelected" @menu-click="closeMobileSidebar" />
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
        <EventSidebar :menuItems="menuItems"
          @back="handleBack" @event-selected="handleEventSelected" />
      </div>

      <!-- ================= RIGHT CARD ================= -->
      <div class="tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4 tw:md:space-y-6">
        <!-- Venue TITLE SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Venue Title
            </h3>
            <!-- <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button> -->
          </div>

          <input v-model="formData.venueTitle" type="text" placeholder="Enter Venue Title"
            data-field="venueTitle"
            @input="formErrors.venueTitle && clearError('venueTitle')"
            :class="[
              'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all',
              formErrors.venueTitle ? 'tw:border-red-500' : 'tw:border-gray-200'
            ]" />
          <p v-if="formErrors.venueTitle" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ formErrors.venueTitle }}</p>
        </div>

        <!-- Venue LOCATION SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">
          <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
            Venue Location
          </h3>

          <div class="tw:relative tw:mb-4">
            <input v-model="searchAddress" @input="onSearchInput" type="text" placeholder="Search Address..."
              class="tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-base tw:md:text-[16px] tw:text-gray-700 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

            <div v-if="isLoading" class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2">
              <svg class="tw:animate-spin tw:h-5 tw:w-5 tw:text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="tw:opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="tw:opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </div>

            <div v-if="suggestions.length > 0"
              class="tw:absolute tw-top-full tw:left-0 tw:right-0 tw:mt-1 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-gray-200 tw:z-10 tw:max-h-60 tw:overflow-y-auto">
              <button v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)"
                class="tw:w-full tw:px-4 tw:py-3 tw:text-left tw:text-sm tw:text-gray-700 hover:tw:bg-gray-50 tw:transition-colors tw:border-b tw:border-gray-100 last:tw:border-b-0">
                {{ suggestion.display_name }}
              </button>
            </div>
          </div>

          <div id="event-map" class="tw:w-full tw:h-[240px] tw:md:h-[300px] tw:rounded-lg tw:overflow-hidden tw:mb-4"></div>

          <div class="tw:space-y-2">
            <label class="tw:block tw:text-sm tw:text-gray-600">Selected Address</label>
            <input v-model="selectedAddress" type="text" readonly placeholder="Address Will Auto Fill Here"
              class="tw:w-full tw:h-12 tw:md:h-auto tw:bg-gray-50 tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:px-4 tw:py-2.5 tw:text-base tw:md:text-[16px] tw:text-gray-700 placeholder:tw:text-gray-400 tw:cursor-not-allowed" />
          </div>
        </div>

        <!-- Venue IMAGE SECTION (gallery ID only) -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">

          <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
            <h3 class="tw:text-lg tw:font-semibold tw:text-gray-800">
              Venue Image (Max 1) <span class="tw:text-red-500">*</span>
              <span class="tw:text-xs tw:text-gray-500"> Recommended (1200x800) </span>
            </h3>
          </div>

          <div
            @click="openMediaModal"
            class="tw:flex tw:items-center tw:w-full tw:max-w-full tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:overflow-hidden tw:bg-white tw:cursor-pointer hover:tw:bg-gray-50"
          >
            <span class="tw:px-4 tw:py-2 tw:bg-[#F6F1E7] tw:text-sm tw:text-gray-700 tw:border-r tw:border-[#E8E1D5]">
              Choose from Media
            </span>
            <span class="tw:px-4 tw:py-2 tw:text-sm tw:text-gray-500 tw:flex-1">
              {{ mainGalleryRow ? mainGalleryRow.file_name : 'No Image Selected' }}
            </span>
            <svg class="tw:w-5 tw:h-5 tw:mr-2 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>

          <div v-if="mainGalleryRow" class="tw:relative tw:mt-4 tw:w-full tw:max-w-md">
            <img :src="mainGalleryRow.image_url" alt="Venue preview" class="tw:w-full tw:h-48 tw:object-cover tw:rounded-lg tw:border tw:border-gray-200" />
            <button type="button" @click="removeMainImage"
              class="tw:absolute tw:top-2 tw:right-2 tw:w-6 tw:h-6 tw:bg-red-500 tw:text-white tw:rounded-full tw:flex tw:items-center tw:justify-center hover:tw:bg-red-700">
              <span class="tw:text-sm tw:leading-none">&times;</span>
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
                <select v-model="selectedCategory" @change="handleCategoryChangeWithValidation"
                  :disabled="isLoadingCategories || categoriesError" :class="[
                    'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                    categoryError ? 'tw:border-red-500' : 'tw:border-gray-200',
                    (isLoadingCategories || categoriesError) ? 'tw:bg-gray-100 tw:cursor-not-allowed' : ''
                  ]">
                  <option value="">
                    {{ isLoadingCategories ? 'Loading...' : (categoriesError ? 'Error loading categories' :
                    'Select Category') }}
                  </option>
                  <option v-for="category in categories.filter(c => c.name.toLowerCase() == 'venue')" :key="category.id" :value="category.name">
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

        <!-- ALLOWANCE OF DOGS SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Allowance of dogs
            </h3>
            <!-- <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button> -->
          </div>

          <div class="tw:relative">
            <select v-model="allowanceOfDogs"
              class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
              <option value="">Select dog policy</option>
              <option value="all-dogs">all dogs allowed</option>
              <option value="small-dogs">small dogs only, except for assistance dogs</option>
              <option value="no-dogs-assistance">no dogs allowed, except for assistance dogs</option>
              <option value="no-dogs-included">no dogs allowed, assistance dogs included</option>
            </select>
            <ChevronDown
              class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-gray-400 tw:pointer-events-none" />
          </div>
        </div>

        <!-- WHEELCHAIR ACCESSIBLE SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Wheelchair accessible
            </h3>
            <!-- <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button> -->
          </div>

          <div class="tw:relative">
            <select v-model="wheelchairAccessible"
              class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <ChevronDown
              class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-gray-400 tw:pointer-events-none" />
          </div>
        </div>

        <!-- ACCESSIBLE PARKING SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Accessible parking close to entrance
            </h3>
            <!-- <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button> -->
          </div>

          <div class="tw:relative">
            <select v-model="accessibleParking"
              class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <ChevronDown
              class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-gray-400 tw:pointer-events-none" />
          </div>
        </div>

        <!-- VALET PARKING SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Valet-Parking
            </h3>
            <!-- <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button> -->
          </div>

          <div class="tw:relative">
            <select v-model="valetParking"
              class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <ChevronDown
              class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-gray-400 tw:pointer-events-none" />
          </div>
        </div>

        <!-- CHILDREN'S PLAY AREA SECTION -->
        <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Children's play area
            </h3>
            <!-- <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button> -->
          </div>

          <div class="tw:relative">
            <select v-model="childrensPlayArea"
              class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <ChevronDown
              class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-gray-400 tw:pointer-events-none" />
          </div>
        </div>

        <!-- VENUE SECTION -->
        <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Venue
            </h3>
            <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button>
          </div>

          <div class="tw:relative">
            <select v-model="selectedVenue"
              class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
              <option value="">Venue</option>
              <option value="venue1">Venue A</option>
              <option value="venue2">Venue B</option>
              <option value="venue3">Create New Venue</option>
            </select>
            <ChevronDown
              class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-gray-400 tw:pointer-events-none" />
          </div>
        </div> -->

        <!-- ORGANISER SECTION -->
        <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Organiser
            </h3>
            <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button>
          </div>

          <div class="tw:relative">
            <select v-model="selectedOrganiser"
              class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
              <option value="">Select Organiser</option>
              <option value="org1">Organiser A</option>
              <option value="org2">Organiser B</option>
              <option value="new">Create New Organiser</option>
            </select>

            <ChevronDown
              class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-gray-400 tw:pointer-events-none" />
          </div>
        </div> -->

        <!-- TALENT SECTION -->
        <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Talent
            </h3>
            <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button>
          </div>

          <div class="tw:relative">
            <select v-model="selectedTalent"
              class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
              <option value="">Select Talent</option>
              <option value="talent1">DJ Alex</option>
              <option value="talent2">Band XYZ</option>
              <option value="new">Add New Talent</option>
            </select>

            <ChevronDown
              class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-gray-400 tw:pointer-events-none" />
          </div>
        </div> -->

        <!-- INVITE SECTION -->
        <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">Invite</h3>
          </div>
          <p class="tw:text-sm tw:text-[#1E3A8A]">
            Make your event stand out even more. These sections help attendees find information and answer their questions.
          </p>
          <div class="tw:space-y-1">
            <InviteSection role="venue" :has-border="false" /> -->
            <!-- <div class="tw:flex tw:items-center tw:justify-between tw:py-3 tw:border-b tw:border-gray-100">
              <div class="tw:flex tw:items-center tw:gap-3">
                <div class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-gray-100 tw:flex tw:items-center tw:justify-center">
                  <User class="tw:w-5 tw:h-5 tw:text-gray-600" />
                </div>
                <span class="tw:text-sm tw:font-medium tw:text-gray-900">Invite Talent</span>
              </div>
              <button class="tw:text-sm tw:font-medium tw:text-blue-600 hover:tw:text-blue-700">+ Add</button>
            </div>
            <div class="tw:flex tw:items-center tw:justify-between tw:py-3 tw:border-b tw:border-gray-100">
              <div class="tw:flex tw:items-center tw:gap-3">
                <div class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-gray-100 tw:flex tw:items-center tw:justify-center">
                  <User class="tw:w-5 tw:h-5 tw:text-gray-600" />
                </div>
                <span class="tw:text-sm tw:font-medium tw:text-gray-900">Invite Organizer</span>
              </div>
              <button class="tw:text-sm tw:font-medium tw:text-blue-600 hover:tw:text-blue-700">+ Add</button>
            </div>
            <div class="tw:flex tw:items-center tw:justify-between tw:py-3">
              <div class="tw:flex tw:items-center tw:gap-3">
                <div class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-gray-100 tw:flex tw:items-center tw:justify-center">
                  <User class="tw:w-5 tw:h-5 tw:text-gray-600" />
                </div>
                <span class="tw:text-sm tw:font-medium tw:text-gray-900">Invite Venue</span>
              </div>
              <button class="tw:text-sm tw:font-medium tw:text-blue-600 hover:tw:text-blue-700">+ Add</button>
            </div> -->
          <!-- </div>
        </div> -->

        <!-- SAVE Venue BUTTON -->
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
                {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Venue' : 'Save Venue') }}
              </button>
            </div>
          </div>
          <!-- <span class="tw:text-red-500 tw:text-sm tw:mt-2 tw:block">Soon available</span> -->
        </div>

      </div>

    </div>
  </div>

  <Teleport to="body">
    <MediaPickerModal
      :visible="showMediaModal"
      :multiple="false"
      :max-selection="1"
      :preselected-ids="formData.image_path ? [formData.image_path] : []"
      @select="handleMediaSelect"
      @close="showMediaModal = false"
      @image-updated="handleImageUpdated"
    />
  </Teleport>
</template>

<script setup>
import {
  Home,
  FileText,
  BarChart3,
  Settings,
  Calendar,
  ChevronDown,
  ChevronLeft,
  Upload,
  Plus,
  MapPin,
  User,
  SkipBackIcon,
  Clock,
} from "lucide-vue-next"

import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from "vue"
import { useRouter, useRoute } from "vue-router"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import MediaPickerModal from "@/components/media/MediaPickerModal.vue"
import { galleryApi } from "@/api/gallery"
import eventService from "@/services/eventService"
import InviteSection from "@/components/invite/InviteSection.vue"
import { useFormValidation } from "@/composables/useFormValidation"
import { useToast } from "@/composables/useToast"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

const router = useRouter()
const route = useRoute()
const toast = useToast()
const mobileSidebarOpen = ref(false)
function toggleMobileSidebar() { mobileSidebarOpen.value = !mobileSidebarOpen.value }
function closeMobileSidebar() { mobileSidebarOpen.value = false }

const activeTab = ref("home")
const isSubmitting = ref(false)
const isEditMode = ref(false)
const editingVenueId = ref(null)
const fieldErrors = ref({})

const showMediaModal = ref(false)
const galleryImages = ref([])

// ── Form Validation (generic composable) ─────────────────────
const formData = reactive({
  venueTitle: '',
  category: '',
  subcategories: [],
  image_path: '',
})

const mainGalleryRow = computed(() => {
  if (!formData.image_path) return null
  return galleryImages.value.find((img) => img.image_id === formData.image_path)
})

const venueSchema = {
  venueTitle: { type: 'text', required: true, min: 3, max: 100, label: 'Venue Title' },
  category: { type: 'select', required: true, label: 'Category' },
  subcategories: { type: 'multiselect', required: true, min: 1, max: 5, label: 'Subcategories' },
}

const { errors: formErrors, validate, clearError, resetErrors, scrollToFirstError } = useFormValidation(venueSchema, formData)

// Genre state
const selectedCategory = ref("")
const selectedSubcategories = ref([])
const categoryError = ref(false)
const subcategoryError = ref(false)
const subcategoryValidationError = ref(false)
const categories = ref([])
const isLoadingCategories = ref(false)
const categoriesError = ref(null)
const showSubcategoryDropdown = ref(false)

// Dropdown refs for click outside functionality
const dropdownContainer = ref(null)
const dropdownMenu = ref(null)

// Computed property for available subcategories
const availableSubcategories = computed(() => {
  if (!selectedCategory.value) return []
  const selectedCategoryData = categories.value.find(cat => cat.name === selectedCategory.value)
  return selectedCategoryData ? selectedCategoryData.subcategories.map(sub => sub.name) : []
})

// Fetch categories from API using eventService
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

function handleCategoryChange() {
  handleCategoryChangeWithValidation()
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

function handleClickOutside(event) {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    showSubcategoryDropdown.value = false
  }
}

function handleSubcategoryChange() {
  subcategoryError.value = false
  if (selectedSubcategories.value.length > 5) {
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

// Event Location refs
const searchAddress = ref("")
const selectedAddress = ref("")
const map = ref(null)
const marker = ref(null)
const suggestions = ref([])
const isLoading = ref(false)
const debounceTimer = ref(null)
const mapLat = ref(null)
const mapLng = ref(null)

// Accessibility fields
const allowanceOfDogs = ref("")
const wheelchairAccessible = ref("")
const accessibleParking = ref("")
const valetParking = ref("")
const childrensPlayArea = ref("")

// Menu items specific to CreateEventFree
const menuItems = [
  { id: "home", icon: Home, label: "Home", route: "/create-venue-free" },
  { id: "details", icon: FileText, label: "Details", route: "/create-venue-free" },
  { id: "analytics", icon: BarChart3, route: "/create-venue-free/report", label: "Analytics" },
  { id: "settings", icon: Settings, route: "/create-venue-free/settings", label: "Settings" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
]

function openMediaModal() {
  showMediaModal.value = true
}

function handleMediaSelect(ids) {
  formData.image_path = ids[0] || ''
}

function handleImageUpdated(newImages) {
  galleryImages.value = [...newImages, ...galleryImages.value]
  if (newImages.length > 0) {
    formData.image_path = newImages[0].image_id
  }
}

async function fetchGalleryImages(retryCount = 0) {
  try {
    const response = await galleryApi.fetchImages(1, 100)
    galleryImages.value = response.data.images
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    if (retryCount < 2) {
      setTimeout(() => fetchGalleryImages(retryCount + 1), 1000)
    }
  }
}

function removeMainImage() {
  formData.image_path = ''
}

function handleBack() {
  closeMobileSidebar()
  router.push('/')
}

async function handleEventSelected(eventId) {
  closeMobileSidebar()
  await loadVenue(Number(eventId))
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

// Sync category/subcategory selections into formData for validation
function syncFormData() {
  formData.category = selectedCategory.value
  formData.subcategories = selectedSubcategories.value
}

function buildVenuePayload() {
  const imagePath = typeof formData.image_path === 'string' ? formData.image_path.trim() : ''
  if (!imagePath) {
    throw new Error('image_path is required')
  }

  const selectedCategoryData = categories.value.find((cat) => cat.name === selectedCategory.value)
  const categoryId = selectedCategoryData ? selectedCategoryData.id : 0
  const subcategoryIds = []
  if (selectedCategoryData) {
    selectedSubcategories.value.forEach((subName) => {
      const subData = selectedCategoryData.subcategories.find((s) => s.name === subName)
      if (subData) subcategoryIds.push(subData.id)
    })
  }

  return {
    title: formData.venueTitle,
    event_type: 'free',
    image_path: imagePath,
    additional_images: [],
    category_id: categoryId,
    subcategory_ids: subcategoryIds,
    location: selectedAddress.value || undefined,
    address: selectedAddress.value || undefined,
    latitude: mapLat.value,
    longitude: mapLng.value,
    allowance_of_dogs: allowanceOfDogs.value || undefined,
    wheelchair_accessible: wheelchairAccessible.value || undefined,
    accessible_parking: accessibleParking.value || undefined,
    valet_parking: valetParking.value || undefined,
    childrens_play_area: childrensPlayArea.value || undefined,
  }
}

function validateForm() {
  syncFormData()
  const ok = validate() && validateGenre()
  const mainUuid =
    typeof formData.image_path === 'string' ? formData.image_path.trim() : ''
  const extra = { ...fieldErrors.value }
  if (!mainUuid) {
    extra.image_path = ['Main image is required']
  } else {
    delete extra.image_path
  }
  fieldErrors.value = extra
  return ok && !!mainUuid
}

// ── Create Venue ────────────────────────────────────────────────
async function createVenue() {
  try {
    fieldErrors.value = {}
    const payload = buildVenuePayload()
    const response = await eventService.createVenue(payload)
    if (response.success) {
      toast.success('Venue created successfully!')
      resetForm()
    } else {
      if (response.errors) fieldErrors.value = response.errors
      toast.error(response.message || 'Failed to create venue')
    }
  } catch (error) {
    console.error('Error creating venue:', error)
    if (error instanceof Error && error.message === 'image_path is required') {
      fieldErrors.value = { ...fieldErrors.value, image_path: ['Main image is required'] }
      toast.error('Please select a main image from your gallery.')
      return
    }
    if (error.response?.data?.errors) {
      fieldErrors.value = error.response.data.errors
      toast.error(error.response.data.message || 'Please correct the errors.')
    } else {
      toast.error(error.response?.data?.message || 'An error occurred while creating the venue')
    }
  }
}

// ── Update Venue ────────────────────────────────────────────────
async function updateVenue() {
  try {
    fieldErrors.value = {}
    const payload = buildVenuePayload()
    const response = await eventService.updateVenue(editingVenueId.value, payload)
    if (response.success) {
      toast.success('Venue updated successfully!')
      resetForm()
    } else {
      if (response.errors) fieldErrors.value = response.errors
      toast.error(response.message || 'Failed to update venue')
    }
  } catch (error) {
    console.error('Error updating venue:', error)
    if (error instanceof Error && error.message === 'image_path is required') {
      fieldErrors.value = { ...fieldErrors.value, image_path: ['Main image is required'] }
      toast.error('Please select a main image from your gallery.')
      return
    }
    if (error.response?.data?.errors) {
      fieldErrors.value = error.response.data.errors
      toast.error(error.response.data.message || 'Please correct the errors.')
    } else {
      toast.error(error.response?.data?.message || 'An error occurred while updating the venue')
    }
  }
}

// ── Load Venue for editing ──────────────────────────────────────
async function loadVenue(id) {
  try {
    await fetchGalleryImages()
    const response = await eventService.getVenueById(id)
    const venue = response.data || response

    isEditMode.value = true
    editingVenueId.value = id

    formData.venueTitle = venue.title || ''
    selectedAddress.value = venue.address || ''
    searchAddress.value = venue.address || ''

    if (venue.latitude) mapLat.value = venue.latitude
    if (venue.longitude) mapLng.value = venue.longitude

    // Category & subcategories
    if (venue.category) {
      selectedCategory.value = venue.category.name || ''
      await nextTick()
      if (venue.subcategories && venue.subcategories.length) {
        selectedSubcategories.value = venue.subcategories.map(s => s.name)
      }
    }

    formData.image_path =
      typeof venue.image_path === 'string' && venue.image_path.trim()
        ? venue.image_path.trim()
        : ''
    fieldErrors.value = {}

    // Accessibility
    allowanceOfDogs.value = venue.allowance_of_dogs || ''
    wheelchairAccessible.value = venue.wheelchair_accessible || ''
    accessibleParking.value = venue.accessible_parking || ''
    valetParking.value = venue.valet_parking || ''
    childrensPlayArea.value = venue.childrens_play_area || ''

    // Center map
    if (venue.latitude && venue.longitude && map.value) {
      map.value.flyTo({
        center: [venue.longitude, venue.latitude],
        zoom: 15,
        essential: true
      })
      updateMarker(venue.longitude, venue.latitude)
    }
  } catch (error) {
    console.error('Error loading venue:', error)
    toast.error('Failed to load venue data')
  }
}

// ── Cancel Edit ─────────────────────────────────────────────────
function cancelEdit() {
  resetForm()
  isEditMode.value = false
  editingVenueId.value = null
}

// ── Reset Form ──────────────────────────────────────────────────
function resetForm() {
  formData.venueTitle = ''
  formData.category = ''
  formData.subcategories = []
  formData.image_path = ''
  selectedCategory.value = ''
  selectedSubcategories.value = []
  selectedAddress.value = ''
  searchAddress.value = ''
  fieldErrors.value = {}
  mapLat.value = null
  mapLng.value = null
  allowanceOfDogs.value = ''
  wheelchairAccessible.value = ''
  accessibleParking.value = ''
  valetParking.value = ''
  childrensPlayArea.value = ''
  categoryError.value = false
  subcategoryError.value = false
  subcategoryValidationError.value = false
  isEditMode.value = false
  editingVenueId.value = null
  resetErrors()
}

// ── Handle Submit ───────────────────────────────────────────────
async function handleSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true

  if (!validateForm()) {
    await scrollToFirstError()
    isSubmitting.value = false
    return
  }

  try {
    if (isEditMode.value) {
      await updateVenue()
    } else {
      await createVenue()
    }
  } finally {
    isSubmitting.value = false
  }
}

// Debounce function
function debounce(func, delay) {
  return function (...args) {
    clearTimeout(debounceTimer.value)
    debounceTimer.value = setTimeout(() => func.apply(this, args), delay)
  }
}

// Handle search input with debouncing
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
  mapLat.value = parseFloat(lat)
  mapLng.value = parseFloat(lon)
  if (map.value) {
    map.value.flyTo({
      center: [lon, lat],
      zoom: 15,
      essential: true
    })
    updateMarker(lon, lat)
  }
}

function updateMarker(lng, lat) {
  if (marker.value) { marker.value.remove() }
  const el = document.createElement('div')
  el.style.width = '60px'
  el.style.height = '60px'
  el.style.cursor = 'pointer'
  el.style.backgroundImage = 'url(/marker.png)'
  el.style.backgroundSize = 'contain'
  el.style.backgroundRepeat = 'no-repeat'
  el.style.backgroundPosition = 'center'
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

// Initialize map on component mount
onMounted(async () => {
  fetchCategories()
  fetchGalleryImages()

  // Add click outside listener for dropdown
  document.addEventListener('click', handleClickOutside)

  // Initialize map centered on Amsterdam
  map.value = new maplibregl.Map({
    container: "event-map",
    style: "https://api.maptiler.com/maps/streets-v2/style.json?key=4Rm2OIdojZoTFcWWjJPY",
    center: [4.895168, 52.370216], // Amsterdam coordinates
    zoom: 12
  })

  // Add click handler to map
  map.value.on("click", async (e) => {
    const { lng, lat } = e.lngLat
    mapLat.value = lat
    mapLng.value = lng
    updateMarker(lng, lat)
    await reverseGeocode(lng, lat)
  })

  // Check if editing an existing venue via route query
  const venueId = route.query.edit || route.params.id
  if (venueId) {
    await loadVenue(Number(venueId))
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>