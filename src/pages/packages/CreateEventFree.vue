<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-10 tw:px-6">
    <div class="tw:w-full tw:max-w-7xl tw:flex tw:gap-6">

      <!-- ================= LEFT CARD (Sidebar Component) ================= -->
      <EventSidebar :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected" />

      <!-- ================= RIGHT CARD ================= -->
      <div class="tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-3xl tw:shadow-sm tw:p-6 tw:space-y-6">
        <!-- EVENT TITLE SECTION -->
        <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Event Title <span class="tw:text-red-500">*</span>
            </h3>
            <!-- <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button> -->
          </div>

          <input v-model="eventTitle" type="text" placeholder="Enter Event Title" :class="[
            'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all',
            fieldErrors.title ? 'tw:border-red-500' : 'tw:border-gray-200'
          ]" @input="clearFieldError('eventTitle')" />
          <p v-if="errors.eventTitle" class="tw:text-red-500 tw:text-sm tw:mt-1">Event title is required</p>
          <p v-if="fieldErrors.title" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ fieldErrors.title[0] }}</p>

          <!-- Slug Preview -->
          <div v-if="eventTitle.trim()" class="tw:mt-2 tw:flex tw:items-center tw:gap-2">
            <span class="tw:text-xs tw:text-gray-500">URL Preview:</span>
            <span class="tw:text-xs tw:font-mono tw:bg-gray-100 tw:px-2 tw:py-1 tw:rounded tw:text-blue-600">
              /event/{{ slugPreview }}
            </span>
          </div>
        </div>

        <!-- EVENT IMAGE SECTION -->
        <div class="tw:bg-white tw:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-6">

          <!-- Header -->
          <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
            <h3 class="tw:text-lg tw:font-semibold tw:text-gray-800">
              Event Image (Max 1) <span class="tw:text-red-500">*</span>
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
              {{ fileName || 'No File Chosen' }}
            </span>

            <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
          </label>

          <!-- Image Preview -->
          <div v-if="imagePreview" class="tw:relative tw:mt-4 tw:w-full">
            <img :src="imagePreview" alt="Event image preview"
              class="tw:w-full tw:h-[50vh] tw:rounded-lg tw:border tw:border-gray-200" />
            <!-- Remove button -->
            <button @click="removeImage" type="button"
              class="tw:absolute tw:top-2 tw:right-2 tw:w-6 tw:h-6 tw:bg-red-500 tw:text-white tw:rounded-full tw:flex tw:items-center tw:justify-center hover:tw:bg-red-600 tw:transition-colors">
              <svg class="tw:w-4 tw:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>

          <p v-if="errors.eventImage" class="tw:text-red-500 tw:text-sm tw:mt-1">Event image is required</p>
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
                    'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                    categoryError ? 'tw:border-red-500' : 'tw:border-gray-200',
                    (isLoadingCategories || categoriesError) ? 'tw:bg-gray-100 tw:cursor-not-allowed' : ''
                  ]">
                  <option value="">
                    {{ isLoadingCategories ? 'Loading...' : (categoriesError ? 'Error loading categories' :
                    'Select Category') }}
                  </option>
                  <option v-for="category in categories.filter(c => c.name.toLowerCase() != 'sports')" :key="category.id" :value="category.name">
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

            <ChevronDown
              class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-gray-400 tw:pointer-events-none" />
          </div>
        </div> -->

        <!-- EVENT DATE & TIME SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:border tw:border-gray-200 tw:p-6">

          <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
            Event Date & Time <span class="tw:text-red-500">*</span>
          </h3>

          <!-- Horizontal Layout -->
          <div class="tw:grid tw:grid-cols-1 md:tw:grid-cols-3 tw:gap-6">

            <!-- EVENT DATE -->
            <div>
              <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-2">
                Event Date <span class="tw:text-red-500">*</span>
              </label>

              <div class="tw:relative">
                <input ref="dateInput" v-model="eventDate" placeholder="MM/DD/YYYY" :class="[
                  'tw:w-full tw:bg-white tw:border tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-gray-700 tw:placeholder-[#666666] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500',
                  fieldErrors.event_date ? 'tw:border-red-500' : 'tw:border-gray-200'
                ]" @input="clearFieldError('eventDate')" />

                <!-- Custom Calendar Icon -->
                <Calendar
                  class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
              </div>
              <p v-if="errors.eventDate" class="tw:text-red-500 tw:text-sm tw:mt-1">Event date is required</p>
              <p v-if="fieldErrors.event_date" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ fieldErrors.event_date[0]
                }}</p>
              <p v-if="pastDateError" class="tw:text-red-500 tw:text-sm tw:mt-1">Cannot select a past date</p>
            </div>

            <!-- START & END TIME -->
            <div class="tw:flex tw:gap-4" style="flex: 1;">

              <!-- START TIME -->
              <div class="tw:flex-1">
                <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-2">
                  Start Time <span class="tw:text-red-500">*</span>
                </label>
                <div
                  class="tw:flex tw:items-center tw:border tw:rounded-lg tw:bg-white tw:overflow-hidden tw:px-3 tw:py-2.5"
                  :class="hasStartError ? 'tw:border-red-500' : 'tw:border-gray-200'">
                  <input type="text" inputmode="numeric" maxlength="2" v-model="startHH" placeholder="12"
                    @input="onTimeInput('startHH', $event)"
                    class="tw:w-8 tw:text-center tw:text-gray-700 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent" />
                  <span class="tw:text-gray-400 tw:font-bold tw:mx-1">:</span>
                  <input type="text" inputmode="numeric" maxlength="2" v-model="startMM" placeholder="00"
                    @input="onTimeInput('startMM', $event)"
                    class="tw:w-8 tw:text-center tw:text-gray-700 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent" />
                  <Clock class="tw:ml-auto tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                </div>
                <p v-if="hasStartError" class="tw:text-red-500 tw:text-sm tw:mt-1">Start time is required</p>
              </div>

              <!-- END TIME -->
              <div class="tw:flex-1">
                <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-2">
                  End Time <span class="tw:text-red-500">*</span>
                </label>
                <div
                  class="tw:flex tw:items-center tw:border tw:rounded-lg tw:bg-white tw:overflow-hidden tw:px-3 tw:py-2.5"
                  :class="(hasEndError || timeRangeError) ? 'tw:border-red-500' : 'tw:border-gray-200'">
                  <input type="text" inputmode="numeric" maxlength="2" v-model="endHH" placeholder="13"
                    @input="onTimeInput('endHH', $event)"
                    class="tw:w-8 tw:text-center tw:text-gray-700 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent" />
                  <span class="tw:text-gray-400 tw:font-bold tw:mx-1">:</span>
                  <input type="text" inputmode="numeric" maxlength="2" v-model="endMM" placeholder="00"
                    @input="onTimeInput('endMM', $event)"
                    class="tw:w-8 tw:text-center tw:text-gray-700 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent" />
                  <Clock class="tw:ml-auto tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                </div>
                <p v-if="hasEndError" class="tw:text-red-500 tw:text-sm tw:mt-1">End time is required</p>
                <p v-if="timeRangeError" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ timeRangeError }}</p>
              </div>

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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
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
            <p v-if="errors.address" class="tw:text-red-500 tw:text-sm tw:mt-1">Address is required</p>
          </div>
        </div>

        <!-- OVERVIEW SECTION -->
        <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Overview
            </h3>
            <!-- <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button> -->
          </div>

          <div class="tw:grid tw:grid-cols-3 tw:gap-4">
            <!-- Dress Code -->
            <div class="tw:space-y-2">
              <label class="tw:text-sm tw:font-medium tw:text-gray-700">Dress Code <span
                  class="tw:text-red-500">*</span></label>
              <div class="tw:relative">
                <select v-model="dressCode" @change="clearFieldError('dressCode')"
                  class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2 tw:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
                  <option value="">No Dress Code</option>
                  <option value="casual">Dress Code</option>
                </select>
                <ChevronDown
                  class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
              </div>
              <p v-if="errors.dressCode" class="tw:text-red-500 tw:text-sm tw:mt-1">Dress code is required</p>
            </div>

            <!-- Age Limit -->
            <div class="tw:space-y-2">
              <label class="tw:text-sm tw:font-medium tw:text-gray-700">Age Limit <span
                  class="tw:text-red-500">*</span></label>
              <div class="tw:relative">
                <select v-model="ageLimit" @change="clearFieldError('ageLimit')"
                  class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2 tw:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
                  <option value="">Select Age</option>
                  <option value="all_ages">All Ages</option>
                  <option value="4+">4+</option>
                  <option value="8+">8+</option>
                  <option value="12+">12+</option>
                  <option value="16+">16+</option>
                  <option value="18+">18+</option>
                  <option value="21+">21+</option>
                  <option value="55+">55+</option>
                  <option value="65+">65+</option>
                </select>
                <ChevronDown
                  class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
              </div>
              <p v-if="errors.ageLimit" class="tw:text-red-500 tw:text-sm tw:mt-1">Age limit is required</p>
            </div>

            <!-- Entrance Fee -->
            <div class="tw:space-y-2">
              <label class="tw:text-sm tw:font-medium tw:text-gray-700">Entrance Status <span
                  class="tw:text-red-500">*</span></label>
              <div class="tw:relative">
                <select v-model="entranceStatus" @change="clearFieldError('entranceStatus')"
                  class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2 tw:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
                  <option value="">Select Entrance Status</option>
                  <option value="free">Free Entrance</option>
                  <option value="paid">Paid Entrance</option>
                  <option value="donation">Sold Out</option>
                  <option value="cancelled">Event is Cancelled</option>
                </select>
                <ChevronDown
                  class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
              </div>
              <p v-if="errors.entranceStatus" class="tw:text-red-500 tw:text-sm tw:mt-1">Entrance fee is required</p>
            </div>
          </div>
        </div>

        <!-- INVITE SECTION -->
        <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Invite
            </h3>
            <!-- <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button> -->
          </div>

          <p class="tw:text-sm tw:text-gray-600">
            Make your event stand out even more. These sections help attendees find information and answer their
            questions.
          </p>

          <div class="tw:space-y-3">
            <InviteSection role="talent" :has-border="true" />
            <InviteSection role="organiser" :has-border="true" />
            <InviteSection role="venue" :has-border="false" />
          </div>
        </div>

        <!-- SAVE EVENT BUTTON -->
        <div class="tw:w-full tw:pt-4">

          <div class="tw:flex tw:w-full tw:items-center tw:justify-between">

            <button @click="saveEvent" class="tw:px-6 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md 
             tw:border tw:border-orange-500 tw:text-[#0061FF]
             tw:bg-white hover:tw:bg-orange-50 tw:transition-all">
              Buy Tickets
            </button>

            <button @click="handleSubmit" :disabled="isSubmitting" class="tw:px-6 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md 
             tw:border tw:border-blue-500 tw:text-blue-600
             tw:bg-white hover:tw:bg-blue-50 tw:transition-all
             disabled:tw:opacity-50 disabled:tw:cursor-not-allowed">
              {{ isSubmitting ? 'Creating...' : 'Create Event' }}
            </button>

          </div>

          <span class="tw:text-red-500 tw:text-sm tw:mt-2 tw:block">
            Soon you can show this button in your event description or event info window when appropriate.
            This is still under consideration.
          </span>

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
  ChevronDown,
  ChevronLeft,
  Upload,
  Plus,
  MapPin,
  User,
  SkipBackIcon,
  Clock,
  Loader2,
} from "lucide-vue-next"

import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import InviteSection from "@/components/invite/InviteSection.vue"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import eventService from "@/services/eventService"
import { useToast } from "@/composables/useToast"
import { useTimeRangeValidation } from "@/composables/useTimeRangeValidation"

import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.css"

const router = useRouter()
const route = useRoute()
const toast = useToast()

const activeTab = ref("home")
const eventTitle = ref("")
const selectedVenue = ref("")

// Server-side validation errors from API
const fieldErrors = ref({})

const pastDateError = ref(false)

// Explicit lat/lng state (not from marker)
const latitude = ref(null)
const longitude = ref(null)

// Form validation state
const errors = ref({
  eventTitle: false,
  eventImage: false,
  category: false,
  subcategories: false,
  eventDate: false,
  address: false,
  dressCode: false,
  ageLimit: false,
  entranceStatus: false
})

// Form submission state
const isSubmitting = ref(false)
const selectedImageFile = ref(null)
const imagePreview = ref(null)

// Slug preview computed property
const slugPreview = computed(() => {
  if (!eventTitle.value.trim()) return ''
  return eventTitle.value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
})

// Form validation computed property
const isFormValid = computed(() => {
  return (
    eventTitle.value.trim() !== '' &&
    selectedImageFile.value !== null &&
    selectedCategory.value !== '' &&
    selectedSubcategories.value.length > 0 &&
    eventDate.value !== '' &&
    !hasStartError.value &&
    !hasEndError.value &&
    selectedAddress.value !== '' &&
    !pastDateError.value
  )
})

// Genre state
const selectedCategory = ref("")
const selectedSubcategories = ref([])  // Multi-select array for subcategories
const categoryError = ref(false)
const subcategoryError = ref(false)
const subcategoryValidationError = ref(false)  // For max 5 validation
const categories = ref([])
const isLoadingCategories = ref(false)
const categoriesError = ref(null)
const showSubcategoryDropdown = ref(false)  // For dropdown toggle

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
  selectedSubcategories.value = []  // Reset array when category changes
  subcategoryError.value = false
  subcategoryValidationError.value = false  // Clear validation error
  categoryError.value = false
  showSubcategoryDropdown.value = false  // Close dropdown

  // Clear field errors
  clearFieldError('category')
  clearFieldError('subcategories')
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
    return // Prevent selection if already at max 5
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

  // Clear field errors
  clearFieldError('subcategories')

  // Maximum 5 subcategories selection logic
  // Prevent selection if trying to add more than 5 items
  if (selectedSubcategories.value.length > 5) {
    // Remove the last added item to maintain the limit
    const lastItem = selectedSubcategories.value[selectedSubcategories.value.length - 1]
    selectedSubcategories.value = selectedSubcategories.value.slice(0, 5)

    // Show validation error
    subcategoryValidationError.value = true

    // Auto-hide validation message after 3 seconds
    setTimeout(() => {
      subcategoryValidationError.value = false
    }, 3000)
  } else {
    // Clear validation error when within limit
    subcategoryValidationError.value = false
  }
}

// Remove subcategory from selection
function removeSubcategory(subcategoryToRemove) {
  const index = selectedSubcategories.value.indexOf(subcategoryToRemove)
  if (index > -1) {
    selectedSubcategories.value.splice(index, 1)
    // Clear validation error when removing items (going below limit)
    subcategoryValidationError.value = false
  }
}

// Validate genre fields
function validateGenre() {
  categoryError.value = !selectedCategory.value
  subcategoryError.value = selectedSubcategories.value.length === 0

  return selectedCategory.value && selectedSubcategories.value.length > 0
}

const dressCode = ref("")
const ageLimit = ref("")
const entranceFee = ref("")
const entranceStatus = ref("")

// Event Date and Time
const eventDate = ref("")
// const startTime = ref("")
// const endTime = ref("")
// const dateInput = ref(null)
const startTimeInput = ref(null)
const endTimeInput = ref(null)

const dateInput = ref(null)
// ── Time split refs ──────────────────────────────────────────────────
const startHH = ref("")
const startMM = ref("")
const endHH = ref("")
const endMM = ref("")
const timeRangeError = ref("")
const hasStartError = ref(false)
const hasEndError = ref(false)

// Computed HH:MM strings for API
const startTime = computed(() => {
  if (startHH.value === "" || startMM.value === "") return ""
  return `${String(startHH.value).padStart(2, "0")}:${String(startMM.value).padStart(2, "0")}`
})

const endTime = computed(() => {
  if (endHH.value === "" || endMM.value === "") return ""
  return `${String(endHH.value).padStart(2, "0")}:${String(endMM.value).padStart(2, "0")}`
})

// Enforce max 2 digits + valid range, then validate end > start
function onTimeInput(field, event) {
  // Strip non-digits and limit to 2 characters
  let raw = event.target.value.replace(/\D/g, "").slice(0, 2)
  event.target.value = raw

  let val = raw === "" ? "" : parseInt(raw)

  if (val !== "") {
    if (field === "startHH" || field === "endHH") {
      if (val > 23) val = 23
      if (val < 0) val = 0
    } else {
      if (val > 59) val = 59
      if (val < 0) val = 0
    }
  }

  if (field === "startHH") { startHH.value = val; hasStartError.value = false }
  if (field === "startMM") { startMM.value = val; hasStartError.value = false }
  if (field === "endHH") { endHH.value = val; hasEndError.value = false }
  if (field === "endMM") { endMM.value = val; hasEndError.value = false }

  validateEndAfterStart()
}

function validateEndAfterStart() {
  timeRangeError.value = ""

  const sHH = parseInt(startHH.value)
  const sMM = parseInt(startMM.value)
  const eHH = parseInt(endHH.value)
  const eMM = parseInt(endMM.value)

  // Only validate when all four fields are filled
  if (
    startHH.value === "" || startMM.value === "" ||
    endHH.value === "" || endMM.value === ""
  ) return

  const startTotal = sHH * 60 + sMM
  const endTotal = eHH * 60 + eMM

  if (endTotal <= startTotal) {
    timeRangeError.value = "End time must be later than start time"
  }
}

// const {
//   startError,
//   endError,
//   hasStartError,
//   hasEndError,
//   validateTimeRange,
//   clearStartError,
//   clearEndError,
//   applyServerErrors: applyTimeServerErrors,
// } = useTimeRangeValidation(startTime, endTime)

watch(eventDate, () => {
  validatePastDate()
})

// Validate that selected date is not in the past
function validatePastDate() {
  if (!eventDate.value) {
    pastDateError.value = false
    return
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const selected = new Date(eventDate.value)
  pastDateError.value = selected < today
}

// Event Location refs
const searchAddress = ref("")
const selectedAddress = ref("")
const map = ref(null)
const marker = ref(null)
const suggestions = ref([])
const isLoading = ref(false)
const debounceTimer = ref(null)

const selectedOrganiser = ref("")
const selectedTalent = ref("")

// Event data
// const eventTitle = ref("Event Title")
// const eventDate = ref("05.03.2026, 18:30 CET")
const eventStatus = ref("Draft")
const fileName = ref("")


// Menu items specific to CreateEventFree
const menuItems = [
  { id: "home", icon: Home, label: "Home", route: "/create-event-free" },
  { id: "details", icon: FileText, label: "Details", route: "/create-event-free" },
  { id: "analytics", icon: BarChart3, route: "/create-event-free/report", label: "Analytics" },
  { id: "settings", icon: Settings, route: "/create-event-free/settings", label: "Settings" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
]
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

function saveEvent() {
  console.log("Saving event...");
  alert("Event saved successfully!");
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

  // Update search input and clear suggestions
  searchAddress.value = display_name
  suggestions.value = []

  // Update selected address
  selectedAddress.value = display_name

  // Store lat/lng explicitly in state
  latitude.value = parseFloat(lat)
  longitude.value = parseFloat(lon)

  // Center map and add marker
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
  // Remove existing marker
  if (marker.value) {
    marker.value.remove()
  }

  // Add new marker with custom icon
  const customIcon = document.createElement('div');
  customIcon.style.backgroundImage = 'url(/marker.png)';
  customIcon.style.width = '60px';
  customIcon.style.height = '60px';
  customIcon.style.backgroundSize = 'contain';
  customIcon.style.backgroundRepeat = 'no-repeat';
  customIcon.style.backgroundPosition = 'center bottom';
  customIcon.style.cursor = 'pointer';

  marker.value = new maplibregl.Marker({
    element: customIcon,
    anchor: 'bottom'
  })
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

// Initialize map on component mount
onMounted(() => {
  // Fetch categories from API
  fetchCategories()

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

    // Store lat/lng explicitly in state
    latitude.value = lat
    longitude.value = lng

    // Update marker location
    updateMarker(lng, lat)

    // Reverse geocode to get address
    await reverseGeocode(lng, lat)
  })

  /* ------------------ DATE PICKER (prevents past dates) ------------------ */
  flatpickr(dateInput.value, {
    dateFormat: "Y-m-d",
    minDate: "today",
    onChange: (selectedDates, dateStr) => {
      eventDate.value = dateStr
    }
  })
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    selectedImageFile.value = file
    fileName.value = file.name
    errors.value.eventImage = false

    // Create image preview using URL.createObjectURL()
    imagePreview.value = URL.createObjectURL(file)
  } else {
    selectedImageFile.value = null
    fileName.value = 'No File Chosen'
    imagePreview.value = null
  }
}

function removeImage() {
  selectedImageFile.value = null
  fileName.value = 'No File Chosen'
  imagePreview.value = null
  errors.value.eventImage = true

  // Clear the file input
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) {
    fileInput.value = ''
  }
}

// Clear individual field error
function clearFieldError(fieldName) {
  if (errors.value.hasOwnProperty(fieldName)) {
    errors.value[fieldName] = false
  }

  // Special handling for category/subcategory
  if (fieldName === 'category') {
    categoryError.value = false
  }
  if (fieldName === 'subcategories') {
    subcategoryError.value = false
  }
}

// Scroll to first invalid field
async function scrollToFirstError() {
  await nextTick()

  // Find first field with error
  const errorFields = ['eventTitle', 'eventImage', 'category', 'subcategories', 'eventDate', 'address', 'dressCode', 'ageLimit', 'entranceStatus']
  const firstErrorField = errorFields.find(field =>
    errors.value[field] ||
    (field === 'category' && categoryError.value) ||
    (field === 'subcategories' && subcategoryError.value)
  )

  if (firstErrorField) {
    let element

    // Map field names to DOM elements
    switch (firstErrorField) {
      case 'eventTitle':
        element = document.querySelector('input[placeholder="Enter Event Title"]')
        break
      case 'eventImage':
        element = document.querySelector('input[type="file"]')
        break
      case 'category':
        element = document.querySelector('select')
        break
      case 'subcategories':
        element = document.querySelector('.subcategory-dropdown-container')
        break
      case 'eventDate':
        element = document.querySelector('input[placeholder="MM/DD/YYYY"]')
        break
      case 'address':
        element = document.querySelector('input[readonly]')
        break
      case 'dressCode':
        element = document.querySelectorAll('select')[1] // Second select
        break
      case 'ageLimit':
        element = document.querySelectorAll('select')[2] // Third select
        break
      case 'entranceStatus':
        element = document.querySelectorAll('select')[3] // Fourth select
        break
    }

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })

      // Focus the element if it's an input or select
      if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
        element.focus()
      }
    }
  }
}

// Form validation functions
function validateForm() {
  // Reset all errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key] = false
  })
  categoryError.value = false
  subcategoryError.value = false
  fieldErrors.value = {}

  // Validate each field
  errors.value.eventTitle = !eventTitle.value.trim()
  errors.value.eventImage = !selectedImageFile.value
  errors.value.category = !selectedCategory.value
  errors.value.subcategories = selectedSubcategories.value.length === 0
  errors.value.eventDate = !eventDate.value
  errors.value.address = !selectedAddress.value

  // Set category/subcategory specific errors
  categoryError.value = !selectedCategory.value
  subcategoryError.value = selectedSubcategories.value.length === 0

  // ✅ Replace with:
  if (!startTime.value) hasStartError.value = true
  if (!endTime.value) hasEndError.value = true
  validateEndAfterStart()
  const timeValid = startTime.value !== "" && endTime.value !== "" && !timeRangeError.value

  const hasOtherErrors = Object.values(errors.value).some(error => error) ||
    categoryError.value ||
    subcategoryError.value ||
    pastDateError.value

  return !hasOtherErrors && timeValid
}

// Submit handler function
async function handleSubmit() {
  console.log('🚀 handleSubmit() called')

  if (isSubmitting.value) {
    console.log('⚠️ Already submitting, returning')
    return
  }

  // Always run validation first
  const isValid = validateForm()

  if (!isValid) {
    console.log('❌ Validation failed, scrolling to first error')
    await scrollToFirstError()
    return
  }

  console.log('✅ Validation passed, proceeding with submission')

  // Call the original createEvent function
  await createEvent()
}

// Create Event function using eventService
async function createEvent() {
  if (isSubmitting.value) return

  // Validate form
  if (!validateForm()) {
    return
  }

  try {
    isSubmitting.value = true
    fieldErrors.value = {}

    // Find category and subcategory IDs
    const selectedCategoryData = categories.value.find(cat => cat.name === selectedCategory.value)
    const categoryId = selectedCategoryData ? selectedCategoryData.id : null

    const selectedSubcategoryData = selectedCategoryData ?
      selectedCategoryData.subcategories.filter(sub => selectedSubcategories.value.includes(sub.name)) : []
    const subcategoryIds = selectedSubcategoryData.map(sub => sub.id)

    // Create FormData for image upload
    const formData = new FormData()

    // Add form fields
    formData.append('title', eventTitle.value)
    formData.append('event_type', 'free')
    formData.append('category_id', categoryId)
    subcategoryIds.forEach(id => formData.append('subcategory_ids[]', id))
    formData.append('event_date', eventDate.value)
    formData.append('start_time', startTime.value)
    formData.append('end_time', endTime.value)
    formData.append('address', selectedAddress.value)
    formData.append('latitude', latitude.value)
    formData.append('longitude', longitude.value)
    formData.append('dress_code', dressCode.value)
    formData.append('age_limit', ageLimit.value)
    formData.append('entrance_fee', entranceFee.value)
    formData.append('entrance_status', entranceStatus.value)

    // Add image file if exists
    if (selectedImageFile.value) {
      formData.append('image', selectedImageFile.value)
    }

    // Submit to API v2 using eventService
    const response = await eventService.createEvent(formData)

    if (response.success) {
      // Show success toast
      toast.success('Event created successfully!')

      // Redirect to event page using slug
      const slug = response.data?.slug
      if (slug) {
        router.push(`/event/${slug}`)
      } else {
        router.push('/events')
      }
    } else {
      // Handle API validation errors
      if (response.errors) {
        fieldErrors.value = response.errors
        applyTimeServerErrors(fieldErrors.value)
        toast.error(response.message || 'Please correct the errors in the form.')
      } else {
        toast.error(response.message || 'Failed to create event. Please try again.')
      }
    }

  } catch (error) {
    console.error('Error creating event:', error)

    // Handle API validation errors from Laravel
    if (error.response?.data?.errors) {
      fieldErrors.value = error.response.data.errors
      applyTimeServerErrors(fieldErrors.value)
      toast.error(error.response.data.message || 'Please correct the errors in the form.')
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else {
      toast.error('An error occurred while creating the event. Please try again.')
    }
  } finally {
    isSubmitting.value = false
  }
}

function handleBack() {
  router.push('/') // Navigate to events list
}

async function handleEventSelected(eventId) {
  try {
    const response = await eventService.getEventBySlug(String(eventId))
    if (response.success && response.data) {
      const event = response.data
      // Fill form with event data
      eventTitle.value = event.title || ''
    }
  } catch (error) {
    console.error('Failed to load event for editing:', error)
  }
}
</script>