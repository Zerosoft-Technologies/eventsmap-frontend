<template>
  <!-- Panel -->
  <transition name="slide">
    <div 
      v-if="visible"
      class="tw:fixed tw:p-0 tw:bg-white tw:rounded-2xl tw:left-4 tw:bottom-4 tw:z-50 tw:w-[420px] tw:max-w-[calc(100vw-2rem)] tw:shadow-xl tw:flex tw:flex-col tw:overflow-hidden"
    >
      <!-- Collapsible close button on right edge -->
      <button 
        @click="close"
        class="tw:absolute -tw:right-3 tw:top-1/2 -tw:translate-y-1/2 tw:w-6 tw:h-12 tw:bg-white tw:rounded-full tw:shadow-md tw:flex tw:items-center tw:justify-center tw:hover:tw:shadow-lg tw:transition-all tw:duration-200 tw:z-10"
        :aria-label="$t('common.close')"
      >
        <div class="tw:w-1 tw:h-4 tw:bg-gray-400 tw:rounded-full tw:transition-all tw:duration-200 hover:tw:bg-gray-600" />
      </button>

      <!-- Event Title -->
      <div class="tw:px-4 tw:py-4">
        <h2 class="tw:text-xl tw:font-semibold tw:text-gray-900 tw:leading-tight">
          {{ event?.title || $t('eventDetails.untitled') }}
        </h2>
      </div>

      <!-- Filter Chips -->
      <div class="tw:px-4 tw:pb-4">
        <div class="tw:flex tw:gap-2">
          <span class="tw:px-3 tw:py-1.5 tw:bg-gray-100 tw:text-gray-600 tw:text-xs tw:rounded-lg tw:whitespace-nowrap tw:font-medium">
            Openingstijden
          </span>
          <span class="tw:px-3 tw:py-1.5 tw:bg-gray-100 tw:text-gray-600 tw:text-xs tw:rounded-lg tw:whitespace-nowrap tw:font-medium">
            Price
          </span>
          <span class="tw:px-3 tw:py-1.5 tw:bg-red-500 tw:text-white tw:text-xs tw:rounded-lg tw:whitespace-nowrap tw:font-medium">
            LIVE NOW
          </span>
        </div>
      </div>

      <!-- Scrollable content area -->
      <div class="tw:max-h-[60vh] tw:overflow-y-auto tw:pr-2">
        <!-- Gallery Slider -->
        <div class="tw:relative tw:h-48 tw:overflow-hidden tw:rounded-t-2xl">
          <!-- Main image -->
          <img 
            :src="currentImage" 
            :alt="event?.title"
            class="tw:w-full tw:h-full tw:object-cover"
          />
          
          <!-- Left arrow -->
          <button 
            v-if="images.length > 1"
            @click="prevImage"
            class="tw:absolute tw:left-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-10 tw:h-10 tw:bg-black/20 tw:backdrop-blur-sm tw:rounded-full tw:flex tw:items-center tw:justify-center tw:transition-all tw:duration-200 hover:tw:bg-black/30"
            :aria-label="$t('eventDetails.previousImage')"
          >
            <ChevronLeftIcon class="tw:w-5 tw:h-5 tw:text-white" />
          </button>
          
          <!-- Right arrow -->
          <button 
            v-if="images.length > 1"
            @click="nextImage"
            class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-10 tw:h-10 tw:bg-black/20 tw:backdrop-blur-sm tw:rounded-full tw:flex tw:items-center tw:justify-center tw:transition-all tw:duration-200 hover:tw:bg-black/30"
            :aria-label="$t('eventDetails.nextImage')"
          >
            <ChevronRightIcon class="tw:w-5 tw:h-5 tw:text-white" />
          </button>

          <!-- Image counter -->
          <div 
            v-if="images.length > 1"
            class="tw:absolute tw:bottom-4 tw:right-4 tw:px-2 tw:py-1 tw:bg-black/50 tw:backdrop-blur-sm tw:rounded-full"
          >
            <span class="tw:text-xs tw:text-white font-medium">
              {{ currentImageIndex + 1 }} / {{ images.length }}
            </span>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="tw:px-4 tw:py-2">
          <div class="tw:flex tw:bg-gray-100 tw:rounded-lg tw:p-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'tw:flex-1 tw:px-3 tw:py-2 tw:text-sm tw:font-medium tw:transition-all tw:duration-200 tw:whitespace-nowrap tw:rounded-md',
                activeTab === tab.id 
                  ? 'tw:bg-white tw:text-gray-900 tw:shadow-sm' 
                  : 'tw:text-gray-600 hover:tw:text-gray-900'
              ]"
            >
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
                <button 
                  @click="handleLink"
                  class="tw:bg-white tw:gap-1 tw:px-3 tw:py-2 tw:flex tw:items-center tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)"
                >
                  <img src="../assets/favourite.png" alt="Favourite Icon">
                  <span class="tw:leading-[1.2]">{{ $t('eventCard.link') }}</span>
                </button>
                <button 
                  @click="handleRoute"
                  class="tw:bg-white tw:gap-1 tw:px-3 tw:py-2 tw:flex tw:items-center tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)"
                >
                  <span>{{ $t('eventCard.route') }}</span>
                  <img src="../assets/location-03.png" alt="Location Icon">
                </button>

                <button 
                  @click="handleShare"
                  class="tw:bg-white tw:px-3 tw:py-2 tw:flex tw:items-center tw:gap-1 tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)"
                >
                  <img src="../assets/share.png" alt="Share Icon" style="width: 16px; height: 16px;">
                  <span>{{ $t('event.share') }}</span>
                </button>
              </div>
            </div>

            <!-- Description -->
            <p class="tw:text-gray-700 tw:text-sm tw:leading-relaxed tw:mb-6">
              {{ event?.description || $t('eventDetails.noDescription') }}
            </p>

            <!-- Event Details List -->
            <div class="tw:space-y-4">
              <!-- Organisator -->
              <div class="tw:flex tw:items-center tw:gap-3 tw:pb-4 tw:pt-4 tw:border-b tw:border-t tw:border-gray-100">
                <div class="tw:w-8 tw:h-8 tw:bg-blue-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center">
                  <UserIcon class="tw:w-4 tw:h-4 tw:text-blue-500" />
                </div>
                <div>
                  <p class="tw:text-xs tw:text-gray-500 tw:mb-1">{{ $t('eventDetails.organizer') }}</p>
                  <p class="tw:text-sm tw:font-medium tw:text-gray-900">{{ event?.organizer_name || $t('eventDetails.notSpecified') }}</p>
                </div>
              </div>

              <!-- Music Category -->
              <div class="tw:flex tw:items-center tw:gap-3 tw:pb-4 tw:border-b tw:border-gray-100">
                <div class="tw:w-8 tw:h-8 tw:bg-blue-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center">
                  <MusicIcon class="tw:w-4 tw:h-4 tw:text-blue-500" />
                </div>
                <div>
                  <p class="tw:text-xs tw:text-gray-500 tw:mb-1">{{ $t('eventDetails.musicCategory') }}</p>
                  <p class="tw:text-sm tw:font-medium tw:text-gray-900">{{ event?.category || $t('eventDetails.notSpecified') }}</p>
                </div>
              </div>

              <!-- Price -->
              <div class="tw:flex tw:items-center tw:gap-3 tw:pb-4 tw:border-b tw:border-gray-100">
                <div class="tw:w-8 tw:h-8 tw:bg-blue-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center">
                  <TicketIcon class="tw:w-4 tw:h-4 tw:text-blue-500" />
                </div>
                <div>
                  <p class="tw:text-xs tw:text-gray-500 tw:mb-1">{{ $t('eventDetails.price') }}</p>
                  <p class="tw:text-sm tw:font-medium tw:text-gray-900">{{ formattedPrice || $t('eventDetails.notSpecified') }}</p>
                </div>
              </div>

              <!-- Dresscode -->
              <div class="tw:flex tw:items-center tw:gap-3 tw:pb-4 tw:border-b tw:border-gray-100">
                <div class="tw:w-8 tw:h-8 tw:bg-blue-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center">
                  <ShirtIcon class="tw:w-4 tw:h-4 tw:text-blue-500" />
                </div>
                <div>
                  <p class="tw:text-xs tw:text-gray-500 tw:mb-1">{{ $t('eventDetails.dresscode') }}</p>
                  <p class="tw:text-sm tw:font-medium tw:text-gray-900 tw:capitalize">{{ event?.dresscode || $t('eventDetails.notSpecified') }}</p>
                </div>
              </div>

              <!-- Age Requirement -->
              <div class="tw:flex tw:items-center tw:gap-3">
                <div class="tw:w-8 tw:h-8 tw:bg-blue-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center">
                  <UsersIcon class="tw:w-4 tw:h-4 tw:text-blue-500" />
                </div>
                <div>
                  <p class="tw:text-xs tw:text-gray-500 tw:mb-1">{{ $t('eventDetails.ageRequirement') }}</p>
                  <p class="tw:text-sm tw:font-medium tw:text-gray-900">{{ ageRequirement || $t('eventDetails.allAges') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- About Tab (placeholder) -->
          <div v-else-if="activeTab === 'about'" class="tw:p-4">
            <p class="tw:text-gray-500 tw:text-sm">{{ $t('eventDetails.tabContentComingSoon') }}</p>
          </div>

          <!-- Date & Location Tab (placeholder) -->
          <div v-else-if="activeTab === 'dateLocation'" class="tw:p-4">
            <p class="tw:text-gray-500 tw:text-sm">{{ $t('eventDetails.tabContentComingSoon') }}</p>
          </div>

          <!-- Talents Tab (placeholder) -->
          <div v-else-if="activeTab === 'talents'" class="tw:p-4">
            <p class="tw:text-gray-500 tw:text-sm">{{ $t('eventDetails.tabContentComingSoon') }}</p>
          </div>

          <!-- Community Tab (placeholder) -->
          <div v-else-if="activeTab === 'community'" class="tw:p-4">
            <p class="tw:text-gray-500 tw:text-sm">{{ $t('eventDetails.tabContentComingSoon') }}</p>
          </div>
        </div>
      </div>
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
  UserIcon,
  MusicIcon,
  TicketIcon,
  ShirtIcon,
  UsersIcon,
  CalendarIcon,
  LinkIcon
} from 'lucide-vue-next'

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
  { id: 'talents', labelKey: 'eventDetails.tabs.talents' },
  { id: 'community', labelKey: 'eventDetails.tabs.community' }
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
