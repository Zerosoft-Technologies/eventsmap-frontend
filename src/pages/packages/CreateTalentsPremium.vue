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
                    <EventSidebar :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected" @chatbox-click="handleChatboxClick" @menu-click="closeMobileSidebar" />
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
                <EventSidebar :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected" 
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
                            Create Premium Talent
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
                        <label class="tw:text-sm tw:text-gray-700">Description</label>
                        <textarea v-model="eventDescription" rows="4" placeholder="Describe Your Talent..."
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
                    </div>
                </div>

                <!-- Talent IMAGE SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-4 tw:md:p-6">

                    <!-- Header -->
                    <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
                        <h3 class="tw:text-lg tw:font-semibold tw:text-gray-800">
                            Talent Main Image <span class="tw:text-red-500">*</span> <span
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

                <!-- ADDITIONAL IMAGES SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:md:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                            Additional Images (Max. 5 images) <span class="tw:text-xs tw:text-gray-500"> Recommended
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
                                Subcategories (Max 1) <span class="tw:text-red-500">*</span>
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
                        Based inset
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
import { useRouter, useRoute } from "vue-router"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import InviteSection from "@/components/invite/InviteSection.vue"
import AdditionalImageUpload from "@/components/common/AdditionalImageUpload.vue"
import eventService from "@/services/eventService"
import { useFormValidation } from "@/composables/useFormValidation"
import { useAuthStore } from "@/stores/auth"
import { useChatStore } from "@/stores/chatStore"
import { useToast } from "@/composables/useToast"
import { useTimeRangeValidation } from "@/composables/useTimeRangeValidation"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.css"

const router = useRouter()
const route = useRoute()
const toast = useToast()
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

// ── Image handling ──────────────────────────────────────────────
const fileName = ref("")
const mainImage = ref(null)
const imagePreviewUrl = ref(null)
const pendingFileMap = ref(new Map())

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
})

const talentSchema = {
    talentTitle: { type: 'text', required: true, min: 3, max: 100, label: 'Talent Title' },
    category: { type: 'select', required: true, label: 'Category' },
    subcategories: { type: 'multiselect', required: true, min: 1, max: 5, label: 'Subcategories' },
}

const { errors: formErrors, validate, clearError, resetErrors, scrollToFirstError } = useFormValidation(talentSchema, formData)

const additionalImages = ref([])
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
  talent_category_id: null,
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

// Sync category/subcategory selections into formData for validation
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
    fd.append('description', eventDescription.value || '')

    // Category ID
    if (form.talent_category_id) {
        fd.append('talent_category_id', form.talent_category_id)
    }

    // Subcategory IDs
    form.talent_subcategory_ids.forEach(subId => {
        fd.append('talent_subcategory_ids[]', subId)
    })

    // Location
    fd.append('address', selectedAddress.value || '')
    if (mapLat.value !== null) fd.append('latitude', mapLat.value)
    if (mapLng.value !== null) fd.append('longitude', mapLng.value)
    fd.append('city', talentCity.value || '')

    // Time
    if (startTime.value) fd.append('start_time', startTime.value)
    if (endTime.value) fd.append('end_time', endTime.value)

    // Main Image
    if (mainImage.value instanceof File) {
        fd.append('image_path', mainImage.value)
    } else if (typeof mainImage.value === 'string' && mainImage.value) {
        fd.append('image_path', mainImage.value)
    }

    // Additional images — new File uploads via pendingFileMap
    if (additionalImages.value && additionalImages.value.length) {
        additionalImages.value.forEach((img, idx) => {
            if (img instanceof File) {
                fd.append('additional_images[]', img)
            } else if (pendingFileMap.value.has(img)) {
                fd.append('additional_images[]', pendingFileMap.value.get(img))
            } else if (typeof img === 'string') {
                fd.append('existing_additional_images[]', img)
            }
        })
    }

    // Contact details
    fd.append('contact_phone', contactPhone.value || '')
    fd.append('contact_email', contactEmail.value || '')
    fd.append('contact_website', contactWebsite.value || '')

    // Social media
    fd.append('facebook_url', facebookUrl.value || '')
    fd.append('instagram_url', instagramUrl.value || '')
    fd.append('tiktok_url', tiktokUrl.value || '')
    fd.append('fan_club_url', fanClubUrl.value || '')

    // Nationality & age
    fd.append('nationality', exactNationality.value || '')
    fd.append('show_nationality', talentNationality.value || '')
    fd.append('age', exactAge.value || '')
    fd.append('show_age', showAge.value || '')

    // Languages & highlights
    fd.append('languages', languagesText.value || '')
    fd.append('highlights', talentHighlightsText.value || '')

    // Visibility
    fd.append('show_upcoming_events', showUpcomingEvents.value ? '1' : '0')
    fd.append('show_past_events', showPastEvents.value ? '1' : '0')

    return fd
}

// ── Load Talent for editing ─────────────────────────────────────
async function loadTalent(id) {
    try {
        const response = await eventService.getTalentById(id)
        const talent = response.data || response

        isEditMode.value = true
        editingTalentId.value = id

        formData.talentTitle = talent.title || ''
        eventDescription.value = talent.description || ''
        selectedAddress.value = talent.address || ''
        talentCity.value = talent.city || ''

        if (talent.latitude) mapLat.value = talent.latitude
        if (talent.longitude) mapLng.value = talent.longitude

        // Category & subcategories
        if (talent.talent_category_id) {
            form.talent_category_id = talent.talent_category_id
            await nextTick()
            if (talent.talent_subcategories && talent.talent_subcategories.length) {
                form.talent_subcategory_ids = talent.talent_subcategories.map(s => s.id)
            }
        }

        // Main image
        mainImage.value = null
        imagePreviewUrl.value = null
        fileName.value = ''
        if (talent.image_path) {
            mainImage.value = talent.image_path
            imagePreviewUrl.value = talent.image_url || talent.image_path
            fileName.value = 'Current image'
        }

        // Additional images
        if (talent.additional_images && talent.additional_images.length) {
            additionalImages.value = talent.additional_images.map(img => img.image_url || img.image_path || img)
        }

        // Time
        if (talent.start_time) {
            const [h, m] = talent.start_time.split(':')
            startHH.value = parseInt(h)
            startMM.value = parseInt(m)
        }
        if (talent.end_time) {
            const [h, m] = talent.end_time.split(':')
            endHH.value = parseInt(h)
            endMM.value = parseInt(m)
        }

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
        languagesText.value = talent.languages || ''
        talentHighlightsText.value = talent.highlights || ''

        // Visibility
        showUpcomingEvents.value = talent.show_upcoming_events === '1' || talent.show_upcoming_events === true
        showPastEvents.value = talent.show_past_events === '1' || talent.show_past_events === true

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
    formData.category = ''
    formData.subcategories = []
    form.talent_category_id = null
    form.talent_subcategory_ids = []
    selectedCategory.value = ''
    selectedSubcategories.value = []
    selectedAddress.value = ''
    searchAddress.value = ''
    talentCity.value = ''
    mainImage.value = null
    imagePreviewUrl.value = null
    fileName.value = ''
    additionalImages.value = []
    pendingFileMap.value = new Map()
    mapLat.value = null
    mapLng.value = null
    startHH.value = ''
    startMM.value = ''
    endHH.value = ''
    endMM.value = ''
    timeRangeError.value = ''
    hasStartError.value = false
    hasEndError.value = false
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
    showUpcomingEvents.value = ''
    showPastEvents.value = ''
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

    if (!startTime.value) hasStartError.value = true
    if (!endTime.value) hasEndError.value = true
    validateEndAfterStart()
    const timeValid = startTime.value !== "" && endTime.value !== "" && !timeRangeError.value

    if (!isValid || !genreValid || !timeValid) {
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

function handleEventSelected(eventId) {
    closeMobileSidebar()
    console.log('Event selected for editing:', eventId)
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
</script>