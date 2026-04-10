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
                    <EventSidebar sidebar-kind="talents" :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected" @chatbox-click="handleChatboxClick" @menu-click="closeMobileSidebar" />
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
                <EventSidebar sidebar-kind="talents" :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected" 
                 @chatbox-click="handleChatboxClick" />
            </div>

            <!-- ================= RIGHT CARD ================= -->
            <div class="tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4 tw:md:space-y-6">

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

                <!-- Talent TITLE SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                            Create Premium Talent <span class="tw:text-red-500">*</span>
                        </h3>
                        <!-- <button
                            class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
                            <Plus class="tw:w-5 tw:h-5" />
                        </button> -->
                    </div>

                    <input v-model="formData.talentTitle" type="text" placeholder="Enter Talent Title"
                        data-field="talentTitle" @input="formErrors.talentTitle && clearError('talentTitle')" :class="[
                            'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all',
                            formErrors.talentTitle ? 'tw:border-red-500' : 'tw:border-gray-200'
                        ]" />
                    <p v-if="formErrors.talentTitle" class="tw:text-red-500 tw:text-sm tw:mt-1">{{
                        formErrors.talentTitle }}</p>
                    <!-- Description -->
                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:text-gray-700">Description <span class="tw:text-red-500">*</span></label>
                        <textarea v-model="eventDescription" rows="4" placeholder="Describe Your Talent..."
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
                        <p v-if="fieldErrors.description" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ fieldErrors.description[0] }}</p>
                    </div>
                </div>

                <!-- MAIN IMAGE SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">

                    <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
                        <h3 class="tw:text-lg tw:font-semibold tw:text-gray-800">
                            Main Image <span class="tw:text-red-500">*</span> <span
                                class="tw:text-xs tw:text-gray-500"> Recommended (1200x800) </span>
                        </h3>
                    </div>

                    <div
                        @click="handleMainImageClick"
                        class="tw:flex tw:items-center tw:w-full tw:max-w-full tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:overflow-hidden tw:bg-white tw:cursor-pointer hover:tw:bg-gray-50">

                        <span
                            class="tw:px-4 tw:py-2 tw:bg-[#F6F1E7] tw:text-sm tw:text-gray-700 tw:border-r tw:border-[#E8E1D5]">
                            Choose from Media
                        </span>

                        <span class="tw:px-4 tw:py-2 tw:text-sm tw:text-gray-500 tw:flex-1">
                            {{ mainImage ? mainImage.file_name : 'No Image Selected' }}
                        </span>

                        <svg class="tw:w-5 tw:h-5 tw:mr-2 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>

                    <div v-if="mainImage" class="tw:relative tw:mt-4 tw:w-full">
                        <img :src="mainImage.image_url" alt="Talent main image preview"
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
                    <p v-if="fieldErrors.image_path" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ fieldErrors.image_path[0] }}</p>
                </div>

                <!-- ADDITIONAL IMAGES SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                            Additional Images (Max. 5 Images) <span class="tw:text-xs tw:text-gray-500"> Recommended
                                (1200x800) </span>
                        </h3>
                    </div>

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

                    <div v-if="resolvedAdditionalImages.length > 0" class="tw:space-y-4">
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

                        <div class="tw:grid tw:grid-cols-2 md:tw:grid-cols-3 lg:tw:grid-cols-5 tw:gap-4">
                            <div v-for="(image, index) in resolvedAdditionalImages" :key="image.image_id || index"
                                class="tw:relative tw:group">
                                <img :src="image.image_url" :alt="`Additional image ${index + 1}`"
                                    class="tw:w-full tw:h-32 tw:object-cover tw:rounded-lg tw:border tw:border-gray-200" />
                                <button @click="removeAdditionalImage(index)" type="button"
                                    class="tw:absolute tw:top-2 tw:right-2 tw:w-6 tw:h-6 tw:bg-red-500 tw:text-white tw:rounded-full tw:flex tw:items-center tw:justify-center tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity hover:tw:bg-red-700">
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
                    <div class="tw:flex tw:flex-col tw:md:flex-row tw:gap-4">
                        <!-- Category Dropdown -->
                        <div class="tw:flex-1">
                            <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
                                Category <span class="tw:text-red-500">*</span>
                            </label>
                            <div class="tw:relative">
                                <select v-model="form.talent_category_id" @change="handleCategoryChangeWithValidation"
                                    :disabled="isLoadingCategories || categoriesError" :class="[
                                        'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                                        categoryError ? 'tw:border-red-500' : 'tw:border-gray-200',
                                        (isLoadingCategories || categoriesError) ? 'tw:bg-gray-100 tw:cursor-not-allowed' : ''
                                    ]">
                                    <option value="">
                                        {{ isLoadingCategories ? 'Loading...' : (categoriesError ? 'Error loading categories' : 'Select Category') }}
                                    </option>
                                    <option v-for="category in categoriesTalents" :key="category.id" :value="category.id">
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
                                    (!form.talent_category_id || categoriesError) ? 'disabled' : '',
                                    subcategoryError ? 'error' : ''
                                ]">
                                    <div class="subcategory-input-content">
                                        <span class="subcategory-input-text">
                                            {{ form.talent_subcategory_ids.length > 0
                                                ? `${form.talent_subcategory_ids.length} selected`
                                                : (form.talent_category_id ? 'Select Subcategories' : 'Select Category First')
                                            }}
                                        </span>
                                        <ChevronDown :class="[
                                            'dropdown-chevron',
                                            showSubcategoryDropdown ? 'rotated' : ''
                                        ]" />
                                    </div>
                                </div>

                                <!-- Dropdown Options -->
                                <div v-if="showSubcategoryDropdown && form.talent_category_id && !categoriesError"
                                    class="subcategory-dropdown" ref="dropdownMenu">
                                    <div class="dropdown-content">
                                        <div v-for="subcategory in availableSubcategories" :key="subcategory.id"
                                            class="dropdown-option" :class="{
                                                'selected': form.talent_subcategory_ids.includes(subcategory.id),
                                                'disabled': !form.talent_subcategory_ids.includes(subcategory.id) && form.talent_subcategory_ids.length >= 5
                                            }" @click="toggleSubcategory(subcategory.id)">
                                            <input type="checkbox" :id="`subcategory-${subcategory.id}`"
                                                :value="subcategory.id" v-model="form.talent_subcategory_ids"
                                                :disabled="!form.talent_subcategory_ids.includes(subcategory.id) && form.talent_subcategory_ids.length >= 5"
                                                @change="handleSubcategoryChange" @click.stop class="option-checkbox">
                                            <label :for="`subcategory-${subcategory.id}`" class="option-label" @click.stop>
                                                {{ subcategory.name }}
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Max selection notice -->
                                    <div v-if="form.talent_subcategory_ids.length >= 5" class="max-selection-notice">
                                        Maximum 5 subcategories selected
                                    </div>
                                </div>
                            </div>

                            <!-- Selected Tags Display -->
                            <div v-if="form.talent_subcategory_ids.length > 0" class="selected-tags">
                                <span v-for="subcategoryId in form.talent_subcategory_ids" :key="subcategoryId"
                                    class="selected-tag">
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

                <!-- Talent DATE & TIME SECTION -->
                <!-- <div class="tw:bg-white tw:rounded-xl tw:border tw:border-gray-200 tw:p-6">

                    <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
                        Talent Date & Time
                    </h3>

                    
                    <div class="tw:flex tw:gap-6">

                        
                        <div class="tw:flex-1">
                            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-2">
                                Talent Date
                            </label>

                            <div class="tw:relative">
                                <input ref="dateInput" placeholder="MM/DD/YYYY"
                                    class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-gray-700 tw:placeholder-[#666666] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500" />

                                
                                <Calendar
                                    class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                            </div>
                        </div>

                        
                        <div class="tw:flex tw:gap-4" style="flex: 1;">

                            
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
                </div> -->

                <!-- Talent LOCATION SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">
                    <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
                        Talent Location <span class="tw:text-red-500">*</span>
                    </h3>

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
                            class="tw:absolute tw-top-full tw:left-0 tw:right-0 tw:mt-1 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-gray-200 tw:z-10 tw:max-h-60 tw:overflow-y-auto">
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
                        <p v-if="fieldErrors.address" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ fieldErrors.address[0] }}</p>
                    </div>
                </div>

                <!-- CONTACT DETAILS SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Contact Details
                    </h3>

                    <input v-model="contactPhone" type="text" placeholder="Telephone Number"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-orange-500 focus:tw:border-transparent tw:transition-all" />

                    <input v-model="contactEmail" type="email" placeholder="Email"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-orange-500 focus:tw:border-transparent tw:transition-all" />

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

                            
                            <div
                                class="tw:absolute tw:left-1 tw:top-1 tw:w-4 tw:h-4 tw:bg-white tw:rounded-full tw:transition tw:peer-checked:translate-x-6">
                            </div>
                        </label>
                    </div> -->
                </div>

                <!-- CONTACT BOX DESIGN SECTION -->
                <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Contact Box Design
                    </h3>

                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Design Message</label>
                        <textarea v-model="contactBoxDesignMessage" rows="4" placeholder="Enter your design message"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
                    </div>
                </div> -->

                <!-- SOCIAL MEDIA LINKS SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-5">
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

                <!-- FAN CLUB SITE SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Link to Fan Club Site
                    </h3>

                    <input v-model="fanClubUrl" type="text" placeholder="Enter Fan Club Website URL"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                </div>

                <!-- BOOKING & TICKET INFO SECTION -->
                <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Booking & Ticket Info
                    </h3>

                    <input v-model="ticketUrl" type="text" placeholder="Ticket / Booking URL"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                </div> -->

                <!-- NATIONALITY OF TALENT SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Nationality of Talent
                    </h3>

                    <!-- Exact Nationality Input -->
                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Enter Nationality</label>
                        <input v-model="exactNationality" type="text"
                            placeholder="e.g., American, British, German, French"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                    </div>

                    <!-- Yes/No Selection -->
                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Share info profile (Yes / No)</label>
                        <div class="tw:relative">
                            <select v-model="talentNationality"
                                class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                            <ChevronDown
                                class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
                        </div>
                    </div>
                </div>

                <!-- Age OF TALENT SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Age of Talent
                    </h3>

                    <!-- Exact Age Input -->
                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Enter Age</label>
                        <input v-model="exactAge" type="text" placeholder="e.g., 21, 22, 23"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                    </div>

                    <!-- Yes/No Selection -->
                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Share info profile (Yes / No)</label>
                        <div class="tw:relative">
                            <select v-model="showAge"
                                class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                            <ChevronDown
                                class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
                        </div>
                    </div>
                </div>

                <!-- LANGUAGES SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Languages
                    </h3>

                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Languages</label>
                        <input v-model="languagesText" type="text" placeholder="Enter languages"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                    </div>
                </div>

                <!-- TALENT HIGHLIGHTS SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Talent Highlights
                    </h3>

                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Highlights</label>

                        <textarea v-model="talentHighlightsText" placeholder="Enter talent highlights" rows="3"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-y"></textarea>

                    </div>
                </div>

                <!-- INVITE SECTION -->
                <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                            Invite
                        </h3>
                        <button
                            class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
                            <Plus class="tw:w-5 tw:h-5" />
                        </button>
                    </div>

                    <p class="tw:text-sm tw:text-[#1E3A8A]">
                        Make your event stand out even more. These sections help attendees find information and
                        answer
                        their
                        questions.
                    </p>

                    <div class="tw:space-y-3">
                        <InviteSection role="organiser" :has-border="true" />
                        <InviteSection role="venue" :has-border="false" />
                        <InviteSection role="talent" :has-border="false" />
                    </div>
                </div> -->

                <!-- Talent OPTIONS SECTION -->
                <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Talent Options
                    </h3>

                    <div class="tw:flex tw:gap-6 tw:items-center">
                        
                        <label class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
                            <input type="radio" value="copy" v-model="eventOption"
                                class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500" />
                            <span class="tw:text-sm tw:text-gray-700">Copy Talent</span>
                        </label>

                        
                        <label class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
                            <input type="radio" value="recurring" v-model="eventOption"
                                class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500" />
                            <span class="tw:text-sm tw:text-gray-700">Recurring Talent</span>
                        </label>
                    </div>
                </div> -->

                                <!-- EVENT VISIBILITY SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-6">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Talent Visibility
                    </h3>

                    <!-- Show Upcoming Events -->
                    <div class="tw:flex tw:flex-col tw:gap-2">
                        <p class="tw:text-sm tw:font-medium tw:text-gray-900">
                            Show Upcoming Talent Events (max 1 year)
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
                            Show Past Talent Events (max 1 year)
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

                <!-- SAVE Talent BUTTON -->
                <div class="tw:w-full tw:pt-4">
                    <div class="tw:flex tw:flex-col tw:md:flex-row tw:w-full tw:items-stretch tw:md:items-center tw:justify-end tw:gap-2">
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
                    <!-- <span class="tw:text-red-500 tw:text-sm tw:mt-2 tw:block">Soon available</span> -->
                </div>

            </div>
        </div>
    </div>

    <Teleport to="body">
        <MediaPickerModal
            :visible="showMediaModal"
            :multiple="selectedMediaType === 'additional'"
            :max-selection="selectedMediaType === 'additional' ? 5 : 1"
            :preselected-ids="selectedMediaType === 'main' ? (formData.image_path ? [formData.image_path] : []) : formData.additional_images"
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
    MessageSquareText,
    Images
} from "lucide-vue-next"

import { ref, reactive, onMounted, onBeforeUnmount, computed, nextTick } from "vue"
import { storeToRefs } from "pinia"
import { useMyTalentStore } from "@/stores/myTalentStore"
import { useRouter, useRoute } from "vue-router"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import InviteSection from "@/components/invite/InviteSection.vue"
import MediaPickerModal from "@/components/media/MediaPickerModal.vue"
import { galleryApi } from "@/api/gallery"
import eventService from "@/services/eventService"
import { useFormValidation } from "@/composables/useFormValidation"
import { useAuthStore } from "@/stores/auth"
import { useChatStore } from "@/stores/chatStore"
import { useToast } from "@/composables/useToast"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.css"

const router = useRouter()
const route = useRoute()
const toast = useToast()

const myTalentStore = useMyTalentStore()
const { talents, loading: talentsLoading, error: talentsError } = storeToRefs(myTalentStore)

const authStore = useAuthStore()
const chatStore = useChatStore()
const mobileSidebarOpen = ref(false)
function toggleMobileSidebar() { mobileSidebarOpen.value = !mobileSidebarOpen.value }
function closeMobileSidebar() { mobileSidebarOpen.value = false }

const activeTab = ref("home")
const isSubmitting = ref(false)
const isEditMode = ref(false)
const editingTalentId = ref(null)
const eventDescription = ref("")
const fieldErrors = ref({})

const showMediaModal = ref(false)
const selectedMediaType = ref('main')
const galleryImages = ref([])
const pendingFileMap = ref({})

const mainImage = computed(() => {
    if (!formData.image_path) return null
    return galleryImages.value.find(img => img.image_id === formData.image_path)
})

const resolvedAdditionalImages = computed(() => {
    return formData.additional_images
        .map(id => galleryImages.value.find(img => img.image_id === id))
        .filter(Boolean)
})

function handleChatboxClick() {
    closeMobileSidebar()
    if (authStore.user?.account_type !== 'premium') {
        toast.warning('Chat is available only for premium users.')
        return
    }
    chatStore.open()
}

// ── Form Validation (generic composable) ─────────────────────
const formData = reactive({
    talentTitle: '',
    category: '',
    subcategories: [],
    image_path: '',
    additional_images: [],
    remove_main_image: false,
})

const talentSchema = {
    talentTitle: { type: 'text', required: true, min: 3, max: 100, label: 'Talent Title' },
    category: { type: 'select', required: true, label: 'Category' },
    subcategories: { type: 'multiselect', required: true, min: 1, max: 5, label: 'Subcategories' },
}

const { errors: formErrors, validate, clearError, resetErrors, scrollToFirstError } = useFormValidation(talentSchema, formData)

const contactPhone = ref("")
const contactEmail = ref("")
const contactWebsite = ref("")
const talentNationality = ref('')
const exactNationality = ref('')
const exactAge = ref('')
const showAge = ref('show')
const languagesText = ref('')
const talentHighlightsText = ref('')
const showUpcomingEvents = ref("")
const showPastEvents = ref("")

const facebookUrl = ref("")
const instagramUrl = ref("")
const tiktokUrl = ref("")
const fanClubUrl = ref("")

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
const selectedCategory = ref("")
const talentCity = ref("")

// Genre state
const form = reactive({
  talent_category_id: "",
  talent_subcategory_ids: []
})
const selectedSubcategories = ref([])
const categoryError = ref(false)
const subcategoryError = ref(false)
const subcategoryValidationError = ref(false)
const categoriesTalents = ref([])
const isLoadingCategories = ref(false)
const categoriesError = ref(null)
const showSubcategoryDropdown = ref(false)

// Dropdown refs for click outside functionality
const dropdownContainer = ref(null)
const dropdownMenu = ref(null)

// Computed property for available subcategories
const availableSubcategories = computed(() => {
    if (!form.talent_category_id) return []
    const selectedCategoryData = categoriesTalents.value.find(cat => cat.id === form.talent_category_id)
    return selectedCategoryData ? selectedCategoryData.subcategories : []
})

// Computed property for selected category details
const selectedCategoryDetails = computed(() => {
    return categoriesTalents.value.find(cat => cat.id === form.talent_category_id)
})

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

function handleCategoryChangeWithValidation() {
    form.talent_subcategory_ids = []
    subcategoryError.value = false
    subcategoryValidationError.value = false
    categoryError.value = false
    showSubcategoryDropdown.value = false
}

function handleCategoryChange() {
    handleCategoryChangeWithValidation()
}

function toggleSubcategoryDropdown() {
    if (!form.talent_category_id || categoriesError.value) return
    showSubcategoryDropdown.value = !showSubcategoryDropdown.value
}

function toggleSubcategory(subcategoryId) {
    if (!form.talent_subcategory_ids.includes(subcategoryId) && form.talent_subcategory_ids.length >= 5) {
        return
    }
    const index = form.talent_subcategory_ids.indexOf(subcategoryId)
    if (index > -1) {
        form.talent_subcategory_ids.splice(index, 1)
    } else {
        form.talent_subcategory_ids.push(subcategoryId)
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
    if (form.talent_subcategory_ids.length > 5) {
        form.talent_subcategory_ids = form.talent_subcategory_ids.slice(0, 5)
        subcategoryValidationError.value = true
        setTimeout(() => { subcategoryValidationError.value = false }, 3000)
    } else {
        subcategoryValidationError.value = false
    }
}

function removeSubcategory(subcategoryIdToRemove) {
    const index = form.talent_subcategory_ids.indexOf(subcategoryIdToRemove)
    if (index > -1) {
        form.talent_subcategory_ids.splice(index, 1)
        subcategoryValidationError.value = false
    }
}

function validateGenre() {
    categoryError.value = !form.talent_category_id
    subcategoryError.value = form.talent_subcategory_ids.length === 0
    return form.talent_category_id && form.talent_subcategory_ids.length > 0
}

// Menu items specific to CreateEventPremium
const menuItems = [
    { id: "home", icon: Home, label: "Home", route: "/create-talents-premium" },
    { id: "details", icon: FileText, label: "Details", route: "/create-talents-premium" },
    { id: "analytics", icon: BarChart3, route: "/create-talents-premium/report", label: "Analytics" },
    { id: "gallery", icon: Images, route: "/create-talents-premium/gallery-images", label: "Gallery" },
    { id: "settings", icon: Settings, route: "/create-talents-premium/settings", label: "Settings" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "back", icon: SkipBackIcon, label: "Back" },
    { id: "chatbox", icon: MessageSquareText, label: "Chatbox" },
]

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside)
})

function handleMainImageClick() {
    selectedMediaType.value = 'main'
    showMediaModal.value = true
}

function handleAdditionalImagesClick() {
    selectedMediaType.value = 'additional'
    showMediaModal.value = true
}

function handleMediaSelect(ids) {
    if (selectedMediaType.value === 'main') {
        formData.image_path = ids[0] || ''
        formData.remove_main_image = false
    } else {
        formData.additional_images = ids.slice(0, 5)
    }
}

function handleImageUpdated(newImages, files) {
    galleryImages.value = [...newImages, ...galleryImages.value]
    if (!files || files.length === 0) return
    newImages.forEach((img, i) => {
        if (files[i] instanceof File) {
            pendingFileMap.value[img.image_id] = files[i]
        }
    })
    if (selectedMediaType.value === 'main' && newImages.length > 0) {
        formData.image_path = newImages[0].image_id
        formData.remove_main_image = false
    } else if (selectedMediaType.value === 'additional') {
        formData.additional_images = newImages.map(img => img.image_id).slice(0, 5)
    }
}

function removeMainImage() {
    formData.image_path = ''
    formData.remove_main_image = true
}

function removeAdditionalImage(index) {
    if (formData.additional_images && formData.additional_images.length > index) {
        formData.additional_images.splice(index, 1)
    }
}

function clearAllAdditionalImages() {
    formData.additional_images = []
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

// Sync category/subcategory selections into formData for validation
function syncFormData() {
    formData.category = selectedCategoryDetails.value?.name || ''
    formData.subcategories = form.talent_subcategory_ids
        .map((id) => availableSubcategories.value.find((s) => s.id === id)?.name)
        .filter(Boolean)
}

function buildTalentPayload() {
    const imagePath = typeof formData.image_path === 'string' ? formData.image_path.trim() : ''
    if (!imagePath) {
        throw new Error('image_path is required')
    }
    const additionalImages = (formData.additional_images || [])
        .map((id) => (id == null ? '' : String(id).trim()))
        .filter(Boolean)
        .slice(0, 5)

    const categoryId = Number(form.talent_category_id)
    const subIds = form.talent_subcategory_ids.map(Number).filter((n) => !Number.isNaN(n))
    const catName =
        categoriesTalents.value.find((c) => c.id === categoryId)?.name || ''
    const subNames = form.talent_subcategory_ids
        .map((sid) => availableSubcategories.value.find((s) => s.id === sid)?.name)
        .filter(Boolean)
    const genre = [catName, ...subNames].filter(Boolean).join(', ') || catName

    const langStr = languagesText.value?.trim()
    const languages = langStr
        ? langStr.split(',').map((s) => s.trim()).filter(Boolean)
        : []

    let ageVal = exactAge.value || ''
    if (typeof exactAge.value === 'string' && exactAge.value.trim() !== '' && !Number.isNaN(Number(exactAge.value))) {
        ageVal = Number(exactAge.value)
    }

    return {
        title: formData.talentTitle,
        description: eventDescription.value || undefined,
        event_type: 'premium',
        image_path: imagePath,
        additional_images: additionalImages,
        category_id: categoryId,
        subcategory_ids: subIds,
        genre: genre || undefined,
        location: selectedAddress.value || undefined,
        address: selectedAddress.value || undefined,
        latitude: mapLat.value,
        longitude: mapLng.value,
        city: talentCity.value || undefined,
        contact_phone: contactPhone.value || undefined,
        contact_email: contactEmail.value || undefined,
        contact_website: contactWebsite.value || undefined,
        facebook_url: facebookUrl.value || undefined,
        instagram_url: instagramUrl.value || undefined,
        tiktok_url: tiktokUrl.value || undefined,
        fan_club_url: fanClubUrl.value || undefined,
        nationality: exactNationality.value || undefined,
        show_nationality: talentNationality.value || undefined,
        age: ageVal === '' ? undefined : ageVal,
        show_age: showAge.value || undefined,
        languages: languages.length ? languages : undefined,
        highlights: talentHighlightsText.value || undefined,
        show_upcoming_events: !!showUpcomingEvents.value,
        show_past_events: !!showPastEvents.value,
    }
}

async function createTalent() {
    try {
        fieldErrors.value = {}
        const payload = buildTalentPayload()
        const response = await eventService.createTalent(payload)
        if (response.success) {
            toast.success('Talent created successfully.')
            await myTalentStore.fetchMyTalents()
            pendingFileMap.value = {}
            resetForm()
        } else {
            if (response.errors) {
                fieldErrors.value = response.errors
                toast.error(response.message || 'Please correct the errors.')
            } else {
                toast.error(response.message || 'Failed to create talent.')
            }
        }
    } catch (error) {
        console.error('Error creating talent:', error)
        if (error instanceof Error && error.message === 'image_path is required') {
            fieldErrors.value = { ...fieldErrors.value, image_path: ['Main image is required'] }
            toast.error('Please select a main image from your gallery.')
            return
        }
        if (error.response?.data?.errors) {
            fieldErrors.value = error.response.data.errors
            toast.error(error.response.data.message || 'Please correct the errors.')
        } else {
            toast.error(error.response?.data?.message || 'Failed to create talent.')
        }
    }
}

async function updateTalent() {
    if (!editingTalentId.value) return
    try {
        fieldErrors.value = {}
        const payload = buildTalentPayload()
        const response = await eventService.updateTalent(editingTalentId.value, payload)
        if (response.success) {
            toast.success('Talent updated successfully.')
            pendingFileMap.value = {}
            isEditMode.value = false
            editingTalentId.value = null
            resetForm()
        } else {
            if (response.errors) {
                fieldErrors.value = response.errors
                toast.error(response.message || 'Please correct the errors.')
            } else {
                toast.error(response.message || 'Failed to update talent.')
            }
        }
    } catch (error) {
        console.error('Error updating talent:', error)
        if (error instanceof Error && error.message === 'image_path is required') {
            fieldErrors.value = { ...fieldErrors.value, image_path: ['Main image is required'] }
            toast.error('Please select a main image from your gallery.')
            return
        }
        if (error.response?.data?.errors) {
            fieldErrors.value = error.response.data.errors
            toast.error(error.response.data.message || 'Please correct the errors.')
        } else {
            toast.error(error.response?.data?.message || 'Failed to update talent.')
        }
    }
}

function cancelEdit() {
    isEditMode.value = false
    editingTalentId.value = null
    resetForm()
}

// ── Load Talent for editing ─────────────────────────────────────
async function loadTalent(id) {
    try {
        if (!categoriesTalents.value.length) await fetchCategories()
        await fetchGalleryImages()

        const response = await eventService.getTalentById(id)
        const talent = response.data || response

        isEditMode.value = true
        editingTalentId.value = id

        formData.talentTitle = talent.title || ''
        eventDescription.value = talent.description || ''
        selectedAddress.value = talent.address || ''
        searchAddress.value = talent.address || ''
        talentCity.value = talent.city || ''

        if (talent.latitude) mapLat.value = talent.latitude
        if (talent.longitude) mapLng.value = talent.longitude

        const catId = talent.talent_category_id ?? talent.category_id
        if (catId) {
            form.talent_category_id = catId
            await nextTick()
            const subs = talent.talent_subcategories || talent.subcategories || []
            if (subs.length) {
                form.talent_subcategory_ids = subs.map((s) => s.id)
            }
        }

        formData.image_path =
            typeof talent.image_path === 'string' && talent.image_path.trim()
                ? talent.image_path.trim()
                : ''

        let addUuids = []
        if (Array.isArray(talent.additional_images)) {
            addUuids = talent.additional_images
                .map((img) => {
                    if (img == null) return ''
                    if (typeof img === 'object' && img !== null) {
                        return img.image_id || img.image_path || ''
                    }
                    return String(img)
                })
                .filter((id) => id !== null && id !== '')
        }
        formData.additional_images = addUuids
        formData.remove_main_image = false

        // Contact & social
        contactPhone.value = talent.contact_phone || ''
        contactEmail.value = talent.contact_email || ''
        contactWebsite.value = talent.contact_website || ''
        facebookUrl.value = talent.facebook_url || ''
        instagramUrl.value = talent.instagram_url || ''
        tiktokUrl.value = talent.tiktok_url || ''
        fanClubUrl.value = talent.fan_club_url || ''

        // Nationality & age
        exactNationality.value = talent.nationality || ''
        talentNationality.value = talent.show_nationality || ''
        exactAge.value = talent.age || ''
        showAge.value = talent.show_age || 'show'

        // Languages & highlights
        if (Array.isArray(talent.languages)) {
            languagesText.value = talent.languages.join(', ')
        } else {
            languagesText.value = talent.languages || ''
        }
        talentHighlightsText.value = talent.highlights || ''

        // Visibility
        showUpcomingEvents.value = talent.show_upcoming_events === '1' || talent.show_upcoming_events === true
        showPastEvents.value = talent.show_past_events === '1' || talent.show_past_events === true

        fieldErrors.value = {}

        // Center map
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

// ── Reset Form ──────────────────────────────────────────────────
function resetForm() {
    formData.talentTitle = ''
    eventDescription.value = ''
    formData.category = ''
    formData.subcategories = []
    formData.image_path = ''
    formData.additional_images = []
    formData.remove_main_image = false
    form.talent_category_id = ''
    form.talent_subcategory_ids = []
    selectedCategory.value = ''
    selectedSubcategories.value = []
    selectedAddress.value = ''
    searchAddress.value = ''
    talentCity.value = ''
    pendingFileMap.value = {}
    mapLat.value = null
    mapLng.value = null
    contactPhone.value = ''
    contactEmail.value = ''
    contactWebsite.value = ''
    facebookUrl.value = ''
    instagramUrl.value = ''
    tiktokUrl.value = ''
    fanClubUrl.value = ''
    exactNationality.value = ''
    talentNationality.value = ''
    exactAge.value = ''
    showAge.value = 'show'
    languagesText.value = ''
    talentHighlightsText.value = ''
    showUpcomingEvents.value = false
    showPastEvents.value = false
    categoryError.value = false
    subcategoryError.value = false
    subcategoryValidationError.value = false
    fieldErrors.value = {}
    isEditMode.value = false
    editingTalentId.value = null
    resetErrors()
}

// ── Handle Submit ───────────────────────────────────────────────
async function handleSubmit() {
    if (isSubmitting.value) return

    syncFormData()

    const isValid = validate()
    const genreValid = validateGenre()

    let hasExtraErrors = false
    const extraErrors = { ...fieldErrors.value }
    if (!eventDescription.value || !eventDescription.value.trim()) {
        extraErrors.description = ['Description is required']
        hasExtraErrors = true
    } else {
        delete extraErrors.description
    }
    if (!selectedAddress.value || !selectedAddress.value.trim()) {
        extraErrors.address = ['Talent location is required']
        hasExtraErrors = true
    } else {
        delete extraErrors.address
    }
    const mainUuid =
        typeof formData.image_path === 'string' ? formData.image_path.trim() : ''
    if (!mainUuid) {
        extraErrors.image_path = ['Main image is required']
        hasExtraErrors = true
    } else {
        delete extraErrors.image_path
    }
    fieldErrors.value = extraErrors

    if (!isValid || !genreValid || hasExtraErrors) {
        await scrollToFirstError()
        return
    }

    isSubmitting.value = true
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
        map.value.flyTo({ center: [lon, lat], zoom: 15, essential: true })
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

function handleBack() {
    closeMobileSidebar()
    router.push('/')
}

async function handleEventSelected(eventId) {
    closeMobileSidebar()
    await loadTalent(Number(eventId))
}

// Initialize map on component mount
onMounted(async () => {
    fetchCategories()
    fetchGalleryImages()
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
</script>