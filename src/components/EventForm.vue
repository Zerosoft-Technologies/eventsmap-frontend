<template>
  <form @submit.prevent="submit" class="tw:flex tw:m-auto tw:w-1/2 tw:flex-col tw:gap-4">    
    <div>
      <label class="tw:block tw:mb-2">{{ $t('forms.eventForm.title') }}</label>
      <input 
        type="text" 
        v-model="form.title" 
        class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
        :placeholder="$t('forms.eventForm.titlePlaceholder')"
      />
    </div>    
    <div>
      <label class="tw:block tw:mb-2">{{ $t('forms.eventForm.bannerImages') }}</label>
      <input 
        type="file" 
        multiple 
        accept="image/*"
        @change="handleBannerUpload"
        class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
      />
      <p class="tw:text-sm tw:text-gray-500">{{ $t('forms.eventForm.bannerImagesInfo') }}</p>
    </div>        
      <h3 class="tw:text-xl tw:font-bold tw:text-(--teritiary-color) tw:text-center tw:mb-4">{{ $t('forms.eventForm.informationDetails') }}</h3>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">{{ $t('forms.eventForm.organizer') }}</label>
        <input 
          type="text" 
          v-model="form.organisator" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          :placeholder="$t('forms.eventForm.organizerPlaceholder')"
        />
      </div>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">{{ $t('forms.eventForm.musicType') }}</label>
        <input 
          type="text" 
          v-model="form.musicType" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          :placeholder="$t('forms.eventForm.musicTypePlaceholder')"
        />
      </div>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">{{ $t('forms.eventForm.entranceFee') }}</label>
        <input 
          type="number" 
          v-model="form.entranceFee" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          :placeholder="$t('forms.eventForm.entranceFeePlaceholder')"
        />
      </div>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">{{ $t('forms.eventForm.dresscode') }}</label>
        <input 
          type="text" 
          v-model="form.dresscode" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          :placeholder="$t('forms.eventForm.dresscodePlaceholder')"
        />
      </div>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">{{ $t('forms.eventForm.minimumAge') }}</label>
        <input 
          type="number" 
          v-model="form.minAge" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          :placeholder="$t('forms.eventForm.minimumAgePlaceholder')"
        />
      </div>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">{{ $t('forms.eventForm.artists') }}</label>
        <input 
          type="text" 
          v-model="form.artists" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          :placeholder="$t('forms.eventForm.artistsPlaceholder')"
        />
      </div>
      
      <div class="tw:mb-4">
        <label class="tw:block  tw:mb-2">{{ $t('forms.eventForm.talents') }}</label>
        <input 
          type="text" 
          v-model="form.talents" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          :placeholder="$t('forms.eventForm.talentsPlaceholder')"
        />
      </div>
    
    
    <div>
      <label class="tw:block  tw:mb-2">{{ $t('forms.eventForm.eventImages') }}</label>
      <input 
        type="file" 
        multiple 
        accept="image/*"
        @change="handleEventImagesUpload"
        class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
      />
      <p class="tw:text-sm tw:text-gray-500">{{ $t('forms.eventForm.eventImagesInfo') }}</p>
    </div>
    
    <div class="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
      <div>
        <label class="tw:block  tw:mb-2">{{ $t('forms.eventForm.eventDate') }}</label>
        <input 
          type="date" 
          v-model="form.date" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
        />
      </div>

      <div>
        <label class="tw:block  tw:mb-2">{{ $t('forms.eventForm.eventLocation') }}</label>
        <input 
          type="text" 
          v-model="form.location" 
          class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
          :placeholder="$t('forms.eventForm.eventLocationPlaceholder')"
        />
      </div>
    </div>
    
    <div>
      <label class="tw:block  tw:mb-2">{{ $t('forms.eventForm.aboutEvent') }}</label>
      <textarea 
        v-model="form.about" 
        class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none tw:min-h-[120px]"
        :placeholder="$t('forms.eventForm.aboutEventPlaceholder')"
      ></textarea>
    </div>
    
    <button 
      type="submit" 
      class="tw:w-full tex tw:border tw:border-(--secondary-color) tw:rounded-lg tw:py-2 tw:hover:bg-(--secondary-color) tw:hover:text-white tw:outline-none tw:transition"
    >
      {{ $t('forms.eventForm.submitEvent') }}
    </button>

  </form>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
    alert($t('forms.eventForm.maxImagesError'))
    return
  }
  form.bannerImages = files
}

function handleEventImagesUpload(e) {
  const files = Array.from(e.target.files)
  if (files.length !== 2) {
    alert($t('forms.eventForm.exactImagesError'))
    return
  }
  form.eventImages = files
}

function submit() {
  alert($t('forms.eventForm.eventRegisteredSuccess'))
}
</script>

<style>
    form label{
        color: #1E3A8A !important;
    }
</style>
