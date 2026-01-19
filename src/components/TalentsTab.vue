<template>
  <div class="tw:px-4 tw:py-4">
    <!-- Section Title -->
    <h3 class="tw:text-base tw:font-medium tw:text-gray-900 tw:mb-4">
      {{ t('talents.title') }}
    </h3>

    <!-- Talents Grid -->
    <div v-if="talents.length > 0" :class="['tw:flex tw:flex-wrap tw:gap-3', isExpanded ? 'tw:max-h-96 tw:overflow-y-auto' : '']">
      <!-- Display talents -->
      <div
        v-for="(talent, index) in displayedTalents"
        :key="talent.id || index"
        class="tw:relative tw:group"
        @click="selectTalent(talent)"
      >
        <div class="tw:w-16 tw:h-16 tw:rounded-xl tw:overflow-hidden tw:border tw:border-gray-200 tw:transition-transform hover:tw:scale-105 tw-flex-shrink-0 tw:cursor-pointer">
          <img
            v-if="talent.image"
            :src="talent.image"
            :alt="talent.name"
            class="tw:w-full tw:h-full tw:object-cover"
          />
          <div
            v-else
            class="tw:w-full tw:h-full tw:bg-gray-200 tw:flex tw:items-center tw:justify-center"
          >
            <svg class="tw:w-8 tw:h-8 tw:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <!-- Tooltip with name and role -->
        <div class="tw:absolute tw:bottom-full tw:left-1/2 tw:-translate-x-1/2 tw:mb-2 tw:px-2 tw:py-1 tw:bg-gray-800 tw:text-white tw:text-xs tw:rounded tw:whitespace-nowrap tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity tw:pointer-events-none tw:z-10">
          <p class="tw:font-medium">{{ talent.name }}</p>
          <p v-if="talent.role" class="tw:text-gray-300">{{ talent.role }}</p>
        </div>
      </div>

      <!-- More Count Badge -->
      <div
        v-if="remainingCount > 0"
        @click="toggleExpanded"
        class="tw:w-16 tw:h-16 tw:rounded-xl tw:bg-[#F4F1EA] tw:flex tw:flex-col tw:items-center tw:justify-center tw:cursor-pointer tw-transition-colors hover:tw:bg-[#EAE6DC] tw:flex-shrink-0"
      >
        <span class="tw-text-sm tw-font-medium tw:text-gray-700">{{ remainingCount }}+</span>
        <span class="tw-xs tw:text-gray-500">{{ t('talents.more') }}</span>
      </div>
    </div>

    <!-- No Talents Message -->
    <div v-else class="tw:text-sm tw:text-gray-500 tw:py-4">
      {{ t('talents.noTalents') }}
    </div>

    <!-- Selected Talent Modal/Details -->
    <div 
      v-if="selectedTalent" 
      class="tw:fixed tw:inset-0 tw:bg-black/50 tw:flex tw:items-center tw:justify-center"
      style="z-index: 70;"
      @click.self="selectedTalent = null"
    >
      <div class="tw:bg-white tw:rounded-xl tw:p-6 tw:max-w-sm tw:w-full tw:mx-4 tw:shadow-xl">
        <div class="tw:flex tw:items-center tw:gap-4 tw:mb-4">
          <img 
            v-if="selectedTalent.image"
            :src="selectedTalent.image" 
            :alt="selectedTalent.name"
            class="tw:w-20 tw:h-20 tw:rounded-full tw:object-cover"
          />
          <div v-else class="tw:w-20 tw:h-20 tw:rounded-full tw:bg-gray-200 tw:flex tw:items-center tw:justify-center">
            <svg class="tw:w-10 tw:h-10 tw:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 class="tw:text-lg tw:font-semibold">{{ selectedTalent.name }}</h4>
            <p v-if="selectedTalent.role" class="tw:text-sm tw:text-gray-500">{{ selectedTalent.role }}</p>
          </div>
        </div>
        
        <p v-if="selectedTalent.bio" class="tw:text-sm tw:text-gray-600 tw:mb-4">
          {{ selectedTalent.bio }}
        </p>

        <!-- Social Links -->
        <div v-if="hasSocialLinks(selectedTalent)" class="tw:flex tw:gap-3 tw:mb-4">
          <a 
            v-if="selectedTalent.social_links?.spotify"
            :href="selectedTalent.social_links.spotify"
            target="_blank"
            rel="noopener noreferrer"
            class="tw:text-green-500 hover:tw:text-green-600"
          >
            <svg class="tw:w-6 tw:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </a>
          <a 
            v-if="selectedTalent.social_links?.instagram"
            :href="selectedTalent.social_links.instagram"
            target="_blank"
            rel="noopener noreferrer"
            class="tw:text-pink-500 hover:tw:text-pink-600"
          >
            <svg class="tw:w-6 tw:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a 
            v-if="selectedTalent.social_links?.website"
            :href="selectedTalent.social_links.website"
            target="_blank"
            rel="noopener noreferrer"
            class="tw:text-blue-500 hover:tw:text-blue-600"
          >
            <svg class="tw:w-6 tw:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
            </svg>
          </a>
        </div>

        <button 
          @click="selectedTalent = null"
          class="tw:w-full tw:py-2 tw:bg-gray-100 tw:rounded-lg tw:text-sm tw:font-medium hover:tw:bg-gray-200 tw:transition-colors"
        >
          {{ t('talents.close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Talent } from '../types/events'

const { t } = useI18n()

interface Props {
  talents?: Talent[]
}

const props = withDefaults(defineProps<Props>(), {
  talents: () => []
})

const isExpanded = ref(false)
const selectedTalent = ref<Talent | null>(null)

// Sort talents by sort_order
const sortedTalents = computed(() => {
  return [...props.talents].sort((a, b) => {
    const aOrder = a.sort_order ?? 999
    const bOrder = b.sort_order ?? 999
    return aOrder - bOrder
  })
})

// Display talents based on expanded state
const displayedTalents = computed(() => {
  const sorted = sortedTalents.value
  if (isExpanded.value || sorted.length <= 8) {
    return sorted
  }
  return sorted.slice(0, 8)
})

// Calculate remaining count
const remainingCount = computed(() => {
  const sorted = sortedTalents.value
  if (isExpanded.value || sorted.length <= 8) {
    return 0
  }
  return sorted.length - 8
})

// Toggle expanded state
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

// Select talent to show details
const selectTalent = (talent: Talent) => {
  selectedTalent.value = talent
}

// Check if talent has social links
const hasSocialLinks = (talent: Talent) => {
  return talent.social_links?.spotify || talent.social_links?.instagram || talent.social_links?.website
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
