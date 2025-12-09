<template>
  <header :class="fixedMenu ? 'tw:fixed tw:top-0 tw:left-0 z-50': ''" class="tw:w-full tw:bg-transparent tw:py-2 tw:px-4 tw:md:py-3 tw:md:px-8 tw:flex tw:items-center tw:justify-between" >
    <h1 class="tw:font-bold tw:leading-[1.4] tw:tracking-[-0.5px] tw:text-lg">
      <RouterLink to="/">The Events Map</RouterLink>
    </h1>
    <div class="tw:hidden tw:relative tw:md:flex tw:items-center tw:gap-3">
      <div class="tw:flex tw:relative tw:bg-white tw:gap-6 tw:items-center tw:py-3 tw:pr-3 tw:pl-4 tw:border tw:border-(--secondary-color) tw:rounded-lg" >
        <div class="tw:flex tw:gap-2 tw:relative tw:cursor-pointer tw:items-center  tw:w-[169px]"><img src="../assets/search.png" alt="Search Icon" /><input  @focus="showSuggestion = true" @blur="showSuggestion = false" type="text" class="tw:outline-none tw:placeholder-(--primary-color)" placeholder="Search for Talent...">        
        </div>
        <div class="tw:w-px tw:h-[22px] tw:bg-(--primary-color)"></div>
        <div class="tw:flex tw:gap-1 tw:cursor-pointer tw:items-center" ref="locationToggler" @click="toggleLocation"><img src="../assets/location-01.png" alt="Location Icon" /><p>{{ city || "Amsterdam" }}</p><img src="../assets/chevron-down.png" alt="Chevron Down" class="ml-1" /></div>   
        <transition name="fade">
          <div v-if="showLocation" v-click-outside="handleOutsideClick" class="tw:absolute tw:flex tw:flex-col tw:gap-2.5 tw:overflow-x-visible tw:mt-px tw:right-0 tw:top-full tw:rounded-2xl tw:p-4 tw:bg-(--gray-color) tw:z-10">
            <div class="tw:bg-white tw:flex tw:items-center tw:justify-center tw:gap-2.5 tw:text-sm tw:py-2.5 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-md">
              <img src="../assets/maps-search.png" alt="Map Icon" /><input type="text" class="tw:outline-none tw:placeholder-(--primary-color) tw:w-[15ch]" placeholder="Search any location"> 
            </div>   
            <div @click="getLocation" class="tw:bg-white tw:flex tw:cursor-pointer tw:items-center tw:justify-center tw:gap-2.5 tw:text-sm tw:py-2.5 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-md">
              <img src="../assets/location-01.png" width="16" height="16" alt="Location Icon" />
              <p class="m-0">Current location</p>
            </div>          
          </div>
        </transition>     
      </div>
      <div>
        <button class="tw:bg-white tw:py-3 tw:hidden tw:gap-2 tw:items-center tw:lg:flex tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg"><img src="../assets/calendar.png" alt="Calendar Icon"/><span>
          <DatePicker />
        </span></button>
      </div>      
      <transition name="fade">
        <div v-if="showSuggestion" class="tw:absolute tw:flex tw:gap-2.5 tw:overflow-x-visible tw:left-0 tw:top-full tw:rounded-2xl tw:p-4 tw:bg-(--gray-color) tw:z-10">
          <button 
          class="tw:bg-white tw:text-sm tw:py-2 tw:px-6 tw:border tw:border-(--secondary-color) tw:rounded-md"
          v-for="(suggestion, index) in suggestions" 
          :key="index"            
          >{{ suggestion }}
          </button>
        </div>
      </transition>
    </div>
    <button class="tw:lg:hidden tw:text-2xl" @click="menuOpen = !menuOpen">☰</button>

    <div class="tw:hidden tw:lg:flex tw:items-center tw:gap-4">
      <div>
        <button class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:gap-1 tw:items-center tw:border tw:border-(--secondary-color)"><img src="../assets/favourite.png" alt="Favourite Icon"/><span>Link</span></button>
      </div>      
      <div>        
        <RouterLink to="/create-profile" class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-1 tw:border-(--secondary-color)"><img src="../assets/user.png" alt="User Icon"/><span>Create profile</span></RouterLink>        
      </div>      
      <div>
        <button @click="$emit('open-login')" class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-1 tw:border-(--secondary-color)"><img src="../assets/login.png" alt="Login Icon"/><span>Login</span></button>
      </div>
    </div>

    <transition name="slide-right">
      <div v-if="menuOpen" class="tw:absolute tw:top-full tw:left-0 tw:md:left-auto tw:md:right-0 tw:w-full tw:md:w-1/2 tw:bg-transparent tw:shadow-md tw:p-4 tw:flex tw:flex-col tw:gap-3 tw:lg:hidden tw:transition-all tw:duration-300">
        <div class="tw:flex tw:bg-white tw:md:hidden tw:gap-4 tw:items-center tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Search for Talent...</p>
        </div>
        <div class="tw:bg-white tw:md:hidden tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Amsterdam</p>
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <DatePicker />
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Link</p>
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Create profile</p>
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Login</p>
        </div>
      </div>
    </transition>
  </header>
  <div v-if="showResults">
    <AllEvents />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import DatePicker from "./DatePicker.vue";
import AllEvents from './AllEvents.vue';

const showSuggestion = ref(false)
const menuOpen = ref(false);
const showResults = ref(false);
const route = useRoute()
const suggestions = ref(['Talent', 'Nightlife', 'Dance', 'Theatre', 'Community', 'Music', 'Film'])
const city = ref("");

onMounted(() => {
  getLocation();
});

const fixedMenu = computed(() => { 
  return route.name === 'Home'
})

async function getLocation() {
  if (!navigator.geolocation) {
    city.value = "Geolocation not supported";
    return;
  }
  navigator.geolocation.getCurrentPosition(success, error);
}

async function success(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();
    city.value = data.address.city || data.address.town || data.address.village || "Amsterdam";
  } catch (e) {
    city.value = "Amsterdam";
  }
}

function error() {
  city.value = "Amsterdam";
}

</script>

<script>
import clickOutside from "../directives/click-outside.js";

const showLocation = ref(false)
const locationToggler = ref(null);

const toggleLocation = () => {  
  showLocation.value = !showLocation.value  
}

export default {
  directives: { clickOutside },
  methods: {
    handleOutsideClick(e) {
      if (locationToggler.value.contains(e.target)) {        
        return;
      }
      showLocation.value = false
    }
  }
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
