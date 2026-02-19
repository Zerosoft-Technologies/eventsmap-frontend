<template>
  <!-- Panel -->
  <transition name="slide">
    <div v-if="visible"
      class="tw:fixed tw:p-0 tw:bg-white tw:rounded-2xl tw:bottom-4 tw:z-50 tw:w-[420px] tw:max-w-[calc(100vw-2rem)] tw:shadow-xl tw:flex tw:flex-col tw:overflow-visible"
      style="left: 540px;">
      <!-- Filter Chips -->
      <div class="tw:absolute tw:z-[60] tw:z-10" style="top: -45px;">
        <div class="tw:flex tw:gap-2">
          <!-- Opening Hours Chip -->
          <button
            class="tw:bg-white tw:gap-1 tw:px-3 tw:py-2 tw:flex tw:items-center tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)"
            style="border-radius: 30px;">
            <img src="../assets/timer.png" alt="Opening Hours" class="tw:w-3 tw:h-3">
            <span class="tw:text-xs">Categories</span>
          </button>
          <button v-if="event?.start_datetime"
            class="tw:bg-white tw:gap-1 tw:px-3 tw:py-2 tw:flex tw:items-center tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)"
            style="border-radius: 30px;">
            <img src="../assets/timer.png" alt="Opening Hours" class="tw:w-3 tw:h-3">
            <span class="tw:text-xs">{{ openingHours }}</span>
          </button>

          <!-- Price Chip -->
          <button v-if="event?.price || event?.min_price || event?.max_price"
            class="tw:bg-white tw:gap-1 tw:px-3 tw:py-2 tw:flex tw:items-center tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)"
            style="border-radius: 30px;">
            <img src="../assets/sack-doller.png" alt="Price" class="tw:w-3 tw:h-3">
            <span class="tw:text-xs">{{ formattedPrice }}</span>
          </button>

          <!-- Event Status Chip -->
          <!-- <button v-if="eventStatus" class="tw:bg-white tw:gap-1 tw:px-3 tw:py-2 tw:flex tw:items-center 
            tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border 
            tw:border-(--secondary-color)" style="border-radius: 30px;">
            <img src="../assets/live-streaming-blue.png" :alt="eventStatus.text" class="tw:w-3 tw:h-3">
            <span class="tw:text-xs"> {{ eventStatus.text }}</span>
          </button> -->

        </div>
      </div>
      <!-- Event Title -->
      <!-- Event Title + Status -->
      <div class="tw:px-4 tw:py-4 tw:flex tw:items-center tw:justify-between tw:gap-3">

        <!-- Title -->
        <h2 class="tw:text-xl tw:font-semibold tw:leading-tight tw:flex-1">
          {{ event?.title || $t('eventDetails.untitled') }}
        </h2>

        <!-- Event Status Button -->
        <button v-if="eventStatus" class="tw:flex tw:items-center tw:gap-1
           tw:px-3 tw:py-1.5
           tw:text-xs tw:font-medium
           tw:rounded-full
           tw:border tw:border-(--secondary-color)
           tw:bg-white">
          <img src="../assets/live-streaming-blue.png" :alt="eventStatus.text" class="tw:w-3 tw:h-3" />
          <span>{{ eventStatus.text }}</span>
        </button>

      </div>

      <div class="tw:h-px tw:bg-gray-200 tw:mb-3"></div>

      <!-- Scrollable content area -->
      <div
        class="tw:flex-1 tw:overflow-y-auto tw:pr-2 tw:max-h-[80vh] tw:lg:max-h-[60vh] tw:space-y-4 tw:pr-2 tw:overflow-y-auto">
        <!-- Gallery Slider -->
        <div class="tw:relative tw:h-48 tw:overflow-hidden tw:rounded-t-2xl tw:mb-2">
          <div class="tw:flex tw:transition-transform tw:duration-300 tw:ease-in-out tw:h-full"
            :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }">
            <div v-for="(image, index) in images" :key="index" class="tw:w-full tw:flex-shrink-0 tw:h-full tw:px-4">
              <img :src="image" :alt="`${event?.title} - Image ${index + 1}`"
                class="tw:w-full tw:h-full tw:object-cover" style="border-radius: 20px;" />
            </div>
          </div>

          <!-- Left arrow -->
          <button v-if="images.length > 1" @click="prevImage" class="tw:absolute tw:left-6 tw:top-1/2 tw:-translate-y-1/2
         tw:w-8 tw:h-8
         tw:bg-black/20 tw:backdrop-blur-sm tw:rounded-full
         tw:flex tw:items-center tw:justify-center
         tw:transition-all tw:duration-200 hover:tw:bg-black/30 tw:z-10" :aria-label="$t('eventDetails.previousImage')"
            style="background: white; box-shadow: 0px 0px 2px 0px black;">
            <ChevronLeftIcon class="tw:w-4 tw:h-4 tw:text-black" />
          </button>

          <!-- Right arrow -->
          <button v-if="images.length > 1" @click="nextImage" class="tw:absolute tw:right-6 tw:top-1/2 tw:-translate-y-1/2
         tw:w-8 tw:h-8
         tw:bg-black/20 tw:backdrop-blur-sm tw:rounded-full
         tw:flex tw:items-center tw:justify-center
         tw:transition-all tw:duration-200 hover:tw:bg-black/30 tw:z-10" :aria-label="$t('eventDetails.nextImage')"
            style="background: white; box-shadow: 0px 0px 2px 0px black;">
            <ChevronRightIcon class="tw:w-4 tw:h-4 tw:text-black" />
          </button>

          <!-- Image counter -->
          <div v-if="images.length > 1"
            class="tw:absolute tw:bottom-4 tw:right-4 tw:px-2 tw:py-1 tw:bg-black/50 tw:backdrop-blur-sm tw:rounded-full tw:z-10">
            <span class="tw:text-xs tw:text-white font-medium">
              {{ currentImageIndex + 1 }} / {{ images.length }}
            </span>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="tw:px-4 tw:pb-4">
          <div class="tw:flex tw:overflow-x-auto tw:scrollbar-hide tw:border-b tw:border-gray-200 justify-between">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
              'tw:px-0 tw:py-3 tw:text-sm tw:font-medium tw:whitespace-nowrap tw:mr-8 tw:relative tw:border-b-2 tw:flex-shrink-0 tw:transition-colors tw:duration-200',
              activeTab === tab.id
                ? 'tw:text-[var(--secondary-color)] tw:border-[var(--secondary-color)]'
                : 'tw:text-[var(--primary-color)] tw:border-transparent hover:tw:text-[var(--secondary-color)] hover:tw:border-[var(--secondary-color)]'
            ]" style="margin: 0 5px;">
              {{ $t(tab.labelKey) }}
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="tw:flex-1 tw:overflow-y-auto">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="tw:p-4">
            <!-- Action Buttons -->
            <div class="tw:flex tw:justify-between tw:items-center tw:mb-6">

              <div class="tw:flex tw:gap-3">
                <button @click="handleLink"
                  class="tw:bg-white tw:gap-1 tw:px-3 tw:py-2 tw:flex tw:items-center tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)">
                  <img src="../assets/favourite.png" alt="Favourite Icon">
                  <!-- <span class="tw:leading-[1.2]">{{ $t('eventCard.link') }}</span> -->
                </button>
                <button @click="handleRoute"
                  class="tw:bg-white tw:gap-1 tw:px-3 tw:py-2 tw:flex tw:items-center tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)">
                  <span>{{ $t('eventCard.route') }}</span>
                  <img src="../assets/location-03.png" alt="Location Icon">
                </button>

                <button @click="handleShare"
                  class="tw:bg-white tw:px-3 tw:py-2 tw:flex tw:items-center tw:gap-1 tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)">
                  <img src="../assets/share.png" alt="Share Icon" style="width: 16px; height: 16px;">
                  <span>{{ $t('event.share') }}</span>
                </button>
              </div>
            </div>

            <!-- Description -->
            <p class="tw:text-sm tw:leading-relaxed tw:mb-6">
              {{ event?.description || $t('eventDetails.noDescription') }}
            </p>

            <!-- Event Details List -->
            <div class="tw:space-y-4">

              <!-- Date and Time -->
              <div class="tw:flex tw:items-center tw:gap-3 tw:pb-4 tw:pt-4 tw:border-b tw:border-t tw:border-gray-100">
                <div class="tw:w-8 tw:h-8 tw:bg-blue-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center">
                  <CalendarIcon class="tw:w-4 tw:h-4 tw:text-blue-500" />
                </div>
                <div>
                  <p class="tw:text-sm tw:font-medium">{{ event?.date || $t('eventDetails.notSpecified') }}</p>
                </div>
              </div>
              <!-- Organisator -->
              <div class="tw:flex tw:items-center tw:gap-3 tw:pb-4 tw:border-b tw:border-gray-100">
                <div class="tw:w-8 tw:h-8 tw:bg-blue-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center">
                  <img src="../assets/filecircle.png" alt="Organizer Icon" class="tw:w-4 tw:h-4 tw:text-blue-500">
                </div>
                <div>
                  <p class="tw:text-sm tw:font-medium">{{ event?.organizer_name || $t('eventDetails.notSpecified') }}
                  </p>
                </div>
              </div>

              <!-- Music Category -->
              <div class="tw:flex tw:items-center tw:gap-3 tw:pb-4 tw:border-b tw:border-gray-100">
                <div class="tw:w-8 tw:h-8 tw:bg-blue-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center">
                  <MusicIcon class="tw:w-4 tw:h-4 tw:text-blue-500" />
                </div>
                <div>
                  <p class="tw:text-sm tw:font-medium">{{ event?.category ? event?.category :
                    $t('eventDetails.notSpecified') }}</p>
                </div>
              </div>

              <!-- Price -->
              <div class="tw:flex tw:items-center tw:gap-3 tw:pb-4 tw:border-b tw:border-gray-100">
                <div class="tw:w-8 tw:h-8 tw:bg-blue-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center">
                  <img src="../assets/sack-doller.png" alt="Price Icon" class="tw:w-4 tw:h-4 tw:text-blue-500">
                </div>
                <div>
                  <p class="tw:text-sm tw:font-medium">{{ formattedPrice || $t('eventDetails.notSpecified') }}</p>
                </div>
              </div>

              <!-- Dresscode -->
              <div class="tw:flex tw:items-center tw:gap-3 tw:pb-4 tw:border-b tw:border-gray-100">
                <div class="tw:w-8 tw:h-8 tw:bg-blue-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center">
                  <ShirtIcon class="tw:w-4 tw:h-4 tw:text-blue-500" />
                </div>
                <div>
                  <p class="tw:text-sm tw:font-medium tw:capitalize">{{ event?.dresscode ||
                    $t('eventDetails.notSpecified') }}</p>
                </div>
              </div>

              <!-- Age Requirement -->
              <div class="tw:flex tw:items-center tw:gap-3">
                <div class="tw:w-8 tw:h-8 tw:bg-blue-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center">
                  <img src="../assets/users-group.png" alt="Age Icon" class="tw:w-4 tw:h-4 tw:text-blue-500">
                </div>
                <div>
                  <p class="tw:text-sm tw:font-medium">{{ ageRequirement || $t('eventDetails.allAges') }}</p>
                </div>
              </div>
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

const { t } = useI18n()

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

// State
const currentImageIndex = ref(0)
const activeTab = ref('overview')

// Tab configuration
const tabs = [
  { id: 'overview', labelKey: 'eventDetails.tabs.overview' },
  { id: 'about', labelKey: 'eventDetails.tabs.about' },
  { id: 'dateLocation', labelKey: 'eventDetails.tabs.dateLocation' },
  { id: 'venue', labelKey: 'eventDetails.tabs.venue' },
  { id: 'talents', labelKey: 'eventDetails.tabs.talents' },
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
  const start = new Date(props.event.start_datetime)
  const end = props.event.end_datetime ? new Date(props.event.end_datetime) : start

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
  if (!props.event?.start_datetime) {
    return t('eventDetails.notSpecified')
  }

  const start = new Date(props.event.start_datetime)
  const end = props.event.end_datetime ? new Date(props.event.end_datetime) : null

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
  if (!props.event?.start_datetime) {
    return t('eventDetails.notSpecified')
  }

  const start = new Date(props.event.start_datetime)
  const end = props.event.end_datetime ? new Date(props.event.end_datetime) : null

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
  transform: translateX(-100%);
  opacity: 0;
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
