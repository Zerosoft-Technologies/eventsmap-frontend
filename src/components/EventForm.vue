<template>
  <form @submit.prevent="submit" class="tw:flex tw:m-auto tw:w-1/2 tw:flex-col tw:gap-4">    
    <div>
      <label class="tw:block tw:mb-2">Title of Event</label>
      <input 
        type="text" 
        v-model="form.title" 
        class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
        placeholder="Enter event title"
      />
    </div>    
    <div>
      <label class="tw:block tw:mb-2">Event Images / Banner (Max 5)</label>
      <input 
        type="file" 
        multiple 
        accept="image/*"
        @change="handleBannerUpload"
        class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
      />
      <p class="tw:text-sm tw:text-gray-500">You can upload up to 5 images.</p>
    </div>        
      <h3 class="tw:text-xl tw:font-bold tw:text-(--teritiary-color) tw:text-center tw:mb-4">Information Details</h3>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">Details Organisator</label>
        <input 
          type="text" 
          v-model="form.organisator" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          placeholder="Organisator details"
        />
      </div>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">Music Type</label>
        <input 
          type="text" 
          v-model="form.musicType" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          placeholder="e.g., EDM, Hip-Hop, Techno"
        />
      </div>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">Entrance Fee</label>
        <input 
          type="number" 
          v-model="form.entranceFee" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          placeholder="0 for free"
        />
      </div>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">Dresscode</label>
        <input 
          type="text" 
          v-model="form.dresscode" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          placeholder="e.g., Casual, Formal, Party"
        />
      </div>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">Minimum Age</label>
        <input 
          type="number" 
          v-model="form.minAge" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          placeholder="e.g., 18, 21"
        />
      </div>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">Artists Joining the Event</label>
        <input 
          type="text" 
          v-model="form.artists" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          placeholder="Comma-separated names"
        />
      </div>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">Talents Joining the Event</label>
        <input 
          type="text" 
          v-model="form.talents" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          placeholder="Comma-separated names"
        />
      </div>
    
    
    <div>
      <label class="tw:block  tw:mb-2">Event Images (2 Required)</label>
      <input 
        type="file" 
        multiple 
        accept="image/*"
        @change="handleEventImagesUpload"
        class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
      />
      <p class="tw:text-sm tw:text-gray-500">Upload exactly 2 images.</p>
    </div>
    
    <div class="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
      <div>
        <label class="tw:block  tw:mb-2">Event Date</label>
        <input 
          type="date" 
          v-model="form.date" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
        />
      </div>

      <div>
        <label class="tw:block  tw:mb-2">Event Location</label>
        <input 
          type="text" 
          v-model="form.location" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          placeholder="City, Venue, Address"
        />
      </div>
    </div>
    
    <div>
      <label class="tw:block  tw:mb-2">About the Event</label>
      <textarea 
        v-model="form.about" 
        class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none tw:min-h-[120px]"
        placeholder="Describe your event..."
      ></textarea>
    </div>
    
    <button 
      type="submit" 
      class="tw:w-full tex tw:border tw:border-(--secondary-color) tw:rounded-lg tw:py-2 tw:hover:bg-(--secondary-color) tw:hover:text-white tw:outline-none tw:transition"
    >
      Submit Event
    </button>

  </form>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  title: "",
  bannerImages: [],
  organisator: "",
  musicType: "",
  entranceFee: "",
  dresscode: "",
  minAge: "",
  artists: "",
  talents: "",
  eventImages: [],
  date: "",
  location: "",
  about: ""
})

function handleBannerUpload(e) {
  const files = Array.from(e.target.files)
  if (files.length > 5) {
    alert("You can upload a maximum of 5 images.")
    return
  }
  form.bannerImages = files
}

function handleEventImagesUpload(e) {
  const files = Array.from(e.target.files)
  if (files.length !== 2) {
    alert("Please upload exactly 2 images.")
    return
  }
  form.eventImages = files
}

function submit() {
  console.log("Event Form Data:", form)
  alert("Event registered successfully!")
}
</script>

<style>
    form label{
        color: #1E3A8A !important;
    }
</style>
