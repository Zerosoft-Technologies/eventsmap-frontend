<template>
  <div class="tw:px-4 tw:py-4">
    <!-- Date & Time Section -->
    <div class="tw:mb-2">
      <div class="tw:flex tw:items-start tw:gap-3">
        <!-- Calendar Icon -->
        <div class="tw:mt-0.5">
          <img src="../assets/calendar.png" alt="Calendar Icon">
        </div>
        
        <!-- Date & Time Content -->
        <div class="tw:flex-1">
          <!-- Primary Date & Time Text -->
          <p class="tw-text-base tw-font-medium tw:text-gray-900 tw:mb-4" style="font-size: 14px;">
            Fri, 12 Sep, 2025 at 12:00 pm - Sun, 14 Sep, 2025 at 10:00 pm (CEST)
          </p>
          
          <!-- Secondary Address Text -->
          <p class="tw:text-sm tw:text-gray-600 tw:mb-4">
            Museumplein 5, 1071 DJ Amsterdam, Nederland,<br>
            Amsterdam, Netherlands
          </p>
          
          <!-- Add to Calendar Link -->
          <button class="tw:flex tw:items-center tw:gap-1 tw:text-sm tw:text-blue-600 hover:tw:text-blue-700 tw-transition-colors tw:mb-4">
            <span>Add to Calendar</span>
            <svg class="tw-w-4 tw:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Location Section -->
    <div class="tw:mb-2">
      <div class="tw:flex tw:items-start tw:gap-3">
        <!-- Location Pin Icon -->
        <div class="tw:mt-0.5">
          <img src="../assets/location-01.png" alt="Location Pin Icon">
        </div>
        
        <!-- Location Content -->
        <div class="tw:flex-1">
          <!-- Location Title -->
          <p class="tw:text-base tw-font-medium tw:text-gray-900 tw:mb-4" style="font-size: 14px;">
            Museumplein, Nederland
          </p>
          
          <!-- Full Address -->
          <p class="tw:text-sm tw:text-gray-600 tw:mb-4">
            Museumplein 5, 1071 DJ Amsterdam, Nederland,<br>
            Amsterdam, Netherlands
          </p>
          
          <!-- Location Actions -->
          <div class="tw:flex tw:items-center">
            <!-- View on Map Link -->
            <button class="tw:text-sm tw:text-blue-600 hover:tw:text-blue-700 tw-transition-colors" style="display: flex; align-items: center;">
              View on map <img src="../assets/map.png" alt="Map Icon" style="width: 15px; height: 15px; margin-left: 10px;">
            </button>
            
            <!-- Route Button -->
            <button class="tw:bg-white tw:px-3 tw:py-2 tw:flex tw:items-center tw:gap-1 tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)" style="margin-left: 2rem;">
              <span class="tw:text-sm tw-font-medium tw:text-gray-900">Route</span>
              <img src="../assets/map.png" alt="Map Icon" style="width: 15px; height: 15px; margin-left: 10px;">
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// DateLocationTab component
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
