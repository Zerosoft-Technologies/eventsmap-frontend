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
        <!-- EVENT TITLE SECTION -->
        <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Event Title
            </h3>
            <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button>
          </div>

          <input v-model="eventTitle" type="text" placeholder="Enter Event Title"
            class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all" />
        </div>

        <!-- EVENT IMAGE SECTION -->
        <div class="tw:bg-white tw:rounded-2xl tw:border tw:border-[#E8E1D5] tw:p-6">

          <!-- Header -->
          <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
            <h3 class="tw:text-lg tw:font-semibold tw:text-gray-800">
              Event Image (Max 1)
            </h3>

            <button type="button"
              class="tw:w-8 tw:h-8 tw:rounded-full tw:bg-blue-100 tw:text-blue-600 tw:flex tw:items-center tw:justify-center">
              <Plus class="tw:w-4 tw:h-4" />
            </button>
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
              No File Chosen
            </span>

            <input type="file" accept="image/*" class="tw:hidden"
              onchange="document.getElementById('file-name').innerText = this.files[0]?.name || 'No file chosen'" />
          </label>
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

          <div class="tw:relative">
            <select v-model="selectedGenre"
              class="tw:w-full tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-3 tw:text-gray-900 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:appearance-none tw:cursor-pointer">
              <option value="">Music Event</option>
              <option value="dance">Dance Event</option>
              <option value="film">Film Event</option>
              <option value="nightlife">Nightlife Event</option>
              <option value="theatre">Theatre Event</option>
              <option value="community">Community Event</option>
              <option value="venue">Venue Event</option>
              <!-- <option value="other">Other Event</option> -->
            </select>
            <ChevronDown
              class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-gray-400 tw:pointer-events-none" />
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

        <!-- ORGANISER SECTION -->
        <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-6 tw:space-y-4">
          <div class="tw:flex tw:justify-between tw:items-center">
            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900">
              Organiser
            </h3>
            <!-- <button
              class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:flex tw:items-center tw:justify-center hover:tw:bg-blue-100 tw:transition-all">
              <Plus class="tw:w-5 tw:h-5" />
            </button> -->
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
        </div>

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
              class="tw:absolute tw-top-full tw:left-0 tw:right-0 tw:mt-1 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-gray-200 tw:z-10 tw:max-h-60 tw:overflow-y-auto">
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
            <!-- Invite talent -->
            <div class="tw:flex tw:items-center tw:justify-between tw:py-3 tw:border-b tw:border-gray-100">
              <div class="tw:flex tw:items-center tw:gap-3">
                <div class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-gray-100 tw:flex tw:items-center tw:justify-center">
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
                <div class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-gray-100 tw:flex tw:items-center tw:justify-center">
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

import { ref, computed, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.css"

const router = useRouter()
const route = useRoute()

const activeTab = ref("home")
// const eventTitle = ref("")
const selectedVenue = ref("")
const selectedGenre = ref("")
const dressCode = ref("")
const ageLimit = ref("")
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

const selectedOrganiser = ref("")
const selectedTalent = ref("")

// Event data
const eventTitle = ref("Event Title")
const eventDate = ref("05.03.2026, 18:30 CET")
const eventStatus = ref("Draft")


const fileName = ref("")

// Menu items specific to CreateEventFree
const menuItems = [
  { id: "home", icon: Home, label: "Home", route: "/create-talents-free" },
  { id: "details", icon: FileText, label: "Details", route: "/create-talents-free" },
  { id: "analytics", icon: BarChart3, route: "/create-talents-free/report", label: "Analytics" },
  { id: "settings", icon: Settings, route: "/create-talents-free/settings", label: "Settings" },
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