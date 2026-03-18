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
            <EventSidebar :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected"
                @chatbox-click="handleChatboxClick" />

            <!-- ================= RIGHT CARD ================= -->
            <div class="tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-3xl tw:shadow-sm tw:p-6 tw:space-y-6">

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
                    <p v-if="fieldErrors.title" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ fieldErrors.title[0] }}
                    </p>
                    <!-- Description -->
                    <div class="tw:space-y-2">
                        <div class="tw:flex tw:justify-between tw:items-center">
                            <label class="tw:text-sm tw:text-gray-700">Description <span
                                    class="tw:text-red-500">*</span></label>
                            <button type="button"
                                class="tw:inline-flex tw:items-center tw:gap-1.5 tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:text-blue-600 hover:tw:text-blue-700 hover:tw:bg-blue-50 tw:rounded-lg tw:transition-colors"
                                @click="showDescriptionExpandModal = true" title="Expand to read full description">
                                <Maximize2 class="tw:w-4 tw:h-4" />
                                Expand
                            </button>
                        </div>
                        <textarea v-model="eventDescription" rows="4" placeholder="Describe Your Event..."
                            @input="clearFieldError('description')" :class="[
                                'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-y tw:min-h-[100px]',
                                (errors.description || fieldErrors.description) ? 'tw:border-red-500' : 'tw:border-gray-200'
                            ]"></textarea>
                        <p v-if="errors.description" class="tw:text-red-500 tw:text-sm tw:mt-1">Description is required
                        </p>
                        <p v-if="fieldErrors.description" class="tw:text-red-500 tw:text-sm tw:mt-1">{{
                            fieldErrors.description[0] }}</p>
                    </div>
                </div>

                <!-- EVENT IMAGE SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-6">

                    <!-- Header -->
                    <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
                        <h3 class="tw:text-lg tw:font-semibold tw:text-gray-800">
                            <!-- Upload Event Image with recommended size -->
                            Event Main Image <span class="tw:text-red-500">*</span> <span
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
                            {{ fileName || 'No File Chosen' }}
                        </span>

                        <input type="file" accept="image/*" class="tw:hidden" @change="handleFileChange" />
                    </label>

                    <!-- Image Preview -->
                    <div v-if="imagePreview" class="tw:relative tw:mt-4 tw:w-full">
                        <img :src="imagePreview" alt="Event image preview"
                            class="tw:w-full tw:h-[50vh] tw:rounded-lg tw:border tw:border-gray-200" />
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
                    <p v-if="fieldErrors.image" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ fieldErrors.image[0] }}
                    </p>
                </div>

                <!-- ADDITIONAL IMAGES SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                            Additional Images (Max. 5 Images) <span class="tw:text-xs tw:text-gray-500"> Recommended
                                (1200x800) </span>
                        </h3>
                    </div>

                    <AdditionalImageUpload v-model:files="additionalImages" :max-files="5" :max-size-m-b="5" />
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
                    <div v-if="categoriesError"
                        class="tw:bg-red-50 tw:border tw:border-red-200 tw:rounded-lg tw:p-4 tw:mb-4">
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
                                        {{ isLoadingCategories ? 'Loading...' : (categoriesError ? 'Error loading categories' : 'Select') }}
                                    </option>
                                    <option
                                        v-for="category in categories.filter(c =>
                                        !['sports','organiser','talent','venue'].includes(c.name.toLowerCase())
                                        )"
                                        :key="category.id"
                                        :value="category.name"
                                    >
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
                                <div v-if="showSubcategoryDropdown && selectedCategory && !categoriesError"
                                    class="subcategory-dropdown" ref="dropdownMenu">
                                    <div class="dropdown-content">
                                        <div v-for="subcategory in availableSubcategories" :key="subcategory"
                                            class="dropdown-option" :class="{
                                                'selected': selectedSubcategories.includes(subcategory),
                                                'disabled': !selectedSubcategories.includes(subcategory) && selectedSubcategories.length >= 6
                                            }" @click="toggleSubcategory(subcategory)">
                                            <input type="checkbox" :id="`subcategory-${subcategory}`"
                                                :value="subcategory" v-model="selectedSubcategories"
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
                                <span v-for="subcategory in selectedSubcategories" :key="subcategory"
                                    class="selected-tag">
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
                            <p v-else-if="subcategoryError" class="validation-error">Please select at least one
                                subcategory</p>
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

                <!-- EVENT DATE & TIME SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:border tw:border-gray-200 tw:p-6">

                    <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
                        Event Date & Time <span class="tw:text-red-500">*</span>
                    </h3>

                    <div class="tw:space-y-4">
                        <!-- Row: Event Start -->
                        <div class="tw:grid tw:grid-cols-2 tw:gap-4">
                            <div class="tw:space-y-2">
                                <label class="tw:block tw:text-sm tw:text-gray-600">
                                    Event Start Date <span class="tw:text-red-500">*</span>
                                </label>
                                <div class="tw:relative">
                                    <input
                                        ref="dateInput"
                                        v-model="eventDate"
                                        placeholder="YYYY-MM-DD"
                                        inputmode="numeric"
                                        :class="[
                                            'tw:w-full tw:bg-white tw:border tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-gray-700 tw:placeholder-[#666666] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500',
                                            (errors.eventDate || startDateFormatError || fieldErrors.event_date) ? 'tw:border-red-500' : 'tw:border-gray-200'
                                        ]"
                                        @input="clearFieldError('eventDate'); startDateFormatError = ''"
                                    />
                                    <Calendar class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                                </div>
                                <p v-if="errors.eventDate" class="tw:text-red-500 tw:text-sm">Start date is required</p>
                                <p v-else-if="startDateFormatError" class="tw:text-red-500 tw:text-sm">{{ startDateFormatError }}</p>
                                <p v-else-if="fieldErrors.event_date" class="tw:text-red-500 tw:text-sm">{{ fieldErrors.event_date[0] }}</p>
                                <p v-if="pastDateError" class="tw:text-red-500 tw:text-sm">Cannot select a past date</p>
                            </div>

                            <div class="tw:space-y-2">
                                <label class="tw:block tw:text-sm tw:text-gray-600">
                                    Event Start Time <span class="tw:text-red-500">*</span>
                                </label>
                                <div
                                    class="tw:flex tw:items-center tw:border tw:rounded-lg tw:bg-white tw:overflow-hidden tw:px-3 tw:py-2.5"
                                    :class="hasStartError ? 'tw:border-red-500' : 'tw:border-gray-200'">
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        maxlength="2"
                                        v-model="startHH"
                                        placeholder="HH"
                                        @input="onTimeInput('startHH', $event)"
                                        @blur="onTimeBlur('startHH')"
                                        class="tw:w-10 tw:text-center tw:text-gray-700 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent tw:tabular-nums"
                                    />
                                    <span class="tw:text-gray-400 tw:font-bold tw:mx-1">:</span>
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        maxlength="2"
                                        v-model="startMM"
                                        placeholder="00"
                                        @input="onTimeInput('startMM', $event)"
                                        @blur="onTimeBlur('startMM')"
                                        class="tw:w-10 tw:text-center tw:text-gray-500 placeholder:tw:text-gray-300 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent tw:tabular-nums"
                                    />
                                    <Clock class="tw:ml-auto tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                                </div>
                                <p v-if="hasStartError" class="tw:text-red-500 tw:text-sm">Start time is required</p>
                                <p class="tw:text-xs tw:text-gray-500">Format: HH:mm (24-hour). “00:00” represents midnight.</p>
                            </div>
                        </div>

                        <!-- Row: Event End -->
                        <div class="tw:grid tw:grid-cols-2 tw:gap-4">
                            <div class="tw:space-y-2">
                                <label class="tw:block tw:text-sm tw:text-gray-600">
                                    Event End Date <span class="tw:text-red-500">*</span>
                                </label>
                                <div class="tw:relative">
                                    <input
                                        ref="endDateInput"
                                        v-model="endDate"
                                        placeholder="YYYY-MM-DD"
                                        inputmode="numeric"
                                        :class="[
                                            'tw:w-full tw:bg-white tw:border tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-gray-700 tw:placeholder-[#666666] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500',
                                            (hasEndDateError || endDateFormatError || datetimeRangeError) ? 'tw:border-red-500' : 'tw:border-gray-200'
                                        ]"
                                        @input="hasEndDateError = false; datetimeRangeError = ''; endDateFormatError = ''"
                                    />
                                    <Calendar class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
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
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        maxlength="2"
                                        v-model="endHH"
                                        placeholder="HH"
                                        @input="onTimeInput('endHH', $event)"
                                        @blur="onTimeBlur('endHH')"
                                        class="tw:w-10 tw:text-center tw:text-gray-700 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent tw:tabular-nums"
                                    />
                                    <span class="tw:text-gray-400 tw:font-bold tw:mx-1">:</span>
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        maxlength="2"
                                        v-model="endMM"
                                        placeholder="00"
                                        @input="onTimeInput('endMM', $event)"
                                        @blur="onTimeBlur('endMM')"
                                        class="tw:w-10 tw:text-center tw:text-gray-500 placeholder:tw:text-gray-300 tw:border-none focus:tw:outline-none focus:tw:ring-0 tw:bg-transparent tw:tabular-nums"
                                    />
                                    <Clock class="tw:ml-auto tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                                </div>
                                <p v-if="hasEndError" class="tw:text-red-500 tw:text-sm">End time is required</p>
                                <p v-if="datetimeRangeError" class="tw:text-red-500 tw:text-sm">{{ datetimeRangeError }}</p>

                                <div v-if="showOvernightSuggestion" class="tw:mt-2 tw:flex tw:flex-wrap tw:items-center tw:gap-2">
                                    <p class="tw:text-xs tw:text-gray-600">
                                        End time is earlier than start time. Did you mean the end date to be the next day?
                                    </p>
                                    <button
                                        type="button"
                                        @click="applyOvernightSuggestion"
                                        class="tw:text-xs tw:font-medium tw:text-blue-600 hover:tw:text-blue-700 tw:underline">
                                        Set end date to next day
                                    </button>
                                </div>
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
                        <input v-model="searchAddress" @input="onSearchInput" type="text"
                            placeholder="Search Address..."
                            class="tw:w-full tw:bg-white tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-gray-700 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

                        <!-- Loading Spinner -->
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

                        <!-- Suggestions Dropdown -->
                        <div v-if="suggestions.length > 0"
                            class="tw:absolute tw-top-full tw:left-0 tw:right-0 tw:mt-1 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-gray-200 tw:z-10 tw:max-h-60 tw:overflow-y-auto">
                            <button v-for="(suggestion, index) in suggestions" :key="index"
                                @click="selectSuggestion(suggestion)"
                                class="tw:w-full tw:px-4 tw:py-3 tw:text-left tw:text-sm tw:text-gray-700 hover:tw:bg-gray-50 tw:transition-colors tw:border-b tw:border-gray-100 last:tw:border-b-0">
                                {{ suggestion.display_name }}
                            </button>
                        </div>
                    </div>

                    <!-- Map Container -->
                    <div id="event-map" class="tw:w-full tw:h-[300px] tw:rounded-lg tw:overflow-hidden tw:mb-4">
                    </div>

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

                    <div class="tw:grid tw:grid-cols-1 md:tw:grid-cols-3 tw:gap-6">
                        <!-- Dress Code -->
                        <div class="tw:space-y-3">
                            <label class="tw:text-sm tw:font-medium tw:text-gray-700">
                                Dress Code <span class="tw:text-red-500">*</span>
                            </label>
                            <div class="tw:relative">
                                <select
                                    v-model="dressCode"
                                    @change="clearFieldError('dressCode'); if (dressCode === 'none') customDressCode = ''"
                                    :class="[
                                        'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                                        errors.dressCode ? 'tw:border-red-500' : 'tw:border-gray-200'
                                    ]">
                                    <option value="">Select</option>
                                    <option value="none">No Dress Code</option>
                                    <option value="required">Dress Code Required</option>
                                </select>
                                <ChevronDown class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
                            </div>
                            <div v-if="dressCode === 'required'" class="tw:space-y-2">
                                <label class="tw:text-xs tw:font-medium tw:text-gray-600">Describe Dress Code</label>
                                <textarea
                                    v-model="customDressCode"
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
                                    @change="clearFieldError('ageLimit'); if (ageLimit === 'none') customAgeLimit = ''"
                                    :class="[
                                        'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                                        errors.ageLimit ? 'tw:border-red-500' : 'tw:border-gray-200'
                                    ]">
                                    <option value="">Select</option>
                                    <option value="none">No Age Limit</option>
                                    <option value="restricted">Age Restricted</option>
                                </select>
                                <ChevronDown class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
                            </div>
                            <div v-if="ageLimit === 'restricted'" class="tw:space-y-2">
                                <label class="tw:text-xs tw:font-medium tw:text-gray-600">Describe Age Limit</label>
                                <input
                                    v-model="customAgeLimit"
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
                                    @change="clearFieldError('entranceStatus'); if (entranceStatus === 'open') customEntranceFee = ''"
                                    :class="[
                                        'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                                        errors.entranceStatus ? 'tw:border-red-500' : 'tw:border-gray-200'
                                    ]">
                                    <option value="">Select</option>
                                    <option value="open">Open to All</option>
                                    <option value="restricted">Restricted Entry</option>
                                </select>
                                <ChevronDown class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
                            </div>
                            <div v-if="entranceStatus === 'restricted'" class="tw:space-y-2">
                                <label class="tw:text-xs tw:font-medium tw:text-gray-600">Describe Entrance Status</label>
                                <textarea
                                    v-model="customEntranceFee"
                                    placeholder="e.g., Members only, Invite-only, VIP access"
                                    rows="3"
                                    class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2 tw:text-sm tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-y tw:min-h-[84px]"
                                ></textarea>
                            </div>
                            <p v-if="errors.entranceStatus" class="tw:text-red-500 tw:text-sm">Please choose an entrance option</p>
                        </div>
                    </div>
                </div>

                <!-- CONTACT DETAILS SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Contact Details
                    </h3>

                    <div>
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Phone <span
                                class="tw:text-gray-400 tw:text-xs">(optional)</span></label>
                        <input v-model="contactPhone" type="text" placeholder="Telephone Number"
                            @input="clearFieldError('contactPhone')"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-orange-500 focus:tw:border-transparent tw:transition-all" />
                        <p v-if="fieldErrors.contact_phone" class="tw:text-red-500 tw:text-sm tw:mt-1">{{
                            fieldErrors.contact_phone[0] }}</p>
                    </div>

                    <div>
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Email <span
                                class="tw:text-gray-400 tw:text-xs">(optional)</span></label>
                        <input v-model="contactEmail" type="email" placeholder="Email"
                            @input="clearFieldError('contactEmail')"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-orange-500 focus:tw:border-transparent tw:transition-all" />
                        <p v-if="fieldErrors.contact_email" class="tw:text-red-500 tw:text-sm tw:mt-1">{{
                            fieldErrors.contact_email[0] }}</p>
                    </div>

                    <input v-model="contactWebsite" type="text" placeholder="Website"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-orange-500 focus:tw:border-transparent tw:transition-all" />

                    <!-- SHOW CHATBOX TOGGLE -->
                    <!-- <div class="tw:flex tw:justify-between tw:items-center tw:pt-2">
                        <span class="tw:text-sm tw:text-gray-900">Show Chatbox</span>

                        <label class="tw:relative tw:inline-flex tw:items-center tw:w-12 tw:h-6 tw:cursor-pointer">
                            <input type="checkbox" v-model="showChatbox" class="tw:sr-only tw:peer" />

                            
                            <div
                                class="tw:w-12 tw:h-6 tw:bg-gray-300 tw:rounded-full tw:transition tw:peer-checked:bg-orange-500">
                            </div>

                            
                                class="tw:absolute tw:left-1 tw:top-1 tw:w-4 tw:h-4 tw:bg-white tw:rounded-full tw:transition tw:peer-checked:translate-x-6">
                            </div>
                        </label>
                    </div> -->
                </div>

                <!-- CONTACT BOX SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Contact Box
                    </h3>

                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Contact Message</label>
                        <textarea v-model="contactBoxMessage" rows="4" placeholder="Enter your contact message"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
                    </div>
                </div>

                <!-- VENUE DETAILS SECTION -->
                <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Describe venue details if different to standard venue description
                    </h3>

                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Venue Details</label>
                        <textarea v-model="venueDetailsText" rows="4" placeholder="Enter venue details"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
                    </div>
                </div> -->

                <!-- SOCIAL MEDIA LINKS SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Social Media Links
                    </h3>

                    <input v-model="facebookUrl" type="text" placeholder="Facebook URL"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

                    <input v-model="instagramUrl" type="text" placeholder="Instagram URL"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

                    <input v-model="tiktokUrl" type="text" placeholder="Tik Tok URL"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                </div>

                <!-- EVENT CONDITIONS SECTION -->
                <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Event Conditions (Optional)
                    </h3>
                    
                    <input v-model="conditionEntranceFee" type="text" placeholder="Entrance Fee (If Different)"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

                    <input v-model="conditionDressCode" type="text" placeholder="Dress Code (If Different)"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

                    <input v-model="conditionAgeLimit" type="text" placeholder="Age Limit (If Different)"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                </div> -->

                <!-- BOOKING & TICKET INFO SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Booking & Ticket Info
                    </h3>

                    <input v-model="ticketUrl" type="text" placeholder="Ticket / Booking URL"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

                    <textarea v-model="bookingInstructions" rows="4" placeholder="Booking Instructions"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
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

                    <p class="tw:text-sm tw:text-[#1E3A8A]">
                        Make your event stand out even more. These sections help attendees find information and
                        answer
                        their
                        questions.
                    </p>

                    <div class="tw:space-y-3">
                        <InviteSection role="talent" :profiles="talentUsers" :has-border="true"
                            v-model:selectedIds="invitedTalentIds" />
                        <InviteSection role="organizer" :profiles="organiserUsers" :has-border="true"
                            v-model:selectedIds="invitedOrganiserIds" />
                        <InviteSection role="venue" :profiles="venueUsers" :has-border="false"
                            v-model:selectedIds="invitedVenueIds" />
                    </div>
                </div>

                <!-- EVENT OPTIONS SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Event Options
                    </h3>

                    <div class="tw:flex tw:flex-col tw:gap-3">
                        <!-- Recurring Event - create mode only -->
                        <label v-if="!isEditMode" class="tw:inline-flex tw:items-center tw:gap-2 tw:cursor-pointer">
                            <input
                                type="checkbox"
                                v-model="isRecurring"
                                class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500"
                            />
                            <span class="tw:text-sm tw:text-gray-700">Recurring Event</span>
                        </label>

                        <!-- Copy Event - edit mode only -->
                        <label v-if="isEditMode" class="tw:inline-flex tw:items-center tw:gap-2 tw:cursor-pointer">
                            <input
                                type="checkbox"
                                v-model="isCopyEvent"
                                class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500"
                            />
                            <span class="tw:text-sm tw:text-gray-700">Copy Event</span>
                        </label>
                    </div>
                </div>

                <!-- EVENT VISIBILITY SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-6">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Event Visibility
                    </h3>

                    <!-- Show Upcoming Events -->
                    <div class="tw:flex tw:flex-col tw:gap-2">
                        <p class="tw:text-sm tw:font-medium tw:text-gray-900">
                            Show Upcoming Events (max 1 year)
                        </p>
                        <!-- <p class="tw:text-xs tw:text-gray-500">
                            If YES, upcoming events within the next year will be visible.
                        </p> -->
                        <div class="tw:flex tw:gap-4 tw:mt-1">
                            <label class="tw:inline-flex tw:items-center tw:gap-2 tw:cursor-pointer">
                                <input
                                    type="radio"
                                    name="show-upcoming-events"
                                    :checked="showUpcomingEvents"
                                    @change="showUpcomingEvents = true"
                                    class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500"
                                />
                                <span class="tw:text-sm tw:text-gray-700">Yes</span>
                            </label>
                            <label class="tw:inline-flex tw:items-center tw:gap-2 tw:cursor-pointer">
                                <input
                                    type="radio"
                                    name="show-upcoming-events"
                                    :checked="!showUpcomingEvents"
                                    @change="showUpcomingEvents = false"
                                    class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500"
                                />
                                <span class="tw:text-sm tw:text-gray-700">No</span>
                            </label>
                        </div>
                    </div>

                    <!-- Show Past Events -->
                    <div class="tw:flex tw:flex-col tw:gap-2">
                        <p class="tw:text-sm tw:font-medium tw:text-gray-900">
                            Show Past Events (max 1 year)
                        </p>
                        <!-- <p class="tw:text-xs tw:text-gray-500">
                            If YES, past events within the last year will be visible.
                        </p> -->
                        <div class="tw:flex tw:gap-4 tw:mt-1">
                            <label class="tw:inline-flex tw:items-center tw:gap-2 tw:cursor-pointer">
                                <input
                                    type="radio"
                                    name="show-past-events"
                                    :checked="showPastEvents"
                                    @change="showPastEvents = true"
                                    class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500"
                                />
                                <span class="tw:text-sm tw:text-gray-700">Yes</span>
                            </label>
                            <label class="tw:inline-flex tw:items-center tw:gap-2 tw:cursor-pointer">
                                <input
                                    type="radio"
                                    name="show-past-events"
                                    :checked="!showPastEvents"
                                    @change="showPastEvents = false"
                                    class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500"
                                />
                                <span class="tw:text-sm tw:text-gray-700">No</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- SAVE / UPDATE EVENT BUTTONS -->
                <div class="tw:w-full tw:pt-4">
                    <div class="tw:flex tw:w-full tw:items-center tw:justify-between">
                        <button class="tw:px-6 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md 
                           tw:border tw:border-orange-500 tw:text-[#0061FF]
                           tw:bg-white hover:tw:bg-orange-50 tw:transition-all">
                            Buy Tickets
                        </button>
                        <div class="tw:flex tw:gap-2">
                            <button v-if="isEditMode" @click="cancelEdit" type="button"
                                class="tw:px-6 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md 
                                   tw:border tw:border-gray-300 tw:text-gray-700
                                   tw:bg-white hover:tw:bg-gray-50 tw:transition-all">
                                Cancel
                            </button>
                            <button @click="handleSubmit" :disabled="isSubmitting" class="tw:px-6 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md 
                               tw:border tw:border-blue-500 tw:text-blue-600
                               tw:bg-white hover:tw:bg-blue-50 tw:transition-all
                               disabled:tw:opacity-50 disabled:tw:cursor-not-allowed">
                                {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update' : 'Save Event') }}
                            </button>
                        </div>
                    </div>
                    <span class="tw:text-red-500 tw:text-sm tw:mt-2 tw:block">Soon available</span>
                </div>

            </div>
        </div>

        <!-- Description Expand Modal -->
        <Teleport to="body">
            <Transition name="modal-fade">
                <div v-if="showDescriptionExpandModal"
                    class="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center tw:p-4">
                    <div class="tw:absolute tw:inset-0 tw:bg-black/50 tw:backdrop-blur-sm"
                        @click="showDescriptionExpandModal = false"></div>
                    <div
                        class="tw:relative tw:w-full tw:max-w-3xl tw:max-h-[85vh] tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:overflow-hidden tw:flex tw:flex-col">
                        <div class="tw:flex tw:items-center tw:justify-between tw:px-5 tw:py-4 tw:border-b tw:border-gray-200">
                            <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900">Description</h3>
                            <button type="button"
                                class="tw:p-2 tw:rounded-lg tw:text-gray-500 hover:tw:text-gray-700 hover:tw:bg-gray-100 tw:transition-colors"
                                @click="showDescriptionExpandModal = false">
                                <X class="tw:w-5 tw:h-5" />
                            </button>
                        </div>
                        <div class="tw:flex-1 tw:overflow-hidden tw:p-5">
                            <textarea v-model="eventDescription" rows="16"
                                class="tw:w-full tw:h-full tw:min-h-[300px] tw:bg-gray-50 tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:resize-none tw:overflow-y-auto"
                                placeholder="Describe Your Event..."></textarea>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
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
    Maximize2,
    X
} from "lucide-vue-next"

import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import InviteSection from "@/components/invite/InviteSection.vue"
import AdditionalImageUpload from "@/components/common/AdditionalImageUpload.vue"
import api from "@/services/api"
import eventService from "@/services/eventService"
import { useAuthStore } from "@/stores/auth"
import { useMyEventStore } from "@/stores/myEventStore"
import { useChatStore } from "@/stores/chatStore"
import { useToast } from "@/composables/useToast"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.css"

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
const myEvtStore = useMyEventStore()
const chatStore = useChatStore()

// Edit mode state
const isEditMode = ref(false)
const editingEventId = ref(null)
const eventType = ref('premium')

function handleChatboxClick() {
    if (authStore.user?.account_type !== 'premium') {
        toast.warning('Chat is available only for premium users.')
        return
    }
    chatStore.open()
}

// Event data
const eventTitle = ref("")
const eventDate = ref("")
const endDate = ref("")
const eventStatus = ref("Draft")

const activeTab = ref("home")
const isSubmitting = ref(false)
const eventDescription = ref("")
const showDescriptionExpandModal = ref(false)

const selectedImageFile = ref(null)
const imagePreview = ref(null)
const pastDateError = ref(false)
const latitude = ref(null)
const longitude = ref(null)

const conditionEntranceFee = ref("")
const conditionDressCode = ref("")
const conditionAgeLimit = ref("")

// Server-side validation errors from API
const fieldErrors = ref({})

// Form validation state
const errors = ref({
    eventTitle: false,
    eventImage: false,
    description: false,
    category: false,
    subcategories: false,
    eventDate: false,
    address: false,
    dressCode: false,
    ageLimit: false,
    entranceStatus: false,
    contactPhone: false,
    contactEmail: false,
})

const allUsers = ref([])
const isLoadingUsers = ref(false)

// Clear individual field error
function clearFieldError(fieldName) {
    if (errors.value.hasOwnProperty(fieldName)) {
        errors.value[fieldName] = false
    }

    if (fieldName === 'category') {
        categoryError.value = false
    }
    if (fieldName === 'subcategories') {
        subcategoryError.value = false
    }
}

const additionalImages = ref([])
const selectedVenue = ref("")
const fileName = ref("")
const selectedGenre = ref("")
// Overview (clean UX modes)
// dressCode: 'none' | 'required'
// ageLimit: 'none' | 'restricted'
// entranceStatus: 'open' | 'restricted'
const dressCode = ref("")
const ageLimit = ref("")
// const entranceFee = ref("")
const entranceStatus = ref("")
const customDressCode = ref("")
const customAgeLimit = ref("")
const customEntranceFee = ref("")
const contactPhone = ref("")
const contactEmail = ref("")
const contactWebsite = ref("")
const bookingInstructions = ref('');
const ticketUrl = ref('');

// Event options
const isRecurring = ref(false)
const isCopyEvent = ref(false)
const showUpcomingEvents = ref("")
const showPastEvents = ref("")
const showChatbox = ref(false)
const contactBoxMessage = ref('')
const venueDetailsText = ref('')

const notifications = ref({
    receiveEmail: false,
    receiveUpdates: false
})

const facebookUrl = ref("")
const instagramUrl = ref("")
const tiktokUrl = ref("")

// Event Date and Time
// const startTime = ref("")
// const endTime = ref("")
const dateInput = ref(null)
const endDateInput = ref(null)
// ── Time split refs ──────────────────────────────────────────────────
const startHH = ref("")
const startMM = ref("")
const endHH = ref("")
const endMM = ref("")
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
    // ensure round-trip (catches 2026-02-31 etc)
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
    const isHour = field === "startHH" || field === "endHH"
    const max = isHour ? 23 : 59
    const nextVal = isEmpty ? "" : String(clamp(isNaN(asNumber) ? 0 : asNumber, 0, max))

    if (field === "startHH") { startHH.value = nextVal; hasStartError.value = false }
    if (field === "startMM") { startMM.value = nextVal; hasStartError.value = false }
    if (field === "endHH") { endHH.value = nextVal; hasEndError.value = false }
    if (field === "endMM") { endMM.value = nextVal; hasEndError.value = false }

    if (!endDate.value && eventDate.value) endDate.value = eventDate.value
    validateEndAfterStartDateTime()
}

// const {
//     startError,
//     endError,
//     // hasStartError,
//     // hasEndError,
//     validateTimeRange,
//     clearStartError,
//     clearEndError,
//     applyServerErrors: applyTimeServerErrors,
// } = useTimeRangeValidation(startTime, endTime)

// Event Location refs
const searchAddress = ref("")
const selectedAddress = ref("")
const map = ref(null)
const marker = ref(null)
const suggestions = ref([])
const isLoading = ref(false)
const debounceTimer = ref(null)
const selectedCategory = ref("")

// Genre state
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

const talentUsers = computed(() =>
    allUsers.value.filter((u) => u.profile_type?.toLowerCase() === 'talent')
)
const organiserUsers = computed(() =>
    allUsers.value.filter((u) => u.profile_type?.toLowerCase() === 'organizer')
)
const venueUsers = computed(() =>
    allUsers.value.filter((u) => u.profile_type?.toLowerCase() === 'venue')
)

// Invite section selected IDs (optional - passed to API when user selects)
const invitedTalentIds = ref([])
const invitedOrganiserIds = ref([])
const invitedVenueIds = ref([])

const menuItems = [
    { id: "home", icon: Home, label: "Home", route: "/create-event-premium" },
    { id: "details", icon: FileText, label: "Details", route: "/create-event-premium" },
    { id: "analytics", icon: BarChart3, route: "/create-event-premium/report", label: "Analytics" },
    { id: "settings", icon: Settings, route: "/create-event-premium/settings", label: "Settings" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "back", icon: SkipBackIcon, label: "Back" },
    { id: "chatbox", icon: MessageSquareText, label: "Chatbox" },
]

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
    if (!selectedSubcategories.value.includes(subcategory) && selectedSubcategories.value.length >= 6) {
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
    // Also handle the old genre dropdown
    if (
        genreDropdownRef.value &&
        !genreDropdownRef.value.contains(event.target)
    ) {
        showGenreDropdown.value = false
    }
}

// Handle subcategory change with max 5 validation
function handleSubcategoryChange() {
    subcategoryError.value = false

    // Clear field errors
    clearFieldError('subcategories')

    // Maximum 5 subcategories selection logic
    // Prevent selection if trying to add more than 5 items
    if (selectedSubcategories.value.length > 6) {
        // Remove the last added item to maintain the limit
        const lastItem = selectedSubcategories.value[selectedSubcategories.value.length - 1]
        selectedSubcategories.value = selectedSubcategories.value.slice(0, 6)

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

function toggleDropdown() {
    showGenreDropdown.value = !showGenreDropdown.value
}

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside)
})

// Image handling
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

// Past date validation
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

// Scroll to first invalid field
async function scrollToFirstError() {
    await nextTick()

    // Find first field with error
    const errorFields = ['eventTitle', 'eventImage', 'description', 'category', 'subcategories', 'eventDate', 'address', 'dressCode', 'ageLimit', 'entranceStatus']
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
            case 'description':
                element = document.querySelector('textarea[placeholder="Describe Your Event..."]')
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
                element = document.querySelectorAll('select')[1]
                break
            case 'ageLimit':
                element = document.querySelectorAll('select')[2]
                break
            case 'entranceStatus':
                element = document.querySelectorAll('select')[3]
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

    // Validate each field (image not required when updating)
    errors.value.eventTitle = !eventTitle.value.trim()
    errors.value.eventImage = !isEditMode.value && !selectedImageFile.value
    errors.value.description = !eventDescription.value.trim()
    errors.value.category = !selectedCategory.value
    errors.value.subcategories = selectedSubcategories.value.length === 0
    errors.value.eventDate = !eventDate.value
    hasEndDateError.value = !endDate.value
    errors.value.address = !selectedAddress.value
    errors.value.dressCode = !dressCode.value || (dressCode.value === 'required' && !customDressCode.value?.trim())
    errors.value.ageLimit = !ageLimit.value || (ageLimit.value === 'restricted' && !customAgeLimit.value?.trim())
    errors.value.entranceStatus = !entranceStatus.value || (entranceStatus.value === 'restricted' && !customEntranceFee.value?.trim())
    // Contact details are optional for premium users

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
    const hasOtherErrors = Object.values(errors.value).some(error => error) ||
        categoryError.value ||
        subcategoryError.value ||
        pastDateError.value

    return !hasOtherErrors && !hasEndDateError.value && timeValid
}

// Submit handler function
async function handleSubmit() {
    if (isSubmitting.value) return
    const isValid = validateForm()
    if (!isValid) {
        await scrollToFirstError()
        return
    }
    if (isEditMode.value) {
        await updateEvent()
    } else {
        await createEvent()
    }
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
        formData.append('event_type', 'premium')
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
        // Overview fields (backwards-compatible keys)
        formData.append('dress_code', dressCode.value === 'none' ? 'no_dress_code' : (customDressCode.value || ''))
        formData.append('age_limit', ageLimit.value === 'none' ? 'no_age_limit' : (customAgeLimit.value || ''))
        // formData.append('entrance_fee', entranceFee.value)
        formData.append('entrance_status', entranceStatus.value === 'open' ? 'open_to_all' : (customEntranceFee.value || ''))
        formData.append('contact_phone', contactPhone.value)
        formData.append('contact_email', contactEmail.value)
        formData.append('description', eventDescription.value)

        // Optional fields
        if (contactWebsite.value) formData.append('contact_website', contactWebsite.value)
        if (contactBoxMessage.value) formData.append('contact_box_message', contactBoxMessage.value)
        if (venueDetailsText.value) formData.append('venue_details', venueDetailsText.value)
        if (facebookUrl.value) formData.append('facebook_url', facebookUrl.value)
        if (instagramUrl.value) formData.append('instagram_url', instagramUrl.value)
        if (tiktokUrl.value) formData.append('tiktok_url', tiktokUrl.value)
        if (ticketUrl.value) formData.append('ticket_url', ticketUrl.value)
        if (bookingInstructions.value) formData.append('booking_instructions', bookingInstructions.value)
        // Backend boolean flags
        formData.append('is_recurring', isRecurring.value ? '1' : '0')
        formData.append('is_copy_event', isCopyEvent.value ? '1' : '0')
        formData.append('show_upcoming_events', showUpcomingEvents.value ? '1' : '0')
        formData.append('show_past_events', showPastEvents.value ? '1' : '0')
        if (conditionEntranceFee.value) formData.append('condition_entrance_fee', conditionEntranceFee.value)
        if (conditionDressCode.value) formData.append('condition_dress_code', conditionDressCode.value)
        if (conditionAgeLimit.value) formData.append('condition_age_limit', conditionAgeLimit.value)

        // Invite section IDs (optional - pass when user has selected)
        invitedTalentIds.value.forEach(id => formData.append('invited_talents[]', id))
        invitedOrganiserIds.value.forEach(id => formData.append('invited_organisers[]', id))
        invitedVenueIds.value.forEach(id => formData.append('invited_venues[]', id))

        // Add image file if exists
        if (selectedImageFile.value) {
            formData.append('image', selectedImageFile.value)
        }

        // Add additional images
        if (additionalImages.value && additionalImages.value.length > 0) {
            additionalImages.value.forEach((file, index) => {
                formData.append(`additional_images[${index}]`, file)
            })
        }

        // Submit to API v2 using eventService
        const response = await eventService.createEvent(formData)

        if (response.success) {
            toast.success('Event created successfully!')
            resetForm()
        } else {
            // Handle API validation errors
            if (response.errors) {
                fieldErrors.value = response.errors
                toast.error(response.message || 'Please correct the errors in the form.')
                await scrollToFirstError()
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
            await scrollToFirstError()
        } else if (error.response?.data?.message) {
            toast.error(error.response.data.message)
        } else {
            toast.error('An error occurred while creating the event. Please try again.')
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

    latitude.value = parseFloat(lat)
    longitude.value = parseFloat(lon)

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
// Update or add marker
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

async function fetchUsers() {
    try {
        isLoadingUsers.value = true
        const response = await api.get('/v2/users')
        const data = response.data?.data ?? response.data ?? []
        allUsers.value = Array.isArray(data) ? data.map(normalizeUser) : []
        console.log('Fetched users:', allUsers.value)
    } catch (error) {
        console.error('Error fetching users:', error)
        allUsers.value = []
    } finally {
        isLoadingUsers.value = false
    }
}

function normalizeUser(u) {
    return {
        id: u.id,
        name: u.name ?? u.username ?? '',
        profile_type: u.profile_type ?? 'talent',
        account_type: u.account_type ?? 'free',
        country: u.country ?? '',
    }
}

// Initialize map on component mount
onMounted(() => {
    fetchUsers()
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

        latitude.value = lat
        longitude.value = lng

        updateMarker(lng, lat)
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

async function clickEvent(eventId) {
    await loadEvent(eventId)
}

async function loadEvent(id) {
    try {
        if (!categories.value.length) {
            await fetchCategories()
        }
        const response = await eventService.getEventById(id)
        if (!response.success || !response.data) {
            toast.error(response.message || 'Failed to load event.')
            return
        }
        const d = response.data

        eventTitle.value = d.title ?? ''
        eventType.value = d.event_type ?? 'premium'
        eventDescription.value = d.description ?? ''
        eventDate.value = d.event_date ?? ''
        endDate.value = d.end_date ?? d.event_date ?? ''
        selectedAddress.value = d.address ?? ''
        searchAddress.value = d.address ?? ''

        // Overview hydration (backwards-compatible with whatever backend stored)
        const dc = (d.dress_code ?? '').toString()
        if (!dc || dc === 'no_dress_code') {
            dressCode.value = 'none'
            customDressCode.value = ''
        } else {
            dressCode.value = 'required'
            customDressCode.value = dc
        }

        const al = (d.age_limit ?? '').toString()
        if (!al || al === 'no_age_limit' || al === 'all_ages') {
            ageLimit.value = 'none'
            customAgeLimit.value = ''
        } else {
            ageLimit.value = 'restricted'
            customAgeLimit.value = al
        }

        const es = (d.entrance_status ?? '').toString()
        if (!es || es === 'open_to_all') {
            entranceStatus.value = 'open'
            customEntranceFee.value = ''
        } else {
            entranceStatus.value = 'restricted'
            customEntranceFee.value = es
        }

        const startFrom = d.start_datetime ? String(d.start_datetime) : null
        const endFrom = d.end_datetime ? String(d.end_datetime) : null

        if (startFrom && startFrom.includes('T')) {
            const [sd, st] = startFrom.split('T')
            eventDate.value = sd ?? eventDate.value
            const parts = (st ?? '').split(':')
            const sh = parts[0] ?? ''
            const sm = parts[1] ?? ''
            startHH.value = String(sh).padStart(2, '0').slice(0, 2)
            startMM.value = String(sm).padStart(2, '0').slice(0, 2)
        } else if (d.start_time) {
            const parts = d.start_time.toString().split(':')
            const sh = parts[0] ?? ''
            const sm = parts[1] ?? ''
            startHH.value = String(sh).padStart(2, '0').slice(0, 2)
            startMM.value = String(sm).padStart(2, '0').slice(0, 2)
        } else {
            startHH.value = ''
            startMM.value = ''
        }

        if (endFrom && endFrom.includes('T')) {
            const [ed, et] = endFrom.split('T')
            endDate.value = ed ?? endDate.value
            const parts = (et ?? '').split(':')
            const eh = parts[0] ?? ''
            const em = parts[1] ?? ''
            endHH.value = String(eh).padStart(2, '0').slice(0, 2)
            endMM.value = String(em).padStart(2, '0').slice(0, 2)
        } else if (d.end_time) {
            const parts = d.end_time.toString().split(':')
            const eh = parts[0] ?? ''
            const em = parts[1] ?? ''
            endHH.value = String(eh).padStart(2, '0').slice(0, 2)
            endMM.value = String(em).padStart(2, '0').slice(0, 2)
        } else {
            endHH.value = ''
            endMM.value = ''
        }

        if (!endDate.value && eventDate.value) endDate.value = eventDate.value
        validateEndAfterStartDateTime()

        if (categories.value.length && d.category_id) {
            const cat = categories.value.find(c => c.id === d.category_id)
            selectedCategory.value = cat ? cat.name : ''
            if (cat && Array.isArray(d.subcategory_ids)) {
                selectedSubcategories.value = d.subcategory_ids
                    .map(sid => cat.subcategories.find(s => s.id === sid)?.name)
                    .filter(Boolean)
            } else {
                selectedSubcategories.value = []
            }
        } else {
            selectedCategory.value = ''
            selectedSubcategories.value = []
        }

        // Event options / visibility (with sensible defaults)
        isRecurring.value = !!d.is_recurring
        isCopyEvent.value = !!d.is_copy_event
        showUpcomingEvents.value = d.show_upcoming_events !== undefined
            ? !!d.show_upcoming_events
            : true
        showPastEvents.value = d.show_past_events !== undefined
            ? !!d.show_past_events
            : false

        if (d.image_url) {
            imagePreview.value = d.image_url
        } else {
            imagePreview.value = null
        }
        selectedImageFile.value = null
        fileName.value = d.image_url ? 'Current image' : 'No File Chosen'

        fieldErrors.value = {}
        isEditMode.value = true
        editingEventId.value = d.id
    } catch (error) {
        console.error('Error loading event:', error)
        toast.error(error.response?.data?.message || 'Failed to load event.')
    }
}

function cancelEdit() {
    isEditMode.value = false
    editingEventId.value = null
    resetForm()
}

function resetForm() {
    eventTitle.value = ''
    eventDescription.value = ''
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
    eventType.value = 'premium'
    imagePreview.value = null
    selectedImageFile.value = null
    fileName.value = ''
    fieldErrors.value = {}
    errors.value.eventTitle = false
    errors.value.description = false
    errors.value.eventImage = false
    errors.value.category = false
    errors.value.subcategories = false
    errors.value.eventDate = false
    errors.value.address = false
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
    ageLimit.value = ''
    entranceStatus.value = ''
    customDressCode.value = ''
    customAgeLimit.value = ''
    customEntranceFee.value = ''
    contactPhone.value = ''
    contactEmail.value = ''
    contactWebsite.value = ''
    contactBoxMessage.value = ''
    venueDetailsText.value = ''
    facebookUrl.value = ''
    instagramUrl.value = ''
    tiktokUrl.value = ''
    ticketUrl.value = ''
    bookingInstructions.value = ''
    isRecurring.value = false
    isCopyEvent.value = false
    showUpcomingEvents.value = true
    showPastEvents.value = false
    conditionEntranceFee.value = ''
    conditionDressCode.value = ''
    conditionAgeLimit.value = ''
    invitedTalentIds.value = []
    invitedOrganiserIds.value = []
    invitedVenueIds.value = []
    additionalImages.value = []
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = ''
    document.querySelectorAll('input[type="file"]').forEach(el => { el.value = '' })
}

async function updateEvent() {
    if (isSubmitting.value || !editingEventId.value) return
    if (!validateForm()) {
        await scrollToFirstError()
        return
    }
    try {
        isSubmitting.value = true
        fieldErrors.value = {}

        const selectedCategoryData = categories.value.find(cat => cat.name === selectedCategory.value)
        const categoryId = selectedCategoryData ? selectedCategoryData.id : null
        const selectedSubcategoryData = selectedCategoryData
            ? selectedCategoryData.subcategories.filter(sub => selectedSubcategories.value.includes(sub.name))
            : []
        const subcategoryIds = selectedSubcategoryData.map(sub => sub.id)

        const payload = {
            title: eventTitle.value,
            event_type: eventType.value,
            category_id: categoryId,
            subcategory_ids: subcategoryIds,
            event_date: eventDate.value,
            start_time: startTime.value,
            end_time: endTime.value,
            end_date: endDate.value,
            start_datetime: buildLocalIso(eventDate.value, startTime.value),
            end_datetime: buildLocalIso(endDate.value, endTime.value),
            address: selectedAddress.value,
            dress_code: dressCode.value === 'none' ? 'no_dress_code' : (customDressCode.value || ''),
            age_limit: ageLimit.value === 'none' ? 'no_age_limit' : (customAgeLimit.value || ''),
            entrance_status: entranceStatus.value === 'open' ? 'open_to_all' : (customEntranceFee.value || ''),
            description: eventDescription.value,
            is_recurring: isRecurring.value,
            is_copy_event: isCopyEvent.value,
            show_upcoming_events: showUpcomingEvents.value,
            show_past_events: showPastEvents.value
        }

        const response = await eventService.updateEventById(editingEventId.value, payload)

        if (response.success) {
            toast.success('Event updated successfully.')
            isEditMode.value = false
            editingEventId.value = null
        } else {
            if (response.errors) {
                fieldErrors.value = response.errors
                toast.error(response.message || 'Please correct the errors in the form.')
                await scrollToFirstError()
            } else {
                toast.error(response.message || 'Failed to update event.')
            }
        }
    } catch (error) {
        console.error('Error updating event:', error)
        if (error.response?.data?.errors) {
            fieldErrors.value = error.response.data.errors
            toast.error(error.response?.data?.message || 'Please correct the errors in the form.')
            await scrollToFirstError()
        } else {
            toast.error(error.response?.data?.message || 'Failed to update event.')
        }
    } finally {
        isSubmitting.value = false
    }
}

async function handleEventSelected(eventId) {
    await clickEvent(eventId)
}

function handleBack() {
    router.push('/') // Navigate to events list
}
</script>