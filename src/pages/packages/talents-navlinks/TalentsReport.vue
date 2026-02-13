<template>
  <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:px-6">

    <!-- Outer Beige Container -->
    <div class="tw:w-full tw:max-w-4xl tw:bg-[#F6F1E7] tw:rounded-3xl tw:p-6">

      <!-- Inner White Card -->
      <div class="tw:bg-white tw:rounded-2xl tw:p-10">

        <!-- Header -->
        <h1 class="tw:text-3xl tw:font-bold tw:text-[#1E5EFF]">
          Event Views
        </h1>
        <p class="tw:text-sm tw:text-gray-600 tw:mt-2">
          Monthly overview of Event visits
        </p>

        <!-- Stats Container -->
        <div class="tw:mt-8 tw:bg-[#F6F1E7] tw:rounded-2xl tw:p-6 tw:space-y-6">

          <!-- Month Row -->
          <div
            v-for="item in monthlyViews"
            :key="item.month"
            class="tw:bg-white tw:rounded-xl tw:px-6 tw:py-4 tw:flex tw:justify-between tw:items-center"
          >
            <span class="tw:text-gray-800 tw:font-medium">
              {{ item.month }}
            </span>
            <span class="tw:text-[#1E3A8A] tw:text-sm tw:font-medium">
              {{ item.views }} Views
            </span>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue"

const monthlyViews = ref([
  { month: "January 2026", views: 120 },
  { month: "February 2026", views: 245 },
  { month: "March 2026", views: 310 },
  { month: "April 2026", views: 180 },
])
</script>
