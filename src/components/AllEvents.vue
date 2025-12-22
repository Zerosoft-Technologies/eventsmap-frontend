<template>
    <transition name="fade">
      <div class="tw:fixed tw:p-4 tw:bg-white tw:rounded-lg tw:md:left-7 tw:bottom-2 tw:z-50 tw:lg:z-10 tw:max-w-[500px]">   
        <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
          <h3 class="tw:font-semibold tw:text-2xl tw:leading-[1.35] tw:tracking-[-0.006em]">All Events</h3>
          <img class="tw:cursor-pointer" @click="close" src="../assets/cancel.png" alt="Close icon">
        </div>        
        <div class="tw:max-h-[80vh] tw:lg:max-h-[60vh] tw:space-y-4 tw:pr-2 tw:overflow-y-auto">
          <!-- Loading state with skeleton -->
          <div v-if="loading" class="tw:space-y-4">
            <div v-for="i in 3" :key="i" class="tw:p-3 tw:bg-[#ECEEF4] tw:rounded-xl tw:animate-pulse">            
              <!-- Header section -->
              <div class="tw:flex tw:justify-between tw:md:gap-5 tw:flex-wrap tw:items-center">
                <div class="tw:flex tw:gap-[13px] tw:items-center">
                  <!-- Logo skeleton -->
                  <div class="tw:border tw:w-10 tw:h-10 tw:bg-gray-300 tw:border-gray-400 tw:rounded-full"></div>
                  <!-- Title skeleton -->
                  <div class="tw:h-5 tw:bg-gray-300 tw:rounded tw:w-40"></div>
                </div>
                <!-- Live button skeleton -->
                <div class="tw:h-8 tw:bg-gray-300 tw:rounded-md tw:w-24"></div>
              </div>

              <!-- Main content section -->
              <div class="tw:flex tw:md:justify-start tw:justify-between tw:md:gap-4 tw:mt-4">
                <!-- Image skeleton -->
                <div class="tw:rounded-lg tw:w-30 tw:h-24 tw:bg-gray-300"></div>

                <div class="tw:flex-1">
                  <!-- Countdown skeleton -->
                  <div class="tw:flex tw:gap-3 tw:md:gap-6 tw:text-center tw:mb-3">
                    <div v-for="j in 4" :key="j" class="tw:space-y-1">
                      <div class="tw:h-4 tw:bg-gray-300 tw:rounded tw:w-8 tw:mx-auto"></div>
                      <div class="tw:h-3 tw:bg-gray-300 tw:rounded tw:w-10"></div>
                    </div>
                  </div>

                  <!-- Detail rows skeleton -->
                  <div class="tw:space-y-3">
                    <div v-for="j in 6" :key="j" class="tw:flex tw:gap-2 tw:items-center">
                      <div class="tw:w-4 tw:h-4 tw:bg-gray-300 tw:rounded"></div>
                      <div class="tw:h-3 tw:bg-gray-300 tw:rounded tw:flex-1"></div>
                    </div>
                  </div>
                </div>                    
              </div>    

              <!-- Footer section -->
              <div class="tw:flex tw:justify-between tw:items-center tw:mt-4">
                <!-- Favourite link skeleton -->
                <div class="tw:flex tw:gap-1 tw:items-center">
                  <div class="tw:w-4 tw:h-4 tw:bg-gray-300 tw:rounded"></div>
                  <div class="tw:h-4 tw:bg-gray-300 tw:rounded tw:w-12"></div>
                </div>

                <!-- Buttons skeleton -->
                <div class="tw:flex tw:gap-3">
                  <div class="tw:h-9 tw:bg-gray-300 tw:rounded-md tw:w-20"></div>
                  <div class="tw:h-9 tw:bg-gray-300 tw:rounded-md tw:w-28"></div>
                </div>
              </div>                            
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-else-if="events.length === 0" class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:px-6">
            <div class="tw:w-24 tw:h-24 tw:bg-[#ECEEF4] tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mb-6">
              <svg class="tw:w-12 tw:h-12 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 class="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mb-2 tw:text-center">No Events Found</h4>
            <p class="tw:text-gray-500 tw:text-center tw:mb-6 tw:max-w-xs">
              We couldn't find any events matching your search criteria. Try adjusting your filters or location.
            </p>
            <button 
              @click="reset" 
              class="tw:bg-[var(--primary-color)] tw:text-white tw:px-6 tw:py-2.5 tw:rounded-lg tw:text-sm tw:font-medium tw:transition-all hover:tw:opacity-90"
            >
              Clear Filters
            </button>
          </div>
          
          <!-- Events list -->
          <template v-else>
            <div v-for="event in events" :key="event.id">
              <Event :event="event"></Event>
            </div>
          </template>
          
          <div v-if="!loading && events.length > 0" class="tw:text-center">
            <button @click="reset" class="tw:bg-white tw:gap-1 tw:px-3 tw:py-2 tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)">                
                Reset Search
            </button>
          </div>
        </div>
      </div>
    </transition>  
</template>
<script setup>
import Event from './Event.vue';

defineProps({
  events: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['closeResults', 'resetSearch']);

function reset (){
  emit('resetSearch')
}

function close(){  
  emit('closeResults')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modern scrollbar styling */
.tw\:max-h-\[80vh\]::-webkit-scrollbar {
  width: 6px;
}
.tw\:max-h-\[80vh\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.tw\:max-h-\[80vh\]::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
  transition: background 0.3s ease;
}
.tw\:max-h-\[80vh\]::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>