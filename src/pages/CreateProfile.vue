<template>
  <div class="tw:min-h-screen tw:p-6 tw:bg-gray-100">    
    <div class="tw:mb-8 tw:text-center">
      <h1 class="tw:font-bold tw:text-xl tw:text-(--teritiary-color) tw:mb-2">Select profile type</h1>
      <p class="tw:text-gray-600 tw:text-lg">To continue, select the type of profile you want to create</p>
    </div>
    <div class="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:md:grid-cols-3 tw:gap-6 tw:mb-8">
      <div
        v-for="profile in profiles"
        :key="profile.type"
        @click="selectedProfile = profile.type"
        :class="['tw:cursor-pointer tw:bg-white tw:p-6 tw:rounded-lg tw:shadow-xl tw:text-center tw:flex tw:flex-col tw:items-center tw:transition tw:border', selectedProfile === profile.type ? 'tw:border-(--secondary-color)' : 'tw:border-transparent']"
      >
        <div class="tw:text-5xl tw:mb-4">{{ profile.icon }}</div>   
        <h2 class="tw:font-bold tw:text-(--teritiary-color) tw:text-xl tw:mb-2">{{ profile.title }}</h2>
        <p class="tw:text-gray-600">{{ profile.description }}</p>
      </div>
    </div>    
    <div v-if="selectedProfile">
      <h2 class="tw:text-2xl tw:text-center tw:text-(--teritiary-color) tw:font-semibold tw:mb-4">{{ selectedProfile.charAt(0).toUpperCase() + selectedProfile.slice(1) }} profile</h2>
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ArtistForm from '../components/ArtistForm.vue'
import EventForm from '../components/EventForm.vue'
import OrganisatorForm from '../components/OrganisatorForm.vue'

const profiles = [
  { type: 'artist', title: 'Artist', description: 'Showcase your talents', icon: '🎨' },
  { type: 'event', title: 'Event', description: 'Create and manage events', icon: '🎉' },
  { type: 'organisator', title: 'Organisator', description: 'Manage events efficiently', icon: '🛠️' },
]

const selectedProfile = ref(null)

const currentComponent = computed(() => {
  if (selectedProfile.value === 'artist') return ArtistForm
  if (selectedProfile.value === 'event') return EventForm
  if (selectedProfile.value === 'organisator') return OrganisatorForm
  return null
})
</script>
