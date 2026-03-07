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
            <EventSidebar :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected" />

            <!-- ================= RIGHT CARD ================= -->
            <div class="tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-3xl tw:shadow-sm tw:p-8 tw:space-y-6">

                <!-- IMAGE UPLOAD SECTION -->
                <!-- <div
                    class="tw:relative tw:rounded-2xl tw:overflow-hidden tw:bg-gray-200 tw:h-96 tw:flex tw:items-center tw:justify-center">
                    <img src="/family-legal-advisor.jpg" alt="Event Background"
                        class="tw:w-full tw:h-full tw:object-cover tw:opacity-50" />

                    <div class="tw:absolute tw:bg-white tw:shadow-lg tw:rounded-2xl tw:px-10 tw:py-8 tw:text-center">
                        <div
                            class="tw:w-14 tw:h-14 tw:mx-auto tw:mb-4 tw:bg-blue-50 tw:rounded-full tw:flex tw:items-center tw:justify-center">
                            <Upload class="tw:w-7 tw:h-7 tw:text-blue-600" />
                        </div>
                        <p class="tw:text-base tw:font-semibold tw:text-gray-900">
                            Upload photos and video
                        </p>
                    </div>
                </div> -->

                <!-- Venue TITLE SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                            Create Premium Venue
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
                    <!-- Description -->
                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:text-gray-700">Description</label>
                        <textarea v-model="eventDescription" rows="4" placeholder="Describe Your Venue..."
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
                    </div>
                </div>

                <!-- DESCRIPTION OF VENUE SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                            Description of Venue
                        </h3>
                    </div>

                    <div class="tw:relative" ref="descriptionDropdownRef">

                        <!-- Trigger -->
                        <div @click="toggleDescriptionDropdown"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:flex tw:justify-between tw:items-center tw:cursor-pointer">
                            <span class="tw:text-gray-700">
                                {{ selectedDescriptionItems?.length ? `${selectedDescriptionItems.length} selected` : 'Select Description Items' }}
                            </span>
                            <ChevronDown :class="['tw:w-5 tw:h-5 tw:text-gray-400 tw:transition-transform', showDescriptionDropdown ? 'tw:rotate-180' : '']" />
                        </div>

                        <!-- Dropdown Box -->
                        <div v-if="showDescriptionDropdown"
                            class="tw:absolute tw:mt-2 tw:w-full tw:bg-[#F6F1E7] tw:p-2 tw:rounded-xl tw:shadow-md tw:z-50">

                            <!-- Inner white container -->
                            <div class="tw:bg-white tw:rounded-lg tw:p-4">

                                <!-- Close Button -->
                                <div class="tw:flex tw:justify-end tw:mb-3">
                                    <button @click="showDescriptionDropdown = false"
                                        class="tw:flex tw:items-center tw:gap-1 tw:text-sm tw:text-gray-500 hover:tw:text-gray-800 tw:border tw:border-gray-200 tw:rounded-lg tw:px-3 tw:py-1 tw:transition">
                                        <X class="tw:w-4 tw:h-4" /> Close
                                    </button>
                                </div>

                                <div class="tw:space-y-2">
                                    <label v-for="item in descriptionItems" :key="item"
                                        class="tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3 tw:rounded-lg tw:border tw:border-gray-200 tw:cursor-pointer">
                                        <span class="tw:text-gray-700">{{ item }}</span>
                                        <input type="checkbox" :value="item" v-model="selectedDescriptionItems"
                                            class="tw:w-5 tw:h-5 tw:accent-[#FF7700] tw:cursor-pointer" />
                                    </label>
                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- Selected Tags -->
                    <div v-if="selectedDescriptionItems.length > 0" class="tw:flex tw:flex-wrap tw:gap-2 tw:mt-2">
                        <span v-for="item in selectedDescriptionItems" :key="item"
                            class="tw:inline-flex tw:items-center tw:gap-1 tw:bg-[#dbeafe] tw:text-[#1d4ed8] tw:text-sm tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-[#bfdbfe]">
                            {{ item }}
                            <button @click="selectedDescriptionItems = selectedDescriptionItems.filter(i => i !== item)"
                                class="tw:ml-1 tw:text-[#1d4ed8] tw:opacity-60 hover:tw:opacity-100 tw:transition">
                                <svg class="tw:w-3.5 tw:h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </span>
                    </div>
                </div>

                <!-- Venue LOCATION SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:border tw:border-[#E8E1D5] tw:p-6">
                    <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
                        Venue Location
                    </h3>

                    <div class="tw:relative tw:mb-4">
                        <input v-model="searchAddress" @input="onSearchInput" type="text"
                            placeholder="Search Address..."
                            class="tw:w-full tw:bg-white tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-gray-700 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

                        <div v-if="isLoading" class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2">
                            <svg class="tw:animate-spin tw:h-5 tw:w-5 tw:text-blue-500"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="tw:opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="tw:opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                        </div>

                        <div v-if="suggestions.length > 0"
                            class="tw:absolute tw-top-full tw:left-0 tw:right-0 tw:mt-1 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-gray-200 tw:z-10 tw:max-h-60 tw:overflow-y-auto">
                            <button v-for="(suggestion, index) in suggestions" :key="index"
                                @click="selectSuggestion(suggestion)"
                                class="tw:w-full tw:px-4 tw:py-3 tw:text-left tw:text-sm tw:text-gray-700 hover:tw:bg-gray-50 tw:transition-colors tw:border-b tw:border-gray-100 last:tw:border-b-0">
                                {{ suggestion.display_name }}
                            </button>
                        </div>
                    </div>

                    <div id="event-map" class="tw:w-full tw:h-[300px] tw:rounded-lg tw:overflow-hidden tw:mb-4">
                    </div>

                    <div class="tw:space-y-2">
                        <label class="tw:block tw:text-sm tw:text-gray-600">
                            Selected Address
                        </label>
                        <input v-model="selectedAddress" type="text" readonly placeholder="Address Will Auto Fill Here"
                            class="tw:w-full tw:bg-gray-50 tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:px-4 tw:py-2.5 tw:text-gray-700 placeholder:tw:text-gray-400 tw:cursor-not-allowed" />
                    </div>
                </div>

                <!-- Venue IMAGE SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-6">

                    <!-- Header -->
                    <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
                        <h3 class="tw:text-lg tw:font-semibold tw:text-gray-800">
                            Venue Image <span class="tw:text-red-500">*</span> <span
                                class="tw:text-xs tw:text-gray-500"> Recommended (1200x800) </span>
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
                        <span
                            class="tw:px-4 tw:py-2 tw:bg-[#F6F1E7] tw:text-sm tw:text-gray-700 tw:border-r tw:border-[#E8E1D5]">
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

                <!-- ADDITIONAL IMAGES SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                            Additional Images (Max. 5 images) <span class="tw:text-xs tw:text-gray-500"> Recommended
                                (1200x800) </span>
                        </h3>
                    </div>

                    <AdditionalImageUpload v-model:files="additionalImages" :max-files="5" :max-size-m-b="5" />
                </div>

                <!-- ACCESSIBILITY SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                            Accessibility
                        </h3>
                    </div>
                    <!-- Dropdown -->
                    <div class="tw:relative" ref="accessibilityDropdownRef">

                        <!-- Trigger -->
                        <div @click="toggleAccessibilityDropdown"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:flex tw:justify-between tw:items-center tw:cursor-pointer">

                            <span class="tw:text-gray-700">
                                {{ selectedAccessibilityItems?.length ? selectedAccessibilityItems.join(', ') : 'Select Accessibility Items' }}
                            </span>

                            <ChevronDown class="tw:w-5 tw:h-5 tw:text-gray-400" />
                        </div>

                        <!-- Dropdown Box -->
                        <div v-if="showAccessibilityDropdown"
                            class="tw:absolute tw:mt-2 tw:w-full tw:bg-[#F6F1E7] tw:p-2 tw:rounded-xl tw:shadow-md tw:z-50">

                            <!-- Inner white container -->
                            <div class="tw:bg-white tw:rounded-lg tw:space-y-4 tw:p-4">

                                <label v-for="item in accessibilityItems" :key="item"
                                    class="tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3 tw:rounded-lg tw:border tw:border-gray-200 tw:cursor-pointer">

                                    <span class="tw:text-gray-700">{{ item }}</span>

                                    <input type="checkbox" :value="item" v-model="selectedAccessibilityItems"
                                        class="tw:w-5 tw:h-5 tw:accent-[#FF7700] tw:cursor-pointer" />
                                </label>

                            </div>
                        </div>
                    </div>
                </div>

                <!-- ALLOWANCE OF DOGS SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
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
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
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
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
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
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
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
                                        'Select') }}
                                    </option>
                                    <option v-for="category in categories" :key="category.id" :value="category.name">
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
                                Subcategories (Max 6) <span class="tw:text-red-500">*</span>
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
                                                'disabled': !selectedSubcategories.includes(subcategory) && selectedSubcategories.length >= 6
                                            }" @click="toggleSubcategory(subcategory)">
                                            <input type="checkbox" :id="`subcategory-${subcategory}`" :value="subcategory"
                                                v-model="selectedSubcategories"
                                                :disabled="!selectedSubcategories.includes(subcategory) && selectedSubcategories.length >= 6"
                                                @change="handleSubcategoryChange" @click.stop class="option-checkbox">
                                            <label :for="`subcategory-${subcategory}`" class="option-label" @click.stop>
                                                {{ subcategory }}
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Max selection notice -->
                                    <div v-if="selectedSubcategories.length >= 6" class="max-selection-notice">
                                        Maximum 6 subcategories selected
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

                <!-- Venue DATE & TIME SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:border tw:border-gray-200 tw:p-6">

                    <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
                        Venue Date & Time
                    </h3>

                    <!-- Horizontal Layout -->
                    <div class="tw:flex tw:gap-6">

                        <!-- Venue DATE -->
                        <div class="tw:flex-1">
                            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-2">
                                Venue Date
                            </label>

                            <div class="tw:relative">
                                <input ref="dateInput" placeholder="MM/DD/YYYY"
                                    class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-gray-700 tw:placeholder-[#666666] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500" />

                                <!-- Custom Calendar Icon -->
                                <Calendar
                                    class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                            </div>
                        </div>

                        <!-- START & END TIME -->
                        <div class="tw:flex tw:gap-4" style="flex: 1;">

                            <!-- START TIME -->
                            <div class="tw:flex-1">
                                <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-2">
                                    Start Time <span class="tw:text-red-500">*</span>
                                </label>
                                <div class="tw:flex tw:items-center tw:border tw:rounded-lg tw:bg-white tw:overflow-hidden tw:px-3 tw:py-2.5"
                                    :class="hasStartError ? 'tw:border-red-500' : 'tw:border-gray-200'">
                                    <input type="text" inputmode="numeric" maxlength="2" v-model="startHH"
                                        placeholder="12" @input="onTimeInput('startHH', $event)"
                                        class="tw:w-8 tw:text-center tw:text-gray-700 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent" />
                                    <span class="tw:text-gray-400 tw:font-bold tw:mx-1">:</span>
                                    <input type="text" inputmode="numeric" maxlength="2" v-model="startMM"
                                        placeholder="00" @input="onTimeInput('startMM', $event)"
                                        class="tw:w-8 tw:text-center tw:text-gray-700 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent" />
                                    <Clock class="tw:ml-auto tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                                </div>
                                <p v-if="hasStartError" class="tw:text-red-500 tw:text-sm tw:mt-1">Start time is
                                    required</p>
                            </div>

                            <!-- END TIME -->
                            <div class="tw:flex-1">
                                <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-2">
                                    End Time <span class="tw:text-red-500">*</span>
                                </label>
                                <div class="tw:flex tw:items-center tw:border tw:rounded-lg tw:bg-white tw:overflow-hidden tw:px-3 tw:py-2.5"
                                    :class="(hasEndError || timeRangeError) ? 'tw:border-red-500' : 'tw:border-gray-200'">
                                    <input type="text" inputmode="numeric" maxlength="2" v-model="endHH"
                                        placeholder="13" @input="onTimeInput('endHH', $event)"
                                        class="tw:w-8 tw:text-center tw:text-gray-700 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent" />
                                    <span class="tw:text-gray-400 tw:font-bold tw:mx-1">:</span>
                                    <input type="text" inputmode="numeric" maxlength="2" v-model="endMM"
                                        placeholder="00" @input="onTimeInput('endMM', $event)"
                                        class="tw:w-8 tw:text-center tw:text-gray-700 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent" />
                                    <Clock class="tw:ml-auto tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                                </div>
                                <p v-if="hasEndError" class="tw:text-red-500 tw:text-sm tw:mt-1">End time is required
                                </p>
                                <p v-if="timeRangeError" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ timeRangeError }}
                                </p>
                            </div>

                        </div>

                    </div>
                </div>

                <!-- CONTACT DETAILS SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">Contact Details</h3>
                    <input v-model="contactPhone" type="text" placeholder="Telephone Number"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-orange-500 focus:tw:border-transparent tw:transition-all" />
                    <input v-model="contactEmail" type="email" placeholder="Email"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-orange-500 focus:tw:border-transparent tw:transition-all" />
                    <input v-model="contactWebsite" type="text" placeholder="Website"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-orange-500 focus:tw:border-transparent tw:transition-all" />
                </div>

                <!-- CONTACT BOX DESIGN SECTION -->
                <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">Contact Box Design</h3>
                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Design Message</label>
                        <textarea v-model="contactBoxDesignMessage" rows="4" placeholder="Enter your design message"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
                    </div>
                </div> -->

                <!-- SOCIAL MEDIA LINKS SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">Social Media Links</h3>
                    <input v-model="facebookUrl" type="text" placeholder="Facebook URL"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                    <input v-model="instagramUrl" type="text" placeholder="Instagram URL"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                    <input v-model="tiktokUrl" type="text" placeholder="Tik Tok URL"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                </div>

                <!-- BOOKING & TICKET INFO SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">Booking & Ticket Info</h3>
                    <input v-model="ticketUrl" type="text" placeholder="Ticket / Booking URL"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                    <textarea v-model="bookingInstructions" rows="4" placeholder="Booking Instructions"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
                </div>

                <!-- INVITE SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">Invite</h3>
                    </div>
                    <p class="tw:text-sm tw:text-[#1E3A8A]">
                        Make your event stand out even more. These sections help attendees find information and answer their questions.
                    </p>
                    <div class="tw:space-y-1">
                        <!-- <InviteSection role="talent" :has-border="true" />
                        <InviteSection role="organiser" :has-border="false" /> -->
                        <InviteSection role="venue" :has-border="false" />
                    </div>
                </div>

                <!-- Venue OPTIONS SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">Venue Options</h3>
                    <div class="tw:flex tw:gap-6 tw:items-center">
                        <label class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
                            <input type="radio" value="copy" v-model="eventOption"
                                class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500" />
                            <span class="tw:text-sm tw:text-gray-700">Copy Venue</span>
                        </label>
                        <label class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
                            <input type="radio" value="recurring" v-model="eventOption"
                                class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500" />
                            <span class="tw:text-sm tw:text-gray-700">Recurring Venue</span>
                        </label>
                    </div>
                </div>

                <!-- SAVE Venue BUTTON -->
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
                            {{ isSubmitting ? 'Saving...' : 'Save Venue' }}
                        </button>
                    </div>
                    <span class="tw:text-red-500 tw:text-sm tw:mt-2 tw:block">Soon you can show this button in
                        your event description or event info window when appropriate. This is still under
                        consideration.</span>
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
    MessageSquareText,
    X
} from "lucide-vue-next"

import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import InviteSection from "@/components/invite/InviteSection.vue"
import AdditionalImageUpload from "@/components/common/AdditionalImageUpload.vue"
import eventService from "@/services/eventService"
import { useFormValidation } from "@/composables/useFormValidation"
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
const isSubmitting = ref(false)
const eventDescription = ref("")
const additionalImages = ref([])
const selectedGenre = ref("")
const dressCode = ref("")
const ageLimit = ref("")
const entranceFee = ref("")
const contactPhone = ref("")
const contactEmail = ref("")
const contactWebsite = ref("")
const bookingInstructions = ref("")
const ticketUrl = ref("")
const eventOption = ref("")
const showChatbox = ref(false)
const contactBoxDesignMessage = ref("")
const childrensPlayArea = ref("")
const facebookUrl = ref("")
const instagramUrl = ref("")
const tiktokUrl = ref("")

const notifications = ref({
    receiveEmail: false,
    receiveUpdates: false
})

// ── Form Validation ─────────────────────
const formData = reactive({
    venueTitle: '',
    category: '',
    subcategories: [],
})

const venueSchema = {
    venueTitle: { type: 'text', required: true, min: 3, max: 100, label: 'Venue Title' },
    category: { type: 'select', required: true, label: 'Category' },
    subcategories: { type: 'multiselect', required: true, min: 1, max: 5, label: 'Subcategories' },
}

const { errors: formErrors, validate, clearError, resetErrors, scrollToFirstError } = useFormValidation(venueSchema, formData)

// Event Date and Time
// const eventDate = ref("")
// const startTime = ref("")
// const endTime = ref("")
const startTimeInput = ref(null)
const endTimeInput = ref(null)

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
//     startError,
//     endError,
//     hasStartError,
//     hasEndError,
//     validateTimeRange,
//     clearStartError,
//     clearEndError,
// } = useTimeRangeValidation(startTime, endTime)

const selectedCategory = ref("")

// Genre state
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

function handleCategoryChange() {
    handleCategoryChangeWithValidation()
}

function toggleSubcategoryDropdown() {
    if (!selectedCategory.value || categoriesError.value) return
    showSubcategoryDropdown.value = !showSubcategoryDropdown.value
}

function toggleSubcategory(subcategory) {
    if (!selectedSubcategories.value.includes(subcategory) && selectedSubcategories.value.length >= 6) {
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
    if (selectedSubcategories.value.length > 6) {
        selectedSubcategories.value = selectedSubcategories.value.slice(0, 6)
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

const contactBoxMessage = ref('')
const openingHoursText = ref('')

// Event Date and Time
// const eventDate = ref("")
const eventTime = ref("")
const dateInput = ref(null)
const timeInput = ref(null)

// Event Location refs
const searchAddress = ref("")
const selectedAddress = ref("")
const map = ref(null)
const marker = ref(null)
const suggestions = ref([])
const isLoading = ref(false)
const debounceTimer = ref(null)
// const selectedCategory = ref("")

// Accessibility fields
const allowanceOfDogs = ref("")
const wheelchairAccessible = ref("")
const accessibleParking = ref("")
const valetParking = ref("")

const showGenreDropdown = ref(false)
const genreDropdownRef = ref(null)

const genres = [
    "Electronic",
    "House",
    "Techno",
    "Hip Hop",
    "Live Music"
]

const selectedGenres = ref([])

// Description of Venue dropdown
const showDescriptionDropdown = ref(false)
const descriptionDropdownRef = ref(null)

const descriptionItems = [
    "Hall / theatre / stage / public place / boat / beach house",
    "Elevator",
    "Cloakrooms (paid / non paid)",
    "Bar / foyer / restaurant / food-truck",
    "Vending machines",
    "Ticket collection point(s) where to find",
    "Ticket sales on site",
    "History of venue",
    "Payment methods (cash, cards, fiches, cheque…)",
    "Security entrance",
    "Smoking area",
    "Baby changing facilities",
    "Toilets",
    "Free Wifi"
]

const selectedDescriptionItems = ref([])

// Accessibility dropdown
const showAccessibilityDropdown = ref(false)
const accessibilityDropdownRef = ref(null)

const accessibilityItems = [
    "Directions to venue",
    "Parking facilities",
    "Public transport to the venue",
    "Taxis nearby"
]

const selectedAccessibilityItems = ref([])

// Toggle functions
function toggleDescriptionDropdown() {
    showDescriptionDropdown.value = !showDescriptionDropdown.value
}

function toggleAccessibilityDropdown() {
    showAccessibilityDropdown.value = !showAccessibilityDropdown.value
}

function toggleDropdown() {
    showGenreDropdown.value = !showGenreDropdown.value
}

// Close when clicking outside
// function handleClickOutside(event) {
//     // Genre dropdown
//     if (
//         genreDropdownRef.value &&
//         !genreDropdownRef.value.contains(event.target)
//     ) {
//         showGenreDropdown.value = false
//     }
    
//     // Description dropdown
//     if (
//         descriptionDropdownRef.value &&
//         !descriptionDropdownRef.value.contains(event.target)
//     ) {
//         showDescriptionDropdown.value = false
//     }
    
//     // Accessibility dropdown
//     if (
//         accessibilityDropdownRef.value &&
//         !accessibilityDropdownRef.value.contains(event.target)
//     ) {
//         showAccessibilityDropdown.value = false
//     }
// }

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside)
})

const eventDate = ref("05.03.2026, 18:30 CET")
const eventStatus = ref("Premium")
const fileName = ref("")

const menuItems = [
    { id: "home", icon: Home, label: "Home", route: "/create-venue-premium" },
    { id: "details", icon: FileText, label: "Details", route: "/create-venue-premium" },
    { id: "analytics", icon: BarChart3, route: "/create-venue-premium/report", label: "Analytics" },
    { id: "settings", icon: Settings, route: "/create-venue-premium/settings", label: "Settings" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "back", icon: SkipBackIcon, label: "Back" },
    { id: "chatbox", icon: MessageSquareText, label: "Chatbox" },
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
        console.log("Navigating to:", item.route)
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
    const genreValid = validateGenre()
    // const timeValid = validateTimeRange()

    // ✅ Replace with:
    if (!startTime.value) hasStartError.value = true
    if (!endTime.value) hasEndError.value = true
    validateEndAfterStart()
    const timeValid = startTime.value !== "" && endTime.value !== "" && !timeRangeError.value

    if (!isValid || !genreValid || !timeValid) {
        await scrollToFirstError()
        isSubmitting.value = false
        return
    }

    toast.success('This feature will be available in future')
    isSubmitting.value = false
}

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
    if (map.value) {
        map.value.flyTo({ center: [lon, lat], zoom: 15, essential: true })
        updateMarker(lon, lat)
    }
}

function updateMarker(lng, lat) {
    // Remove existing marker
    if (marker.value) {
        marker.value.remove()
    }

    // Create custom marker element using marker.png
    const el = document.createElement('div')
    el.style.width = '60px'
    el.style.height = '60px'
    el.style.cursor = 'pointer'
    el.style.backgroundImage = 'url(/marker.png)'
    el.style.backgroundSize = 'contain'
    el.style.backgroundRepeat = 'no-repeat'
    el.style.backgroundPosition = 'center'

    // Add new marker with custom element
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

onMounted(() => {
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
        updateMarker(lng, lat)
        await reverseGeocode(lng, lat)
    })

    /* ------------------ DATE PICKER ------------------ */
    flatpickr(dateInput.value, {
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: (selectedDates, dateStr) => {
            eventDate.value = dateStr
        }
    })

    // /* ------------------ START TIME PICKER ------------------ */
    // flatpickr(startTimeInput.value, {
    //     enableTime: true,
    //     noCalendar: true,
    //     dateFormat: "H:i",
    //     time_24hr: true,
    //     onChange: (selectedDates, timeStr) => { startTime.value = timeStr }
    // })

    // /* ------------------ END TIME PICKER ------------------ */
    // flatpickr(endTimeInput.value, {
    //     enableTime: true,
    //     noCalendar: true,
    //     dateFormat: "H:i",
    //     time_24hr: true,
    //     onChange: (selectedDates, timeStr) => { endTime.value = timeStr }
    // })
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>