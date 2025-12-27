<template>
  <header :class="fixedMenu ? 'tw:fixed tw:top-0 tw:left-0 z-50': ''" class="tw:w-full tw:bg-transparent tw:py-2 tw:px-4 tw:md:py-3 tw:md:px-8 tw:flex tw:items-center tw:justify-between" >
    <h1 class="tw:font-bold tw:leading-[1.4] tw:tracking-[-0.5px] tw:text-lg">
      <RouterLink to="/">The Events Map</RouterLink>
    </h1>
    <div class="tw:hidden tw:relative tw:md:flex tw:items-center tw:gap-3">
      <div class="tw:flex tw:relative tw:bg-white tw:gap-6 tw:items-center tw:py-3 tw:pr-3 tw:pl-4 tw:border tw:border-(--secondary-color) tw:rounded-lg" >
        <div class="tw:flex tw:gap-2 tw:relative tw:cursor-pointer tw:items-center tw:w-[169px] overflow-hidden">
          <img src="../assets/search.png" alt="Search Icon" />
          <input ref="searchInput" @keyup.enter="filterBy('search')" v-model="searchTerm" @focus="showSuggestion = true" @blur="handleSuggestionBlur" type="text" class="tw:outline-none tw:placeholder-(--primary-color)" :placeholder="$t('header.search.placeholder')">        
        </div>
        <div class="tw:w-px tw:h-[22px] tw:bg-(--primary-color)"></div>
        <div class="tw:flex tw:gap-1 tw:cursor-pointer tw:items-center" ref="locationToggler" @click="toggleLocation"><img src="../assets/location-01.png" alt="Location Icon" /><p>{{ city || $t('header.defaultLocation') }}</p><img src="../assets/chevron-down.png" alt="Chevron Down" class="ml-1" /></div>   
        <transition name="fade">
          <div v-if="showLocation" v-click-outside="handleOutsideClick" class="tw:absolute tw:flex tw:flex-col tw:gap-2.5 tw:overflow-x-visible tw:mt-px tw:right-0 tw:top-full tw:rounded-2xl tw:p-4 tw:bg-(--gray-color) tw:z-10">
            <div class="tw:bg-white tw:flex tw:items-center tw:justify-center tw:gap-2.5 tw:text-sm tw:py-2.5 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-md">
              <img src="../assets/maps-search.png" alt="Map Icon" />
              <input v-model="searchLocation" @keyup.enter="debouncedSearch" @input="debouncedSearch" type="text" class="tw:outline-none tw:placeholder-(--primary-color) tw:w-[15ch]" :placeholder="$t('header.location.placeholder')"> 
            </div>   
            <div @click="getLocation" class="tw:bg-white tw:flex tw:cursor-pointer tw:items-center tw:justify-center tw:gap-2.5 tw:text-sm tw:py-2.5 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-md">
              <img src="../assets/location-01.png" width="16" height="16" alt="Location Icon" />
              <p class="m-0">{{ $t('header.currentLocation') }}</p>
            </div>          
          </div>
        </transition> 
        <transition name="fade">
          <div v-if="searchResults.length > 0" class="tw:absolute tw:w-[400px] tw:flex tw:flex-col tw:overflow-x-visible tw:mt-px tw:top-full tw:left-full tw:z-10 tw:rounded-2xl tw:p-4 tw:bg-(--gray-color)">
            <div v-for="(result, index) in searchResults" @click="selectCity(result)" :key="index" class="tw:cursor-pointer border-b tw:border-(--secondary-color) tw:text-sm tw:py-2.5">
              <p class="m-0">{{ result.display_name }}</p>
            </div>          
          </div>
        </transition>         
      </div>
      <div>
        <button class="tw:bg-white tw:py-3 tw:hidden tw:gap-2 tw:items-center tw:lg:flex tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg"><img src="../assets/calendar.png" alt="Calendar Icon"/><span>
          <DatePicker @update:dateRange="dateRange = $event" />
        </span></button>
      </div>      
      <transition name="fade">
        <div v-if="showSuggestion" @mousedown.prevent class="tw:absolute tw:left-0 tw:top-full tw:rounded-2xl tw:p-3 tw:bg-(--gray-color) tw:z-10 tw:w-[35vw]">
          <div class="tw:flex tw:items-center tw:gap-2">
            <button
              type="button"
              @click="scrollCategories('left')"
              class="tw:bg-white tw:border tw:border-(--secondary-color) tw:rounded-md tw:p-2 tw:flex tw:items-center tw:justify-center"
              aria-label="Scroll categories left"
            >
              <img src="../assets/arrow-right.png" alt="Left" class="tw:w-4 tw:h-4 tw:rotate-180" />
            </button>

            <!-- Categories loading skeleton -->
            <div v-if="categoriesLoading" class="tw:flex tw:items-center tw:gap-2 tw:flex-1 tw:py-1">
              <div v-for="i in 5" :key="i" class="tw:inline-flex tw:shrink-0 tw:animate-pulse">
                <div class="tw:h-9 tw:bg-gray-300 tw:rounded-md" :style="{ width: `${80 + Math.random() * 40}px` }"></div>
              </div>
            </div>

            <!-- Categories list -->
            <div
              v-else
              ref="categoriesScrollEl"
              class="cat-scroll tw:flex tw:items-center tw:gap-2 tw:overflow-x-auto tw:whitespace-nowrap tw:flex-1 tw:py-1"
              :class="catIsDragging ? 'tw:cursor-grabbing' : 'tw:cursor-grab'"
              @mousedown="onCatMouseDown"
              @mousemove="onCatMouseMove"
              @mouseup="stopCatDrag"
              @mouseleave="stopCatDrag"
            >
              <button
                v-for="category in categories"
                :key="category.id"
                type="button"
                @click="selectCategory(category)"
                :class="[
                  'tw:inline-flex tw:shrink-0 tw:text-sm tw:py-2 tw:px-5 tw:border tw:rounded-md tw:transition-colors',
                  selectedCategory?.id === category.id
                    ? 'tw:bg-[var(--primary-color)] tw:text-white tw:border-[var(--primary-color)]'
                    : 'tw:bg-white tw:border-(--secondary-color) hover:tw:bg-gray-50'
                ]"
              >
                {{ category.name }}
              </button>

              <button
                v-if="selectedCategory"
                type="button"
                @click="clearCategoryFilter"
                class="tw:inline-flex tw:shrink-0 tw:text-sm tw:py-2 tw:px-4 tw:text-gray-500 hover:tw:text-gray-700"
              >
                {{ $t('common.clear') }}
              </button>
            </div>

            <button
              type="button"
              @click="scrollCategories('right')"
              class="tw:bg-white tw:border tw:border-(--secondary-color) tw:rounded-md tw:p-2 tw:flex tw:items-center tw:justify-center"
              aria-label="Scroll categories right"
            >
              <img src="../assets/arrow-right.png" alt="Right" class="tw:w-4 tw:h-4" />
            </button>
          </div>
        </div>
      </transition>
    </div>
    <button class="tw:lg:hidden tw:text-2xl" @click="menuOpen = !menuOpen">☰</button>

    <div class="tw:hidden tw:lg:flex tw:items-center tw:gap-4">
      <div>
        <button @click="filterBy('suggestion')" class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:gap-1 tw:items-center tw:border tw:border-(--secondary-color)"><img src="../assets/favourite.png" alt="Favourite Icon"/><span>Events</span></button>
      </div>      
      <div>        
        <RouterLink to="/create-profile" class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-1 tw:border-(--secondary-color)"><img src="../assets/user.png" alt="User Icon"/><span>{{ $t('header.createProfile') }}</span></RouterLink>        
      </div>      
      <!-- Language Switcher -->
      <div class="tw:relative">
        <button 
          ref="languageToggler"
          @click="toggleLanguageDropdown"
          class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-2 tw:border-(--secondary-color) tw:cursor-pointer"
        >
          <img :src="currentLanguage.flag" :alt="currentLanguage.name + ' flag'" class="tw:w-4 tw:h-4 tw-object-cover tw-rounded-sm" />
          <span class="tw:text-sm">{{ currentLanguage.name }}</span>
          <img src="../assets/chevron-down.png" alt="Chevron Down" class="tw:w-3 tw:h-3 tw-ml-1" />
        </button>
        
        <transition name="fade">
          <div 
            v-if="showLanguageDropdown" 
            v-click-outside="handleLanguageDropdownOutsideClick"
            class="tw:absolute tw:right-0 tw:top-full tw:mt-1 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-(--secondary-color) tw:overflow-hidden tw:z-20"
          >
            <button
              v-for="lang in availableLanguages"
              :key="lang.code"
              @click="switchLanguage(lang.code)"
              class="tw:w-full tw:px-4 tw:py-2 tw:flex tw:items-center tw:gap-3 tw:hover:bg-gray-50 tw-transition-colors tw:text-left"
              :class="{ 'tw:bg-gray-100': lang.code === currentLocale }"
            >
              <img :src="lang.flag" :alt="lang.name + ' flag'" class="tw:w-4 tw:h-4 tw-object-cover tw-rounded-sm" />
              <span class="tw-text-sm">{{ lang.name }}</span>
              <svg 
                v-if="lang.code === currentLocale" 
                class="tw:w-4 tw:h-4 tw:ml-auto tw:text-green-600" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </transition>
      </div>
      <div>
        <button @click="$emit('open-login')" class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-1 tw:border-(--secondary-color)"><img src="../assets/login.png" alt="Login Icon"/><span>{{ $t('header.login') }}</span></button>
      </div>
    </div>

    <transition name="slide-right">
      <div v-if="menuOpen" class="tw:absolute tw:top-full tw:left-0 tw:md:left-auto tw:md:right-0 tw:w-full tw:md:w-1/2 tw:bg-transparent tw:shadow-md tw:p-4 tw:flex tw:flex-col tw:gap-3 tw:lg:hidden tw:transition-all tw:duration-300">
        <div class="tw:flex tw:bg-white tw:md:hidden tw:gap-4 tw:items-center tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>{{ $t('header.search.placeholder') }}</p>
        </div>
        <div class="tw:bg-white tw:md:hidden tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Amsterdam</p>
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <DatePicker @update:dateRange="dateRange = $event" @update:session="sessionFilter = $event" />
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Link</p>
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>{{ $t('header.createProfile') }}</p>
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>{{ $t('header.login') }}</p>
        </div>

        <!-- Mobile Language Switcher -->
        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p class="tw-mb-2 tw-font-medium">{{ $t('header.language') }}</p>
          <div class="tw-flex tw-flex-col tw-gap-2">
            <button
              v-for="lang in availableLanguages"
              :key="lang.code"
              @click="switchLanguage(lang.code)"
              class="tw:flex tw-items-center tw-gap-2 tw:text-sm tw-py-1"
              :class="{ 'tw-font-semibold': lang.code === currentLocale }"
            >
              <img :src="lang.flag" :alt="lang.name + ' flag'" class="tw:w-6 tw:h-4 tw-object-cover tw-rounded-sm" />
              <span>{{ lang.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </header>
  <!-- Location permission prompt -->
  <!-- <LocationPermissionPrompt
    v-show="showManualEnablePrompt"
    @dismiss="() => {}"
    @continue-without="() => {}"
  /> -->
  <div v-if="showResults">
    <AllEvents @closeResults="handleClose" @resetSearch="handleReset" @viewEvent="handleViewEvent" :events="events" :loading="eventsLoading" />
  </div>
  
  <!-- Event Details Panel -->
  <EventDetailsPanel 
    :visible="showEventDetailsPanel" 
    :event="selectedEvent"
    @close="closeEventDetailsPanel"
  />
</template>
<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import DatePicker from "./DatePicker.vue";
import LocationPermissionPrompt from './LocationPermissionPrompt.vue';
import { useLocationPermission } from '../composables/useLocationPermission';
import { useLanguageSwitch } from '../composables/useLanguageSwitch';

// Lazy load AllEvents to avoid circular import issue
const AllEvents = defineAsyncComponent(() => import('./AllEvents.vue'))

// Lazy load EventDetailsPanel for event details side panel
const EventDetailsPanel = defineAsyncComponent(() => import('./EventDetailsPanel.vue'))

const { t, locale } = useI18n()
const { switchLanguage, getAvailableLanguages, initializeLanguage } = useLanguageSwitch()

// Language switcher state
const showLanguageDropdown = ref(false)
const languageToggler = ref(null)
const availableLanguages = getAvailableLanguages()
const currentLocale = computed(() => locale.value)
const currentLanguage = computed(() => 
  availableLanguages.find(lang => lang.code === locale.value) || availableLanguages[0]
)

const showSuggestion = ref(false)
const menuOpen = ref(false);
const showResults = ref(false);
const searchInput = ref(null)
const route = useRoute()
const city = ref("");
const searchLocation = ref("")
const searchTerm = ref('')
const searchResults = ref([])
const categories = ref([])
const categoriesLoading = ref(false)
const selectedCategory = ref(null)
const categoriesScrollEl = ref(null)
const catIsDragging = ref(false)
const catDidDrag = ref(false)
let catDragStartX = 0
let catDragStartScrollLeft = 0
const dateRange = ref([null, null])
const sessionFilter = ref({
  morning: false,
  afternoon: false,
  evening: false,
  night: false
})
const selectedLocation = ref({ lat: 52.3676, lng: 4.9041, name: "Amsterdam" }) // Default to Amsterdam

// Event Details Panel state
const showEventDetailsPanel = ref(false)
const selectedEvent = ref(null)

// Initialize location permission composable
const { 
  permissionStatus: locationPermissionStatus, 
  coords: locationCoords, 
  error: locationError, 
  isLoading: locationLoading,
  getLocation: getCurrentLocation,
  showManualEnablePrompt
} = useLocationPermission()

// Language switcher functions
function toggleLanguageDropdown() {
  showLanguageDropdown.value = !showLanguageDropdown.value
}

function handleLanguageDropdownOutsideClick(e) {
  if (languageToggler.value && languageToggler.value.contains(e.target)) {
    return
  }
  showLanguageDropdown.value = false
}

function handleSuggestionBlur() {
  setTimeout(() => {
    showSuggestion.value = false
  }, 150)
}

function scrollCategories(direction) {
  const el = categoriesScrollEl.value
  if (!el) return
  const amount = 240
  el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
}

function onCatMouseDown(e) {
  const el = categoriesScrollEl.value
  if (!el) return
  catIsDragging.value = true
  catDidDrag.value = false
  catDragStartX = e.clientX
  catDragStartScrollLeft = el.scrollLeft
}

function onCatMouseMove(e) {
  const el = categoriesScrollEl.value
  if (!el || !catIsDragging.value) return
  e.preventDefault()
  const dx = e.clientX - catDragStartX
  if (Math.abs(dx) > 5) catDidDrag.value = true
  el.scrollLeft = catDragStartScrollLeft - dx
}

function stopCatDrag() {
  if (!catIsDragging.value) return
  catIsDragging.value = false
  if (catDidDrag.value) {
    setTimeout(() => {
      catDidDrag.value = false
    }, 0)
  }
}

// Load categories from API
async function loadCategories() {
  categoriesLoading.value = true;
  try {
    const { fetchCategories } = await import('../api/categories');
    categories.value = await fetchCategories();
  } catch (e) {
    console.error('Failed to load categories:', e);
    categories.value = [];
  } finally {
    categoriesLoading.value = false;
  }
}

// Handle category selection
function selectCategory(category) {
  if (catDidDrag.value) return
  selectedCategory.value = category;
  showSuggestion.value = false;
  loadEventsFromApi(searchTerm.value.trim());
  showResults.value = true;
}

function clearCategoryFilter() {
  selectedCategory.value = null
  loadEventsFromApi(searchTerm.value.trim())
  showResults.value = true
}

onMounted(() => {
  getLocation();
  loadCategories();
});

function filterBy(action){
  if(action == 'search'){
    // Load events from API and show in AllEvents panel
    loadEventsFromApi(searchTerm.value.trim());
    showResults.value = true;
    searchInput.value.blur();
  } else {
    // Load events without search filter
    loadEventsFromApi();
    showResults.value = true;
  }
}

const fixedMenu = computed(() => { 
  return route.name === 'Home'
})

function handleClose(){
  showResults.value = false
}

function handleReset(){
  showResults.value = false
  searchTerm.value = ""  
  searchInput.value.blur();
  city.value = "Amsterdam";
  selectedCategory.value = null
  selectedLocation.value = { lat: 52.3676, lng: 4.9041, name: "Amsterdam" };
  sessionFilter.value = {
    morning: false,
    afternoon: false,
    evening: false,
    night: false
  }
}

async function getLocation() {
  const location = await getCurrentLocation();
  
  if (location) {
    // Successfully got location, now reverse geocode to get city name
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`
      );
      const data = await res.json();
      const cityName = data.address.city || data.address.town || data.address.village || "Amsterdam";
      city.value = cityName;
      
      // Store current location coordinates
      selectedLocation.value = {
        lat: location.latitude,
        lng: location.longitude,
        name: cityName
      };
    } catch (e) {
      console.error('Failed to reverse geocode location:', e);
      city.value = "Amsterdam";
      selectedLocation.value = { lat: 52.3676, lng: 4.9041, name: "Amsterdam" };
    }
  } else {
    // Location access failed or was denied
    if (locationError.value?.isPermissionDenied) {
      city.value = "Amsterdam";
      // Keep Amsterdam as default
      selectedLocation.value = { lat: 52.3676, lng: 4.9041, name: "Amsterdam" };
    } else if (locationError.value) {
      city.value = "Amsterdam";
      selectedLocation.value = { lat: 52.3676, lng: 4.9041, name: "Amsterdam" };
    } else {
      city.value = "Amsterdam";
      selectedLocation.value = { lat: 52.3676, lng: 4.9041, name: "Amsterdam" };
    }
  }
}

const events = ref([]);
const eventsLoading = ref(false);

// Convert DD/MM/YYYY to YYYY-MM-DD
function formatDateToApi(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
}

// Load events from API
async function loadEventsFromApi(searchQuery = '') {
  eventsLoading.value = true;
  try {
    const { fetchEvents } = await import('../api/events');
    const { transformApiEventsToUI } = await import('../utils/eventTransformer');
    
    const params = {
      lat: selectedLocation.value.lat,
      lng: selectedLocation.value.lng,
      radius: 100,
      per_page: 20
    };
    
    // Add search param if provided
    if (searchQuery) {
      params.search = searchQuery;
    }
    
    // Add category filter if selected
    if (selectedCategory.value) {
      params.category = selectedCategory.value.slug;
    }
    
    // Add date range if selected
    if (dateRange.value[0]) {
      params.from_date = formatDateToApi(dateRange.value[0]);
    }
    if (dateRange.value[1]) {
      params.to_date = formatDateToApi(dateRange.value[1]);
    }
    
    // Add session filter if any sessions are selected
    const activeSessions = Object.entries(JSON.parse(localStorage.getItem('datepicker-session')))
    .filter(([key, value]) => value)
    .map(([key]) => key);

    if (activeSessions.length > 0) {
      activeSessions.forEach(session => {
        params[session] = true
      })
    }
    
    const result = await fetchEvents(params);
    events.value = transformApiEventsToUI(result.data);
  } catch (e) {
    console.error('Failed to load events:', e);
    events.value = [];
  } finally {
    eventsLoading.value = false;
  }
}

const searchCity = async () => {
  if (!city.value) {
    searchResults.value = [];
    return;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchLocation.value
      )}&addressdetails=1&limit=5`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    const data = await response.json();
    searchResults.value = data;
    // error.value = "";
  } catch (err) {
    // error.value = "Failed to fetch locations";
  }
};

let timeout = null;

const debouncedSearch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(searchCity, 500);
};

const selectCity = (place) => {
  city.value = place.display_name.split(',')[0]; // Get city name from full address
  searchResults.value = [];
  
  // Store selected location coordinates
  selectedLocation.value = {
    lat: parseFloat(place.lat),
    lng: parseFloat(place.lon),
    name: place.display_name.split(',')[0]
  };
};

const showLocation = ref(false)
const locationToggler = ref(null);

const toggleLocation = () => {  
  showLocation.value = !showLocation.value  
}

const handleOutsideClick = (e) => {
  if (locationToggler.value.contains(e.target)) {        
    return;
  }
  showLocation.value = false
}

/**
 * Handle view event - opens the event details panel
 * @param {Object} event - The event object to display
 */
function handleViewEvent(event) {
  selectedEvent.value = event
  showEventDetailsPanel.value = true
}

/**
 * Close the event details panel
 */
function closeEventDetailsPanel() {
  showEventDetailsPanel.value = false
  selectedEvent.value = null
}
</script>

<script>
import clickOutside from "../directives/click-outside.js";

export default {
  directives: { clickOutside },
  inheritAttrs: false
};
</script>

<style scoped>

/* Search suggestion animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* Search suggestion animation */

 .cat-scroll {
   -ms-overflow-style: none;
   scrollbar-width: none;
   user-select: none;
 }

 .cat-scroll::-webkit-scrollbar {
   display: none;
 }

/* Menu animation */
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.slide-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-enter-active {
  transition: all 0.35s ease;
}
.slide-right-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.slide-right-leave-active {
  transition: all 0.25s ease;
}
/* Menu animation */
</style>