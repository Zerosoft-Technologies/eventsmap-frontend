<template>
  <!-- Panel -->
  <transition name="slide">
    <div v-if="visible"
      class="tw:fixed tw:p-0 tw:bg-white tw:rounded-2xl tw:top-32 tw:bottom-4 tw:z-40 tw:w-[420px] tw:max-w-[calc(100vw-2rem)] tw:shadow-xl tw:flex tw:flex-col tw:overflow-hidden"
      style="left: 430px;">
      
      <!-- Gallery Slider - AT THE VERY TOP -->
      <div class="tw:relative tw:h-56 tw:md:h-64 tw:overflow-hidden tw:flex-shrink-0">
        <div class="tw:flex tw:transition-transform tw:duration-300 tw:ease-in-out tw:h-full"
          :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }">
          <div v-for="(image, index) in images" :key="index" class="tw:w-full tw:flex-shrink-0 tw:h-full">
            <img :src="image" :alt="`${event?.title} - Image ${index + 1}`"
              class="tw:w-full tw:h-full tw:object-cover" />
          </div>
        </div>

        <!-- Left arrow -->
        <button v-if="images.length > 1" @click="prevImage" 
          class="tw:absolute tw:left-4 tw:top-1/2 tw:-translate-y-1/2
          tw:w-8 tw:h-8
          tw:bg-white/90 tw:backdrop-blur-sm tw:rounded-full
          tw:flex tw:items-center tw:justify-center
          tw:transition-all tw:duration-200 hover:tw:bg-white tw:shadow-lg tw:z-10" 
          :aria-label="$t('eventDetails.previousImage')">
          <ChevronLeftIcon class="tw:w-4 tw:h-4 tw:text-gray-700" />
        </button>

        <!-- Right arrow -->
        <button v-if="images.length > 1" @click="nextImage" 
          class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2
          tw:w-8 tw:h-8
          tw:bg-white/90 tw:backdrop-blur-sm tw:rounded-full
          tw:flex tw:items-center tw:justify-center
          tw:transition-all tw:duration-200 hover:tw:bg-white tw:shadow-lg tw:z-10" 
          :aria-label="$t('eventDetails.nextImage')">
          <ChevronRightIcon class="tw:w-4 tw:h-4 tw:text-gray-700" />
        </button>

        <!-- Image counter -->
        <div v-if="images.length > 1"
          class="tw:absolute tw:bottom-4 tw:right-4 tw:px-2 tw:py-1 tw:bg-black/60 tw:backdrop-blur-sm tw:rounded-full tw:z-10">
          <span class="tw:text-xs tw:text-white tw:font-medium">
            {{ currentImageIndex + 1 }} / {{ images.length }}
          </span>
        </div>
      </div>

      <!-- Header with Title and Event Status -->
      <div class="tw:px-4 tw:py-4 tw:flex tw:items-center tw:justify-between tw:gap-3">
        <h2 class="tw:text-xl tw:font-semibold tw:leading-tight tw:flex-1">
          {{ event?.title || $t('eventDetails.untitled') }}
        </h2>
        
        <!-- Event Status Button -->
        <button v-if="eventStatus" class="tw:flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:rounded-full tw:border tw:border-[#0061FF] tw:bg-white">
          <!-- <img src="../assets/live-streaming-blue.png" :alt="eventStatus.text" class="tw:w-3 tw:h-3" /> -->
          <span>{{ eventStatus.text }}</span>
        </button>
      </div>

      <!-- <div class="tw:h-px tw:bg-gray-200 tw:mb-3"></div> -->

      <!-- Filter Chips - COMMENTED OUT -->
      <!-- <div class="tw:px-4 tw:py-3 tw:flex tw:gap-2 tw:overflow-x-auto tw:scrollbar-hide tw:flex-shrink-0">
        <button
          class="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-gray-200 tw:text-sm tw:whitespace-nowrap tw:text-gray-600 tw:bg-white hover:tw:bg-gray-50 tw:transition-colors tw:flex-shrink-0">
          <svg class="tw:w-4 tw:h-4 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
          </svg>
          {{ event?.category ? event.category.name : 'Category' }}
        </button>
        <button v-if="event?.start_datetime"
          class="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-gray-200 tw:text-sm tw:whitespace-nowrap tw:text-gray-600 tw:bg-white hover:tw:bg-gray-50 tw:transition-colors tw:flex-shrink-0">
          <svg class="tw:w-4 tw:h-4 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ openingHours }}
        </button>
        <button v-if="event?.price || event?.min_price || event?.max_price"
          class="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-gray-200 tw:text-sm tw:whitespace-nowrap tw:text-gray-600 tw:bg-white hover:tw:bg-gray-50 tw:transition-colors tw:flex-shrink-0">
          <svg class="tw:w-4 tw:h-4 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ formattedPrice }}
        </button>
        <button v-if="eventStatus" 
          class="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-gray-200 tw:text-sm tw:whitespace-nowrap tw:text-gray-600 tw:bg-white hover:tw:bg-gray-50 tw:transition-colors tw:flex-shrink-0">
          <span class="tw:w-2 tw:h-2 tw:bg-red-500 tw:rounded-full" :class="eventStatus.type === 'live' ? 'tw:animate-pulse' : ''"></span>
          {{ eventStatus.text }}
        </button>
      </div> -->

      <!-- Action Buttons - COMMENTED OUT -->
      <!-- <div class="tw:px-4 tw:pb-4 tw:flex tw:gap-2 tw:flex-shrink-0">
        <button @click="handleWishlistToggle"
          class="tw:flex-1 tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2.5 tw:text-sm tw:font-medium tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:text-gray-700 tw:transition-all tw:duration-200 hover:tw:bg-gray-50"
          :class="wishlistStore.isWishlisted(event?.id) ? 'tw:border-red-200 tw:bg-red-50 tw:text-red-600' : ''"
          :disabled="wishlistLoading">
          <svg 
            class="tw:w-4 tw:h-4 tw:transition-colors tw:duration-200" 
            :class="wishlistStore.isWishlisted(event?.id) ? 'tw:text-red-500 tw:fill-red-500' : 'tw:text-gray-400 tw:fill-none'"
            :style="wishlistLoading ? 'opacity: 0.5' : ''"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {{ $t('eventCard.save') }}
        </button>
        <button @click="handleRoute"
          class="tw:flex-1 tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2.5 tw:text-sm tw:font-medium tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:text-gray-700 tw:transition-all tw:duration-200 hover:tw:bg-gray-50">
          <svg class="tw:w-4 tw:h-4 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          {{ $t('eventCard.route') }}
        </button>
        <button @click="handleShare"
          class="tw:flex-1 tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2.5 tw:text-sm tw:font-medium tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:text-gray-700 tw:transition-all tw:duration-200 hover:tw:bg-gray-50">
          <svg class="tw:w-4 tw:h-4 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
          </svg>
          {{ $t('event.share') }}
        </button>
      </div> -->

      <!-- Tabs Navigation -->
      <div class="tw:px-3 tw:pb-0 tw:bg-[#FAFBFF] tw:sticky tw:top-0 tw:z-10 tw:flex-shrink-0">
        <div class="tw:flex tw:overflow-x-auto tw:scrollbar-hide tw:border-b tw:border-gray-200">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
            'tw:px-3 tw:py-3 tw:text-sm tw:font-medium tw:whitespace-nowrap tw:relative tw:border-b-2 tw:flex-shrink-0 tw:transition-colors tw:duration-200',
            activeTab === tab.id
              ? 'tw:text-[#FF7700] tw:border-[#FF7700]'
              : 'tw:text-gray-500 tw:border-transparent hover:tw:text-gray-700'
          ]">
            {{ $t(tab.labelKey) }}
          </button>
        </div>
      </div>

      <!-- Scrollable content area -->
      <div class="tw:flex-1 tw:overflow-y-auto tw:overscroll-contain">
        <!-- Tab Content -->
        <div class="tw:flex-1 tw:overflow-y-auto">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="tw:p-3">
            <!-- Event Details List -->
            <div class="tw:space-y-1">
              <!-- Dress Code -->
              <div class="tw:flex tw:items-center tw:gap-2 tw:py-2 tw:border-b tw:border-gray-100">
                <div class="tw:flex tw:items-center tw:justify-center tw:w-5">
                  <svg class="tw:w-4 tw:h-4 tw:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div class="tw:flex-1">
                  <p class="tw:text-xs tw:text-gray-500 tw:mb-0.5">Dress Code</p>
                  <p class="tw:text-sm tw:font-medium tw:text-gray-900 tw:capitalize">{{ event?.dresscode || $t('eventDetails.notSpecified') }}</p>
                </div>
              </div>

              <!-- Age -->
              <div class="tw:flex tw:items-center tw:gap-2 tw:py-2 tw:border-b tw:border-gray-100">
                <div class="tw:flex tw:items-center tw:justify-center tw:w-5">
                  <svg class="tw:w-4 tw:h-4 tw:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div class="tw:flex-1">
                  <p class="tw:text-xs tw:text-gray-500 tw:mb-0.5">Age</p>
                  <p class="tw:text-sm tw:font-medium tw:text-gray-900">{{ event?.age_limit || $t('eventDetails.allAges') }}</p>
                </div>
              </div>

              <!-- Entrance Status -->
              <div class="tw:flex tw:items-center tw:gap-2 tw:py-2 tw:border-b tw:border-gray-100">
                <div class="tw:flex tw:items-center tw:justify-center tw:w-5">
                  <svg class="tw:w-4 tw:h-4 tw:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div class="tw:flex-1">
                  <p class="tw:text-xs tw:text-gray-500 tw:mb-0.5">Entrance Status</p>
                  <p class="tw:text-sm tw:font-medium tw:text-gray-900 tw:capitalize">{{ event?.entrance_status || $t('eventDetails.notSpecified') }}</p>
                </div>
              </div>

              <!-- Venue Name -->
              <div class="tw:flex tw:items-center tw:gap-3 tw:py-2">
                <div class="tw:w-10 tw:h-10 tw:bg-gray-100 tw:rounded-xl tw:flex tw:items-center tw:justify-center">
                  <svg class="tw:w-5 tw:h-5 tw:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div class="tw:flex-1">
                  <p class="tw:text-xs tw:text-gray-500 tw:mb-0.5">Venue Name</p>
                  <p class="tw:text-sm tw:font-medium tw:text-gray-900">
                    {{ event?.venue?.name || (event?.invited_venues && event.invited_venues.length > 0 ? 'Venue details available' : $t('eventDetails.notSpecified')) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Like Button -->
            <div class="tw:mt-6 tw:px-3">
              <button class="tw:w-full tw:flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2.5 tw:bg-[#FF7700] tw:text-white tw:font-medium tw:rounded-lg tw:transition-colors hover:tw:bg-[#E66800]">
                <svg class="tw:w-5 tw:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                Like Event
              </button>
            </div>
          </div>

          <!-- About Tab -->
          <AboutTab v-else-if="activeTab === 'about'" :about="event?.about"
            :description="event?.about?.description || event?.description" />

          <!-- Date & Location Tab -->
          <DateLocationTab v-else-if="activeTab === 'dateLocation'" :event="event"
            :location-details="event?.location_details" />

          <!-- Venue Tab -->
          <VenueTab v-else-if="activeTab === 'venue'" :event="event"
            :location-details="event?.location_details" />

          <!-- Talents Tab -->
          <TalentsTab v-else-if="activeTab === 'talents'" :talents="event?.talents || []" />
          <!-- <TalentsTab v-else-if="activeTab === 'talents'" :talents="mockTalents" /> -->

          <!-- Community Tab -->
          <!-- <CommunityTab v-else-if="activeTab === 'community'" :community="event?.community || mockCommunity" /> -->
        </div>
      </div>
      <!-- Close button -->
      <button @click="close"
        class="tw:absolute tw:z-[60] tw:top-1/2 tw:-translate-y-1/2 tw:-right-3 tw:w-7 tw:h-12 tw:bg-white tw:shadow-md tw:flex tw:items-center tw:justify-center hover:tw:shadow-lg tw:transition-all hover:tw:-right-4"
        style="border-radius: 0; border-top-right-radius: 10px; border-bottom-right-radius: 10px; right: -28px;">
        <img src="../assets/chevron-bold-left.png" class="tw:w-3 tw:h-3" />
      </button>
    </div>

  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  MapPinIcon,
  Share2Icon,
  MusicIcon,
  TicketIcon,
  ShirtIcon,
  UsersIcon,
  CalendarIcon,
  LinkIcon,
  UserIcon
} from 'lucide-vue-next'
import AboutTab from './AboutTab.vue'
import DateLocationTab from './DateLocationTab.vue'
import VenueTab from './VenueTab.vue'
import TalentsTab from './TalentsTab.vue'
import CommunityTab from './CommunityTab.vue'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const wishlistStore = useWishlistStore()
const authStore = useAuthStore()

// Props
const props = defineProps({
  /**
   * Controls panel visibility
   */
  visible: {
    type: Boolean,
    default: false
  },
  /**
   * Event object containing all event data
   * Should match the Event type from types/events.ts
   */
  event: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'link', 'route', 'share'])

const detailsWishlistBtnClass = computed(() => {
  const pending = wishlistStore.isWishlistPending(props.event?.id)
  const base = pending
    ? 'tw:opacity-90 tw:pointer-events-none tw:cursor-wait'
    : ''
  if (wishlistStore.isWishlisted(props.event?.id)) {
    return `${base} tw:border-[var(--primary-color)] tw:bg-[var(--primary-color)]/10`
  }
  return `${base}`
})

const detailsWishlistIconClass = computed(() => {
  if (wishlistStore.isWishlisted(props.event?.id)) {
    return 'tw:text-[var(--primary-color)] tw:fill-[var(--primary-color)] tw:stroke-[var(--primary-color)]'
  }
  return 'tw:text-gray-400 tw:fill-none'
})

// Wishlist toggle (optimistic UI + rollback + toast in store)
async function handleWishlistToggle() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login' })
    return
  }
  if (!props.event) return
  await wishlistStore.toggleWishlist(props.event)
}

// State
const currentImageIndex = ref(0)
const activeTab = ref('overview')

// Tab configuration
const tabs = [
  { id: 'overview', labelKey: 'eventDetails.tabs.overview' },
  // { id: 'about', labelKey: 'eventDetails.tabs.about' },
  { id: 'dateLocation', labelKey: 'eventDetails.tabs.dateLocation' },
  // { id: 'venue', labelKey: 'eventDetails.tabs.venue' },
  // { id: 'talents', labelKey: 'eventDetails.tabs.talents' },
  // { id: 'community', labelKey: 'eventDetails.tabs.community' }
]

// Debug: Log event prop and coordinates
watch(() => props.event, (newEvent) => {
  console.log('[EventDetailsPanel] Event prop received:', newEvent)
  if (newEvent) {
    console.log('[EventDetailsPanel] Event ID:', newEvent.id)
    console.log('[EventDetailsPanel] Event title:', newEvent.title)
    console.log('[EventDetailsPanel] latitude:', newEvent.latitude, 'type:', typeof newEvent.latitude)
    console.log('[EventDetailsPanel] longitude:', newEvent.longitude, 'type:', typeof newEvent.longitude)
    console.log('[EventDetailsPanel] address:', newEvent.address)
  }
}, { immediate: true, deep: true })

const mockTalents = [
  { name: "DJ Shadow", image: "https://picsum.photos/seed/talent1/200/200.jpg" },
  { name: "Luna Nova", image: "https://picsum.photos/seed/talent2/200/200.jpg" },
  { name: "The Vibes", image: "https://picsum.photos/seed/talent3/200/200.jpg" },
  { name: "Electric Dreams", image: "https://picsum.photos/seed/talent4/200/200.jpg" },
  { name: "Jazz Masters", image: "https://picsum.photos/seed/talent5/200/200.jpg" },
  { name: "Neon Lights", image: "https://picsum.photos/seed/talent6/200/200.jpg" },
  { name: "Rhythm Kings", image: "https://picsum.photos/seed/talent7/200/200.jpg" },
  { name: "Soul Train", image: "https://picsum.photos/seed/talent8/200/200.jpg" },
  { name: "Funk Factory", image: "https://picsum.photos/seed/talent9/200/200.jpg" },
  { name: "Beat Makers", image: "https://picsum.photos/seed/talent10/200/200.jpg" },
  { name: "Groove City", image: "https://picsum.photos/seed/talent11/200/200.jpg" },
  { name: "Sound Wave", image: "https://picsum.photos/seed/talent12/200/200.jpg" },
  { name: "Pulse Party", image: "https://picsum.photos/seed/talent13/200/200.jpg" },
  { name: "Jazz Jam", image: "https://picsum.photos/seed/talent14/200/200.jpg" },
  { name: "Electro Edge", image: "https://picsum.photos/seed/talent15/200/200.jpg" },
  { name: "Techno Tunes", image: "https://picsum.photos/seed/talent16/200/200.jpg" },
  { name: "Rave Revolution", image: "https://picsum.photos/seed/talent17/200/200.jpg" },
  { name: "Punk Parade", image: "https://picsum.photos/seed/talent18/200/200.jpg" },
  { name: "Metal Madness", image: "https://picsum.photos/seed/talent19/200/200.jpg" },
  { name: "Hip Hop Heat", image: "https://picsum.photos/seed/talent20/200/200.jpg" },
  { name: "Pop Culture", image: "https://picsum.photos/seed/talent21/200/200.jpg" },
  { name: "R&B Revolution", image: "https://picsum.photos/seed/talent22/200/200.jpg" }
]

const mockCommunity = [
  { name: "Alex Johnson", image: "https://picsum.photos/seed/user1/200/200.jpg" },
  { name: "Sarah Williams", image: "https://picsum.photos/seed/user2/200/200.jpg" },
  { name: "Mike Chen", image: "https://picsum.photos/seed/user3/200/200.jpg" },
  { name: "Emma Davis", image: "https://picsum.photos/seed/user4/200/200.jpg" },
  { name: "John Smith", image: "https://picsum.photos/seed/user5/200/200.jpg" },
  { name: "Lisa Anderson", image: "https://picsum.photos/seed/user6/200/200.jpg" },
  { name: "David Brown", image: "https://picsum.photos/seed/user7/200/200.jpg" },
  { name: "Maria Garcia", image: "https://picsum.photos/seed/user8/200/200.jpg" },
  { name: "Tom Wilson", image: "https://picsum.photos/seed/user9/200/200.jpg" },
  { name: "Anna Martinez", image: "https://picsum.photos/seed/user10/200/200.jpg" },
  { name: "Chris Taylor", image: "https://picsum.photos/seed/user11/200/200.jpg" },
  { name: "Julia White", image: "https://picsum.photos/seed/user12/200/200.jpg" },
  { name: "Ryan Lee", image: "https://picsum.photos/seed/user13/200/200.jpg" },
  { name: "Sophie Turner", image: "https://picsum.photos/seed/user14/200/200.jpg" },
  { name: "Mark Harris", image: "https://picsum.photos/seed/user15/200/200.jpg" },
  { name: "Nina Patel", image: "https://picsum.photos/seed/user16/200/200.jpg" },
  { name: "Oliver Jones", image: "https://picsum.photos/seed/user17/200/200.jpg" },
  { name: "Grace Kim", image: "https://picsum.photos/seed/user18/200/200.jpg" }
]

// Reset state when event changes
watch(() => props.event, () => {
  currentImageIndex.value = 0
  activeTab.value = 'overview'
})

// Computed: Get event images or fallback to dummy
const images = computed(() => {
  return [props.event?.cover_image]
  if (props.event?.images && props.event.images.length > 0) {
    return props.event.images
  }
  // Fallback to dummy image - create multiple for demo
  const dummyImage = new URL('../assets/dummy-event.png', import.meta.url).href
  return [dummyImage, dummyImage, dummyImage]
})

// Computed: Current displayed image
const currentImage = computed(() => {
  return images.value[currentImageIndex.value] || images.value[0]
})

// Computed: Formatted price
const formattedPrice = computed(() => {
  if (!props.event?.price) {
    return t('event.free')
  }
  return props.event.price
})

// Computed: Age requirement display
const ageRequirement = computed(() => {
  if (!props.event?.min_age) {
    return t('eventDetails.allAges')
  }
  return `${props.event.min_age}+`
})

// Computed: Event status (upcoming/live/past)
const eventStatus = computed(() => {
  if (!props.event?.start_datetime) {
    return null
  }

  const now = new Date()
  // const start = new Date(props.event.start_datetime)
  // const end = props.event.end_datetime ? new Date(props.event.end_datetime) : start

  const startDate = new Date(`${props.event.event_date}T${props.event.start_datetime}`)
  const endDate = new Date(`${props.event.event_date}T${props.event.end_datetime}`)
  const start = startDate.getTime()
  const end = endDate.getTime()

  if (now < start) {
    // Upcoming event
    return {
      type: 'upcoming',
      text: t('eventCard.upcomingEvent'),
      icon: '../assets/calendar-upcoming.png'
    }
  } else if (now >= start && now <= end) {
    // Live event
    return {
      type: 'live',
      text: t('eventCard.liveNow'),
      icon: '../assets/live-streaming.png'
    }
  } else {
    // Past event
    return {
      type: 'past',
      text: t('eventCard.pastEvent'),
      icon: '../assets/calendar-past.png'
    }
  }
})

// Computed: Opening hours
const openingHours = computed(() => {
  if (!props.event?.start_datetime || !props.event?.event_date) {
    return t('eventDetails.notSpecified')
  }

  const start = new Date(`${props.event.event_date}T${props.event.start_datetime}`)
  const end = props.event.end_datetime ? new Date(`${props.event.event_date}T${props.event.end_datetime}`) : null

  const timeOpts = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }

  const startTime = start.toLocaleTimeString('en-US', timeOpts)

  if (end) {
    const endTime = end.toLocaleTimeString('en-US', timeOpts)
    return `${startTime} - ${endTime}`
  }

  return startTime
})

// Computed: Formatted date and time
const formattedDateTime = computed(() => {
  if (!props.event?.start_datetime || !props.event?.event_date) {
    return t('eventDetails.notSpecified')
  }

  const start = new Date(`${props.event.event_date}T${props.event.start_datetime}`)
  const end = props.event.end_datetime ? new Date(`${props.event.event_date}T${props.event.end_datetime}`) : null

  const dateOpts = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }
  const timeOpts = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }

  const dateStr = start.toLocaleDateString('en-US', dateOpts)
  const startTime = start.toLocaleTimeString('en-US', timeOpts)

  if (end) {
    const endTime = end.toLocaleTimeString('en-US', timeOpts)
    return `${dateStr}, ${startTime} - ${endTime}`
  }

  return `${dateStr}, ${startTime}`
})

// Methods
function close() {
  emit('close')
}

function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
}

// Action button handlers (UI only for now)
function handleLink() {
  emit('link', props.event)
}

function handleRoute() {
  emit('route', props.event)
}

function handleShare() {
  emit('share', props.event)
}
</script>

<style scoped>
/* Panel slide-in animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(-100%);
  }
}

/* Hide scrollbar for tabs and filter chips */
.tw\:scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.tw\:scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Custom scrollbar for content area */
.tw\:overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.tw\:overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.tw\:overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.tw\:overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
