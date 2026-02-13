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
            <EventSidebar :eventTitle="eventTitle" :eventDate="eventDate" :eventStatus="eventStatus" :menuItems="menuItems"
                @back="handleBack" />

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
                            Create Premium Event
                        </h3>
                        <!-- <button
                            class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
                            <Plus class="tw:w-5 tw:h-5" />
                        </button> -->
                    </div>

                    <input v-model="eventTitle" type="text" placeholder="Enter Event Title"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                    <!-- Description -->
                    <div class="tw:space-y-2">
                        <label class="tw:text-sm tw:text-gray-700">Description</label>
                        <textarea v-model="eventDescription" rows="4" placeholder="Describe Your Event..."
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:resize-none"></textarea>
                    </div>
                </div>

                <!-- ================= CATEGORY SECTION ================= -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-6">

                    <!-- Header -->
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Category
                    </h3>

                    <!-- Category Select -->
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

                    <!-- CATEGORY SPECIFIC DETAILS -->
                    <div class="tw:space-y-6">

                        <!-- Music Section -->
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

                        <!-- Film Section -->
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

                        <!-- Theatre Section -->
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
                </div>

                <!-- EVENT IMAGE SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-6">

                    <!-- Header -->
                    <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
                        <h3 class="tw:text-lg tw:font-semibold tw:text-gray-800">
                            Event Image
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
                            Additional Images (Max 5)
                        </h3>
                    </div>

                    <div class="tw:flex tw:gap-4 tw:flex-wrap tw:justify-between">
                        <div v-for="n in 5" :key="n"
                            class="tw:w-[48px] tw:h-[48px] tw:bg-[#F6F1E7] tw:rounded-sm tw:flex tw:items-center tw:justify-center tw:cursor-pointer hover:tw:bg-blue-50 tw:transition">
                            <Plus class="tw:w-5 tw:h-5 tw:text-orange-400" />
                        </div>
                    </div>
                </div>

                <!-- GENRE SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                            Genre
                        </h3>
                        <!-- <button
                            class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
                            <Plus class="tw:w-5 tw:h-5" />
                        </button> -->
                    </div>
                    <!-- Dropdown -->
                    <div class="tw:relative" ref="genreDropdownRef">

                        <!-- Trigger -->
                        <div @click="toggleDropdown"
                            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:flex tw:justify-between tw:items-center tw:cursor-pointer">

                            <span class="tw:text-gray-700">
                                {{ selectedGenres.length ? selectedGenres.join(', ') : 'Select Genres' }}
                            </span>

                            <ChevronDown class="tw:w-5 tw:h-5 tw:text-gray-400" />
                        </div>

                        <!-- Dropdown Box -->
                        <div v-if="showGenreDropdown"
                            class="tw:absolute tw:mt-2 tw:w-full tw:bg-[#F6F1E7] tw:p-2 tw:rounded-xl tw:shadow-md tw:z-50">

                            <!-- Inner white container -->
                            <div class="tw:bg-white tw:rounded-lg tw:space-y-4 tw:p-4">

                                <label v-for="genre in genres" :key="genre"
                                    class="tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3 tw:rounded-lg tw:border tw:border-gray-200 tw:cursor-pointer">

                                    <span class="tw:text-gray-700">{{ genre }}</span>

                                    <input type="checkbox" :value="genre" v-model="selectedGenres"
                                        class="tw:w-5 tw:h-5 tw:accent-[#FF7700] tw:cursor-pointer" />
                                </label>

                            </div>
                        </div>
                    </div>
                </div>


                <!-- VENUE SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <div class="tw:flex tw:justify-between tw:items-center">
                        <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                            Venue
                        </h3>
                        <!-- <button
                            class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
                            <Plus class="tw:w-5 tw:h-5" />
                        </button> -->
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
                </div>

                <!-- EVENT DATE & TIME SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:border tw:border-gray-200 tw:p-6">

                    <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
                        Event Date & Time
                    </h3>

                    <!-- Horizontal Layout -->
                    <div class="tw:flex tw:gap-6">

                        <!-- EVENT DATE -->
                        <div class="tw:flex-1">
                            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-2">
                                Event Date
                            </label>

                            <div class="tw:relative">
                                <input ref="dateInput" placeholder="MM/DD/YYYY"
                                    class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-gray-700 tw:placeholder-[#666666] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500" />

                                <!-- Custom Calendar Icon -->
                                <Calendar
                                    class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                            </div>
                        </div>

                        <!-- EVENT TIME -->
                        <div class="tw:flex-1">
                            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-2">
                                Event Time
                            </label>

                            <div class="tw:relative">
                                <input ref="timeInput" placeholder="-- -- --"
                                    class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-lg tw:px-4 tw:py-2.5 tw:pr-10 tw:text-gray-700 tw:placeholder-[#666666] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500" />

                                <!-- Custom Clock Icon -->
                                <Clock
                                    class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-[#787878] tw:pointer-events-none" />
                            </div>
                        </div>

                    </div>
                </div>

                <!-- EVENT LOCATION SECTION -->
                <div class="tw:bg-white tw:rounded-xl tw:border tw:border-[#E8E1D5] tw:p-6">
                    <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">
                        Event Location
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

                        <!-- Age Limit -->
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

                        <!-- Entrance Fee -->
                        <div class="tw:space-y-2">
                            <label class="tw:text-sm tw:font-medium tw:text-gray-700">Entrance Status</label>
                            <div class="tw:relative">
                                <select v-model="entranceFee"
                                    class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-3 tw:py-2 tw:text-sm tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
                                    <option value="">Free Entrance</option>
                                    <option value="paid">Paid Entrance</option>
                                    <option value="donation">Sold Out</option>
                                    <option value="cancelled">Event is Cancelled</option>
                                </select>
                                <ChevronDown
                                    class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

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
                    <div class="tw:flex tw:justify-between tw:items-center tw:pt-2">
                        <span class="tw:text-sm tw:text-gray-900">Show Chatbox</span>

                        <label class="tw:relative tw:inline-flex tw:items-center tw:w-12 tw:h-6 tw:cursor-pointer">
                            <input type="checkbox" v-model="showChatbox" class="tw:sr-only tw:peer" />

                            <!-- Background -->
                            <div
                                class="tw:w-12 tw:h-6 tw:bg-gray-300 tw:rounded-full tw:transition tw:peer-checked:bg-orange-500">
                            </div>

                            <!-- Circle -->
                            <div
                                class="tw:absolute tw:left-1 tw:top-1 tw:w-4 tw:h-4 tw:bg-white tw:rounded-full tw:transition tw:peer-checked:translate-x-6">
                            </div>
                        </label>
                    </div>
                </div>

                <!-- SOCIAL MEDIA LINKS SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-5">
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
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-5">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Event Conditions (Optional)
                    </h3>

                    <input type="text" placeholder="Entrance Fee (If Different)"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

                    <input type="text" placeholder="Dress Code (If Different)"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />

                    <input type="text" placeholder="Age Limit (If Different)"
                        class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
                </div>

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
                        <!-- Invite venue -->
                        <!-- <div class="tw:flex tw:items-center tw:justify-between tw:py-3 tw:border-b tw:border-gray-100">
                            <div class="tw:flex tw:items-center tw:gap-3">
                                <div
                                    class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-gray-100 tw:flex tw:items-center tw:justify-center">
                                    <MapPin class="tw:w-5 tw:h-5 tw:text-gray-600" />
                                </div>
                                <span class="tw:text-sm tw:font-medium tw:text-gray-900">Invite venue</span>
                            </div>
                            <button class="tw:text-sm tw:font-medium tw:text-blue-600 hover:tw:text-blue-700">
                                + Add
                            </button>
                        </div> -->

                        <!-- Invite talent -->
                        <div class="tw:flex tw:items-center tw:justify-between tw:py-3 tw:border-b tw:border-gray-100">
                            <div class="tw:flex tw:items-center tw:gap-3">
                                <div
                                    class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-gray-100 tw:flex tw:items-center tw:justify-center">
                                    <User class="tw:w-5 tw:h-5 tw:text-gray-600" />
                                </div>
                                <span class="tw:text-sm tw:font-medium tw:text-gray-900">Invite Talent</span>
                            </div>
                            <button class="tw:text-sm tw:font-medium tw:text-blue-600 hover:tw:text-blue-700">
                                + Add
                            </button>
                        </div>

                        <!-- Invite organiser -->
                        <div class="tw:flex tw:items-center tw:justify-between tw:py-3">
                            <div class="tw:flex tw:items-center tw:gap-3">
                                <div
                                    class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-gray-100 tw:flex tw:items-center tw:justify-center">
                                    <User class="tw:w-5 tw:h-5 tw:text-gray-600" />
                                </div>
                                <span class="tw:text-sm tw:font-medium tw:text-gray-900">Invite Organiser</span>
                            </div>
                            <button class="tw:text-sm tw:font-medium tw:text-blue-600 hover:tw:text-blue-700">
                                + Add
                            </button>
                        </div>
                    </div>
                </div>

                <!-- EVENT OPTIONS SECTION -->
                <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
                    <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
                        Event Options
                    </h3>

                    <div class="tw:flex tw:gap-6 tw:items-center">
                        <!-- Copy Event -->
                        <label class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
                            <input type="radio" value="copy" v-model="eventOption"
                                class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500" />
                            <span class="tw:text-sm tw:text-gray-700">Copy Event</span>
                        </label>

                        <!-- Recurring Event -->
                        <label class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
                            <input type="radio" value="recurring" v-model="eventOption"
                                class="tw:w-4 tw:h-4 tw:text-orange-500 tw:border-gray-300 focus:tw:ring-orange-500" />
                            <span class="tw:text-sm tw:text-gray-700">Recurring Event</span>
                        </label>
                    </div>
                </div>

                <!-- SAVE EVENT BUTTON -->
                <div class="tw:flex tw:flex-col tw:items-start tw:pt-4 tw:w-full">
                    <button @click="saveEvent" class="tw:px-6 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md 
               tw:border tw:border-orange-500 tw:text-[#0061FF]
               tw:bg-white hover:tw:bg-orange-50 tw:transition-all">
                        Buy Tickets
                    </button>
                    <span class="tw:text-red-500 tw:text-sm tw:mt-2 tw:w-full tw:ml-11">Soon</span>
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
} from "lucide-vue-next"

import { ref, onMounted, onBeforeUnmount, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.css"

const router = useRouter()
const route = useRoute()

// Event data
const eventTitle = ref("Event Title")
const eventDate = ref("05.03.2026, 18:30 CET")
const eventStatus = ref("Draft")


const activeTab = ref("home")
// const eventTitle = ref("")
const eventDescription = ref("")
const selectedVenue = ref("")
const fileName = ref("")
const selectedGenre = ref("")
const dressCode = ref("")
const ageLimit = ref("")
const contactPhone = ref("")
const contactEmail = ref("")
const contactWebsite = ref("")
const bookingInstructions = ref('');
const ticketUrl = ref('');
const eventOption = ref('');
const showChatbox = ref(false)

const notifications = ref({
    receiveEmail: false,
    receiveUpdates: false
})

const facebookUrl = ref("")
const instagramUrl = ref("")
const tiktokUrl = ref("")

const entranceFee = ref("")

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
const selectedCategory = ref("")

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

// Close when clicking outside
function handleClickOutside(event) {
    if (
        genreDropdownRef.value &&
        !genreDropdownRef.value.contains(event.target)
    ) {
        showGenreDropdown.value = false
    }
}

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside)
})


// Menu items specific to CreateEventPremium
const menuItems = [
  { id: "home", icon: Home, label: "Home", route: "/create-event-premium" },
  { id: "details", icon: FileText, label: "Details", route: "/create-event-premium" },
  { id: "analytics", icon: BarChart3, route: "/create-event-premium/report", label: "Analytics" },
  { id: "settings", icon: Settings, route: "/create-event-premium/settings", label: "Settings" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
  { id: "back", icon: SkipBackIcon, label: "Back" },
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

    // Add new marker
    marker.value = new maplibregl.Marker({ color: "#0061FF" })
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

        // Update marker location
        updateMarker(lng, lat)

        // Reverse geocode to get address
        await reverseGeocode(lng, lat)
    })

    // ✅ ADD THIS LINE
    document.addEventListener("click", handleClickOutside)

    /* ------------------ DATE PICKER ------------------ */
    flatpickr(dateInput.value, {
        dateFormat: "m/d/Y",
    })


    /* ------------------ TIME PICKER ------------------ */
    flatpickr(timeInput.value, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
    })
})
function handleFileChange(event) {
    const file = event.target.files[0]
    fileName.value = file ? file.name : 'No File Chosen'
}

function handleBack() {
    router.push('/events') // Navigate to events list
}
</script>