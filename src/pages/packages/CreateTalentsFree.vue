<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6">
    <div class="tw:w-full tw:max-w-7xl tw:min-w-0 tw:flex tw:flex-col tw:md:flex-row tw:gap-4 tw:md:gap-6">
      <div class="tw:md:hidden tw:flex tw:items-center tw:justify-between tw:bg-white tw:rounded-xl tw:shadow-sm tw:px-4 tw:py-3">
        <button type="button" @click="handleBack" class="tw:text-sm tw:font-medium tw:text-[#0061FF]">Event Map</button>
        <button type="button" @click="toggleMobileSidebar" aria-label="Open menu" class="tw:text-2xl tw:leading-none tw:text-gray-700">☰</button>
      </div>
      <div v-if="mobileSidebarOpen" class="tw:md:hidden tw:fixed tw:inset-0 tw:z-50">
        <div class="tw:absolute tw:inset-0 tw:bg-black/30" @click="closeMobileSidebar"></div>
        <div class="tw:absolute tw:left-0 tw:top-0 tw:h-screen tw:max-w-[92vw] tw:w-full tw:p-2">
          <EventSidebar sidebar-kind="talents" :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected" @menu-click="closeMobileSidebar" />
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
        <EventSidebar sidebar-kind="talents" :menuItems="menuItems"
          @back="handleBack" @event-selected="handleEventSelected" />
      </div>

      <!-- ================= RIGHT CARD ================= -->
      <div class="tw:flex-1 tw:min-w-0 tw:overflow-x-hidden tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4 tw:md:space-y-6">
        <ProfileDraftVisibilityBanner v-if="showDraftVisibilityBanner" />
        <!-- Talent NAME SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Talent Name <span class="tw:text-red-500">*</span>
            </h3>
          </div>

          <input v-model="formData.talentTitle" type="text" placeholder="Enter Talent Name"
            data-field="talentTitle"
            @input="formErrors.talentTitle && clearError('talentTitle')"
            :class="[
              'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all',
              formErrors.talentTitle ? 'tw:border-red-500' : 'tw:border-gray-200'
            ]" />
          <p v-if="formErrors.talentTitle" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ formErrors.talentTitle }}</p>
        </div>

        <!-- Talent IMAGE — free accounts: upload from device (multipart `image_path`), not gallery modal -->
        <div data-field="talentImage" class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">

          <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
            <h3 class="tw:text-lg tw:font-semibold tw:text-gray-800">
              Talent Image (Max 1) <span class="tw:text-red-500">*</span>
              <span class="tw:text-xs tw:text-gray-500"> Recommended portrait (3:4) </span>
            </h3>
          </div>

          <label
            class="tw:flex tw:items-center tw:w-full tw:max-w-full tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:overflow-hidden tw:bg-white tw:cursor-pointer"
          >
            <span class="tw:px-4 tw:py-2 tw:bg-[#F6F1E7] tw:text-sm tw:text-gray-700 tw:border-r tw:border-[#E8E1D5]">
              Choose Image
            </span>
            <span class="tw:px-4 tw:py-2 tw:text-sm tw:text-gray-500 tw:flex-1">
              {{ fileName || 'No Image Chosen' }}
            </span>
            <input
              ref="talentFileInput"
              type="file"
              accept="image/*"
              class="tw:hidden"
              @change="handleFileChange"
            />
          </label>

          <div v-if="imagePreview" class="tw:relative tw:mt-4 tw:mx-auto tw:max-w-xs tw:w-full tw:aspect-[3/4]">
            <img
              :src="imagePreview"
              alt="Talent preview"
              class="tw:w-full tw:h-full tw:object-cover tw:rounded-lg tw:border tw:border-gray-200"
            />
            <button
              type="button"
              @click="removeTalentImage"
              class="tw:absolute tw:top-2 tw:right-2 tw:w-6 tw:h-6 tw:bg-(--secondary-color) tw:text-white tw:rounded-full tw:flex tw:items-center tw:justify-center hover:tw:bg-(--secondary-color)"
            >
              <span class="tw:text-sm tw:leading-none">&times;</span>
            </button>
          </div>
          <p v-if="fieldErrors.image_path" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ fieldErrors.image_path[0] }}</p>
        </div>

        <!-- TALENT TYPE -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Talent Type <span class="tw:text-red-500">*</span>
            </h3>
          </div>

          <div v-if="categoriesError" class="tw:bg-red-50 tw:border tw:border-red-200 tw:rounded-lg tw:p-4">
            <div class="tw:flex tw:items-center">
              <p class="tw:text-red-800 tw:text-sm">{{ categoriesError }}</p>
              <button @click="fetchCategories"
                class="tw:ml-auto tw:text-red-600 tw:text-sm tw:font-medium hover:tw:text-red-700">
                Retry
              </button>
            </div>
          </div>

          <div data-field="talentType">
            <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
              Choose from Musician, Dancer, Singer, Actor or Group
            </label>
            <div class="tw:relative">
              <select
                v-model="selectedTalentType"
                @change="handleTalentTypeChange"
                :disabled="isLoadingCategories || !!categoriesError"
                :class="[
                  'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                  (talentTypeError || formErrors.talentType) ? 'tw:border-red-500' : 'tw:border-gray-200',
                  (isLoadingCategories || categoriesError) ? 'tw:bg-gray-100 tw:cursor-not-allowed' : ''
                ]"
              >
                <option value="">
                  {{ isLoadingCategories ? 'Loading...' : (categoriesError ? 'Error loading types' : 'Select talent type') }}
                </option>
                <option v-for="type in talentTypeOptions" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
              <ChevronDown
                class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-gray-400 tw:pointer-events-none" />
            </div>
            <p v-if="formErrors.talentType || talentTypeError" class="tw:text-red-500 tw:text-sm tw:mt-1">
              {{ formErrors.talentType || 'Please select a talent type' }}
            </p>
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
        <div id="talent-location-section" class="tw:bg-white tw:rounded-xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">
          <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-1">
            Talent Location <span class="tw:text-red-500">*</span>
          </h3>
          <p v-if="fieldErrors.address" class="tw:text-red-500 tw:text-sm tw:mb-3">{{ fieldErrors.address[0] }}</p>

          <!-- Address Search Input with Loading Spinner -->
          <div class="tw:relative tw:mb-4">
            <input v-model="searchAddress" @input="onSearchInput" type="text" placeholder="Search Address..."
              data-field="talentLocationSearch"
              :class="[
                'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-base tw:md:text-[16px] tw:text-gray-700 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all',
                fieldErrors.address ? 'tw:border-red-500' : 'tw:border-[#E8E1D5]'
              ]" />

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

          <!-- City (display only; full address is still saved) -->
          <div class="tw:space-y-2">
            <label class="tw:block tw:text-sm tw:text-gray-600">
              City
            </label>
            <input :value="selectedLocationCityDisplay" type="text" readonly placeholder="City appears after you choose a location"
              data-field="talentLocation"
              :class="[
                'tw:w-full tw:h-12 tw:md:h-auto tw:bg-gray-50 tw:border tw:rounded-lg tw:px-4 tw:py-2.5 tw:text-base tw:md:text-[16px] tw:text-gray-700 placeholder:tw:text-gray-400 tw:cursor-not-allowed',
                fieldErrors.address ? 'tw:border-red-500' : 'tw:border-[#E8E1D5]'
              ]" />
          </div>

        </div>

        <!-- NATIONALITY SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6 tw:space-y-4">
          <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
            Nationality of Talent
          </h3>
          <div class="tw:space-y-2">
            <label class="tw:text-sm tw:font-medium tw:text-gray-700">Nationality</label>
            <CountrySelect v-model="nationalityCode" placeholder="Search and select nationality…" />
          </div>
        </div>

        <!-- LANGUAGES SECTION -->
        <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6 tw:space-y-4">
          <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
            Languages
          </h3>
          <div class="tw:space-y-2">
            <label class="tw:text-sm tw:font-medium tw:text-gray-700">Languages spoken</label>
            <LanguageMultiSelect v-model="selectedLanguages" />
          </div>
        </div>

        <!-- CITY WHERE TALENT IS LIVING SECTION -->
        <!-- <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
          <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
            City where talent is living
          </h3>

          <div class="tw:space-y-2">
            <label class="tw:text-sm tw:font-medium tw:text-gray-700">City</label>
            <input v-model="talentCity" type="text" placeholder="Enter city"
              class="tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-base tw:md:text-[16px] tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
          </div>
        </div> -->

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
                {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Talent' : 'Save Talent') }}
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
  ChevronDown,
  ChevronLeft,
  Upload,
  Plus,
  MapPin,
  User,
  SkipBackIcon,
} from "lucide-vue-next"

import { ref, reactive, computed, onMounted, nextTick, watch } from "vue"
import { storeToRefs } from "pinia"
import { useMyTalentStore } from "@/stores/myTalentStore"
import { useRouter, useRoute } from "vue-router"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import ProfileDraftVisibilityBanner from "@/components/profile/ProfileDraftVisibilityBanner.vue"
import InviteSection from "@/components/invite/InviteSection.vue"
import LanguageMultiSelect from "@/components/talent/LanguageMultiSelect.vue"
import CountrySelect from "@/components/common/CountrySelect.vue"
import eventService from "@/services/eventService"
import { fetchCountries } from "@/api/referenceData"
import { resolveCountryCode } from "@/utils/countryIso3166"
import { useFormValidation } from "@/composables/useFormValidation"
import { useToast } from "@/composables/useToast"
import { eventInvitationsNavItem } from "@/utils/eventInvitationsNavItem"
import { firstOwnedProfileId } from "@/utils/profileSingleton"
import {
  isPublicationDraft,
  resolvePublicationStatusSlug,
} from "@/utils/profilePublicationStatus"
import { TALENT_FREE_TYPE_OPTIONS, isTalentFreeType } from "@/constants/talentFreeTypes"
import { cityDisplayFromStoredFullAddress, locationCityDisplayFromNominatim } from "@/utils/nominatimCityDisplay"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

const router = useRouter()
const route = useRoute()
const toast = useToast()

const myTalentStore = useMyTalentStore()
const { talents, loading: talentsLoading, error: talentsError } = storeToRefs(myTalentStore)
const mobileSidebarOpen = ref(false)
function toggleMobileSidebar() { mobileSidebarOpen.value = !mobileSidebarOpen.value }
function closeMobileSidebar() { mobileSidebarOpen.value = false }

const activeTab = ref("home")
const isSubmitting = ref(false)
const isEditMode = ref(false)
const editingTalentId = ref(null)
const publicationStatus = ref(null)

const showDraftVisibilityBanner = computed(
  () => isEditMode.value && isPublicationDraft(publicationStatus.value),
)

watch(
  [() => talents.value, editingTalentId],
  () => {
    const id = editingTalentId.value
    if (id == null) {
      publicationStatus.value = null
      return
    }
    const row = talents.value.find((t) => Number(t.id) === Number(id))
    if (row) publicationStatus.value = resolvePublicationStatusSlug(row)
  },
  { deep: true }
)
const fieldErrors = ref({})

const talentFileInput = ref(null)
const selectedImageFile = ref(null)
const imagePreview = ref(null)
const fileName = ref('')
const existingImageUrl = ref(null)

// ── Form Validation (generic composable) ─────────────────────
const formData = reactive({
  talentTitle: '',
  talentType: '',
})

const talentSchema = {
  talentTitle: { type: 'text', required: true, min: 3, max: 100, label: 'Talent Name' },
  talentType: { type: 'select', required: true, label: 'Talent Type' },
}

const { errors: formErrors, validate, clearError, resetErrors, scrollToFirstError } = useFormValidation(talentSchema, formData)

const talentTypeOptions = TALENT_FREE_TYPE_OPTIONS
const selectedTalentType = ref('')
const categoriesTalents = ref([])
const isLoadingCategories = ref(false)
const categoriesError = ref(null)
const talentTypeError = ref(false)

// Fetch categories from API using eventService
async function fetchCategories() {
  try {
    isLoadingCategories.value = true
    categoriesError.value = null

    const response = await eventService.getCategoriesTalents()

    if (response.success) {
      categoriesTalents.value = response.data
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

function resolveTalentCategoryId(type) {
  const match = categoriesTalents.value.find(
    (cat) => String(cat.name).toLowerCase() === String(type).toLowerCase(),
  )
  return match?.id ?? null
}

function handleTalentTypeChange() {
  formData.talentType = selectedTalentType.value
  talentTypeError.value = false
  clearError('talentType')
}

function validateTalentType() {
  talentTypeError.value = !selectedTalentType.value
  return !!selectedTalentType.value
}

const talentCity = ref("")
const nationalityCode = ref("")
const selectedLanguages = ref([])

// Event Location refs
const searchAddress = ref("")
/** Full address sent to the API (unchanged behaviour). */
const selectedAddress = ref("")
/** City label shown in the readonly field only. */
const selectedLocationCityDisplay = ref("")
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
  eventInvitationsNavItem("/create-talents-free"),
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
  return activeTab.value === item.id && !route.path.includes('/report') && !route.path.includes('/settings') && !route.path.includes('/event-invitations')
}

async function handleEventSelected(eventId) {
  closeMobileSidebar()
  await loadTalent(Number(eventId))
}

function handleFileChange(event) {
  const file = event.target.files && event.target.files[0]
  if (file) {
    selectedImageFile.value = file
    fileName.value = file.name
    existingImageUrl.value = null
    if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview.value)
    }
    imagePreview.value = URL.createObjectURL(file)
    const nextErr = { ...fieldErrors.value }
    delete nextErr.image_path
    fieldErrors.value = nextErr
  } else {
    selectedImageFile.value = null
    fileName.value = ''
    if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview.value)
    }
    imagePreview.value = existingImageUrl.value
  }
}

function clearAddressFieldError() {
  if (!fieldErrors.value.address) return
  const next = { ...fieldErrors.value }
  delete next.address
  fieldErrors.value = next
}

function removeTalentImage() {
  selectedImageFile.value = null
  fileName.value = ''
  existingImageUrl.value = null
  if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imagePreview.value = null
  if (talentFileInput.value) {
    talentFileInput.value.value = ''
  }
}

// ── Sync category/subcategory selections into formData for validation ──
function syncFormData() {
  formData.talentType = selectedTalentType.value
}

function buildTalentFormData() {
  const type = selectedTalentType.value
  const categoryId = resolveTalentCategoryId(type)

  const fd = new FormData()
  fd.append('title', formData.talentTitle)
  fd.append('event_type', 'free')
  if (categoryId != null) {
    fd.append('talent_category_id', String(categoryId))
    fd.append('category_id', String(categoryId))
  }
  if (type) fd.append('highlights', type)
  if (selectedAddress.value) {
    fd.append('location', selectedAddress.value)
    fd.append('address', selectedAddress.value)
  }
  if (mapLat.value != null && mapLat.value !== '') fd.append('latitude', String(mapLat.value))
  if (mapLng.value != null && mapLng.value !== '') fd.append('longitude', String(mapLng.value))
  if (talentCity.value) fd.append('city', talentCity.value)
  if (nationalityCode.value) fd.append('nationality', nationalityCode.value)

  selectedLanguages.value
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((lang) => fd.append('languages[]', lang))

  if (selectedImageFile.value) {
    fd.append('image_path', selectedImageFile.value)
  }

  return fd
}

function validateForm() {
  syncFormData()
  const schemaOk = validate()
  const typeOk = validateTalentType()
  const hasImage =
    selectedImageFile.value !== null ||
    (isEditMode.value && !!existingImageUrl.value)
  const addressOk = !!(selectedAddress.value && String(selectedAddress.value).trim())
  const extra = { ...fieldErrors.value }
  if (!hasImage) {
    extra.image_path = ['Main image is required']
  } else {
    delete extra.image_path
  }
  if (!addressOk) {
    extra.address = ['Talent location is required']
  } else {
    delete extra.address
  }
  fieldErrors.value = extra
  return schemaOk && typeOk && hasImage && addressOk
}

// ── Create Talent ───────────────────────────────────────────────
async function createTalent() {
  try {
    fieldErrors.value = {}
    await myTalentStore.fetchMyTalents()
    const existingId = firstOwnedProfileId(myTalentStore.talents)
    if (existingId != null) {
      toast.info('You already have a talent profile. Loaded for editing.')
      await loadTalent(existingId)
      return
    }
    if (!selectedImageFile.value) {
      fieldErrors.value = { ...fieldErrors.value, image_path: ['Main image is required'] }
      toast.error('Please upload a talent image.')
      return
    }
    const formDataBody = buildTalentFormData()
    const response = await eventService.createTalentFormData(formDataBody)

    if (response.success) {
      toast.success('Talent created successfully!')
      await myTalentStore.fetchMyTalents()
      const newId = response.data?.id
      if (newId != null) {
        myTalentStore.selectTalent(Number(newId))
        await loadTalent(Number(newId))
      } else {
        resetForm()
      }
    } else {
      if (response.errors) fieldErrors.value = response.errors
      toast.error(response.message || 'Failed to create talent')
    }
  } catch (error) {
    console.error('Error creating talent:', error)
    if (error.response?.data?.errors) {
      fieldErrors.value = error.response.data.errors
      toast.error(error.response.data.message || 'Please correct the errors.')
    } else {
      toast.error(error.response?.data?.message || 'An error occurred while creating the talent')
    }
  }
}

// ── Update Talent ───────────────────────────────────────────────
async function updateTalent() {
  try {
    fieldErrors.value = {}
    const formDataBody = buildTalentFormData()
    const response = await eventService.updateTalentFormData(editingTalentId.value, formDataBody)

    if (response.success) {
      toast.success('Talent updated successfully!')
      const id = editingTalentId.value
      await myTalentStore.fetchMyTalents()
      if (id != null) await loadTalent(id)
    } else {
      if (response.errors) fieldErrors.value = response.errors
      toast.error(response.message || 'Failed to update talent')
    }
  } catch (error) {
    console.error('Error updating talent:', error)
    if (error.response?.data?.errors) {
      fieldErrors.value = error.response.data.errors
      toast.error(error.response.data.message || 'Please correct the errors.')
    } else {
      toast.error(error.response?.data?.message || 'An error occurred while updating the talent')
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
    const addrFull = talent.address || ''
    selectedAddress.value = addrFull
    searchAddress.value = addrFull
    selectedLocationCityDisplay.value = addrFull ? cityDisplayFromStoredFullAddress(addrFull) : ''
    talentCity.value = talent.city || ''

    if (talent.latitude) mapLat.value = talent.latitude
    if (talent.longitude) mapLng.value = talent.longitude

    const catName =
      talent.talent_category?.name ||
      talent.category?.name ||
      (typeof talent.highlights === 'string' ? talent.highlights.trim() : '')
    if (isTalentFreeType(catName)) {
      selectedTalentType.value = catName
      formData.talentType = catName
    } else {
      selectedTalentType.value = ''
      formData.talentType = ''
    }
    talentTypeError.value = false

    selectedImageFile.value = null
    fileName.value = ''
    existingImageUrl.value = talent.image_url || talent.main_image_url || null
    if (existingImageUrl.value) {
      imagePreview.value = existingImageUrl.value
    } else {
      imagePreview.value = null
    }
    if (talentFileInput.value) {
      talentFileInput.value.value = ''
    }
    fieldErrors.value = {}

    publicationStatus.value = resolvePublicationStatusSlug(talent)

    if (Array.isArray(talent.languages)) {
      selectedLanguages.value = [...talent.languages]
    } else if (typeof talent.languages === 'string' && talent.languages.trim()) {
      selectedLanguages.value = talent.languages
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    } else {
      selectedLanguages.value = []
    }

    try {
      const countries = await fetchCountries()
      nationalityCode.value = resolveCountryCode(talent.nationality, countries)
    } catch {
      nationalityCode.value = typeof talent.nationality === 'string' ? talent.nationality : ''
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
    return true
  } catch (error) {
    console.error('Error loading talent:', error)
    toast.error('Failed to load talent data')
    return false
  }
}

// ── Cancel Edit ─────────────────────────────────────────────────
async function cancelEdit() {
  resetForm()
  isEditMode.value = false
  editingTalentId.value = null
  await myTalentStore.fetchMyTalents()
  const id = firstOwnedProfileId(myTalentStore.talents)
  if (id != null) await loadTalent(id)
}

// ── Reset Form ──────────────────────────────────────────────────
function resetForm() {
  formData.talentTitle = ''
  formData.talentType = ''
  selectedTalentType.value = ''
  selectedAddress.value = ''
  selectedLocationCityDisplay.value = ''
  searchAddress.value = ''
  talentCity.value = ''
  nationalityCode.value = ''
  selectedLanguages.value = []
  selectedImageFile.value = null
  fileName.value = ''
  if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imagePreview.value = null
  existingImageUrl.value = null
  if (talentFileInput.value) {
    talentFileInput.value.value = ''
  }
  fieldErrors.value = {}
  mapLat.value = null
  mapLng.value = null
  talentTypeError.value = false
  isEditMode.value = false
  editingTalentId.value = null
  resetErrors()
}

// ── Handle Submit ───────────────────────────────────────────────
async function handleSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true

  if (!validateForm()) {
    await scrollToFirstError()
    await nextTick()
    if (fieldErrors.value.address?.length) {
      document.getElementById('talent-location-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    await nextTick()
    if (fieldErrors.value.image_path?.length) {
      document.querySelector('[data-field="talentImage"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
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
  selectedLocationCityDisplay.value = locationCityDisplayFromNominatim(display_name, suggestion.address)
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
  clearAddressFieldError()
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
      const full = data.display_name || "Address not found"
      selectedAddress.value = full
      selectedLocationCityDisplay.value = locationCityDisplayFromNominatim(full, data.address)
      if (data.display_name) {
        clearAddressFieldError()
      }
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error)
    selectedAddress.value = "Error fetching address"
    selectedLocationCityDisplay.value = "Error fetching address"
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

  const talentId =
    myTalentStore.takePendingEditorTalentId() ?? route.query.edit ?? route.params.id
  if (talentId != null && talentId !== '') {
    const loaded = await loadTalent(Number(talentId))
    if (loaded && route.query.edit != null && String(route.query.edit) !== '') {
      const q = { ...route.query }
      delete q.edit
      if (Object.keys(q).length) {
        router.replace({ path: route.path, query: q })
      } else {
        router.replace({ path: route.path })
      }
    }
  } else {
    await myTalentStore.fetchMyTalents()
    const id = firstOwnedProfileId(myTalentStore.talents)
    if (id != null) await loadTalent(id)
  }
})

</script>