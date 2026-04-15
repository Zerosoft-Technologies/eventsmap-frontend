<template>
    <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6 tw:overflow-x-hidden">
        <div class="tw:w-full tw:max-w-7xl tw:flex tw:flex-col tw:md:flex-row tw:gap-4 tw:md:gap-6">
            <!-- Mobile Header -->
            <div class="tw:md:hidden tw:flex tw:items-center tw:justify-between tw:bg-white tw:rounded-xl tw:shadow-sm tw:px-4 tw:py-3">
                <button type="button" @click="handleBack" class="tw:text-sm tw:font-medium tw:text-[#0061FF]">Event Map</button>
                <button type="button" @click="toggleMobileSidebar" aria-label="Open menu" class="tw:text-2xl tw:leading-none tw:text-gray-700">☰</button>
            </div>

            <!-- Mobile Sidebar Drawer -->
            <div v-if="mobileSidebarOpen" class="tw:md:hidden tw:fixed tw:inset-0 tw:z-50">
                <div class="tw:absolute tw:inset-0 tw:bg-black/30" @click="closeMobileSidebar"></div>
                <div class="tw:absolute tw:left-0 tw:top-0 tw:h-screen tw:max-w-[92vw] tw:w-full tw:p-2">
                    <OrganiserSidebar :menuItems="menuItems" @back="handleBack" @organiser-selected="handleEventSelected" @chatbox-click="handleChatboxClick" @menu-click="closeMobileSidebar"/>
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
                                {{ formData.organiserTitle || 'Event Title' }}
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
            <!-- ================= LEFT CARD (Sidebar Component) ================= -->
            <div class="tw:hidden tw:md:block">
                <OrganiserSidebar :menuItems="menuItems" @back="handleBack" @organiser-selected="handleEventSelected" 
                @chatbox-click="handleChatboxClick"/>
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

                <!-- Organiser TITLE SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                            Create Premium Organiser <span class="tw:text-red-500">*</span>
                        </h3>
                        <!-- <button
                            class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
                            <Plus class="tw:w-5 tw:h-5" />
                        </button> -->
                    </div>

                    <input v-model="formData.organiserTitle" type="text" placeholder="Enter Organiser Title"
                        data-field="organiserTitle" @input="formErrors.organiserTitle && clearError('organiserTitle')"
                        :class="[
                            'tw:w-full tw:bg-white tw:border tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all',
                            formErrors.organiserTitle ? 'tw:border-red-500' : 'tw:border-gray-200'
                        ]" />
                    <p v-if="formErrors.organiserTitle" class="tw:text-red-500 tw:text-sm tw:mt-1">{{
                        formErrors.organiserTitle }}</p>
                    <!-- Description -->
                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:text-gray-700">Description <span class="tw:text-red-500">*</span></label>
                        <textarea v-model="eventDescription" rows="4" placeholder="Describe Your Organiser..."
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
                        <p v-if="fieldErrors.description" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ fieldErrors.description[0] }}</p>
                    </div>
                </div>

                <!-- ================= CATEGORY SECTION ================= -->
                <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-6">

                    
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Category
                    </h3>

                    
                    <div class="tw:relative">
                        <select v-model="selectedCategory" class="tw:w-full tw:bg-white tw:border tw:border-[#DFE1E7] 
             tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 
             focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 
             focus:tw:border-transparent tw:appearance-none tw:cursor-pointer">
                            <option value="">Select Category</option>
                            <option value="music">Music</option>
                            <option value="film">Film</option>
                            <option value="theatre">Theatre</option>
                        </select>

                        <ChevronDown class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 
             tw:w-5 tw:h-5 tw:text-gray-400 tw:pointer-events-none" />
                    </div>

                    
                    <div class="tw:space-y-6">

                        
                        <div class="tw:space-y-4">
                            <h4 class="tw:text-md tw:font-normal tw:text-gray-800">
                                Category Specific Details
                            </h4>

                            <div class="tw:flex tw:items-center tw:gap-6">
                                <label class="tw:w-44 tw:text-sm tw:text-gray-700">
                                    Music, Lineup:
                                </label>
                                <input type="text" placeholder="Artist / Band Names" class="tw:flex-1 tw:bg-gray-50 tw:border tw:border-[#DFE1E7] 
                 tw:rounded-lg tw:px-4 tw:py-2 tw:text-sm" />
                            </div>

                            <div class="tw:flex tw:items-center tw:gap-6">
                                <label class="tw:w-44 tw:text-sm tw:text-gray-700">
                                    Music, Headliner:
                                </label>
                                <input type="text" placeholder="Main Performer" class="tw:flex-1 tw:bg-gray-50 tw:border tw:border-[#DFE1E7] 
                 tw:rounded-lg tw:px-4 tw:py-2 tw:text-sm" />
                            </div>
                        </div>

                        
                        <div class="tw:space-y-4">
                            <h4 class="tw:text-md tw:font-normal tw:text-gray-800">
                                Film Details
                            </h4>

                            <div class="tw:flex tw:items-center tw:gap-6">
                                <label class="tw:w-44 tw:text-sm tw:text-gray-700">
                                    Director:
                                </label>
                                <input type="text" placeholder="Director Name" class="tw:flex-1 tw:bg-gray-50 tw:border tw:border-[#DFE1E7] 
                 tw:rounded-lg tw:px-4 tw:py-2 tw:text-sm" />
                            </div>

                            <div class="tw:flex tw:items-center tw:gap-6">
                                <label class="tw:w-44 tw:text-sm tw:text-gray-700">
                                    Duration:
                                </label>
                                <input type="text" placeholder="E.G 120 Minutes" class="tw:flex-1 tw:bg-gray-50 tw:border tw:border-[#DFE1E7] 
                 tw:rounded-lg tw:px-4 tw:py-2 tw:text-sm" />
                            </div>
                        </div>

                        
                        <div class="tw:space-y-4">
                            <h4 class="tw:text-md tw:font-normal tw:text-gray-800">
                                Theatre Details
                            </h4>

                            <div class="tw:flex tw:items-center tw:gap-6">
                                <label class="tw:w-44 tw:text-sm tw:text-gray-700">
                                    Cast:
                                </label>
                                <input type="text" placeholder="Main Cast Members" class="tw:flex-1 tw:bg-gray-50 tw:border tw:border-[#DFE1E7] 
                 tw:rounded-lg tw:px-4 tw:py-2 tw:text-sm" />
                            </div>

                            <div class="tw:flex tw:items-center tw:gap-6">
                                <label class="tw:w-44 tw:text-sm tw:text-gray-700">
                                    Act Structure:
                                </label>
                                <input type="text" placeholder="E.G 3 Acts" class="tw:flex-1 tw:bg-gray-50 tw:border tw:border-[#DFE1E7] 
                 tw:rounded-lg tw:px-4 tw:py-2 tw:text-sm" />
                            </div>
                        </div>

                    </div>
                </div> -->

                <!-- Organiser IMAGE SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">

                    <!-- Header -->
                    <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
                        <h3 class="tw:text-lg tw:font-semibold tw:text-gray-800">
                            Organiser Image <span class="tw:text-red-500">*</span> <span
                                class="tw:text-xs tw:text-gray-500"> Recommended (1200x800) </span>
                        </h3>

                        <!-- <button type="button"
                            class="tw:w-8 tw:h-8 tw:rounded-full tw:bg-blue-100 tw:text-blue-600 tw:flex tw:items-center tw:justify-center">
                            <Plus class="tw:w-4 tw:h-4" />
                        </button> -->
                    </div><!-- End of Header -->

                    <!-- Custom File Input -->
                    <div
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
                        <img :src="mainImage.image_url" alt="Organiser image preview"
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
                                <select v-model="form.organiser_category_id" @change="handleCategoryChangeWithValidation"
                                    :disabled="isLoadingCategories || categoriesError" :class="[
                                        'tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer',
                                        categoryError ? 'tw:border-red-500' : 'tw:border-gray-200',
                                        (isLoadingCategories || categoriesError) ? 'tw:bg-gray-100 tw:cursor-not-allowed' : ''
                                    ]">
                                    <option value="">
                                        {{ isLoadingCategories ? 'Loading...' : (categoriesError ? 'Error loading categories' :
                                        'Select Category') }}
                                    </option>
                                    <option v-for="category in categoriesOrganisers" :key="category.id" :value="category.id">
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
                                    (!form.organiser_category_id || categoriesError) ? 'disabled' : '',
                                    subcategoryError ? 'error' : ''
                                ]">
                                    <div class="subcategory-input-content">
                                        <span class="subcategory-input-text">
                                            {{ form.organiser_subcategory_ids.length > 0
                                                ? `${form.organiser_subcategory_ids.length} selected`
                                                : (form.organiser_category_id ? 'Select Subcategories' : 'Select Category First')
                                            }}
                                        </span>
                                        <ChevronDown :class="[
                                            'dropdown-chevron',
                                            showSubcategoryDropdown ? 'rotated' : ''
                                        ]" />
                                    </div>
                                </div>

                                <!-- Dropdown Options -->
                                <div v-if="showSubcategoryDropdown && form.organiser_category_id && !categoriesError" class="subcategory-dropdown"
                                    ref="dropdownMenu">
                                    <div class="dropdown-content">
                                        <div v-for="subcategory in availableSubcategories" :key="subcategory.id" class="dropdown-option"
                                            :class="{
                                                'selected': form.organiser_subcategory_ids.includes(subcategory.id),
                                                'disabled': !form.organiser_subcategory_ids.includes(subcategory.id) && form.organiser_subcategory_ids.length >= 5
                                            }" @click="toggleSubcategory(subcategory.id)">
                                            <input type="checkbox" :id="`subcategory-${subcategory.id}`" :value="subcategory.id"
                                                v-model="form.organiser_subcategory_ids"
                                                :disabled="!form.organiser_subcategory_ids.includes(subcategory.id) && form.organiser_subcategory_ids.length >= 5"
                                                @change="handleSubcategoryChange" @click.stop class="option-checkbox">
                                            <label :for="`subcategory-${subcategory.id}`" class="option-label" @click.stop>
                                                {{ subcategory.name }}
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Max selection notice -->
                                    <div v-if="form.organiser_subcategory_ids.length >= 5" class="max-selection-notice">
                                        Maximum 5 subcategories selected
                                    </div>
                                </div>
                            </div>

                            <!-- Selected Tags Display -->
                            <div v-if="form.organiser_subcategory_ids.length > 0" class="selected-tags">
                                <span v-for="subcategoryId in form.organiser_subcategory_ids" :key="subcategoryId" class="selected-tag">
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
                            <p v-else-if="subcategoryError" class="validation-error">Please select at least one subcategory</p>
                        </div>
                    </div>
                </div>

                <!-- ORGANISER LOCATION SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">
                    <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
                        Organiser Location <span class="tw:text-red-500">*</span>
                    </h3>

                    <!-- Address Search Input with Loading Spinner -->
                    <div class="tw:relative tw:mb-4">
                        <input
                            v-model="searchAddress"
                            @input="onSearchInput"
                            type="text"
                            placeholder="Search Address..."
                            class="tw:w-full tw:h-12 tw:md:h-auto tw:bg-white tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-base tw:md:text-[16px] tw:text-gray-700 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all"
                        />

                        <!-- Loading Spinner -->
                        <div v-if="isLoading" class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2">
                            <svg class="tw:animate-spin tw:h-5 tw:w-5 tw:text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="tw:opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="tw:opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>

                        <!-- Suggestions Dropdown -->
                        <div
                            v-if="suggestions.length > 0"
                            class="tw:absolute tw:top-full tw:left-0 tw:right-0 tw:mt-1 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-gray-200 tw:z-10 tw:max-h-60 tw:overflow-y-auto"
                        >
                            <button
                                v-for="(suggestion, index) in suggestions"
                                :key="index"
                                @click="selectSuggestion(suggestion)"
                                class="tw:w-full tw:px-4 tw:py-3 tw:text-left tw:text-sm tw:text-gray-700 hover:tw:bg-gray-50 tw:transition-colors tw:border-b tw:border-gray-100 last:tw:border-b-0"
                            >
                                {{ suggestion.display_name }}
                            </button>
                        </div>
                    </div>

                    <!-- Map Container -->
                    <div id="event-map" class="tw:w-full tw:h-[240px] tw:md:h-[300px] tw:rounded-lg tw:overflow-hidden tw:mb-4"></div>

                    <!-- Selected Address -->
                    <div class="tw:space-y-2">
                        <label class="tw:block tw:text-sm tw:text-gray-600">Selected Address</label>
                        <input
                            v-model="selectedAddress"
                            type="text"
                            readonly
                            placeholder="Address Will Auto Fill Here"
                            class="tw:w-full tw:h-12 tw:md:h-auto tw:bg-gray-50 tw:border tw:border-[#E8E1D5] tw:rounded-lg tw:px-4 tw:py-2.5 tw:text-base tw:md:text-[16px] tw:text-gray-700 placeholder:tw:text-gray-400 tw:cursor-not-allowed"
                        />
                        <p v-if="fieldErrors.address" class="tw:text-red-500 tw:text-sm tw:mt-1">{{ fieldErrors.address[0] }}</p>
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
                <!-- CONTACT DETAILS SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-5">
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

                            
                                class="tw:absolute tw:left-1 tw:top-1 tw:w-4 tw:h-4 tw:bg-white tw:rounded-full tw:transition tw:peer-checked:translate-x-6">
                            </div>
                        </label>
                    </div> -->
                </div>

                <!-- CONTACT BOX SECTION -->
                <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Contact Box
                    </h3>

                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Contact Message</label>
                        <textarea v-model="contactBoxMessage" rows="4" placeholder="Enter your contact message"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
                    </div>
                </div> -->

                <!-- SOCIAL MEDIA LINKS SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
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

                <!-- Organiser CONDITIONS SECTION -->
                <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Organiser Conditions (Optional)
                    </h3>

                    <input type="text" placeholder="Entrance Fee (If Different)"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

                    <input type="text" placeholder="Dress Code (If Different)"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

                    <input type="text" placeholder="Age Limit (If Different)"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                </div> -->

                <!-- BOOKING & TICKET INFO SECTION -->
                <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Booking & Ticket Info
                    </h3>

                    <input v-model="ticketUrl" type="text" placeholder="Ticket / Booking URL"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

                    <textarea v-model="bookingInstructions" rows="4" placeholder="Booking Instructions"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
                </div> -->

                <!-- INVITE SECTION -->
                <!-- <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
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
                        <InviteSection role="talent" :has-border="true" />
                        <InviteSection role="venue"     :has-border="false" />
                        <InviteSection role="organizer" :has-border="false" />
                    </div>
                </div> -->

                <!-- Organiser OPTIONS SECTION -->
                <!-- <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Organiser Options
                    </h3>

                    <div class="tw:flex tw:gap-6 tw:items-center">
                        
                        <label class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
                            <input type="radio" value="copy" v-model="eventOption"
                                class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500" />
                            <span class="tw:text-sm tw:text-gray-700">Copy Organiser</span>
                        </label>

                        
                        <label class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
                            <input type="radio" value="recurring" v-model="eventOption"
                                class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500" />
                            <span class="tw:text-sm tw:text-gray-700">Recurring Organiser</span>
                        </label>
                    </div>
                </div> -->

                                <!-- EVENT VISIBILITY SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-6">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Organiser Visibility
                    </h3>

                    <!-- Show Upcoming Events -->
                    <div class="tw:flex tw:flex-col tw:gap-2">
                        <p class="tw:text-sm tw:font-medium tw:text-gray-900">
                            Show Upcoming Organiser Events (max 1 year)
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
                            Show Past Organiser Events (max 1 year)
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

                <!-- SAVE Organiser BUTTON -->
                <div class="tw:w-full tw:pt-4">
                    <div class="tw:flex tw:flex-col tw:md:flex-row tw:w-full tw:items-stretch tw:md:items-center tw:justify-end">
                        <!-- <button class="tw:px-6 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md 
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
                                {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Organiser' : 'Save Organiser') }}
                            </button>
                        </div>
                    </div>
                    <!-- <span class="tw:text-red-500 tw:text-sm tw:mt-2 tw:block">Soon available</span> -->
                </div>

            </div>
        </div>
    </div>

    <!-- Media Picker Modal -->
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
    MessageSquareText,
    Images
} from "lucide-vue-next"

import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import OrganiserSidebar from "./eventsidebar/OrganiserSidebar.vue"
import InviteSection from "@/components/invite/InviteSection.vue"
import AdditionalImageUpload from "@/components/common/AdditionalImageUpload.vue"
import MediaPickerModal from "@/components/media/MediaPickerModal.vue"
import eventService from "@/services/eventService"
import { useMyOrganiserStore } from "@/stores/myOrganiserStore"
import { useFormValidation } from "@/composables/useFormValidation"
import { useToast } from "@/composables/useToast"
import { useAuthStore } from "@/stores/auth"
import { useChatStore } from "@/stores/chatStore"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.css"

const router = useRouter()
const route = useRoute()
const myOrganiserStore = useMyOrganiserStore()
const toast = useToast()
const authStore = useAuthStore()
const chatStore = useChatStore()
const mobileSidebarOpen = ref(false)

function toggleMobileSidebar() {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
}

function closeMobileSidebar() {
    mobileSidebarOpen.value = false
}


function handleChatboxClick() {
    closeMobileSidebar()
    if (authStore.user?.account_type !== 'premium') {
        toast.warning('Chat is available only for premium users.')
        return
    }
    chatStore.open()
}


const activeTab = ref("home")
const isSubmitting = ref(false)
const eventDescription = ref("")
const additionalImages = ref([])
const selectedVenue = ref("")
const selectedGenre = ref("")
const dressCode = ref("")
const ageLimit = ref("")
const contactPhone = ref("")
const contactEmail = ref("")
const contactWebsite = ref("")
// const bookingInstructions = ref('');
// const ticketUrl = ref('');
// const eventOption = ref('');

// Event options
const isRecurring = ref(false)
const isCopyEvent = ref(false)
const showUpcomingEvents = ref("")
const showPastEvents = ref("")
const showChatbox = ref(false)
const contactBoxMessage = ref('')

const notifications = ref({
    receiveEmail: false,
    receiveUpdates: false
})

const facebookUrl = ref("")
const instagramUrl = ref("")
const tiktokUrl = ref("")

const selectedCategory = ref("")

const selectedSubcategories = ref([])  // Multi-select array for subcategories
const categoryError = ref(false)
const subcategoryError = ref(false)
const subcategoryValidationError = ref(false)  // For max 5 validation
const categoriesOrganisers = ref([])
const isLoadingCategories = ref(false)
const categoriesError = ref(null)
const showSubcategoryDropdown = ref(false)  // For dropdown toggle

// Form for organiser categories
const form = reactive({
  organiser_category_id: "",
  organiser_subcategory_ids: []
})

// Dropdown refs for click outside functionality
const dropdownContainer = ref(null)
const dropdownMenu = ref(null)

// Computed property for available subcategories
const availableSubcategories = computed(() => {
    if (!form.organiser_category_id) return []
    const selectedCategoryData = categoriesOrganisers.value.find(cat => cat.id === form.organiser_category_id)
    return selectedCategoryData ? selectedCategoryData.subcategories : []
})

// Computed property for selected category details
const selectedCategoryDetails = computed(() => {
    return categoriesOrganisers.value.find(cat => cat.id === form.organiser_category_id)
})

// Fetch categories from API using eventService with retry
async function fetchCategories(retryCount = 0) {
    try {
        isLoadingCategories.value = true
        categoriesError.value = null

        const response = await eventService.getCategoriesOrganisers()

        if (response.success) {
            categoriesOrganisers.value = response.data
        } else {
            categoriesError.value = 'Failed to fetch categories'
        }
    } catch (error) {
        console.error('Error fetching categories:', error)
        if (retryCount < 2) {
            console.log(`Retrying categories fetch... Attempt ${retryCount + 1}`)
            setTimeout(() => fetchCategories(retryCount + 1), 1000)
        } else {
            categoriesError.value = 'Error loading categories. Please check your connection and refresh the page.'
            toast.error('Failed to load categories. Please check your connection and refresh the page.')
        }
    } finally {
        isLoadingCategories.value = false
    }
}

// Handle category change with validation clearing
function handleCategoryChangeWithValidation() {
    form.organiser_subcategory_ids = []  // Reset array when category changes
    subcategoryError.value = false
    subcategoryValidationError.value = false  // Clear validation error
    categoryError.value = false
    showSubcategoryDropdown.value = false  // Close dropdown
}

// Handle category change
function handleCategoryChange() {
    handleCategoryChangeWithValidation()
}

// Toggle subcategory dropdown
function toggleSubcategoryDropdown() {
    if (!form.organiser_category_id || categoriesError.value) return
    showSubcategoryDropdown.value = !showSubcategoryDropdown.value
}

// Toggle individual subcategory selection
function toggleSubcategory(subcategoryId) {
    if (!form.organiser_subcategory_ids.includes(subcategoryId) && form.organiser_subcategory_ids.length >= 5) {
        return // Prevent selection if already at max 5
    }

    const index = form.organiser_subcategory_ids.indexOf(subcategoryId)
    if (index > -1) {
        form.organiser_subcategory_ids.splice(index, 1)
    } else {
        form.organiser_subcategory_ids.push(subcategoryId)
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

    // Maximum 5 subcategories selection logic
    // Prevent selection if trying to add more than 5 items
    if (form.organiser_subcategory_ids.length > 5) {
        // Remove the last added item to maintain the limit
        const lastItem = form.organiser_subcategory_ids[form.organiser_subcategory_ids.length - 1]
        form.organiser_subcategory_ids = form.organiser_subcategory_ids.slice(0, 5)

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

// Validate genre fields
function validateGenre() {
    categoryError.value = !form.organiser_category_id
    subcategoryError.value = form.organiser_subcategory_ids.length === 0
    return form.organiser_category_id && form.organiser_subcategory_ids.length > 0
}

// Remove subcategory
function removeSubcategory(subcategoryIdToRemove) {
    const index = form.organiser_subcategory_ids.indexOf(subcategoryIdToRemove)
    if (index > -1) {
        form.organiser_subcategory_ids.splice(index, 1)
        subcategoryValidationError.value = false
    }
}

// ── Edit mode state ────────────────────────────────────────────────────
const isEditMode = ref(false)
const editingOrganiserId = ref(null)

// ── Image state ────────────────────────────────────────────────────────
const imagePreviewUrl = ref(null)
const pendingFileMap = ref({})
// const clearAllImages = ref(false)
const fieldErrors = ref({})

// Media picker state
const showMediaModal = ref(false)
const selectedMediaType = ref('main')
const galleryImages = ref([])

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
    if (!formData.image_path) return null
    const id = String(formData.image_path)
    return galleryImages.value.find((img) => String(img.image_id) === id) ?? null
})

const resolvedAdditionalImages = computed(() => {
    return formData.additional_images
        .map((rawId) => {
            const id = String(rawId)
            return galleryImages.value.find((img) => String(img.image_id) === id)
        })
        .filter(Boolean)
})

// Media Picker Handlers
const handleMainImageClick = () => {
    console.log('Main image clicked')
    openMediaModal('main')
}

const handleAdditionalImagesClick = () => {
    openMediaModal('additional')
}

const openMediaModal = (type) => {
    console.log('Opening media modal with type:', type)
    selectedMediaType.value = type
    showMediaModal.value = true
    console.log('showMediaModal set to:', showMediaModal.value)
}

const handleMediaSelect = (ids, items = []) => {
    mergeGalleryPickerItems(items)
    if (selectedMediaType.value === 'main') {
        formData.image_path = ids[0] != null && ids[0] !== '' ? String(ids[0]) : ''
        formData.remove_main_image = false
    } else {
        formData.additional_images = ids.slice(0, 5).map((id) => String(id))
        additionalImages.value = []
    }
}

const handleImageUpdated = (newImages, files) => {
    // Add newly uploaded images to the gallery resolution list
    galleryImages.value = [...newImages, ...galleryImages.value]

    if (!files || files.length === 0) return

    // Map every uploaded image_id → its File so it survives the modal confirm
    newImages.forEach((img, i) => {
        pendingFileMap.value[img.image_id] = files[i]
    })
}

const removeMainImage = () => {
    formData.image_path = ''
    formData.remove_main_image = true
}

const removeAdditionalImage = (index) => {
    // Remove from form.additional_images (existing images)
    if (formData.additional_images && formData.additional_images.length > index) {
        formData.additional_images.splice(index, 1)
    }
    // Also clear additionalImages ref if it's being used for new uploads
    if (additionalImages.value && additionalImages.value.length > index) {
        additionalImages.value.splice(index, 1)
    }
}

const clearAllAdditionalImages = () => {
    formData.additional_images = []
    additionalImages.value = []
}

/** Populate local image metadata from organiser detail (avoids GET /gallery-images on load/select). */
function setGalleryImagesFromOrganiser(org) {
    const items = []
    const mainId = typeof org.image_path === 'string' ? org.image_path.trim() : ''
    const mainUrl = org.image_url || org.main_image_url
    if (mainId && mainUrl) {
        items.push({
            image_id: mainId,
            image_url: mainUrl,
            file_name: org.title ? String(org.title).slice(0, 80) : 'Main image',
        })
    }
    if (Array.isArray(org.additional_images)) {
        for (const raw of org.additional_images) {
            if (raw == null || typeof raw !== 'object') continue
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
    galleryImages.value = items
}

// ── Form Validation ───────────────────────────────────────────────────
const formData = reactive({
    organiserTitle: '',
    category: '',
    subcategories: [],
    image_path: '',
    additional_images: [],
    remove_main_image: false,
})

const organiserSchema = {
    organiserTitle: { type: 'text', required: true, min: 3, max: 100, label: 'Organiser Title' },
    category: { type: 'select', required: true, label: 'Category' },
    subcategories: { type: 'multiselect', required: true, min: 1, max: 6, label: 'Subcategories' },
}

const { errors: formErrors, validate, clearError, resetErrors, scrollToFirstError } = useFormValidation(organiserSchema, formData)

const eventDate = ref("05.03.2026, 18:30 CET")
const eventStatus = ref("Premium")
const fileName = ref("")
const searchAddress = ref("")
const selectedAddress = ref("")
const map = ref(null)
const marker = ref(null)
const suggestions = ref([])
const isLoading = ref(false)
const debounceTimer = ref(null)
const latitude = ref(null)
const longitude = ref(null)

const menuItems = [
    { id: "home", icon: Home, label: "Home", route: "/create-organiser-premium" },
    { id: "details", icon: FileText, label: "Details", route: "/create-organiser-premium" },
    { id: "analytics", icon: BarChart3, route: "/create-organiser-premium/report", label: "Analytics" },
    { id: 'gallery', label: 'Gallery', icon: Images, route: `/create-organiser-premium/gallery-images` },
    { id: "settings", icon: Settings, route: "/create-organiser-premium/settings", label: "Settings" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "back", icon: SkipBackIcon, label: "Back" },
    { id: "chatbox", icon: MessageSquareText, label: "Chatbox" },
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

function syncFormData() {
    formData.category = selectedCategoryDetails.value?.name || ''
    formData.subcategories = availableSubcategories.value
        .filter(s => form.organiser_subcategory_ids.includes(s.id))
        .map(s => s.name)
}

// ── Build FormData (shared by create & update) ────────────────────────
function buildFormData() {
    const fd = new FormData()

    fd.append('title', formData.organiserTitle)
    fd.append('event_type', 'premium')

    // Organiser Category ID
    if (form.organiser_category_id) {
        fd.append('organiser_category_id', form.organiser_category_id)
    }

    // Organiser Subcategory IDs
    form.organiser_subcategory_ids.forEach(id => {
        fd.append('organiser_subcategory_ids[]', id)
    })

    fd.append('address', selectedAddress.value)
    if (latitude.value != null) fd.append('latitude', latitude.value)
    if (longitude.value != null) fd.append('longitude', longitude.value)

    if (eventDescription.value) fd.append('description', eventDescription.value)

    // Contact
    if (contactPhone.value) fd.append('contact_phone', contactPhone.value)
    if (contactEmail.value) fd.append('contact_email', contactEmail.value)
    if (contactWebsite.value) fd.append('contact_website', contactWebsite.value)

    // Social
    if (facebookUrl.value) fd.append('facebook_url', facebookUrl.value)
    if (instagramUrl.value) fd.append('instagram_url', instagramUrl.value)
    if (tiktokUrl.value) fd.append('tiktok_url', tiktokUrl.value)

    // Visibility
    fd.append('show_upcoming_events', showUpcomingEvents.value ? '1' : '0')
    fd.append('show_past_events', showPastEvents.value ? '1' : '0')

    // ── Main image (Always send UUID, not file) ───────────────────────────
    if (formData.image_path) {
        fd.append('image_path', formData.image_path)
    }
    
    // Additional images
    // ── Additional images (Always send UUIDs, not files) ───────────────────
    // Always send additional_images field, even if empty
    if (formData.additional_images && formData.additional_images.length > 0) {
        console.log('Additional images being sent:', formData.additional_images)
        formData.additional_images.forEach((imageId, index) => {
            console.log('Sending image ID:', imageId)
            fd.append(`additional_images[${index}]`, imageId)
        })
    } else {
        // Send empty array to clear additional images
        console.log('Sending empty additional_images array')
        fd.append('additional_images', '')
    }

    return fd
}

// ── Create ─────────────────────────────────────────────────────────────
async function createOrganiser() {
    try {
        isSubmitting.value = true
        fieldErrors.value = {}

        const fd = buildFormData()

        console.log('Create FormData:')
        for (let pair of fd.entries()) console.log(pair[0], pair[1])

        const response = await eventService.createOrganiser(fd)

        if (response.success) {
            toast.success('Organiser created successfully.')
            pendingFileMap.value = {}
            resetForm()
            // Refresh organiser list in sidebar
            const { useMyOrganiserStore } = await import("@/stores/myOrganiserStore")
            const myOrganiserStore = useMyOrganiserStore()
            myOrganiserStore.fetchMyOrganisers()
        } else {
            if (response.errors) {
                fieldErrors.value = response.errors
                toast.error(response.message || 'Please correct the errors.')
            } else {
                toast.error(response.message || 'Failed to create organiser.')
            }
        }
    } catch (error) {
        console.error('Error creating organiser:', error)
        if (error.response?.data?.errors) {
            fieldErrors.value = error.response.data.errors
            toast.error(error.response.data.message || 'Please correct the errors.')
        } else {
            toast.error(error.response?.data?.message || 'Failed to create organiser.')
        }
    } finally {
        isSubmitting.value = false
    }
}

// ── Update ─────────────────────────────────────────────────────────────
async function updateOrganiser() {
    if (!editingOrganiserId.value) return
    try {
        isSubmitting.value = true
        fieldErrors.value = {}

        const fd = buildFormData()
        fd.append('_method', 'PUT')
        // fd.append('remove_additional_images', clearAllImages.value ? '1' : '0')

        console.log('Update FormData:')
        for (let pair of fd.entries()) console.log(pair[0], pair[1])

        const response = await eventService.updateOrganiser(editingOrganiserId.value, fd)

        if (response.success) {
            toast.success('Organiser updated successfully.')
            pendingFileMap.value = {}
            // clearAllImages.value = false
            isEditMode.value = false
            editingOrganiserId.value = null
            resetForm()
            // Refresh organiser list in sidebar
            const { useMyOrganiserStore } = await import("@/stores/myOrganiserStore")
            const myOrganiserStore = useMyOrganiserStore()
            myOrganiserStore.fetchMyOrganisers()
        } else {
            if (response.errors) {
                fieldErrors.value = response.errors
                toast.error(response.message || 'Please correct the errors.')
            } else {
                toast.error(response.message || 'Failed to update organiser.')
            }
        }
    } catch (error) {
        console.error('Error updating organiser:', error)
        if (error.response?.data?.errors) {
            fieldErrors.value = error.response.data.errors
            toast.error(error.response.data.message || 'Please correct the errors.')
        } else {
            toast.error(error.response?.data?.message || 'Failed to update organiser.')
        }
    } finally {
        isSubmitting.value = false
    }
}

// ── Load for edit ──────────────────────────────────────────────────────
async function loadOrganiser(id) {
    try {
        if (!categoriesOrganisers.value.length) await fetchCategories()

        const response = await eventService.getOrganiserById(id)
        if (!response.success || !response.data) {
            toast.error(response.message || 'Failed to load organiser.')
            return false
        }
        const d = response.data

        formData.organiserTitle = d.title ?? ''
        eventDescription.value = d.description ?? ''
        selectedAddress.value = d.address ?? ''
        searchAddress.value = d.address ?? ''
        latitude.value = d.latitude ?? null
        longitude.value = d.longitude ?? null

        contactPhone.value = d.contact_phone ?? ''
        contactEmail.value = d.contact_email ?? ''
        contactWebsite.value = d.contact_website ?? ''

        facebookUrl.value = d.facebook_url ?? ''
        instagramUrl.value = d.instagram_url ?? ''
        tiktokUrl.value = d.tiktok_url ?? ''

        showUpcomingEvents.value = !!d.show_upcoming_events
        showPastEvents.value = !!d.show_past_events

        // Load image data
        formData.image_path = d.image_path || ''
        formData.additional_images = Array.isArray(d.additional_images)
            ? d.additional_images.filter(id => id !== null && id !== '')
            : []
        
        imagePreviewUrl.value = d.image_url || d.image_path || null
        fileName.value = d.image_path ? 'Existing image' : ''

        pendingFileMap.value = {}
        setGalleryImagesFromOrganiser(d)
        // clearAllImages.value = false

        // Category / subcategory hydration
        if (d.organiser_category_id) {
            form.organiser_category_id = d.organiser_category_id
            if (d.organiser_subcategories && Array.isArray(d.organiser_subcategories)) {
                form.organiser_subcategory_ids = d.organiser_subcategories.map(s => s.id)
            }
        }

        fieldErrors.value = {}
        isEditMode.value = true
        editingOrganiserId.value = d.id
        return true
    } catch (error) {
        console.error('Error loading organiser:', error)
        toast.error(error.response?.data?.message || 'Failed to load organiser.')
        return false
    }
}

function cancelEdit() {
    isEditMode.value = false
    editingOrganiserId.value = null
    resetForm()
}

function resetForm() {
    formData.organiserTitle = ''
    formData.category = ''
    formData.subcategories = []
    formData.image_path = ''
    formData.additional_images = []
    formData.remove_main_image = false
    form.organiser_category_id = ''
    form.organiser_subcategory_ids = []
    selectedCategory.value = ''
    selectedSubcategories.value = []
    selectedAddress.value = ''
    searchAddress.value = ''
    latitude.value = null
    longitude.value = null
    eventDescription.value = ''
    contactPhone.value = ''
    contactEmail.value = ''
    contactWebsite.value = ''
    facebookUrl.value = ''
    instagramUrl.value = ''
    tiktokUrl.value = ''
    showUpcomingEvents.value = false
    showPastEvents.value = false
    imagePreviewUrl.value = null
    additionalImages.value = []
    pendingFileMap.value = {}
    // clearAllImages.value = false
    fileName.value = ''
    fieldErrors.value = {}
    categoryError.value = false
    subcategoryError.value = false
    subcategoryValidationError.value = false
    isEditMode.value = false
    editingOrganiserId.value = null
    galleryImages.value = []
    resetErrors()
}

// ── Submit handler ─────────────────────────────────────────────────────
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
        extraErrors.address = ['Address is required']
        hasExtraErrors = true
    } else {
        delete extraErrors.address
    }
    if (!formData.image_path) {
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

    if (isEditMode.value) {
        await updateOrganiser()
    } else {
        await createOrganiser()
    }
}

// ── Debounce ───────────────────────────────────────────────────────────
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
    latitude.value = parseFloat(lat)
    longitude.value = parseFloat(lon)

    if (map.value) {
        map.value.flyTo({ center: [lon, lat], zoom: 15, essential: true })
        updateMarker(lon, lat)
    }
}

function updateMarker(lng, lat) {
    if (marker.value) marker.value.remove()

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
    await loadOrganiser(eventId)
}

// ── Lifecycle ──────────────────────────────────────────────────────────
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
        latitude.value = lat
        longitude.value = lng
        updateMarker(lng, lat)
        await reverseGeocode(lng, lat)
    })

    const organiserId =
        myOrganiserStore.takePendingEditorOrganiserId() ?? route.query.edit ?? route.params.id
    if (organiserId != null && organiserId !== '') {
        const loaded = await loadOrganiser(Number(organiserId))
        if (loaded && route.query.edit != null && String(route.query.edit) !== '') {
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

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
    if (map.value) map.value.remove()
})
</script>