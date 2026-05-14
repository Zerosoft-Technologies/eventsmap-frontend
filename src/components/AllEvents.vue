<template>
  <!-- CTA Button when panel is closed -->
  <transition name="slide-left">
    <button
      v-if="!visible && computedEvents.length > 0"
      @click="expand"
      class="tw:fixed tw:top-1/2 tw:-translate-y-1/2 tw:left-0 tw:z-50 tw:bg-white tw:px-4 tw:py-3 tw:rounded-r-xl tw:shadow-lg tw:border tw:border-gray-200 tw:flex tw:items-center tw:gap-2 tw:transition-all hover:tw:translate-x-1"
    >
      <span class="tw:text-sm tw:font-semibold tw:text-gray-700">{{ panelLabel }}</span>
      <img src="../assets/arrow-right.png" alt="Expand" class="tw:w-4 tw:h-4">
    </button>
  </transition>

  <!-- Events Panel -->
  <transition name="fade">
    <div
      v-if="visible"
      :class="[
        isMinimized
          ? 'tw:max-w-[min(11rem,calc(100vw-1.5rem))] tw:min-h-14 tw:px-3 tw:py-2.5 tw:rounded-2xl tw:shadow-lg tw:cursor-pointer tw:flex tw:items-center tw:justify-center tw:bg-[#FF7700] tw:box-border'
          : 'tw:w-full tw:md:w-[380px] tw:max-h-[85vh] tw:md:max-h-[80vh] tw:rounded-t-2xl tw:md:rounded-2xl tw:shadow-xl tw:flex tw:flex-col tw:bg-white',
        'tw:fixed tw:bottom-0 tw:md:bottom-2 tw:left-0 tw:md:left-7 tw:z-50 tw:lg:z-10 tw:transition-all tw:duration-300 tw:overflow-visible'
      ]"
      @click="isMinimized && expand()"
    >
      <!-- Minimized State -->
      <template v-if="isMinimized">
        <span class="tw:text-xs tw:sm:text-sm tw:font-semibold tw:text-white tw:text-center tw:leading-snug tw:break-words tw:max-w-full tw:px-0.5">{{ panelLabel }}</span>
      </template>

      <!-- Expanded State -->
      <template v-else>
        <!-- Mobile drag handle -->
        <div class="tw:flex tw:justify-center tw:pt-2.5 tw:pb-1 tw:md:hidden tw:flex-shrink-0">
          <div class="tw:w-10 tw:h-1 tw:bg-gray-300 tw:rounded-full"></div>
        </div>

        <!-- Subcategories + time window (synced with header category + API) -->
        <MapEventsFilterPills
          :available-subcategories="availableSubcategories"
          :selected-slugs="selectedSubcategorySlugs"
          :start-time="startTime"
          :end-time="endTime"
          :venue-open-time="venueOpenTime"
          :venue-close-time="venueCloseTime"
          :disabled-subcategories="!selectedCategory"
          :show-time-range="profileType === 'events'"
          :show-venue-hours-filter="profileType === 'venues'"
          @toggle-subcategory="(slug) => $emit('toggleSubcategory', slug)"
          @clear-subcategories="$emit('clearSubcategories')"
          @update:start-time="$emit('update:startTime', $event)"
          @update:end-time="$emit('update:endTime', $event)"
          @update:venue-open-time="$emit('update:venueOpenTime', $event)"
          @update:venue-close-time="$emit('update:venueCloseTime', $event)"
        />

        <!-- Section header -->
        <div class="tw:flex tw:justify-between tw:items-center tw:px-4 tw:pb-3 tw:border-b tw:border-gray-100 tw:flex-shrink-0">
          <h3 class="tw:text-sm tw:font-bold tw:text-gray-600 tw:tracking-[0.1em] tw:uppercase">{{ panelLabel }}</h3>
          <div class="tw:flex tw:items-center tw:gap-3">
            <img
              class="tw:cursor-pointer tw:opacity-60 hover:tw:opacity-100 tw:transition-opacity"
              @click.stop="minimize"
              src="../assets/chevron-bold-left.png"
              alt="Minimize"
              style="width:13px;height:15px;"
            >
            <!-- <button
              @click.stop="close"
              class="tw:w-6 tw:h-6 tw:flex tw:items-center tw:justify-center tw:text-gray-400 hover:tw:text-gray-700 tw:rounded-full hover:tw:bg-gray-100 tw:transition-colors"
            >
              <svg class="tw:w-4 tw:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button> -->
          </div>
        </div>

        <!-- Scrollable event list (flex-1 + min-h-0 ensures it fills remaining height and scrolls) -->
        <div class="events-scroll tw:flex-1 tw:min-h-0 tw:overflow-y-auto">

          <!-- Loading skeleton -->
          <div v-if="isLoading" class="tw:p-4 tw:space-y-4">
            <div v-for="i in 3" :key="i" class="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:overflow-hidden tw:shadow-sm tw:animate-pulse">
              <div class="tw:h-40 tw:bg-gray-200 tw:w-full"></div>
              <div class="tw:p-3 tw:space-y-2">
                <div class="tw:flex tw:justify-between tw:items-start">
                  <div class="tw:h-5 tw:bg-gray-200 tw:rounded tw:w-36"></div>
                  <div class="tw:w-10 tw:h-12 tw:bg-gray-200 tw:rounded-lg"></div>
                </div>
                <div class="tw:h-3 tw:bg-gray-200 tw:rounded tw:w-full"></div>
                <div class="tw:h-3 tw:bg-gray-200 tw:rounded tw:w-4/5"></div>
                <div class="tw:grid tw:grid-cols-2 tw:gap-2">
                  <div class="tw:h-3 tw:bg-gray-200 tw:rounded"></div>
                  <div class="tw:h-3 tw:bg-gray-200 tw:rounded"></div>
                  <div class="tw:h-3 tw:bg-gray-200 tw:rounded"></div>
                  <div class="tw:h-3 tw:bg-gray-200 tw:rounded"></div>
                </div>
                <div class="tw:flex tw:gap-2 tw:pt-1">
                  <div class="tw:h-8 tw:bg-gray-200 tw:rounded-lg tw:flex-1"></div>
                  <div class="tw:h-8 tw:bg-gray-200 tw:rounded-lg tw:flex-1"></div>
                  <div class="tw:h-8 tw:bg-gray-200 tw:rounded-lg tw:flex-1"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="computedEvents.length === 0" class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-16 tw:px-6">
            <div class="tw:w-20 tw:h-20 tw:bg-gray-100 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mb-5">
              <svg class="tw:w-10 tw:h-10 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h4 class="tw:text-lg tw:font-semibold tw:text-gray-800 tw:mb-2 tw:text-center">{{ emptyTitle }}</h4>
            <p class="tw:text-sm tw:text-gray-500 tw:text-center tw:mb-6 tw:max-w-xs">{{ emptyMessage }}</p>
            <button
              @click="reset"
              class="tw:bg-orange-500 tw:text-white tw:px-6 tw:py-2.5 tw:rounded-lg tw:text-sm tw:font-medium tw:transition-all hover:tw:bg-orange-600"
            >
              {{ $t('common.clearFilters') }}
            </button>
          </div>

          <!-- Events list -->
          <transition-group v-else-if="isEventsMode" name="panel-fade" tag="div" class="tw:p-4 tw:space-y-4">
            <div v-for="event in computedEvents" :key="event.id">
              <Event :event="event" @viewEvent="handleViewEvent"></Event>
            </div>
          </transition-group>

          <!-- Profiles list (organisers / talents / venues) -->
          <transition-group v-else name="panel-fade" tag="div" class="tw:p-4 tw:space-y-4">
            <div v-for="item in computedEvents" :key="item.id">
              <DiscoveryProfileCard
                :profile="item"
                :profile-type="profileType"
                @viewProfile="emit('viewProfile', $event)"
              />
            </div>
          </transition-group>

          <!-- Reset search -->
          <div v-if="!isLoading && computedEvents.length > 0" class="tw:text-center tw:pb-5">
            <button
              @click="reset"
              class="tw:text-sm tw:text-gray-500 tw:px-5 tw:py-2 tw:rounded-lg tw:border tw:border-gray-200 hover:tw:bg-gray-50 tw:transition-colors"
            >
              {{ $t('header.resetSearch') }}
            </button>
          </div>

        </div>
      </template>
    </div>
  </transition>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { defineAsyncComponent, ref, computed, watch } from 'vue'
import MapEventsFilterPills from '@/components/events/MapEventsFilterPills.vue'

const Event = defineAsyncComponent(() => import('./Event.vue'))
const DiscoveryProfileCard = defineAsyncComponent(() => import('./DiscoveryProfileCard.vue'))

const { t } = useI18n()

const props = defineProps({
  events: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  profileType: {
    type: String,
    default: 'events'
  },
  selectedCategory: {
    type: Object,
    default: null
  },
  availableSubcategories: {
    type: Array,
    default: () => []
  },
  selectedSubcategorySlugs: {
    type: Array,
    default: () => []
  },
  startTime: {
    type: String,
    default: null
  },
  endTime: {
    type: String,
    default: null
  },
  venueOpenTime: {
    type: String,
    default: null
  },
  venueCloseTime: {
    type: String,
    default: null
  }
});

const isEventsMode = computed(() => props.profileType === 'events')

const PROFILE_LABELS = { events: 'Events', organisers: 'Organisers', talents: 'Talents', venues: 'Venues' }
const panelLabel = computed(() => PROFILE_LABELS[props.profileType] ?? 'Results')

const emptyTitle = computed(() =>
  isEventsMode.value ? t('allEvents.noEventsFound') : t('allEvents.noProfilesFound')
)
const emptyMessage = computed(() =>
  isEventsMode.value ? t('allEvents.noEventsMessage') : t('allEvents.noProfilesMessage')
)

const emit = defineEmits([
  'closeResults',
  'resetSearch',
  'viewEvent',
  'viewProfile',
  'toggleSubcategory',
  'clearSubcategories',
  'update:startTime',
  'update:endTime',
  'update:venueOpenTime',
  'update:venueCloseTime',
  /** Listing dock collapsed (chevron) — parent should hide event/profile detail overlays */
  'panelMinimized',
  /** Home map: `'expanded' | 'compact' | 'hidden'` — positions event/profile detail panels beside vs over the dock */
  'listingDockLayout',
]);

// Computed: events list
const computedEvents = computed(() => props.events)

// Computed: loading state
const isLoading = computed(() => props.loading)

// Component state
const visible = ref(true);
const isMinimized = ref(false);

function emitListingDockLayout() {
  let mode = 'hidden'
  if (visible.value && !isMinimized.value) mode = 'expanded'
  else if (visible.value && isMinimized.value) mode = 'compact'
  else mode = 'hidden'
  emit('listingDockLayout', mode)
}

watch([visible, isMinimized], emitListingDockLayout, { immediate: true })

function reset (){
  emit('resetSearch')
}

function close(){  
  visible.value = false;
  emit('closeResults')
}

function minimize() {
  isMinimized.value = true
  emit('panelMinimized')
}

function expand() {
  isMinimized.value = false;
  visible.value = true;
}

/**
 * Handle view event - emit to parent to open the details panel
 * @param {Object} event - The event object to display in the panel
 */
function handleViewEvent(event) {
  emit('viewEvent', event)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Smooth fade transition for panel content switching */
.panel-fade-enter-active {
  transition: opacity 0.25s ease;
}
.panel-fade-leave-active {
  transition: opacity 0.15s ease;
}
.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
}

/* Slide animation for CTA button */
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-left-enter-active {
  transition: all 0.3s ease;
}
.slide-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-left-leave-active {
  transition: all 0.3s ease;
}

/* Modern scrollbar styling */
.tw\:max-h-\[80vh\]::-webkit-scrollbar {
  width: 6px;
}
.tw\:max-h-\[80vh\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.tw\:max-h-\[80vh\]::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
  transition: background 0.3s ease;
}
.tw\:max-h-\[80vh\]::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Scrollable events area */
.events-scroll::-webkit-scrollbar { width: 5px; }
.events-scroll::-webkit-scrollbar-track { background: #F3F4F6; border-radius: 8px; }
.events-scroll::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 8px; }
.events-scroll::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }

/* Hide scrollbar on filter chips row */
.events-chips { scrollbar-width: none; }
.events-chips::-webkit-scrollbar { display: none; }
</style>