<template>
  <div class="tw:min-h-screen tw:bg-gray-50">
    <div class="tw:max-w-4xl tw:mx-auto tw:py-12 tw:px-4 tw:sm:px-6 tw:lg:px-8">
      <!-- Header Section -->
      <div class="tw:text-center tw:mb-10">
        <h1 class="tw:text-2xl tw:sm:text-3xl tw:font-semibold tw:text-[var(--primary-color)] tw:mb-3">
          Select profile type
        </h1>
        <p class="tw:text-gray-500 tw:text-base tw:sm:text-lg tw:max-w-xl tw:mx-auto">
          To continue, select the type of profile you want to create. You can add more profiles later.
        </p>
      </div>

      <!-- Profile Cards Grid -->
      <div class="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:gap-5 tw:mb-10">
        <div
          v-for="profile in profiles"
          :key="profile.type"
          @click="selectedProfile = profile.type"
          :class="[
            'tw:relative tw:bg-white tw:p-6 tw:rounded-xl tw:cursor-pointer tw:transition-all tw:duration-200',
            'tw:flex tw:flex-col tw:items-center tw:text-center',
            'tw:border-2',
            selectedProfile === profile.type 
              ? 'tw:border-[var(--primary-color)] tw:shadow-lg tw:ring-2 tw:ring-[var(--primary-color)]/20' 
              : 'tw:border-gray-200 tw:shadow-sm hover:tw:border-gray-300 hover:tw:shadow-md'
          ]"
        >
          <!-- Selection Indicator -->
          <div 
            v-if="selectedProfile === profile.type"
            class="tw:absolute tw:top-3 tw:right-3 tw:w-6 tw:h-6 tw:bg-[var(--primary-color)] tw:rounded-full tw:flex tw:items-center tw:justify-center"
          >
            <Check class="tw:w-4 tw:h-4 tw:text-white" />
          </div>

          <!-- Icon -->
          <div 
            :class="[
              'tw:w-16 tw:h-16 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mb-4 tw:transition-colors tw:duration-200',
              selectedProfile === profile.type 
                ? 'tw:bg-[var(--primary-color)]/10' 
                : 'tw:bg-gray-100'
            ]"
          >
            <component 
              :is="profile.icon" 
              :class="[
                'tw:w-8 tw:h-8 tw:transition-colors tw:duration-200',
                selectedProfile === profile.type 
                  ? 'tw:text-[var(--primary-color)]' 
                  : 'tw:text-gray-500'
              ]"
            />
          </div>

          <!-- Title -->
          <h2 
            :class="[
              'tw:font-semibold tw:text-lg tw:mb-2 tw:transition-colors tw:duration-200',
              selectedProfile === profile.type 
                ? 'tw:text-[var(--primary-color)]' 
                : 'tw:text-gray-900'
            ]"
          >
            {{ profile.title }}
          </h2>

          <!-- Subtitle -->
          <p class="tw:text-gray-500 tw:text-sm">
            {{ profile.subtitle }}
          </p>
        </div>
      </div>

      <!-- Proceed Button -->
      <div class="tw:flex tw:justify-center">
        <button
          @click="handleProceed"
          :disabled="!selectedProfile"
          :class="[
            'tw:px-8 tw:py-2.5 tw:rounded-lg tw:font-medium tw:text-base tw:transition-all tw:duration-200',
            'tw:flex tw:items-center tw:gap-2',
            selectedProfile
              ? 'tw:bg-[var(--primary-color)] tw:text-white hover:tw:bg-[var(--primary-color)]/90 tw:shadow-md hover:tw:shadow-lg'
              : 'tw:bg-gray-200 tw:text-gray-400 tw:cursor-not-allowed'
          ]"
        >
          Continue
          <ArrowRight class="tw:w-5 tw:h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, Users, Mic2, MapPin, Check, ArrowRight } from 'lucide-vue-next'

const router = useRouter()

const profiles = [
  { 
    type: 'event', 
    title: 'Event', 
    subtitle: 'Create and manage events',
    icon: Calendar
  },
  { 
    type: 'event-organiser', 
    title: 'Event Organiser', 
    subtitle: 'Manage and promote your events',
    icon: Users
  },
  { 
    type: 'talent', 
    title: 'Talent', 
    subtitle: 'Showcase your talent and get booked for events',
    icon: Mic2
  },
  { 
    type: 'venue', 
    title: 'Venue', 
    subtitle: 'List and manage event locations',
    icon: MapPin
  },
]

const selectedProfile = ref(null)

function handleProceed() {
  if (selectedProfile.value) {
    // Navigate to the next step with the selected profile type
    // This can be customized based on the onboarding flow
    console.log('Proceeding with profile type:', selectedProfile.value)
    // Example: router.push({ name: 'ProfileSetup', params: { type: selectedProfile.value } })
  }
}
</script>
