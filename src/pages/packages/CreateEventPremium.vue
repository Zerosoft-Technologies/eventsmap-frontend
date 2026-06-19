<template>
    <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6">
        <div class="tw:w-full tw:max-w-7xl tw:min-w-0 tw:flex tw:flex-col tw:md:flex-row tw:md:items-stretch tw:gap-4 tw:md:gap-6">
            <!-- Mobile Header -->
            <div class="tw:md:hidden tw:flex tw:items-center tw:justify-between tw:bg-white tw:rounded-xl tw:shadow-sm tw:px-4 tw:py-3">
                <button type="button" @click="handleBack" class="tw:text-sm tw:font-medium tw:text-[#0061FF]">
                    Event Map
                </button>
                <button type="button" @click="toggleMobileSidebar" aria-label="Open menu" class="tw:text-2xl tw:leading-none tw:text-gray-700">
                    ☰
                </button>
            </div>

            <!-- Mobile Sidebar Drawer -->
            <div v-if="mobileSidebarOpen" class="tw:md:hidden tw:fixed tw:inset-0 tw:z-50">
                <div class="tw:absolute tw:inset-0 tw:bg-black/30" @click="closeMobileSidebar"></div>
                <div class="tw:absolute tw:left-0 tw:top-0 tw:h-screen tw:max-w-[92vw] tw:w-full tw:p-2">
                    <EventSidebar :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected"
                        @chatbox-click="handleChatboxClick" @menu-click="closeMobileSidebar" />
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
            <div class="tw:hidden tw:shrink-0 tw:md:block">
                <EventSidebar :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected"
                    @chatbox-click="handleChatboxClick" />
            </div>

            <!-- ================= RIGHT CARD ================= -->
            <div class="tw:min-w-0 tw:flex-1 tw:max-w-full tw:overflow-x-hidden tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4 tw:md:space-y-6">

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
                    <p v-if="fieldErrors.title" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ fieldErrors.title[0] }}
                    </p>
                    <!-- Description -->
                    <div class="tw:space-y-2">
                        <div class="tw:flex tw:justify-between tw:items-center">
                            <label class="tw:text-sm tw:text-gray-700">Description <span
                                    class="tw:text-red-500">*</span></label>
                            <!-- <button type="button"
                                class="tw:inline-flex tw:items-center tw:gap-1.5 tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:text-blue-600 hover:tw:text-blue-700 hover:tw:bg-blue-50 tw:rounded-lg tw:transition-colors"
                                @click="showDescriptionExpandModal = true" title="Expand to read full description">
                                <Maximize2 class="tw:w-4 tw:h-4" />
                                Expand
                            </button> -->
                        </div>
                        <textarea v-model="eventDescription" rows="4" placeholder="Describe Your Event..."
                            @input="clearFieldError('description')" :class="[
                                'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-base tw:md:text-[16px] tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-y tw:min-h-[100px]',
                                (errors.description || fieldErrors.description) ? 'tw:border-red-500' : 'tw:border-gray-200'
                            ]"></textarea>
                        <p v-if="errors.description" class="tw:text-red-500 tw:text-sm tw:mt-1">Description is required
                        </p>
                        <p v-if="fieldErrors.description" class="tw:text-red-500 tw:text-sm tw:mt-1">{{
                            fieldErrors.description[0] }}</p>
                    </div>
                </div>

                <!-- EVENT IMAGE SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">

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
                    <div
                        ref="mainImagePickerRef"
                        @click="handleMainImageClick"
                        class="tw:flex tw:items-center tw:w-full tw:max-w-full tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:overflow-hidden tw:bg-white tw:cursor-pointer hover:tw:bg-gray-50">

                        <!-- Choose File -->
                        <span
                            class="tw:px-4 tw:py-2 tw:bg-[#F6F1E7] tw:text-sm tw:text-gray-700 tw:border-r tw:border-[#E8E1D5]">
                            Choose from Media
                        </span>

                        <!-- Selected file info -->
                        <span class="tw:px-4 tw:py-2 tw:text-sm tw:text-gray-500 tw:flex-1">
                            {{ mainImage ? mainImage.file_name : 'No Image Selected' }}
                        </span>

                        <svg class="tw:w-5 tw:h-5 tw:mr-2 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>

                    <!-- Image Preview -->
                    <div v-if="mainImage" class="tw:relative tw:mt-4 tw:w-full">
                        <img :src="mainImage.image_url" alt="Event image preview"
                            class="tw:w-full tw:h-[50vh] tw:rounded-lg tw:border tw:border-gray-200" />
                        <button @click="removeMainImage" type="button"
                            class="tw:absolute tw:top-2 tw:right-2 tw:w-6 tw:h-6 tw:bg-(--secondary-color) tw:text-white tw:rounded-full tw:flex tw:items-center tw:justify-center hover:tw:bg-(--secondary-color) tw:transition-colors">
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

                    <div class="tw:pt-4 tw:border-t tw:border-gray-100 tw:mt-4">
                        <MapPhotoMarkerToggle v-model="showPhotoMapMarker" input-name="event-show-photo-map-marker" />
                    </div>
                </div>

                <!-- ADDITIONAL IMAGES SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                            Additional Images (Max. 5 Images) <span class="tw:text-xs tw:text-gray-500"> Recommended
                                (1200x800) </span>
                        </h3>
                    </div>

                    <!-- Upload Area -->
                    <div
                        @click="handleAdditionalImagesClick"
                        class="tw:border-2 tw:border-dashed tw:border-gray-300 tw:rounded-xl tw:p-6 tw:text-center tw:cursor-pointer hover:tw:border-blue-400 tw:bg-gray-50 tw:transition-all tw:duration-200">
                        
                        <div class="tw:flex tw:flex-col tw:items-center tw:gap-2">
                            <div class="tw:w-12 tw:h-12 tw:rounded-full tw:bg-blue-100 tw:flex tw:items-center tw:justify-center">
                                <svg class="tw:w-6 tw:h-6 tw:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p class="tw:text-sm tw:font-medium tw:text-gray-700">Choose from Media Library</p>
                            <p class="tw:text-xs tw:text-gray-500">Select up to 5 additional images</p>
                        </div>
                    </div>

                    <!-- Selected Images Preview -->
                    <div v-if="resolvedAdditionalImages.length > 0" class="tw:space-y-4">
                        <!-- Image Count -->
                        <div class="tw:flex tw:items-center tw:justify-between">
                            <span class="tw:text-sm tw:text-gray-600">
                                {{ resolvedAdditionalImages.length }} / 5 images selected
                            </span>
                            <button
                                @click="clearAllAdditionalImages"
                                type="button"
                                class="tw:text-sm tw:text-red-500 hover:tw:text-red-700 tw:transition-colors"
                            >
                                Clear All
                            </button>
                        </div>

                        <!-- Images Grid -->
                        <div class="tw:grid tw:grid-cols-2 md:tw:grid-cols-3 lg:tw:grid-cols-5 tw:gap-4">
                            <div v-for="(image, index) in resolvedAdditionalImages" :key="`additional-${index}-${image.image_id}`" 
                                class="tw:relative tw:group">
                                <img :src="image.image_url" :alt="image.file_name"
                                    class="tw:w-full tw:h-32 tw:object-cover tw:rounded-lg tw:border tw:border-gray-200" />
                                
                                <!-- Remove Button -->
                                <button @click="removeAdditionalImage(index)" type="button"
                                    class="tw:absolute tw:top-2 tw:right-2 tw:w-6 tw:h-6 tw:bg-red-500 tw:text-white tw:rounded-full tw:flex tw:items-center tw:justify-center tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity">
                                    <svg class="tw:w-4 tw:h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
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
                                Subcategories (Max 5) <span class="tw:text-red-500">*</span>
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
                                                'disabled': !selectedSubcategories.includes(subcategory) && selectedSubcategories.length >= 5
                                            }" @click="toggleSubcategory(subcategory)">
                                            <input type="checkbox" :id="`subcategory-${subcategory}`"
                                                :value="subcategory" v-model="selectedSubcategories"
                                                :disabled="!selectedSubcategories.includes(subcategory) && selectedSubcategories.length >= 5"
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

                <!-- EVENT DATE & TIME SECTION (same 3-column layout as Event Free) -->
                <div class="tw:bg-white tw:rounded-xl tw:border tw:border-gray-200 tw:p-4 tw:md:p-6">

                    <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
                        Event Date & Time <span class="tw:text-red-500">*</span>
                    </h3>

                    <div class="tw:space-y-4">
                        <div
                            v-if="showOvernightEventCallout"
                            class="tw:rounded-xl tw:border tw:border-indigo-200/90 tw:bg-gradient-to-br tw:from-indigo-50 tw:to-violet-50/80 tw:px-3 tw:py-3 tw:shadow-sm"
                            role="status"
                            aria-live="polite"
                        >
                            <div class="tw:flex tw:gap-3 tw:items-start">
                                <div
                                    class="tw:flex tw:h-9 tw:w-9 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:bg-indigo-100 tw:text-indigo-700"
                                    aria-hidden="true"
                                >
                                    <Moon class="tw:h-5 tw:w-5" :stroke-width="2" />
                                </div>
                                <div class="tw:min-w-0 tw:space-y-1.5">
                                    <p class="tw:text-sm tw:font-semibold tw:text-indigo-950 tw:tracking-tight">
                                        Overnight event
                                    </p>
                                    <p class="tw:text-sm tw:text-gray-700 tw:leading-snug">
                                        Times cross midnight, so this runs into the
                                        <span class="tw:font-medium tw:text-gray-900">next calendar day</span>.
                                        It starts
                                        <span class="tw:whitespace-nowrap tw:font-medium tw:text-gray-900">{{ eventDate }} · {{ startTime }}</span>
                                        and ends
                                        <span class="tw:whitespace-nowrap tw:font-medium tw:text-gray-900">{{ endDate }} · {{ endTime }}</span>.
                                    </p>
                                    <p class="tw:text-xs tw:font-medium tw:text-indigo-900/80">
                                        Maximum duration: 24 hours (inclusive).
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-3 tw:gap-4">
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
                                            'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-base tw:md:text-[16px] tw:text-gray-700 tw:placeholder-[#666666] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500',
                                            (errors.eventDate || startDateFormatError || fieldErrors.start_date) ? 'tw:border-red-500' : 'tw:border-gray-200'
                                        ]"
                                        @input="onPremiumEventDateInput"
                                    />
                                    <Calendar class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                                </div>
                                <p v-if="errors.eventDate" class="tw:text-red-500 tw:text-sm">Start date is required</p>
                                <p v-else-if="startDateFormatError" class="tw:text-red-500 tw:text-sm">{{ startDateFormatError }}</p>
                                <p v-else-if="fieldErrors.start_date" class="tw:text-red-500 tw:text-sm">{{ fieldErrors.start_date[0] }}</p>
                                <p v-if="pastDateError" class="tw:text-red-500 tw:text-sm">Cannot select a past date</p>
                            </div>

                            <div class="tw:space-y-2">
                                <label class="tw:block tw:text-sm tw:text-gray-600">
                                    Event Start Time <span class="tw:text-red-500">*</span>
                                </label>
                                <input
                                    v-model="startTimePicker"
                                    type="time"
                                    step="60"
                                    :class="[
                                        'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:rounded-lg tw:px-4 tw:py-2.5 tw:text-base tw:md:text-[16px] tw:text-gray-700 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500',
                                        hasStartError ? 'tw:border-red-500' : 'tw:border-gray-200'
                                    ]"
                                />
                                <p v-if="hasStartError" class="tw:text-red-500 tw:text-sm">Start time is required</p>
                            </div>

                            <div class="tw:space-y-2">
                                <label class="tw:block tw:text-sm tw:text-gray-600">
                                    Event End Time <span class="tw:text-red-500">*</span>
                                </label>
                                <input
                                    v-model="endTimePicker"
                                    type="time"
                                    step="60"
                                    :class="[
                                        'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:rounded-lg tw:px-4 tw:py-2.5 tw:text-base tw:md:text-[16px] tw:text-gray-700 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500',
                                        (hasEndError || datetimeRangeError) ? 'tw:border-red-500' : 'tw:border-gray-200'
                                    ]"
                                />
                                <p v-if="hasEndError" class="tw:text-red-500 tw:text-sm">End time is required</p>
                                <p v-if="datetimeRangeError" class="tw:text-red-500 tw:text-sm">{{ datetimeRangeError }}</p>
                                <p class="tw:text-xs tw:text-gray-500">
                                    <!-- <template v-if="showOvernightEventCallout">Format: HH:mm (24-hour).</template> -->
                                    <!-- Format: HH:mm (24-hour). If the end clock time is earlier than the start time, the end is counted as the
                                    <span class="tw:font-medium tw:text-gray-600">next day</span> (max. 24 hours total). -->
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- EVENT LOCATION SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">
                    <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
                        Event Location <span class="tw:text-red-500">*</span>
                    </h3>

                    <div class="tw:space-y-2 tw:mb-4">
                        <label class="tw:block tw:text-sm tw:text-gray-600" for="event-venue-name-premium">
                            Venue name
                        </label>
                        <input
                            id="event-venue-name-premium"
                            v-model="venueName"
                            type="text"
                            placeholder="e.g. name of the venue or location"
                            class="tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:px-4 tw:py-2.5 tw:text-base tw:md:text-[16px] tw:text-gray-700 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all"
                        />
                    </div>

                    <!-- Address Search Input with Loading Spinner -->
                    <div class="tw:relative tw:mb-4">
                        <input v-model="searchAddress" @input="onSearchInput" type="text"
                            placeholder="Search Address..."
                            class="tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-base tw:md:text-[16px] tw:text-gray-700 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

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
                            class="tw:absolute tw:top-full tw:left-0 tw:right-0 tw:mt-1 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-gray-200 tw:z-10 tw:max-h-60 tw:overflow-y-auto">
                            <button v-for="(suggestion, index) in suggestions" :key="index"
                                @click="selectSuggestion(suggestion)"
                                class="tw:w-full tw:px-4 tw:py-3 tw:text-left tw:text-sm tw:text-gray-700 hover:tw:bg-gray-50 tw:transition-colors tw:border-b tw:border-gray-100 last:tw:border-b-0">
                                {{ suggestion.display_name }}
                            </button>
                        </div>
                    </div>

                    <!-- Map Container -->
                    <div id="event-map" class="tw:w-full tw:h-[240px] tw:md:h-[300px] tw:rounded-lg tw:overflow-hidden tw:mb-4">
                    </div>

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
                        <!-- Dress Code (aligned with Free event profile) -->
                        <div class="tw:space-y-3">
                            <label class="tw:text-sm tw:font-medium tw:text-gray-700">
                                Dress Code <span class="tw:text-red-500">*</span>
                            </label>
                            <div class="tw:relative">
                                <select
                                    v-model="dressCode"
                                    @change="clearFieldError('dressCode'); if (dressCode === 'none' || dressCode === 'formal') dressCodeDescription = ''"
                                    :class="[
                                        'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-base tw:md:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                                        errors.dressCode ? 'tw:border-red-500' : 'tw:border-gray-200'
                                    ]"
                                >
                                    <option value="">Select</option>
                                    <option value="formal">Dress Code</option>
                                    <option value="none">No Dress Code</option>
                                    <option value="required">Other, Please specify</option>
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

                        <!-- Age Limit (Free options + Premium-only “Other, Please specify”) -->
                        <div class="tw:space-y-3">
                            <label class="tw:text-sm tw:font-medium tw:text-gray-700">
                                Age Limit <span class="tw:text-red-500">*</span>
                            </label>
                            <div class="tw:relative">
                                <select
                                    v-model="ageLimit"
                                    @change="clearFieldError('ageLimit'); if (ageLimit !== 'required') ageLimitDescription = ''"
                                    :class="[
                                        'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-base tw:md:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                                        errors.ageLimit ? 'tw:border-red-500' : 'tw:border-gray-200'
                                    ]"
                                >
                                    <option value="">Select age group</option>
                                    <option v-for="opt in AGE_GROUP_OPTIONS" :key="opt" :value="opt">{{ opt }}</option>
                                    <option value="required">Other, Please specify</option>
                                </select>
                                <ChevronDown class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
                            </div>
                            <div v-if="ageLimit === 'required'" class="tw:space-y-2">
                                <label class="tw:text-xs tw:font-medium tw:text-gray-600">Describe age limit</label>
                                <textarea
                                    v-model="ageLimitDescription"
                                    placeholder="e.g., 16+ with parent, no children under 10"
                                    rows="3"
                                    class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2 tw:text-sm tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-y tw:min-h-[84px]"
                                ></textarea>
                            </div>
                            <p v-if="errors.ageLimit" class="tw:text-red-500 tw:text-sm">Please choose an age group</p>
                        </div>

                        <!-- Entrance Status (Free options + Premium-only “Other, Please specify”) -->
                        <div class="tw:space-y-3">
                            <label class="tw:text-sm tw:font-medium tw:text-gray-700">
                                Entrance Status <span class="tw:text-red-500">*</span>
                            </label>
                            <div class="tw:relative">
                                <select
                                    v-model="entranceStatus"
                                    @change="clearFieldError('entranceStatus'); if (entranceStatus !== 'required') entranceStatusDescription = ''"
                                    :class="[
                                        'tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-base tw:md:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                                        errors.entranceStatus ? 'tw:border-red-500' : 'tw:border-gray-200'
                                    ]"
                                >
                                    <option value="">Select entrance status</option>
                                    <option v-for="opt in ENTRANCE_STATUS_OPTIONS" :key="opt" :value="opt">{{ opt }}</option>
                                    <option value="required">Other, Please specify</option>
                                </select>
                                <ChevronDown class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
                            </div>
                            <div v-if="entranceStatus === 'required'" class="tw:space-y-2">
                                <label class="tw:text-xs tw:font-medium tw:text-gray-600">Describe entrance status</label>
                                <textarea
                                    v-model="entranceStatusDescription"
                                    placeholder="e.g., members only, pre-registration required"
                                    rows="3"
                                    class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2 tw:text-sm tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-y tw:min-h-[84px]"
                                ></textarea>
                            </div>
                            <p v-if="errors.entranceStatus" class="tw:text-red-500 tw:text-sm">Please choose an entrance status</p>
                        </div>
                    </div>
                </div>

                <!-- CONTACT DETAILS SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Contact Details
                    </h3>

                    <div>
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Phone <span
                                class="tw:text-gray-400 tw:text-xs">(optional)</span></label>
                        <PhoneInput
                            v-model="contactPhone"
                            placeholder="Telephone Number"
                            input-class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-orange-500 focus:tw:border-transparent tw:transition-all"
                            @blur="clearFieldError('contactPhone')"
                        />
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

                    <div>
                        <input
                            v-model="contactWebsite"
                            type="url"
                            inputmode="url"
                            placeholder="https://example.com"
                            data-field="contact_website"
                            @input="clearFieldError('contact_website')"
                            @blur="normalizeUrlField(contactWebsite)"
                            :class="urlInputClass('contact_website')"
                        />
                        <p v-if="fieldErrors.contact_website" class="tw:text-red-500 tw:text-sm tw:mt-1">
                            {{ fieldErrors.contact_website[0] }}
                        </p>
                    </div>

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
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Contact Box + Message
                    </h3>

                    <div class="tw:space-y-2">
                        <span class="tw:text-sm tw:font-medium tw:text-gray-700">Show contact box on your event page</span>
                        <div class="tw:flex tw:gap-4">
                            <label class="tw:inline-flex tw:items-center tw:gap-2 tw:cursor-pointer">
                                <input
                                    type="radio"
                                    name="show-contact-box-event"
                                    :checked="showContactBox"
                                    class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500"
                                    @change="showContactBox = true"
                                />
                                <span class="tw:text-sm tw:text-gray-800">Yes</span>
                            </label>
                            <label class="tw:inline-flex tw:items-center tw:gap-2 tw:cursor-pointer">
                                <input
                                    type="radio"
                                    name="show-contact-box-event"
                                    :checked="!showContactBox"
                                    class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500"
                                    @change="showContactBox = false"
                                />
                                <span class="tw:text-sm tw:text-gray-800">No</span>
                            </label>
                        </div>
                    </div>

                    <div v-if="showContactBox" class="tw:space-y-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Contact Message</label>
                        <textarea v-model="contactBoxDesignMessage" rows="4" placeholder="Enter your contact message"
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
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Social Media Links
                    </h3>

                    <div>
                        <input
                            v-model="facebookUrl"
                            type="url"
                            inputmode="url"
                            placeholder="https://facebook.com/..."
                            data-field="facebook_url"
                            @input="clearFieldError('facebook_url')"
                            @blur="normalizeUrlField(facebookUrl)"
                            :class="urlInputClass('facebook_url')"
                        />
                        <p v-if="fieldErrors.facebook_url" class="tw:text-red-500 tw:text-sm tw:mt-1">
                            {{ fieldErrors.facebook_url[0] }}
                        </p>
                    </div>

                    <div>
                        <input
                            v-model="instagramUrl"
                            type="url"
                            inputmode="url"
                            placeholder="https://instagram.com/..."
                            data-field="instagram_url"
                            @input="clearFieldError('instagram_url')"
                            @blur="normalizeUrlField(instagramUrl)"
                            :class="urlInputClass('instagram_url')"
                        />
                        <p v-if="fieldErrors.instagram_url" class="tw:text-red-500 tw:text-sm tw:mt-1">
                            {{ fieldErrors.instagram_url[0] }}
                        </p>
                    </div>

                    <div>
                        <input
                            v-model="tiktokUrl"
                            type="url"
                            inputmode="url"
                            placeholder="https://tiktok.com/@..."
                            data-field="tiktok_url"
                            @input="clearFieldError('tiktok_url')"
                            @blur="normalizeUrlField(tiktokUrl)"
                            :class="urlInputClass('tiktok_url')"
                        />
                        <p v-if="fieldErrors.tiktok_url" class="tw:text-red-500 tw:text-sm tw:mt-1">
                            {{ fieldErrors.tiktok_url[0] }}
                        </p>
                    </div>
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
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Booking & Ticket Info
                    </h3>

                    <!-- <input v-model="ticketUrl" type="text" placeholder="Ticket / Booking URL"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" /> -->

                    <textarea v-model="bookingInstructions" rows="4" placeholder="Booking Instructions"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
                </div>

                <!-- INVITE SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-[var(--text-primary)]">
                            Invite
                        </h3>
                        <!-- <button
                            class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
                            <Plus class="tw:w-5 tw:h-5" />
                        </button> -->
                    </div>

                    <p class="tw:text-sm tw:text-[#1E3A8A]">
                        {{ $t('invite.sectionIntro') }}
                    </p>

                    <div class="tw:space-y-3">
                        <p v-if="inviteProfilesError" class="tw:text-sm tw:text-red-600">{{ inviteProfilesError }}</p>
                        <InviteSection
                            :key="`invite-talent-${inviteSectionResetKey}`"
                            role="talent"
                            :event-id="editingEventId"
                            :profiles="talentProfiles"
                            :all-profiles="invitationAllProfiles"
                            :loading="invitationRoleLoading('talent')"
                            :load-error="inviteProfilesError ?? ''"
                            :has-border="true"
                            v-model:selectedIds="invitedTalentIds"
                            @open="onInvitePanelOpen"
                            @refetch="onInviteRefetch"
                            @guest-queued="onGuestInviteQueued"
                        />
                        <InviteSection
                            :key="`invite-venue-${inviteSectionResetKey}`"
                            role="venue"
                            :event-id="editingEventId"
                            :profiles="venueProfiles"
                            :all-profiles="invitationAllProfiles"
                            :loading="invitationRoleLoading('venue')"
                            :load-error="inviteProfilesError ?? ''"
                            :has-border="false"
                            v-model:selectedIds="invitedVenueIds"
                            @open="onInvitePanelOpen"
                            @refetch="onInviteRefetch"
                            @guest-queued="onGuestInviteQueued"
                        />
                        <InviteSection
                            :key="`invite-organizer-${inviteSectionResetKey}`"
                            role="organizer"
                            :event-id="editingEventId"
                            :profiles="organiserProfiles"
                            :all-profiles="invitationAllProfiles"
                            :loading="invitationRoleLoading('organizer')"
                            :load-error="inviteProfilesError ?? ''"
                            :has-border="true"
                            v-model:selectedIds="invitedOrganiserIds"
                            @open="onInvitePanelOpen"
                            @refetch="onInviteRefetch"
                            @guest-queued="onGuestInviteQueued"
                        />
                    </div>
                </div>

                <!-- EVENT OPTIONS SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Event Options
                    </h3>

                    <div class="tw:flex tw:gap-3">
                        <!-- Recurring Event — only after date/time is set -->
                        <label
                            v-if="hasEventScheduleSelected"
                            class="tw:inline-flex tw:items-center tw:gap-2 tw:cursor-pointer"
                        >
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

                <!-- SAVE / UPDATE EVENT BUTTONS -->
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
                                {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update' : 'Save Event') }}
                            </button>
                        </div>
                    </div>
                    <!-- <span class="tw:text-red-500 tw:text-sm tw:mt-2 tw:block">Soon available</span> -->
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

        <!-- Media Picker Modal -->
        <Teleport to="body">
            <MediaPickerModal
                :visible="showMediaModal"
                :multiple="selectedMediaType === 'additional'"
                :max-selection="selectedMediaType === 'additional' ? 5 : 1"
                :preselected-ids="selectedMediaType === 'main' ? (form.image_path ? [form.image_path] : []) : form.additional_images"
                @select="handleMediaSelect"
                @close="showMediaModal = false"
                @image-updated="handleImageUpdated"
            />
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
    X,
    Images,
    UserPlus,
    Moon,
} from "lucide-vue-next"

import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch, reactive } from "vue"
import { useRouter, useRoute } from "vue-router"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import InviteSection from "@/components/invite/InviteSection.vue"
import PhoneInput from "@/components/common/PhoneInput.vue"
import MediaPickerModal from "@/components/media/MediaPickerModal.vue"
import MapPhotoMarkerToggle from "@/components/map/MapPhotoMarkerToggle.vue"
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
import { validateOptionalUrlInput } from "@/utils/socialMediaUrls"
import { useEventInvitationProfiles } from "@/composables/useEventInvitationProfiles"
import { sendGuestInvitation } from "@/api/guestInvitations"
import {
    parseInvitedProfileIds,
    profilesFromInvitedObjects,
} from "@/utils/invitedEventProfiles"

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
const myEvtStore = useMyEventStore()
const chatStore = useChatStore()
const mobileSidebarOpen = ref(false)

function toggleMobileSidebar() {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
}

function closeMobileSidebar() {
    mobileSidebarOpen.value = false
}

// Edit mode state
const isEditMode = ref(false)
const editingEventId = ref(null)
const eventType = ref('premium')

function handleChatboxClick() {
    closeMobileSidebar()
    if (authStore.user?.account_type !== 'premium') {
        toast.warning('Chat is available only for premium users.')
        return
    }
    chatStore.open()
}

function todayYmdLocal() {
    const d = new Date()
    const pad2 = (n) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

// Event data
const eventTitle = ref("")
const eventDate = ref(todayYmdLocal())
const endDate = ref(todayYmdLocal())
const eventStatus = ref("Draft")

const activeTab = ref("home")
const isSubmitting = ref(false)
const eventDescription = ref("")
const showDescriptionExpandModal = ref(false)

const form = reactive({
    image_path: '', 
    additional_images: [],
    remove_main_image: false
})

const mainImageFile = ref(null)
const mainImagePickerRef = ref(null)
const additionalImageFiles = ref([])
const selectedImageFile = ref(null)
const imagePreview = ref(null)
const fileName = ref('')

// Gallery images for resolving image_ids to URLs
const galleryImages = ref([])
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

const invitationEventId = computed(() => editingEventId.value ?? null)

const {
  talentProfiles,
  organiserProfiles,
  venueProfiles,
  error: inviteProfilesError,
  load: loadInvitationProfiles,
  allProfiles: invitationAllProfiles,
  ensureRoleLoaded: ensureInvitationRoleLoaded,
  refetchRole: refetchInvitationRole,
  roleLoading: invitationRoleLoading,
  seedProfiles: seedInvitationProfiles,
} = useEventInvitationProfiles(invitationEventId)

function onInvitePanelOpen(role) {
  ensureInvitationRoleLoaded(role, '')
}

function onInviteRefetch(role) {
  refetchInvitationRole(role)
}

const URL_INPUT_BASE =
    'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all'

function apiFieldError(key) {
    const err = fieldErrors.value[key]
    if (Array.isArray(err)) return err[0] || ''
    if (typeof err === 'string') return err
    return ''
}

function urlInputClass(key) {
    return [URL_INPUT_BASE, apiFieldError(key) ? 'tw:border-red-500' : 'tw:border-gray-200']
}

function normalizeUrlField(fieldRef) {
    const result = validateOptionalUrlInput(fieldRef.value)
    if (result.ok && result.value) fieldRef.value = result.value
}

function validateOptionalUrlFields() {
    const checks = [
        { key: 'contact_website', value: contactWebsite.value },
        { key: 'facebook_url', value: facebookUrl.value },
        { key: 'instagram_url', value: instagramUrl.value },
        { key: 'tiktok_url', value: tiktokUrl.value },
        { key: 'ticket_url', value: ticketUrl.value },
    ]
    const next = { ...fieldErrors.value }
    let valid = true
    for (const { key, value } of checks) {
        const result = validateOptionalUrlInput(value)
        if (!result.ok) {
            next[key] = [result.error]
            valid = false
        } else if (next[key]) {
            delete next[key]
        }
    }
    fieldErrors.value = next
    return valid
}

function appendValidatedOptionalUrl(formData, key, rawValue) {
    const result = validateOptionalUrlInput(rawValue)
    if (result.ok && result.value) formData.append(key, result.value)
}

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

    if (fieldErrors.value[fieldName]) {
        const next = { ...fieldErrors.value }
        delete next[fieldName]
        fieldErrors.value = next
    }
}

const additionalImages = ref([])
const selectedVenue = ref("")
const selectedGenre = ref("")
/** Same option lists as Free event profile (age_limit & entrance_status stored as labels). */
const AGE_GROUP_OPTIONS = [
    'All Ages',
    'Family Friendly (0–12)',
    '0–4 (Toddlers / Babies)',
    '4–7 (Young Kids)',
    '8–12 (Kids)',
    '12–17 (Teens)',
    '18+ (Adults)',
    '21+',
    '25+ (Mature Crowd)',
    '30+ (30+ Crowd)',
    'Students',
    'Senior Friendly (50+ / 60+)',
    'LGBTQ+ Friendly',
]

const ENTRANCE_STATUS_OPTIONS = [
    'Free Entrance',
    'Paid Entrance',
    'Donation',
    'Event Postponed',
    'Event Cancelled',
    'Sold Out',
]

const dressCode = ref("")
const dressCodeDescription = ref("")
const ageLimit = ref("")
const ageLimitDescription = ref("")
const entranceStatus = ref("")
const entranceStatusDescription = ref("")

function dressCodePayloadValue() {
    if (dressCode.value === 'none') return 'no_dress_code'
    if (dressCode.value === 'formal') return 'Dress Code'
    if (dressCode.value === 'required') return (dressCodeDescription.value || '').trim()
    return ''
}

function ageLimitPayloadValue() {
    if (ageLimit.value === 'required') return (ageLimitDescription.value || '').trim()
    return ageLimit.value
}

function entranceStatusPayloadValue() {
    if (entranceStatus.value === 'required') return (entranceStatusDescription.value || '').trim()
    return entranceStatus.value
}

function hydrateAgeLimitFromApi(stored) {
    const al = (stored ?? '').toString().trim()
    if (!al || al === 'no_age_limit') {
        ageLimit.value = 'All Ages'
        ageLimitDescription.value = ''
        return
    }
    if (al === 'all_ages') {
        ageLimit.value = 'All Ages'
        ageLimitDescription.value = ''
        return
    }
    if (AGE_GROUP_OPTIONS.includes(al)) {
        ageLimit.value = al
        ageLimitDescription.value = ''
        return
    }
    const alLower = al.toLowerCase()
    const byLabel = AGE_GROUP_OPTIONS.find((o) => o.toLowerCase() === alLower)
    if (byLabel) {
        ageLimit.value = byLabel
        ageLimitDescription.value = ''
        return
    }
    ageLimit.value = 'required'
    ageLimitDescription.value = al
}

function hydrateEntranceStatusFromApi(stored) {
    const es = (stored ?? '').toString().trim()
    if (!es || es === 'open_to_all') {
        entranceStatus.value = 'Free Entrance'
        entranceStatusDescription.value = ''
        return
    }
    if (ENTRANCE_STATUS_OPTIONS.includes(es)) {
        entranceStatus.value = es
        entranceStatusDescription.value = ''
        return
    }
    const esLower = es.toLowerCase()
    const byLabel = ENTRANCE_STATUS_OPTIONS.find((o) => o.toLowerCase() === esLower)
    if (byLabel) {
        entranceStatus.value = byLabel
        entranceStatusDescription.value = ''
        return
    }
    entranceStatus.value = 'required'
    entranceStatusDescription.value = es
}
const contactPhone = ref("")
const contactEmail = ref("")
const contactWebsite = ref("")
const bookingInstructions = ref('');
const ticketUrl = ref('');

// Event options
const isRecurring = ref(false)
const isCopyEvent = ref(false)
// Default visibility: "No"
const showUpcomingEvents = ref(false)
const showPastEvents = ref(true)
const showPhotoMapMarker = ref(false)
const showChatbox = ref(false)
const contactBoxMessage = ref('')
const contactBoxDesignMessage = ref('')
const showContactBox = ref(false)
const venueDetailsText = ref('')
const inviteSectionResetKey = ref(0)

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
// ── Time split refs ──────────────────────────────────────────────────
const startHH = ref("")
const startMM = ref("")
const endHH = ref("")
const endMM = ref("")
const startHHInput = ref(null)
const startMMInput = ref(null)
const endHHInput = ref(null)
const endMMInput = ref(null)
const datetimeRangeError = ref("")
const showOvernightEventCallout = ref(false)
const hasStartError = ref(false)
const hasEndError = ref(false)
const startDateFormatError = ref("")

function onPremiumEventDateInput() {
    clearFieldError('eventDate')
    startDateFormatError.value = ''
    validatePastDate()
    validateEndAfterStartDateTime()
}

// Computed HH:MM strings for API
const startTime = computed(() => {
    if (startHH.value === "" || startMM.value === "") return ""
    return `${String(startHH.value).padStart(2, "0")}:${String(startMM.value).padStart(2, "0")}`
})

const endTime = computed(() => {
    if (endHH.value === "" || endMM.value === "") return ""
    return `${String(endHH.value).padStart(2, "0")}:${String(endMM.value).padStart(2, "0")}`
})

const hasEventScheduleSelected = computed(
  () => !!eventDate.value?.trim() && !!startTime.value && !!endTime.value,
)

const startTimePicker = computed({
    get() {
        if (startHH.value === "" || startMM.value === "") return ""
        return `${String(startHH.value).padStart(2, "0")}:${String(startMM.value).padStart(2, "0")}`
    },
    set(v) {
        if (!v) {
            startHH.value = ""
            startMM.value = ""
            validateEndAfterStartDateTime()
            return
        }
        const [h, m] = String(v).split(":")
        const hour = h != null && h !== "" ? Math.min(23, Math.max(0, parseInt(h, 10))) : NaN
        const min = m != null && m !== "" ? Math.min(59, Math.max(0, parseInt(m, 10))) : NaN
        if (!Number.isFinite(hour) || !Number.isFinite(min)) {
            startHH.value = ""
            startMM.value = ""
        } else {
            startHH.value = String(hour).padStart(2, "0")
            startMM.value = String(min).padStart(2, "0")
        }
        hasStartError.value = false
        validateEndAfterStartDateTime()
    },
})

const endTimePicker = computed({
    get() {
        if (endHH.value === "" || endMM.value === "") return ""
        return `${String(endHH.value).padStart(2, "0")}:${String(endMM.value).padStart(2, "0")}`
    },
    set(v) {
        if (!v) {
            endHH.value = ""
            endMM.value = ""
            validateEndAfterStartDateTime()
            return
        }
        const [h, m] = String(v).split(":")
        const hour = h != null && h !== "" ? Math.min(23, Math.max(0, parseInt(h, 10))) : NaN
        const min = m != null && m !== "" ? Math.min(59, Math.max(0, parseInt(m, 10))) : NaN
        if (!Number.isFinite(hour) || !Number.isFinite(min)) {
            endHH.value = ""
            endMM.value = ""
        } else {
            endHH.value = String(hour).padStart(2, "0")
            endMM.value = String(min).padStart(2, "0")
        }
        hasEndError.value = false
        validateEndAfterStartDateTime()
    },
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

const MAX_EVENT_DURATION_MS = 24 * 60 * 60 * 1000

function addDaysYmd(dateStr, dayDelta) {
    const base = parseYmd(dateStr)
    if (!base) return ""
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + dayDelta)
    const pad2 = (n) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
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
    validateEndAfterStartDateTime()
}

function validateEndAfterStartDateTime() {
    datetimeRangeError.value = ""
    startDateFormatError.value = ""
    showOvernightEventCallout.value = false

    if (!eventDate.value) {
        endDate.value = ""
        return
    }
    if (!startTime.value || !endTime.value) {
        endDate.value = eventDate.value
        return
    }

    const startDt = buildDateTime(eventDate.value, startTime.value)
    if (!startDt) {
        startDateFormatError.value = "Use YYYY-MM-DD (e.g., 2026-03-17)"
        endDate.value = eventDate.value
        return
    }

    const endOnStartDay = buildDateTime(eventDate.value, endTime.value)
    if (!endOnStartDay) {
        endDate.value = eventDate.value
        return
    }

    let resolvedEndDate = eventDate.value
    let endDt
    if (endOnStartDay.getTime() > startDt.getTime()) {
        endDt = endOnStartDay
        resolvedEndDate = eventDate.value
    } else {
        const nextDay = addDaysYmd(eventDate.value, 1)
        if (!nextDay) {
            endDate.value = eventDate.value
            return
        }
        resolvedEndDate = nextDay
        endDt = buildDateTime(resolvedEndDate, endTime.value)
        if (!endDt) {
            endDate.value = eventDate.value
            return
        }
    }

    endDate.value = resolvedEndDate

    const duration = endDt.getTime() - startDt.getTime()
    if (duration <= 0) {
        datetimeRangeError.value = "End date & time must be after start date & time"
        return
    }
    if (duration > MAX_EVENT_DURATION_MS) {
        datetimeRangeError.value = "Event cannot last longer than 24 hours"
        return
    }

    if (resolvedEndDate !== eventDate.value) {
        showOvernightEventCallout.value = true
    }
}

function maybeAdvanceTimeField(field, nextVal) {
    if (nextVal.length !== 2) return
    nextTick(() => {
        if (field === "startHH") startMMInput.value?.focus()
        else if (field === "startMM") endHHInput.value?.focus()
        else if (field === "endHH") endMMInput.value?.focus()
    })
}

// Enforce max 2 digits + valid range, then validate end > start (full datetime)
function onTimeInput(field, event) {
    // Strip non-digits and limit to 2 characters
    let raw = event.target.value.replace(/\D/g, "").slice(0, 2)
    const clamp = (n, min, max) => Math.min(max, Math.max(min, n))
    const isEmpty = raw === ""
    const asNumber = isEmpty ? null : Number(raw)
    const isHourField = field === "startHH" || field === "endHH"
    const max = isHourField ? 23 : 59
    const nextVal = isEmpty ? "" : String(clamp(isNaN(asNumber) ? 0 : asNumber, 0, max))
    if (!isEmpty && nextVal !== raw) {
        event.target.value = nextVal
    } else {
        event.target.value = raw
    }

    if (field === "startHH") { startHH.value = nextVal; hasStartError.value = false }
    if (field === "startMM") { startMM.value = nextVal; hasStartError.value = false }
    if (field === "endHH") { endHH.value = nextVal; hasEndError.value = false }
    if (field === "endMM") { endMM.value = nextVal; hasEndError.value = false }

    validateEndAfterStartDateTime()
    maybeAdvanceTimeField(field, nextVal)
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
const venueName = ref('')
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
    const names = selectedCategoryData ? selectedCategoryData.subcategories.map(sub => sub.name) : []
    return [...names].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
})

// Invite section selected IDs (profile primary keys for invited_* arrays)
const invitedTalentIds = ref([])
const invitedOrganiserIds = ref([])
const invitedVenueIds = ref([])
const pendingGuestInvites = ref([])

function onGuestInviteQueued(payload) {
  pendingGuestInvites.value.push(payload)
}

async function flushPendingGuestInvites(eventId) {
  if (!eventId || pendingGuestInvites.value.length === 0) return
  const queue = [...pendingGuestInvites.value]
  pendingGuestInvites.value = []
  let sent = 0
  for (const item of queue) {
    try {
      const res = await sendGuestInvitation(Number(eventId), item)
      if (res.success) sent += 1
    } catch (err) {
      const msg = err?.response?.data?.message
      if (msg) toast.error(msg)
    }
  }
  if (sent > 0) {
    toast.success(`${sent} email invitation(s) sent.`)
  }
}

function appendInvitedProfileIds(formData) {
    invitedTalentIds.value.forEach((id) => {
        const n = Number(id)
        if (Number.isFinite(n)) formData.append('invited_talents[]', String(n))
    })
    invitedOrganiserIds.value.forEach((id) => {
        const n = Number(id)
        if (Number.isFinite(n)) formData.append('invited_organisers[]', String(n))
    })
    invitedVenueIds.value.forEach((id) => {
        const n = Number(id)
        if (Number.isFinite(n)) formData.append('invited_venues[]', String(n))
    })
}

watch(editingEventId, () => {
    loadInvitationProfiles()
})

const menuItems = [
    { id: "home", icon: Home, label: "Home", route: "/create-event-premium" },
    { id: "details", icon: FileText, label: "Details", route: "/create-event-premium" },
    { id: "analytics", icon: BarChart3, route: "/create-event-premium/report", label: "Analytics" },
    { id: 'gallery', label: 'Gallery', icon: Images, route: `/create-event-premium/gallery-images` },
    { id: "settings", icon: Settings, route: "/create-event-premium/settings", label: "Settings" },
    { id: "invites", icon: UserPlus, label: "Invites", route: "/create-event-premium/invites" },
    // { id: "calendar", icon: Calendar, label: "Calendar" },
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
    if (!selectedSubcategories.value.includes(subcategory) && selectedSubcategories.value.length >= 5) {
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

// Media Picker Modal State
const showMediaModal = ref(false)
const selectedMediaType = ref('main')

// Merge picker selections into local gallery so id → URL previews work (library picks are not loaded via event detail).
function mergeGalleryPickerItems(items) {
    if (!items?.length) return
    const byId = new Map(galleryImages.value.map((img) => [String(img.image_id), img]))
    for (const img of items) {
        byId.set(String(img.image_id), img)
    }
    galleryImages.value = Array.from(byId.values())
}

// Computed properties for resolving image_ids to URLs
const mainImage = computed(() => {
    if (!form.image_path) return null
    const id = String(form.image_path)
    return galleryImages.value.find((img) => String(img.image_id) === id) ?? null
})

const resolvedAdditionalImages = computed(() => {
    return form.additional_images
        .map((rawId) => {
            const id = String(rawId)
            return galleryImages.value.find((img) => String(img.image_id) === id)
        })
        .filter(Boolean)
})

// Media Picker Handlers
const openMediaModal = (type) => {
    console.log('Opening media modal with type:', type)
    selectedMediaType.value = type
    showMediaModal.value = true
    console.log('showMediaModal set to:', showMediaModal.value)
}

const handleMediaSelect = (ids, items = []) => {
    mergeGalleryPickerItems(items)
    if (selectedMediaType.value === 'main') {
        form.image_path = ids[0] != null && ids[0] !== '' ? String(ids[0]) : ''
        form.remove_main_image = false
    } else {
        form.additional_images = ids.slice(0, 5).map((id) => String(id))
        additionalImages.value = []
    }
}

const handleImageUpdated = (newImages, _files) => {
  if (!newImages?.length) return
  galleryImages.value = [...newImages, ...galleryImages.value]

  if (selectedMediaType.value === 'main') {
    form.image_path = String(newImages[0].image_id)
    form.remove_main_image = false
    mainImageFile.value = null
    selectedImageFile.value = null
  } else if (selectedMediaType.value === 'additional') {
    const existing = (form.additional_images || []).map(String)
    for (const img of newImages) {
      const id = String(img.image_id)
      if (!existing.includes(id) && existing.length < 5) existing.push(id)
    }
    form.additional_images = existing.slice(0, 5)
    additionalImageFiles.value = []
    additionalImages.value = []
  }
}

const handleMainImageClick = () => {
    console.log('Main image clicked')
    openMediaModal('main')
}

const handleAdditionalImagesClick = () => {
    openMediaModal('additional')
}

const removeAdditionalImage = (index) => {
    // Remove from form.additional_images (existing images)
    if (form.additional_images && form.additional_images.length > index) {
        form.additional_images.splice(index, 1)
    }
    // Also clear additionalImages ref if it's being used for new uploads
    if (additionalImages.value && additionalImages.value.length > index) {
        additionalImages.value.splice(index, 1)
    }
    // Also clear additionalImageFiles if it contains files
    if (additionalImageFiles.value && additionalImageFiles.value.length > index) {
        additionalImageFiles.value.splice(index, 1)
    }
}

const clearAllAdditionalImages = () => {
    form.additional_images = []
    additionalImages.value = []
    additionalImageFiles.value = []
}

const removeMainImage = () => {
    // Mark for removal
    form.remove_main_image = false
    form.image_path = ''
    selectedImageFile.value = null
    mainImageFile.value = null
    imagePreview.value = null
    fileName.value = 'No File Chosen'
}

/** Merge event detail image metadata into galleryImages (no GET /gallery-images). */
function setGalleryImagesFromEvent(d) {
    const items = []
    const mainId = typeof d.image_path === 'string' ? d.image_path.trim() : ''
    const mainUrl = d.image_url || d.main_image_url
    if (mainId && mainUrl) {
        items.push({
            image_id: mainId,
            image_url: mainUrl,
            file_name: d.title ? String(d.title).slice(0, 80) : 'Main image',
        })
    }
    if (Array.isArray(d.additional_images)) {
        const urlList = Array.isArray(d.additional_image_urls) ? d.additional_image_urls : []
        for (let i = 0; i < d.additional_images.length; i++) {
            const raw = d.additional_images[i]
            if (raw == null || raw === '') continue
            if (typeof raw === 'string' || typeof raw === 'number') {
                const id = String(raw).trim()
                const url = (urlList[i] || '').toString()
                if (id && url) {
                    items.push({
                        image_id: id,
                        image_url: url,
                        file_name: 'Image',
                    })
                }
            } else if (typeof raw === 'object') {
                const id = raw.image_id || raw.image_path || ''
                const url = raw.image_url
                if (id && url) {
                    items.push({
                        image_id: String(id),
                        image_url: url,
                        file_name: raw.file_name || 'Image',
                    })
                }
            }
        }
    }
    const byId = new Map(galleryImages.value.map((img) => [String(img.image_id), img]))
    for (const item of items) {
        byId.set(String(item.image_id), item)
    }
    galleryImages.value = Array.from(byId.values())
}

watch(eventDate, () => {
    validatePastDate()
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

// Scroll to first invalid field (document order must match the form layout)
async function scrollToFirstError() {
    await nextTick()

    function scrollEl(el) {
        if (!el) return false
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const tag = el.tagName
        if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
            try {
                el.focus({ preventScroll: true })
            } catch {
                el.focus()
            }
        }
        return true
    }

    const selects = () => Array.from(document.querySelectorAll('select'))

    if (errors.value.eventTitle || fieldErrors.value.title?.length) {
        scrollEl(document.querySelector('input[placeholder="Enter Event Title"]'))
        return
    }
    if (errors.value.description || fieldErrors.value.description?.length) {
        scrollEl(document.querySelector('textarea[placeholder="Describe Your Event..."]'))
        return
    }
    if (errors.value.eventImage || fieldErrors.value.image?.length) {
        scrollEl(mainImagePickerRef.value)
        return
    }
    if (categoryError.value || errors.value.category) {
        scrollEl(selects()[0])
        return
    }
    if (subcategoryError.value || errors.value.subcategories) {
        scrollEl(dropdownContainer.value)
        return
    }
    if (errors.value.eventDate || pastDateError.value || fieldErrors.value.start_date?.length) {
        scrollEl(dateInput.value)
        return
    }
    if (hasStartError.value) {
        scrollEl(startMMInput.value)
        return
    }
    if (hasEndError.value || datetimeRangeError.value) {
        scrollEl(endMMInput.value)
        return
    }
    if (errors.value.address) {
        scrollEl(document.querySelector('input[placeholder="Address Will Auto Fill Here"]'))
        return
    }
    if (errors.value.dressCode) {
        scrollEl(selects()[1])
        return
    }
    if (errors.value.ageLimit) {
        scrollEl(selects()[2])
        return
    }
    if (errors.value.entranceStatus) {
        scrollEl(selects()[3])
        return
    }

    for (const key of ['contact_website', 'facebook_url', 'instagram_url', 'tiktok_url', 'ticket_url']) {
        if (fieldErrors.value[key]?.length) {
            scrollEl(document.querySelector(`[data-field="${key}"]`))
            return
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
    
    // Image validation: not required in edit mode if already exists
    errors.value.eventImage = isEditMode.value 
        ? (!form.image_path && !selectedImageFile.value)
        : !form.image_path
    
    errors.value.description = !eventDescription.value.trim()
    errors.value.category = !selectedCategory.value
    errors.value.subcategories = selectedSubcategories.value.length === 0
    errors.value.eventDate = !eventDate.value
    errors.value.address = !selectedAddress.value
    
    errors.value.dressCode =
        !dressCode.value ||
        (dressCode.value === 'required' && !dressCodeDescription.value?.trim())
    errors.value.ageLimit =
        !ageLimit.value ||
        (ageLimit.value === 'required' && !ageLimitDescription.value?.trim())
    errors.value.entranceStatus =
        !entranceStatus.value ||
        (entranceStatus.value === 'required' && !entranceStatusDescription.value?.trim())
    
    // Contact details are optional for premium users
    errors.value.contactPhone = false // Always optional
    errors.value.contactEmail = false // Always optional

    // Set category/subcategory specific errors
    categoryError.value = !selectedCategory.value
    subcategoryError.value = selectedSubcategories.value.length === 0

    // Time validation
    if (!startTime.value) hasStartError.value = true
    if (!endTime.value) hasEndError.value = true
    validateEndAfterStartDateTime()
    const timeValid =
        startTime.value !== "" &&
        endTime.value !== "" &&
        !datetimeRangeError.value

    const urlsValid = validateOptionalUrlFields()

    // Check for any validation errors
    const hasOtherErrors = Object.values(errors.value).some(error => error) ||
        categoryError.value ||
        subcategoryError.value ||
        pastDateError.value

    return !hasOtherErrors && timeValid && urlsValid
}

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
        formData.append('event_type', 'premium')
        formData.append('category_id', categoryId)
        subcategoryIds.forEach(id => formData.append('subcategory_ids[]', id))
        // Backwards-compatible fields (legacy)
        formData.append('start_date', eventDate.value)
        formData.append('start_time', startTime.value)
        formData.append('end_time', endTime.value)
        // New datetime fields (preferred)
        formData.append('end_date', endDate.value)
        formData.append('start_datetime', buildLocalIso(eventDate.value, startTime.value))
        formData.append('end_datetime', buildLocalIso(endDate.value, endTime.value))
        formData.append('address', selectedAddress.value)
        formData.append('venue_name', venueName.value ?? '')
        formData.append('latitude', latitude.value)
        formData.append('longitude', longitude.value)
        formData.append('dress_code', dressCodePayloadValue())
        formData.append('age_limit', ageLimitPayloadValue())
        formData.append('entrance_status', entranceStatusPayloadValue())
        formData.append('contact_phone', contactPhone.value)
        formData.append('contact_email', contactEmail.value)
        formData.append('description', eventDescription.value)

        // Optional fields
        appendValidatedOptionalUrl(formData, 'contact_website', contactWebsite.value)
        formData.append('show_contact_box', showContactBox.value ? '1' : '0')
        if (showContactBox.value && contactBoxDesignMessage.value.trim()) {
            formData.append('contact_box_design_message', contactBoxDesignMessage.value.trim())
            formData.append('contact_box_message', contactBoxDesignMessage.value.trim())
        }
        if (venueDetailsText.value) formData.append('venue_details', venueDetailsText.value)
        appendValidatedOptionalUrl(formData, 'facebook_url', facebookUrl.value)
        appendValidatedOptionalUrl(formData, 'instagram_url', instagramUrl.value)
        appendValidatedOptionalUrl(formData, 'tiktok_url', tiktokUrl.value)
        appendValidatedOptionalUrl(formData, 'ticket_url', ticketUrl.value)
        if (bookingInstructions.value) formData.append('booking_instructions', bookingInstructions.value)
        // Backend boolean flags
        formData.append('is_recurring', isRecurring.value ? '1' : '0')
        formData.append('is_copy_event', isCopyEvent.value ? '1' : '0')
        formData.append('show_upcoming_events', showUpcomingEvents.value === null ? '' : (showUpcomingEvents.value ? '1' : '0'))
        formData.append('show_past_events', showPastEvents.value === null ? '' : (showPastEvents.value ? '1' : '0'))
        formData.append('show_photo_map_marker', showPhotoMapMarker.value ? '1' : '0')
        if (conditionEntranceFee.value) formData.append('condition_entrance_fee', conditionEntranceFee.value)
        if (conditionDressCode.value) formData.append('condition_dress_code', conditionDressCode.value)
        if (conditionAgeLimit.value) formData.append('condition_age_limit', conditionAgeLimit.value)

        // Invite section IDs (optional - pass when user has selected)
        appendInvitedProfileIds(formData)

        // Add image_id if exists
        if (form.image_path) {
            formData.append('image_path', form.image_path)
        }

        // Add additional image_ids
        if (form.additional_images && form.additional_images.length > 0) {
            form.additional_images.forEach((imageId, index) => {
                formData.append(`additional_images[${index}]`, imageId)
            })
        }

        // Submit to API v2 using eventService
        const response = await eventService.createEvent(formData)

        if (response.success) {
            const newEventId = response.data?.id
            if (newEventId) {
                await flushPendingGuestInvites(newEventId)
            }
            toast.success('Event created successfully!')
            resetForm()
            pendingGuestInvites.value = []
            await refreshMyEventsAfterCreate()
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

// Initialize map on component mount
onMounted(async () => {
    loadInvitationProfiles()
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
        defaultDate: eventDate.value,
        allowInput: false,
        onChange: (selectedDates, dateStr) => {
            eventDate.value = dateStr
            clearFieldError('eventDate')
            validatePastDate()
            validateEndAfterStartDateTime()
        }
    })

    const rawId =
        myEvtStore.takePendingEditorEventId() ?? route.query.edit ?? route.params.id
    if (rawId != null && String(rawId).trim() !== '') {
        await clickEvent(Number(rawId))
        if (route.query.edit != null && String(route.query.edit) !== '') {
            const q = { ...route.query }
            delete q.edit
            if (Object.keys(q).length) {
                router.replace({ path: route.path, query: q })
            } else {
                router.replace({ path: route.path })
            }
        }
    }
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
        eventDate.value = d.start_date ?? ''
        selectedAddress.value = d.address ?? ''
        searchAddress.value = d.address ?? ''
        venueName.value =
            d.venue_name != null && d.venue_name !== undefined
                ? String(d.venue_name)
                : (d.venueName != null ? String(d.venueName) : '')
        latitude.value = d.latitude ?? null
        longitude.value = d.longitude ?? null

        // Contact + links
        contactPhone.value = d.contact_phone ?? ''
        contactEmail.value = d.contact_email ?? ''
        contactWebsite.value = d.contact_website ?? ''
        contactBoxMessage.value = d.contact_box_message ?? ''
        contactBoxDesignMessage.value = d.contact_box_design_message ?? d.contact_box_message ?? ''
        showContactBox.value = d.show_contact_box === true || d.show_contact_box === '1'
            || (!!contactBoxDesignMessage.value && d.show_contact_box !== false && d.show_contact_box !== '0')
        facebookUrl.value = d.facebook_url ?? ''
        instagramUrl.value = d.instagram_url ?? ''
        tiktokUrl.value = d.tiktok_url ?? ''
        ticketUrl.value = d.ticket_url ?? ''
        bookingInstructions.value = d.booking_instructions ?? ''

        // Overview hydration (match Free create form)
        const dc = (d.dress_code ?? '').toString().trim()
        if (!dc || dc === 'no_dress_code') {
            dressCode.value = 'none'
            dressCodeDescription.value = ''
        } else if (dc === 'formal' || dc === 'Dress Code' || dc === 'dress_code') {
            dressCode.value = 'formal'
            dressCodeDescription.value = ''
        } else {
            dressCode.value = 'required'
            dressCodeDescription.value = dc
        }
        hydrateAgeLimitFromApi(d.age_limit)
        hydrateEntranceStatusFromApi(d.entrance_status)

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
            if (ed && DATE_YMD_REGEX.test(ed)) {
                endDate.value = ed
            }
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
            const rawEnd = d.end_date != null ? String(d.end_date) : ''
            if (rawEnd && DATE_YMD_REGEX.test(rawEnd)) {
                endDate.value = rawEnd
            }
        } else {
            endHH.value = ''
            endMM.value = ''
        }

        validateEndAfterStartDateTime()

        if (categories.value.length && d.category_id) {
            const cat = categories.value.find(c => String(c.id) === String(d.category_id))
            selectedCategory.value = cat ? cat.name : ''
            if (cat && Array.isArray(d.subcategory_ids)) {
                selectedSubcategories.value = d.subcategory_ids
                    .map(sid => cat.subcategories.find(s => String(s.id) === String(sid))?.name)
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
            : false
        showPastEvents.value = d.show_past_events !== undefined
            ? !!d.show_past_events
            : false
        showPhotoMapMarker.value = !!d.show_photo_map_marker

        // Invite selections (profile PKs from ids and/or *_objects)
        seedInvitationProfiles([
            ...profilesFromInvitedObjects(d.invited_talents_objects, 'talent'),
            ...profilesFromInvitedObjects(d.invited_organisers_objects, 'organiser'),
            ...profilesFromInvitedObjects(d.invited_venues_objects, 'venue'),
        ])
        invitedTalentIds.value = parseInvitedProfileIds(
            d.invited_talents,
            d.invited_talents_objects,
            'talent',
        )
        invitedOrganiserIds.value = parseInvitedProfileIds(
            d.invited_organisers,
            d.invited_organisers_objects,
            'organiser',
        )
        invitedVenueIds.value = parseInvitedProfileIds(
            d.invited_venues,
            d.invited_venues_objects,
            'venue',
        )
        inviteSectionResetKey.value += 1

        // Load image_ids from event
        form.image_path = d.image_path || ''
        // form.additional_images = Array.isArray(d.additional_images) ? d.additional_images : []
        form.additional_images = Array.isArray(d.additional_images)
            ? d.additional_images.filter(id => id !== null && id !== '').map((id) => String(id))
            : []

        // Clear file refs when loading existing event (avoid stale Files forcing main_image binary on save)
        mainImageFile.value = null
        additionalImageFiles.value = []
        selectedImageFile.value = null
        additionalImages.value = []

        setGalleryImagesFromEvent(d)

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
    eventDate.value = todayYmdLocal()
    endDate.value = todayYmdLocal()
    startHH.value = ''
    startMM.value = ''
    endHH.value = ''
    endMM.value = ''
    selectedAddress.value = ''
    searchAddress.value = ''
    venueName.value = ''
    selectedCategory.value = ''
    selectedSubcategories.value = []
    eventType.value = 'premium'
    // Reset image form state
    form.image_path = ''
    form.additional_images = []
    form.remove_main_image = false
    // Reset file refs
    mainImageFile.value = null
    additionalImageFiles.value = []
    galleryImages.value = []
    // Legacy resets
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
    startDateFormatError.value = ''
    datetimeRangeError.value = ''
    showOvernightEventCallout.value = false
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
    entranceStatus.value = ''
    entranceStatusDescription.value = ''
    contactPhone.value = ''
    contactEmail.value = ''
    contactWebsite.value = ''
    contactBoxMessage.value = ''
    contactBoxDesignMessage.value = ''
    showContactBox.value = false
    venueDetailsText.value = ''
    facebookUrl.value = ''
    instagramUrl.value = ''
    tiktokUrl.value = ''
    ticketUrl.value = ''
    bookingInstructions.value = ''
    isRecurring.value = false
    isCopyEvent.value = false
    showUpcomingEvents.value = false
    showPastEvents.value = true
    showPhotoMapMarker.value = false
    conditionEntranceFee.value = ''
    conditionDressCode.value = ''
    conditionAgeLimit.value = ''
    invitedTalentIds.value = []
    invitedOrganiserIds.value = []
    invitedVenueIds.value = []
    inviteSectionResetKey.value += 1
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

        // Create FormData for file upload
        const formData = new FormData()
        
        // Add _method for PUT request
        formData.append('_method', 'PUT')
        
        // Add basic fields
        formData.append('title', eventTitle.value)
        formData.append('event_type', eventType.value)
        formData.append('category_id', categoryId)
        subcategoryIds.forEach(id => formData.append('subcategory_ids[]', id))
        formData.append('start_date', eventDate.value)
        formData.append('start_time', startTime.value)
        formData.append('end_time', endTime.value)
        formData.append('end_date', endDate.value)
        formData.append('start_datetime', buildLocalIso(eventDate.value, startTime.value))
        formData.append('end_datetime', buildLocalIso(endDate.value, endTime.value))
        formData.append('address', selectedAddress.value)
        formData.append('venue_name', venueName.value ?? '')
        formData.append('description', eventDescription.value)
        
        formData.append('dress_code', dressCodePayloadValue())
        formData.append('age_limit', ageLimitPayloadValue())
        formData.append('entrance_status', entranceStatusPayloadValue())
        
        // Optional fields
        if (contactPhone.value) formData.append('contact_phone', contactPhone.value)
        if (contactEmail.value) formData.append('contact_email', contactEmail.value)
        appendValidatedOptionalUrl(formData, 'contact_website', contactWebsite.value)
        formData.append('show_contact_box', showContactBox.value ? '1' : '0')
        if (showContactBox.value && contactBoxDesignMessage.value.trim()) {
            formData.append('contact_box_design_message', contactBoxDesignMessage.value.trim())
            formData.append('contact_box_message', contactBoxDesignMessage.value.trim())
        }
        if (venueDetailsText.value) formData.append('venue_details', venueDetailsText.value)
        appendValidatedOptionalUrl(formData, 'facebook_url', facebookUrl.value)
        appendValidatedOptionalUrl(formData, 'instagram_url', instagramUrl.value)
        appendValidatedOptionalUrl(formData, 'tiktok_url', tiktokUrl.value)
        appendValidatedOptionalUrl(formData, 'ticket_url', ticketUrl.value)
        if (bookingInstructions.value) formData.append('booking_instructions', bookingInstructions.value)
        
        // Boolean fields
        formData.append('is_recurring', isRecurring.value ? '1' : '0')
        formData.append('is_copy_event', isCopyEvent.value ? '1' : '0')
        formData.append('show_upcoming_events', showUpcomingEvents.value === null ? '' : (showUpcomingEvents.value ? '1' : '0'))
        formData.append('show_past_events', showPastEvents.value === null ? '' : (showPastEvents.value ? '1' : '0'))
        formData.append('show_photo_map_marker', showPhotoMapMarker.value ? '1' : '0')
        
        // Condition fields
        if (conditionEntranceFee.value) formData.append('condition_entrance_fee', conditionEntranceFee.value)
        if (conditionDressCode.value) formData.append('condition_dress_code', conditionDressCode.value)
        if (conditionAgeLimit.value) formData.append('condition_age_limit', conditionAgeLimit.value)
        
        // Invite section IDs
        appendInvitedProfileIds(formData)
        
        // ── Main image ──────────────────────────────────────────────────────
        // Prefer gallery UUID (same as create flow). Upload-via-modal already assigns form.image_path after the image exists server-side.
        if (form.remove_main_image) {
            formData.append('remove_main_image', 'true')
        } else if (form.image_path) {
            formData.append('image_path', String(form.image_path))
        } else if (mainImageFile.value instanceof File) {
            formData.append('main_image', mainImageFile.value)
        } else if (selectedImageFile.value instanceof File) {
            formData.append('main_image', selectedImageFile.value)
        }

        // ── Additional images (gallery UUIDs only; uploads already exist server-side) ──
        if (form.additional_images && form.additional_images.length > 0) {
            form.additional_images.forEach((id) => {
                formData.append('additional_images[]', String(id))
            })
        } else {
            formData.append('additional_images[]', '')
        }
        
        // Debug: Log FormData contents
        console.log('FormData contents:')
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1])
        }
        
        // Send update request
        const response = await api.post(`/v2/events/${editingEventId.value}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        if (response.data.success) {
            toast.success('Event updated successfully.')
            isEditMode.value = false
            editingEventId.value = null
            resetForm()
            await myEvtStore.fetchMyEvents()
        } else {
            if (response.data.errors) {
                fieldErrors.value = response.data.errors
                toast.error(response.data.message || 'Please correct the errors in the form.')
                await scrollToFirstError()
            } else {
                toast.error(response.data.message || 'Failed to update event.')
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
    closeMobileSidebar()
    await clickEvent(eventId)
}

function handleBack() {
    closeMobileSidebar()
    router.push('/') // Navigate to events list
}
</script>