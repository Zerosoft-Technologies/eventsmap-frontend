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
          <EventSidebar :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected" @menu-click="closeMobileSidebar" />
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
        <!-- Talent TITLE SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Talent Title
            </h3>
          </div>

          <input v-model="formData.talentTitle" type="text" placeholder="Enter Talent Title"
            data-field="talentTitle"
            @input="formErrors.talentTitle && clearError('talentTitle')"
            :class="[
              'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all',
              formErrors.talentTitle ? 'tw:border-red-500' : 'tw:border-gray-200'
            ]" />
          <p v-if="formErrors.talentTitle" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ formErrors.talentTitle }}</p>
        </div>

        <!-- Talent IMAGE SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">

          <!-- Header -->
          <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
            <h3 class="tw:text-lg tw:font-semibold tw:text-gray-800">
              Talent Image (Max 1) <span class="tw:text-red-500">*</span>
              <span class="tw:text-xs tw:text-gray-500"> Recommended (1200x800) </span>
            </h3>

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
          <div v-if="imagePreviewUrl" class="tw:relative tw:mt-3 tw:inline-block">
            <img :src="imagePreviewUrl" alt="Preview" class="tw:w-40 tw:h-28 tw:object-cover tw:rounded-lg tw:border tw:border-gray-200" />
            <button type="button" @click="removeMainImage"
              class="tw:absolute tw:-top-2 tw:-right-2 tw:w-6 tw:h-6 tw:bg-red-500 tw:text-white tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-xs tw:shadow hover:tw:bg-red-600 tw:transition">
              &times;
            </button>
          </div>
        </div>

        <!-- GENRE SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Genre <span class="tw:text-red-500">*</span>
            </h3>
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
                    'tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                    categoryError ? 'tw:border-red-500' : 'tw:border-gray-200',
                    (isLoadingCategories || categoriesError) ? 'tw:bg-gray-100 tw:cursor-not-allowed' : ''
                  ]">
                  <option value="">
                    {{ isLoadingCategories ? 'Loading...' : (categoriesError ? 'Error loading categories' :
                    'Select') }}
                  </option>
                  <option v-for="category in categories.filter(c => c.name.toLowerCase() == 'talent')" :key="category.id" :value="category.name">
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

        <!-- Talent LOCATION SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">
          <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
            Talent Location
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </div>

            <!-- Suggestions Dropdown -->
            <div v-if="suggestions.length > 0"
              class="tw:absolute tw-top-full tw:left-0 tw:right-0 tw:mt-1 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-gray-200 tw:z-10 tw:max-h-60 tw:overflow-y-auto">
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
          </div>

        </div>

        <!-- CITY WHERE TALENT IS LIVING SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
            City where talent is living
          </h3>

          <div class="tw:space-y-2">
            <label class="tw:text-sm tw:font-medium tw:text-gray-700">City</label>
            <input v-model="talentCity" type="text" placeholder="Enter city"
              class="tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-base tw:md:text-[16px] tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
          </div>
        </div>

        <!-- OVERVIEW SECTION -->
        <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Overview
            </h3>
          </div>

          <div class="tw:grid tw:grid-cols-3 tw:gap-4">
            
            <div class="tw:space-y-2">
              <label class="tw:text-sm tw:font-medium tw:text-gray-700">Dress Code</label>
              <div class="tw:relative">
                <select v-model="dressCode"
                  class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2 tw:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
                  <option value="">No Dress Code</option>
                  <option value="casual">Dress Code</option>
                </select>
                <ChevronDown
                  class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
              </div>
            </div>

            
            <div class="tw:space-y-2">
              <label class="tw:text-sm tw:font-medium tw:text-gray-700">Age Limit</label>
              <div class="tw:relative">
                <select v-model="ageLimit"
                  class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2 tw:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
                  <option value="">4+</option>
                  <option value="8">8+</option>
                  <option value="12">12+</option>
                  <option value="16">16+</option>
                  <option value="18">18+</option>
                  <option value="21">21+</option>
                  <option value="55">55+</option>
                  <option value="65">65+</option>
                  <option value="different">Different Ages</option>
                </select>
                <ChevronDown
                  class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
              </div>
            </div>

            
            <div class="tw:space-y-2">
              <label class="tw:text-sm tw:font-medium tw:text-gray-700">Entrance Status</label>
              <div class="tw:relative">
                <select v-model="entranceFee"
                  class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2 tw:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
                  <option value="">Free Entrance</option>
                  <option value="paid">Paid Entrance</option>
                  <option value="donation">Sold Out</option>
                  <option value="cancelled">Talent is Cancelled</option>
                </select>
                <ChevronDown
                  class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
              </div>
            </div>
          </div>
        </div> -->

        <!-- INVITE SECTION -->
        <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Invite
            </h3>
          </div>

          <p class="tw:text-sm tw:text-gray-600">
            Make your event stand out even more. These sections help attendees find information and answer their
            questions.
          </p>

          <div class="tw:space-y-3">
            <InviteSection role="organiser" :has-border="true" />
            <InviteSection role="venue"     :has-border="false" />
            <InviteSection role="talent"    :has-border="false" />
          </div>
        </div> -->

        <!-- SAVE Talent BUTTON -->
        <div class="tw:w-full tw:pt-4">
          <div class="tw:flex tw:flex-col tw:md:flex-row tw:w-full tw:items-stretch tw:md:items-center tw:justify-between tw:gap-3 tw:md:gap-0">
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
                {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Talent' : 'Save Talent') }}
              </button>
            </div>
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
  ChevronDown,
  ChevronLeft,
  Upload,
  Plus,
  MapPin,
  User,
  SkipBackIcon,
} from "lucide-vue-next"

import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from "vue"
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
const mobileSidebarOpen = ref(false)
function toggleMobileSidebar() { mobileSidebarOpen.value = !mobileSidebarOpen.value }
function closeMobileSidebar() { mobileSidebarOpen.value = false }

const activeTab = ref("home")
const isSubmitting = ref(false)
const isEditMode = ref(false)
const editingTalentId = ref(null)

// ── Image handling ──────────────────────────────────────────────
const fileName = ref("")
const mainImage = ref(null)          // File object or UUID string
const imagePreviewUrl = ref(null)    // blob URL or server URL for preview

// ── Form Validation (generic composable) ─────────────────────
const formData = reactive({
  talentTitle: '',
  category: '',
  subcategories: [],
})

const talentSchema = {
  talentTitle: { type: 'text', required: true, min: 3, max: 100, label: 'Talent Title' },
  category: { type: 'select', required: true, label: 'Category' },
  subcategories: { type: 'multiselect', required: true, min: 1, max: 5, label: 'Subcategories' },
}

const { errors: formErrors, validate, clearError, resetErrors, scrollToFirstError } = useFormValidation(talentSchema, formData)

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

// Handle category change with validation clearing
function handleCategoryChangeWithValidation() {
  selectedSubcategories.value = []
  subcategoryError.value = false
  subcategoryValidationError.value = false
  categoryError.value = false
  showSubcategoryDropdown.value = false
}

// Handle category change
function handleCategoryChange() {
  handleCategoryChangeWithValidation()
}

// Toggle subcategory dropdown
function toggleSubcategoryDropdown() {
  if (!selectedCategory.value || categoriesError.value) return
  showSubcategoryDropdown.value = !showSubcategoryDropdown.value
}

// Toggle individual subcategory selection
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

// Click outside handler to close dropdown
function handleClickOutside(event) {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    showSubcategoryDropdown.value = false
  }
}

// Handle subcategory change with max 5 validation
function handleSubcategoryChange() {
  subcategoryError.value = false

  if (selectedSubcategories.value.length > 5) {
    selectedSubcategories.value = selectedSubcategories.value.slice(0, 5)
    subcategoryValidationError.value = true
    setTimeout(() => {
      subcategoryValidationError.value = false
    }, 3000)
  } else {
    subcategoryValidationError.value = false
  }
}

// Remove subcategory from selection
function removeSubcategory(subcategoryToRemove) {
  const index = selectedSubcategories.value.indexOf(subcategoryToRemove)
  if (index > -1) {
    selectedSubcategories.value.splice(index, 1)
    subcategoryValidationError.value = false
  }
}

// Validate genre fields
function validateGenre() {
  categoryError.value = !selectedCategory.value
  subcategoryError.value = selectedSubcategories.value.length === 0

  return selectedCategory.value && selectedSubcategories.value.length > 0
}

const talentCity = ref("")

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

// Menu items specific to CreateTalentFree
const menuItems = [
  { id: "home", icon: Home, label: "Home", route: "/create-talents-free" },
  { id: "details", icon: FileText, label: "Details", route: "/create-talents-free" },
  { id: "analytics", icon: BarChart3, route: "/create-talents-free/report", label: "Analytics" },
  { id: "settings", icon: Settings, route: "/create-talents-free/settings", label: "Settings" },
]

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

function handleEventSelected(eventId) {
  closeMobileSidebar()
  console.log('Event selected for editing:', eventId)
}

// ── Image handling ──────────────────────────────────────────────
function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    fileName.value = file.name
    mainImage.value = file
    imagePreviewUrl.value = URL.createObjectURL(file)
  }
}

function removeMainImage() {
  mainImage.value = null
  imagePreviewUrl.value = null
  fileName.value = ''
}

// ── Sync category/subcategory selections into formData for validation ──
function syncFormData() {
  formData.category = selectedCategory.value
  formData.subcategories = selectedSubcategories.value
}

// ── Build FormData for API ──────────────────────────────────────
function buildFormData() {
  const fd = new FormData()

  if (isEditMode.value) {
    fd.append('_method', 'PUT')
  }

  fd.append('title', formData.talentTitle)
  fd.append('event_type', 'talent')

  // Category ID
  const selectedCategoryData = categories.value.find(cat => cat.name === selectedCategory.value)
  if (selectedCategoryData) {
    fd.append('category_id', selectedCategoryData.id)
  }

  // Subcategory IDs
  if (selectedCategoryData) {
    selectedSubcategories.value.forEach(subName => {
      const subData = selectedCategoryData.subcategories.find(s => s.name === subName)
      if (subData) {
        fd.append('subcategory_ids[]', subData.id)
      }
    })
  }

  // Location
  fd.append('address', selectedAddress.value || '')
  if (mapLat.value !== null) fd.append('latitude', mapLat.value)
  if (mapLng.value !== null) fd.append('longitude', mapLng.value)

  // City
  fd.append('city', talentCity.value || '')

  // Image — File object for new upload, UUID string for existing
  if (mainImage.value instanceof File) {
    fd.append('image_path', mainImage.value)
  } else if (typeof mainImage.value === 'string' && mainImage.value) {
    fd.append('image_path', mainImage.value)
  }

  return fd
}

// ── Create Talent ───────────────────────────────────────────────
async function createTalent() {
  try {
    const fd = buildFormData()
    const response = await eventService.createTalent(fd)

    if (response.success) {
      toast.success('Talent created successfully!')
      resetForm()
    } else {
      toast.error(response.message || 'Failed to create talent')
    }
  } catch (error) {
    console.error('Error creating talent:', error)
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      Object.keys(errors).forEach(key => {
        toast.error(errors[key][0])
      })
    } else {
      toast.error('An error occurred while creating the talent')
    }
  }
}

// ── Update Talent ───────────────────────────────────────────────
async function updateTalent() {
  try {
    const fd = buildFormData()
    const response = await eventService.updateTalent(editingTalentId.value, fd)

    if (response.success) {
      toast.success('Talent updated successfully!')
      resetForm()
    } else {
      toast.error(response.message || 'Failed to update talent')
    }
  } catch (error) {
    console.error('Error updating talent:', error)
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      Object.keys(errors).forEach(key => {
        toast.error(errors[key][0])
      })
    } else {
      toast.error('An error occurred while updating the talent')
    }
  }
}

// ── Load Talent for editing ─────────────────────────────────────
async function loadTalent(id) {
  try {
    const response = await eventService.getTalentById(id)
    const talent = response.data || response

    isEditMode.value = true
    editingTalentId.value = id

    formData.talentTitle = talent.title || ''
    selectedAddress.value = talent.address || ''
    talentCity.value = talent.city || ''

    if (talent.latitude) mapLat.value = talent.latitude
    if (talent.longitude) mapLng.value = talent.longitude

    // Category & subcategories
    if (talent.category) {
      selectedCategory.value = talent.category.name || ''
      await nextTick()
      if (talent.subcategories && talent.subcategories.length) {
        selectedSubcategories.value = talent.subcategories.map(s => s.name)
      }
    }

    // Image
    mainImage.value = null
    imagePreviewUrl.value = null
    fileName.value = ''
    if (talent.image_path) {
      mainImage.value = talent.image_path
      imagePreviewUrl.value = talent.image_url || talent.image_path
      fileName.value = 'Current image'
    }

    // Center map if coordinates exist
    if (talent.latitude && talent.longitude && map.value) {
      map.value.flyTo({
        center: [talent.longitude, talent.latitude],
        zoom: 15,
        essential: true
      })
      updateMarker(talent.longitude, talent.latitude)
    }
  } catch (error) {
    console.error('Error loading talent:', error)
    toast.error('Failed to load talent data')
  }
}

// ── Cancel Edit ─────────────────────────────────────────────────
function cancelEdit() {
  resetForm()
  isEditMode.value = false
  editingTalentId.value = null
}

// ── Reset Form ──────────────────────────────────────────────────
function resetForm() {
  formData.talentTitle = ''
  formData.category = ''
  formData.subcategories = []
  selectedCategory.value = ''
  selectedSubcategories.value = []
  selectedAddress.value = ''
  searchAddress.value = ''
  talentCity.value = ''
  mainImage.value = null
  imagePreviewUrl.value = null
  fileName.value = ''
  mapLat.value = null
  mapLng.value = null
  categoryError.value = false
  subcategoryError.value = false
  subcategoryValidationError.value = false
  isEditMode.value = false
  editingTalentId.value = null
  resetErrors()
}

// ── Handle Submit ───────────────────────────────────────────────
async function handleSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true

  syncFormData()

  const isValid = validate()
  const genreValid = validateGenre()

  if (!isValid || !genreValid) {
    await scrollToFirstError()
    isSubmitting.value = false
    return
  }

  try {
    if (isEditMode.value) {
      await updateTalent()
    } else {
      await createTalent()
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
      {
        headers: {
          "User-Agent": "EventMap App"
        }
      }
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

// Select a suggestion from dropdown
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

// Update or add marker
function updateMarker(lng, lat) {
    if (marker.value) {
        marker.value.remove()
    }

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

// Reverse geocode function
async function reverseGeocode(lng, lat) {
  isLoading.value = true

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "EventMap App"
        }
      }
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

function handleBack() {
  closeMobileSidebar()
  router.push('/')
}

// Initialize map on component mount
onMounted(async () => {
  fetchCategories()

  document.addEventListener('click', handleClickOutside)

  map.value = new maplibregl.Map({
    container: "event-map",
    style: "https://api.maptiler.com/maps/streets-v2/style.json?key=4Rm2OIdojZoTFcWWjJPY",
    center: [4.895168, 52.370216],
    zoom: 12
  })

  map.value.on("click", async (e) => {
    const { lng, lat } = e.lngLat
    mapLat.value = lat
    mapLng.value = lng
    updateMarker(lng, lat)
    await reverseGeocode(lng, lat)
  })

  // Check if editing an existing talent via route query
  const talentId = route.query.edit || route.params.id
  if (talentId) {
    await loadTalent(Number(talentId))
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>