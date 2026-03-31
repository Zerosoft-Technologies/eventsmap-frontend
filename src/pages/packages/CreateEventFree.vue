<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6 tw:overflow-x-hidden">
    <div class="tw:w-full tw:max-w-7xl tw:flex tw:flex-col tw:md:flex-row tw:gap-4 tw:md:gap-6">
      <!-- Mobile Header -->
      <div class="tw:md:hidden tw:flex tw:items-center tw:justify-between tw:bg-white tw:rounded-xl tw:shadow-sm tw:px-4 tw:py-3">
        <button
          type="button"
          @click="handleBack"
          class="tw:text-sm tw:font-medium tw:text-[#0061FF]"
        >
          Event Map
        </button>
        <button
          type="button"
          @click="toggleMobileSidebar"
          aria-label="Open menu"
          class="tw:text-2xl tw:leading-none tw:text-gray-700"
        >
          ☰
        </button>
      </div>

      <!-- Mobile Sidebar Drawer -->
      <div
        v-if="mobileSidebarOpen"
        class="tw:md:hidden tw:fixed tw:inset-0 tw:z-50"
      >
        <div class="tw:absolute tw:inset-0 tw:bg-black/30" @click="closeMobileSidebar"></div>
        <div class="tw:absolute tw:left-0 tw:top-0 tw:h-screen tw:max-w-[92vw] tw:w-full tw:p-2">
          <EventSidebar
            :menuItems="menuItems"
            @back="handleBack"
            @event-selected="handleEventSelected"
            @menu-click="closeMobileSidebar"
          />
        </div>
      </div>

      <!-- ================= LEFT CARD (Sidebar Component) ================= -->
      <div class="tw:hidden tw:md:block">
        <EventSidebar :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected" />
      </div>

      <!-- ================= RIGHT CARD ================= -->
      <div class="tw:flex-1 tw:max-w-full tw:overflow-x-hidden tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4 tw:md:space-y-6">
        <!-- EVENT TITLE SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
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
            'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-base tw:md:text-[16px] tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all',
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
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">

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
            class="tw:flex tw:items-center tw:w-full tw:max-w-full tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:overflow-hidden tw:bg-white tw:cursor-pointer">

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
              class="tw:absolute tw:top-2 tw:right-2 tw:w-6 tw:h-6 tw:bg-(--secondary-color) tw:text-white tw:rounded-full tw:flex tw:items-center tw:justify-center hover:tw:bg-(--secondary-color) tw:transition-colors">
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
                    'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-base tw:md:text-[16px] tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                    categoryError ? 'tw:border-red-500' : 'tw:border-gray-200',
                    (isLoadingCategories || categoriesError) ? 'tw:bg-gray-100 tw:cursor-not-allowed' : ''
                  ]">
                  <option value="">
                    {{ isLoadingCategories ? 'Loading...' : (categoriesError ? 'Error loading categories' :
                      'Select Category') }}
                  </option>
                  <option v-for="category in categories.filter(c =>
                    !['sports', 'organiser', 'talent', 'venue'].includes(c.name.toLowerCase())
                  )" :key="category.id" :value="category.name">
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
                <div v-if="showSubcategoryDropdown && selectedCategory && !categoriesError"
                  class="subcategory-dropdown tw:flex tw:flex-col" ref="dropdownMenu">
                  <div class="dropdown-content tw:flex-1 tw:min-h-0" :style="{ maxHeight: 'none' }">
                    <div v-for="subcategory in availableSubcategories" :key="subcategory" class="dropdown-option"
                      :class="{
                        'selected': isSubcategorySelected(subcategory),
                        'disabled': isSubcategoryLocked(subcategory)
                      }" @click.stop="handleSubcategoryClick(subcategory)">
                      <input type="checkbox" :id="`subcategory-${subcategory}`" class="option-checkbox tw:pointer-events-none"
                        :checked="isSubcategorySelected(subcategory)"
                        :disabled="isSubcategoryLocked(subcategory)" />
                      <label :for="`subcategory-${subcategory}`" class="option-label" @click.stop>
                        {{ subcategory }}
                      </label>
                      <Lock v-if="isSubcategoryLocked(subcategory)" class="tw:w-4 tw:h-4 tw:text-gray-400 tw:ml-3" />
                    </div>
                  </div>

                  <!-- Upgrade message (always visible, separated by divider) -->
                  <div class="tw:border-t tw:bg-white tw:px-4 tw:py-3">
                    <p class="tw:text-xs tw:font-medium tw:text-[#1d4ed8] tw:text-center">
                      Upgrade to Premium to select more subcategories
                    </p>
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
        <div class="tw:bg-white tw:rounded-xl tw:border tw:border-gray-200 tw:p-4 tw:md:p-6">

          <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
            Event Date & Time <span class="tw:text-red-500">*</span>
          </h3>

          <div class="tw:space-y-4">
            <!-- Row: Event Start -->
            <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
              <div class="tw:space-y-2">
                <label class="tw:block tw:text-sm tw:text-gray-600">
                  Event Start Date <span class="tw:text-red-500">*</span>
                </label>
                <div class="tw:relative">
                  <input ref="dateInput" v-model="eventDate" placeholder="YYYY-MM-DD" inputmode="numeric" :class="[
                    'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-base tw:md:text-[16px] tw:text-gray-700 tw:placeholder-[#666666] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500',
                    (errors.eventDate || startDateFormatError || fieldErrors.event_date) ? 'tw:border-red-500' : 'tw:border-gray-200'
                  ]" @input="clearFieldError('eventDate'); startDateFormatError = ''" />
                  <Calendar
                    class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                </div>
                <p v-if="errors.eventDate" class="tw:text-red-500 tw:text-sm">Start date is required</p>
                <p v-else-if="startDateFormatError" class="tw:text-red-500 tw:text-sm">{{ startDateFormatError }}</p>
                <p v-else-if="fieldErrors.event_date" class="tw:text-red-500 tw:text-sm">{{ fieldErrors.event_date[0] }}
                </p>
                <p v-if="pastDateError" class="tw:text-red-500 tw:text-sm">Cannot select a past date</p>
              </div>

              <div class="tw:space-y-2">
                <label class="tw:block tw:text-sm tw:text-gray-600">
                  Event Start Time <span class="tw:text-red-500">*</span>
                </label>
                <div
                  class="tw:flex tw:items-center tw:border tw:rounded-lg tw:bg-white tw:overflow-hidden tw:px-3 tw:py-2.5"
                  :class="hasStartError ? 'tw:border-red-500' : 'tw:border-gray-200'">
                  <input type="text" inputmode="numeric" maxlength="2" v-model="startHH" placeholder="HH"
                    @input="onTimeInput('startHH', $event)" @blur="onTimeBlur('startHH')"
                    class="tw:w-10 tw:text-center tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent tw:tabular-nums"
                    :class="startHH ? 'tw:text-black' : 'tw:text-gray-700'" />
                  <span class="tw:text-gray-400 tw:font-bold tw:mx-1">:</span>
                  <input
                    ref="startMMInput"
                    type="text"
                    inputmode="numeric"
                    maxlength="2"
                    v-model="startMM"
                    placeholder="00"
                    @input="onTimeInput('startMM', $event)" @blur="onTimeBlur('startMM')"
                    class="tw:w-10 tw:text-center placeholder:tw:text-gray-300 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent tw:tabular-nums"
                    :class="startMM ? 'tw:text-black' : 'tw:text-gray-500'" />
                  <Clock class="tw:ml-auto tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                </div>
                <p v-if="hasStartError" class="tw:text-red-500 tw:text-sm">Start time is required</p>
                <p class="tw:text-xs tw:text-gray-500">Format: HH:mm (24-hour). “00:00” represents midnight.</p>
              </div>
            </div>

            <!-- Row: Event End -->
            <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
              <div class="tw:space-y-2">
                <label class="tw:block tw:text-sm tw:text-gray-600">
                  Event End Date <span class="tw:text-red-500">*</span>
                </label>
                <div class="tw:relative">
                  <input ref="endDateInput" v-model="endDate" placeholder="YYYY-MM-DD" inputmode="numeric" :class="[
                    'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-base tw:md:text-[16px] tw:text-gray-700 tw:placeholder-[#666666] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500',
                    (hasEndDateError || endDateFormatError || datetimeRangeError) ? 'tw:border-red-500' : 'tw:border-gray-200'
                  ]" @input="hasEndDateError = false; datetimeRangeError = ''; endDateFormatError = ''" />
                  <Calendar
                    class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                </div>
                <p v-if="hasEndDateError" class="tw:text-red-500 tw:text-sm">End date is required</p>
                <p v-else-if="endDateFormatError" class="tw:text-red-500 tw:text-sm">{{ endDateFormatError }}</p>
              </div>

              <div class="tw:space-y-2">
                <label class="tw:block tw:text-sm tw:text-gray-600">
                  Event End Time <span class="tw:text-red-500">*</span>
                </label>
                <div
                  class="tw:flex tw:items-center tw:border tw:rounded-lg tw:bg-white tw:overflow-hidden tw:px-3 tw:py-2.5"
                  :class="(hasEndError || datetimeRangeError) ? 'tw:border-red-500' : 'tw:border-gray-200'">
                  <input type="text" inputmode="numeric" maxlength="2" v-model="endHH" placeholder="HH"
                    @input="onTimeInput('endHH', $event)" @blur="onTimeBlur('endHH')"
                    class="tw:w-10 tw:text-center tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent tw:tabular-nums"
                    :class="endHH ? 'tw:text-black' : 'tw:text-gray-700'" />
                  <span class="tw:text-gray-400 tw:font-bold tw:mx-1">:</span>
                  <input
                    ref="endMMInput"
                    type="text"
                    inputmode="numeric"
                    maxlength="2"
                    v-model="endMM"
                    placeholder="00"
                    @input="onTimeInput('endMM', $event)" @blur="onTimeBlur('endMM')"
                    class="tw:w-10 tw:text-center placeholder:tw:text-gray-300 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent tw:tabular-nums"
                    :class="endMM ? 'tw:text-black' : 'tw:text-gray-500'" />
                  <Clock class="tw:ml-auto tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                </div>
                <p v-if="hasEndError" class="tw:text-red-500 tw:text-sm">End time is required</p>
                <p v-if="datetimeRangeError" class="tw:text-red-500 tw:text-sm">{{ datetimeRangeError }}</p>

                <div v-if="showOvernightSuggestion" class="tw:mt-2 tw:flex tw:flex-wrap tw:items-center tw:gap-2">
                  <p class="tw:text-xs tw:text-gray-600">
                    End time is earlier than start time. Did you mean the end date to be the next day?
                  </p>
                  <button type="button" @click="applyOvernightSuggestion"
                    class="tw:text-xs tw:font-medium tw:text-blue-600 hover:tw:text-blue-700 tw:underline">
                    Set end date to next day
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- EVENT LOCATION SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">
          <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
            Event Location <span class="tw:text-red-500">*</span>
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
            <p v-if="errors.address" class="tw:text-red-500 tw:text-sm tw:mt-1">Address is required</p>
          </div>
        </div>

        <!-- OVERVIEW SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Overview
            </h3>
            <!-- <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button> -->
          </div>

          <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-3 tw:gap-6">
            <!-- Dress Code -->
            <div class="tw:space-y-3">
              <label class="tw:text-sm tw:font-medium tw:text-gray-700">
                Dress Code <span class="tw:text-red-500">*</span>
              </label>
              <div class="tw:relative">
                <select
                  v-model="dressCode"
                  @change="clearFieldError('dressCode'); if (dressCode === 'none') dressCodeDescription = ''"
                  :class="[
                    'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-base tw:md:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                    errors.dressCode ? 'tw:border-red-500' : 'tw:border-gray-200'
                  ]">
                  <option value="">Select</option>
                  <option value="none">No Dress Code</option>
                  <option value="required">Other, Please Specify</option>
                </select>
                <ChevronDown class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
              </div>
              <div v-if="dressCode === 'required'" class="tw:space-y-2">
                <label class="tw:text-xs tw:font-medium tw:text-gray-600">Describe Dress Code</label>
                <textarea
                  v-model="dressCodeDescription"
                  placeholder="e.g., Formal wear, White party, Business casual"
                  rows="3"
                  class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2 tw:text-sm tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-y tw:min-h-[84px]"
                ></textarea>
              </div>
              <p v-if="errors.dressCode" class="tw:text-red-500 tw:text-sm">Please choose a dress code option</p>
            </div>

            <!-- Age Limit -->
            <div class="tw:space-y-3">
              <label class="tw:text-sm tw:font-medium tw:text-gray-700">
                Age Limit <span class="tw:text-red-500">*</span>
              </label>
              <div class="tw:relative">
                <select
                  v-model="ageLimit"
                  @change="clearFieldError('ageLimit'); if (ageLimit === 'none') ageLimitDescription = ''"
                  :class="[
                    'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-base tw:md:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                    errors.ageLimit ? 'tw:border-red-500' : 'tw:border-gray-200'
                  ]">
                  <option value="">Select</option>
                  <option value="none">No Age Limit</option>
                  <option value="restricted">Other, Please Specify</option>
                </select>
                <ChevronDown class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
              </div>
              <div v-if="ageLimit === 'restricted'" class="tw:space-y-2">
                <label class="tw:text-xs tw:font-medium tw:text-gray-600">Describe Age Limit</label>
                <input
                  v-model="ageLimitDescription"
                  type="text"
                  placeholder="e.g., 18+, 21+, Adults only"
                  class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-sm tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all"
                />
              </div>
              <p v-if="errors.ageLimit" class="tw:text-red-500 tw:text-sm">Please choose an age limit option</p>
            </div>

            <!-- Entrance Status -->
            <div class="tw:space-y-3">
              <label class="tw:text-sm tw:font-medium tw:text-gray-700">
                Entrance Status <span class="tw:text-red-500">*</span>
              </label>
              <div class="tw:relative">
                <select
                  v-model="entranceStatus"
                  @change="clearFieldError('entranceStatus'); if (entranceStatus === 'open') entranceDescription = ''"
                  :class="[
                    'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-base tw:md:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                    errors.entranceStatus ? 'tw:border-red-500' : 'tw:border-gray-200'
                  ]">
                  <option value="">Select</option>
                  <option value="open">Open to All</option>
                  <option value="restricted">Other, Please Specify</option>
                </select>
                <ChevronDown class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
              </div>
              <div v-if="entranceStatus === 'restricted'" class="tw:space-y-2">
                <label class="tw:text-xs tw:font-medium tw:text-gray-600">Describe Entrance Status</label>
                <textarea
                  v-model="entranceDescription"
                  placeholder="e.g., Members only, Invite-only, VIP access"
                  rows="3"
                  class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2 tw:text-sm tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-y tw:min-h-[84px]"
                ></textarea>
              </div>
              <p v-if="errors.entranceStatus" class="tw:text-red-500 tw:text-sm">Please choose an entrance option</p>
            </div>
          </div>
        </div>

        <!-- INVITE SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
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
            <InviteSection role="venue" :has-border="false" />
            <InviteSection role="organizer" :has-border="true" />
          </div>
        </div>

        <!-- SAVE EVENT BUTTON -->
        <div class="tw:w-full tw:pt-4">

          <div class="tw:flex tw:flex-col tw:md:flex-row tw:w-full tw:items-stretch tw:md:items-center tw:justify-between tw:gap-3 tw:md:gap-0">

            <button @click="saveEvent" class="tw:w-full tw:md:w-auto tw:px-6 tw:py-3 tw:md:py-2 tw:text-sm tw:font-medium tw:rounded-md 
             tw:border tw:border-orange-500 tw:text-[#0061FF]
             tw:bg-white hover:tw:bg-orange-50 tw:transition-all">
              Buy Tickets
            </button>

            <button @click="handleSubmit" :disabled="isSubmitting" class="tw:w-full tw:md:w-auto tw:px-6 tw:py-3 tw:md:py-2 tw:text-sm tw:font-medium tw:rounded-md 
             tw:border tw:border-orange-500 tw:text-blue-600
             tw:bg-white hover:tw:bg-blue-50 tw:transition-all
             disabled:tw:opacity-50 disabled:tw:cursor-not-allowed">
              {{ isSubmitting ? 'Creating...' : 'Create Event' }}
            </button>

          </div>

          <span class="tw:text-red-500 tw:text-sm tw:mt-2 tw:block">Soon available
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
  Lock,
  Loader2,
} from "lucide-vue-next"

import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import InviteSection from "@/components/invite/InviteSection.vue"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import eventService from "@/services/eventService"
import { useToast } from "@/composables/useToast"
import { useMyEventStore } from "@/stores/myEventStore"

import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.css"

const router = useRouter()
const route = useRoute()
const toast = useToast()
const myEvtStore = useMyEventStore()
const mobileSidebarOpen = ref(false)

function toggleMobileSidebar() {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

function closeMobileSidebar() {
  mobileSidebarOpen.value = false
}

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

function isSubcategorySelected(subcategory) {
  return selectedSubcategories.value.includes(subcategory)
}

function isSubcategoryLocked(subcategory) {
  // Free plan: once one option is selected, lock all other options.
  return selectedSubcategories.value.length >= 1 && !isSubcategorySelected(subcategory)
}

function handleSubcategoryClick(subcategory) {
  if (isSubcategoryLocked(subcategory)) return

  // Allow toggling off the selected option.
  if (isSubcategorySelected(subcategory)) {
    selectedSubcategories.value = []
  } else {
    selectedSubcategories.value = [subcategory]
  }

  subcategoryError.value = false
  subcategoryValidationError.value = false

  // Clear field errors
  clearFieldError('subcategories')
}

// Click outside handler to close dropdown
function handleClickOutside(event) {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    showSubcategoryDropdown.value = false
  }
}

// Kept for backwards compatibility (legacy code path).
// Free plan now enforces 1 option via handleSubcategoryClick + disabled UI.
function handleSubcategoryChange() {
  subcategoryValidationError.value = false
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
const dressCodeDescription = ref("")
const ageLimitDescription = ref("")
const entranceDescription = ref("")

// Event Date and Time
const eventDate = ref("")
const endDate = ref("")
// const startTime = ref("")
// const endTime = ref("")
// const dateInput = ref(null)
const startTimeInput = ref(null)
const endTimeInput = ref(null)

const dateInput = ref(null)
const endDateInput = ref(null)
// ── Time split refs ──────────────────────────────────────────────────
const startHH = ref("")
const startMM = ref("")
const endHH = ref("")
const endMM = ref("")
const startMMInput = ref(null)
const endMMInput = ref(null)
const datetimeRangeError = ref("")
const hasStartError = ref(false)
const hasEndError = ref(false)
const hasEndDateError = ref(false)
const startDateFormatError = ref("")
const endDateFormatError = ref("")
const showOvernightSuggestion = computed(() => {
  if (!eventDate.value || !endDate.value || !startTime.value || !endTime.value) return false
  if (eventDate.value !== endDate.value) return false
  const s = parseTimeToMinutes(startTime.value)
  const e = parseTimeToMinutes(endTime.value)
  if (s == null || e == null) return false
  return e < s
})

// Computed HH:MM strings for API
const startTime = computed(() => {
  if (startHH.value === "" || startMM.value === "") return ""
  return `${String(startHH.value).padStart(2, "0")}:${String(startMM.value).padStart(2, "0")}`
})

const endTime = computed(() => {
  if (endHH.value === "" || endMM.value === "") return ""
  return `${String(endHH.value).padStart(2, "0")}:${String(endMM.value).padStart(2, "0")}`
})

const DATE_YMD_REGEX = /^\d{4}-\d{2}-\d{2}$/

function parseYmd(dateStr) {
  if (!DATE_YMD_REGEX.test(String(dateStr || ''))) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  if (!y || !m || !d) return null
  const dt = new Date(y, m - 1, d)
  if (dt.getFullYear() !== y || dt.getMonth() !== (m - 1) || dt.getDate() !== d) return null
  dt.setHours(0, 0, 0, 0)
  return dt
}

function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null
  const m = timeStr.trim().match(/^([01]\d|2[0-3]):([0-5]\d)$/)
  if (!m) return null
  return Number(m[1]) * 60 + Number(m[2])
}

function buildDateTime(dateStr, timeStr) {
  const date = parseYmd(dateStr)
  const mins = parseTimeToMinutes(timeStr)
  if (!date || mins == null) return null
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0, 0)
}

function buildLocalIso(dateStr, timeStr) {
  const dt = buildDateTime(dateStr, timeStr)
  if (!dt) return ""
  const pad2 = (n) => String(n).padStart(2, '0')
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}T${pad2(dt.getHours())}:${pad2(dt.getMinutes())}:00`
}

function onTimeBlur(field) {
  const pad2 = (v) => (v === "" || v == null ? "" : String(v).padStart(2, "0").slice(-2))
  if (field === "startHH") startHH.value = pad2(startHH.value)
  if (field === "startMM") startMM.value = pad2(startMM.value)
  if (field === "endHH") endHH.value = pad2(endHH.value)
  if (field === "endMM") endMM.value = pad2(endMM.value)
}

function validateEndAfterStartDateTime() {
  datetimeRangeError.value = ""
  startDateFormatError.value = ""
  endDateFormatError.value = ""

  if (!eventDate.value || !endDate.value || !startTime.value || !endTime.value) return

  const startDt = buildDateTime(eventDate.value, startTime.value)
  const endDt = buildDateTime(endDate.value, endTime.value)
  if (!startDt) {
    startDateFormatError.value = "Use YYYY-MM-DD (e.g., 2026-03-17)"
    return
  }
  if (!endDt) {
    endDateFormatError.value = "Use YYYY-MM-DD (e.g., 2026-03-18)"
    return
  }

  if (endDt.getTime() <= startDt.getTime()) {
    datetimeRangeError.value = "End date & time must be after start date & time"
  }
}

function applyOvernightSuggestion() {
  if (!eventDate.value) return
  const d = parseYmd(eventDate.value)
  if (!d) return
  d.setDate(d.getDate() + 1)
  const pad2 = (n) => String(n).padStart(2, '0')
  endDate.value = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
  hasEndDateError.value = false
  validateEndAfterStartDateTime()
}

// Enforce max 2 digits + valid range, then validate end > start (full datetime)
function onTimeInput(field, event) {
  // Strip non-digits and limit to 2 characters
  let raw = event.target.value.replace(/\D/g, "").slice(0, 2)
  event.target.value = raw

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n))
  const isEmpty = raw === ""
  const asNumber = isEmpty ? null : Number(raw)
  const isHourField = field === "startHH" || field === "endHH"
  const max = isHourField ? 23 : 59
  const nextVal = isEmpty ? "" : String(clamp(isNaN(asNumber) ? 0 : asNumber, 0, max))

  if (field === "startHH") { startHH.value = nextVal; hasStartError.value = false }
  if (field === "startMM") { startMM.value = nextVal; hasStartError.value = false }
  if (field === "endHH") { endHH.value = nextVal; hasEndError.value = false }
  if (field === "endMM") { endMM.value = nextVal; hasEndError.value = false }

  // When HH reaches 2 digits, auto-fill minutes with "00" and move focus.
  const hourJustCompleted = isHourField && raw.length === 2
  const hourJustCleared = isHourField && raw.length === 0

  if (hourJustCompleted) {
    if (field === "startHH") {
      startMM.value = "00"
      nextTick(() => {
        startMMInput.value?.focus?.()
        startMMInput.value?.select?.()
      })
    }
    if (field === "endHH") {
      endMM.value = "00"
      nextTick(() => {
        endMMInput.value?.focus?.()
        endMMInput.value?.select?.()
      })
    }
  } else if (hourJustCleared) {
    if (field === "startHH") startMM.value = ""
    if (field === "endHH") endMM.value = ""
  }

  if (!endDate.value && eventDate.value) endDate.value = eventDate.value
  validateEndAfterStartDateTime()
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

watch([eventDate, endDate, startTime, endTime], () => {
  validatePastDate()
  if (!endDate.value && eventDate.value) endDate.value = eventDate.value
  const s = parseYmd(eventDate.value)
  const e = parseYmd(endDate.value)
  if (s && e && e.getTime() < s.getTime()) {
    endDate.value = eventDate.value
  }
  validateEndAfterStartDateTime()
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
    allowInput: false,
    onChange: (selectedDates, dateStr) => {
      eventDate.value = dateStr
    }
  })

  flatpickr(endDateInput.value, {
    dateFormat: "Y-m-d",
    minDate: "today",
    allowInput: false,
    onChange: (selectedDates, dateStr) => {
      endDate.value = dateStr
      hasEndDateError.value = false
      validateEndAfterStartDateTime()
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
  hasEndDateError.value = !endDate.value

  // Set category/subcategory specific errors
  categoryError.value = !selectedCategory.value
  subcategoryError.value = selectedSubcategories.value.length === 0

  // ✅ Replace with:
  if (!startTime.value) hasStartError.value = true
  if (!endTime.value) hasEndError.value = true
  validateEndAfterStartDateTime()
  const timeValid =
    startTime.value !== "" &&
    endTime.value !== "" &&
    endDate.value !== "" &&
    !datetimeRangeError.value

  // Overview validation
  errors.value.dressCode = !dressCode.value || (dressCode.value === 'required' && !dressCodeDescription.value?.trim())
  errors.value.ageLimit = !ageLimit.value || (ageLimit.value === 'restricted' && !ageLimitDescription.value?.trim())
  errors.value.entranceStatus = !entranceStatus.value || (entranceStatus.value === 'restricted' && !entranceDescription.value?.trim())

  const hasOtherErrors = Object.values(errors.value).some(error => error) ||
    categoryError.value ||
    subcategoryError.value ||
    pastDateError.value

  return !hasOtherErrors && !hasEndDateError.value && timeValid
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

function resetForm() {
  eventTitle.value = ''
  eventDate.value = ''
  endDate.value = ''
  startHH.value = ''
  startMM.value = ''
  endHH.value = ''
  endMM.value = ''
  selectedAddress.value = ''
  searchAddress.value = ''
  selectedCategory.value = ''
  selectedSubcategories.value = []
  imagePreview.value = null
  selectedImageFile.value = null
  fieldErrors.value = {}
  errors.value.eventTitle = false
  errors.value.eventImage = false
  errors.value.category = false
  errors.value.subcategories = false
  errors.value.eventDate = false
  errors.value.address = false
  errors.value.dressCode = false
  errors.value.ageLimit = false
  errors.value.entranceStatus = false
  hasStartError.value = false
  hasEndError.value = false
  hasEndDateError.value = false
  datetimeRangeError.value = ''
  categoryError.value = false
  subcategoryError.value = false
  subcategoryValidationError.value = false
  pastDateError.value = false
  latitude.value = null
  longitude.value = null
  dressCode.value = ''
  dressCodeDescription.value = ''
  ageLimit.value = ''
  ageLimitDescription.value = ''
  entranceFee.value = ''
  entranceStatus.value = ''
  entranceDescription.value = ''
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) fileInput.value = ''
}

async function refreshMyEventsAfterCreate() {
  await myEvtStore.fetchMyEvents()
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
    // Backwards-compatible fields (legacy)
    formData.append('event_date', eventDate.value)
    formData.append('start_time', startTime.value)
    formData.append('end_time', endTime.value)
    // New datetime fields (preferred)
    formData.append('end_date', endDate.value)
    formData.append('start_datetime', buildLocalIso(eventDate.value, startTime.value))
    formData.append('end_datetime', buildLocalIso(endDate.value, endTime.value))
    formData.append('address', selectedAddress.value)
    formData.append('latitude', latitude.value)
    formData.append('longitude', longitude.value)
    formData.append('dress_code', dressCode.value === 'none' ? 'no_dress_code' : (dressCodeDescription.value || ''))
    formData.append('age_limit', ageLimit.value === 'none' ? 'no_age_limit' : (ageLimitDescription.value || ''))
    formData.append('entrance_fee', entranceFee.value)
    formData.append('entrance_status', entranceStatus.value === 'open' ? 'open_to_all' : (entranceDescription.value || ''))

    // Add image file if exists
    if (selectedImageFile.value) {
      formData.append('image', selectedImageFile.value)
    }

    // Submit to API v2 using eventService
    const response = await eventService.createEvent(formData)

    if (response.success) {
      toast.success('Event created successfully!')
      resetForm()
      await refreshMyEventsAfterCreate()
    } else {
      // Handle API validation errors
      if (response.errors) {
        fieldErrors.value = response.errors
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
  closeMobileSidebar()
  router.push('/') // Navigate to events list
}

async function handleEventSelected(eventId) {
  closeMobileSidebar()
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