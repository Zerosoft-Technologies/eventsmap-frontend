<template>
  <div
    class="tw:w-full tw:max-w-[92vw] tw:md:w-[400px] tw:bg-[#F3F2EE] tw:rounded-lg tw:border-[10px] tw:border-[#F6F1E7] tw:flex tw:h-[calc(100vh-1rem)] tw:md:h-[85vh] tw:md:max-h-[calc(100dvh-3rem)] tw:md:sticky tw:md:top-6 tw:md:z-30 tw:md:shrink-0 tw:md:self-start"
  >

    <!-- Sidebar -->
    <div
      class="tw:w-[90px] tw:bg-[#FFFFFF] tw:flex tw:flex-col tw:items-center tw:py-8 tw:space-y-6 tw:rounded-l-lg tw:border-r tw:border-gray-200 tw:flex-shrink-0">
      <div v-for="item in menuItems" :key="item.id" class="tw:relative tw:group">
        <button @click="handleMenuClick(item)" :class="[
          'tw:flex tw:items-center tw:justify-center tw:transition-all',
          'tw:border tw:border-[#DFE1E7] tw:rounded-[6px] tw:px-[12px] tw:py-[9px]',
          isActive(item)
            ? 'tw:bg-[#0061FF] tw:text-white'
            : 'tw:bg-white tw:text-gray-400 hover:tw:bg-gray-50'
        ]">
          <component :is="item.icon" class="tw:w-5 tw:h-5" />
        </button>

        <!-- Tooltip -->
        <div class="tw:absolute tw:left-16 tw:top-1/2 tw:-translate-y-1/2
         tw:bg-white tw:text-gray-700 tw:text-xs
         tw:px-3 tw:py-1 tw:rounded-md
         tw:border tw:border-[#DFE1E7]
         tw:opacity-0 tw:group-hover:opacity-100
         tw:transition tw:whitespace-nowrap tw:shadow-sm">
          {{ item.label }}
        </div>
      </div>
    </div>

    <!-- Event Summary -->
    <div class="tw:flex-1 tw:bg-[#FFFFFF] tw:rounded-r-lg tw:overflow-hidden tw:flex tw:flex-col">

      <!-- Header Section - Fixed -->
      <div class="tw:px-6 tw:py-6 tw:border-b tw:border-gray-300 tw:flex-shrink-0">
        <button
          @click="handleBackClick"
          class="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:text-[#0061FF] hover:tw:text-black tw:font-medium">
          <ChevronLeft class="tw:w-4 tw:h-4" />
          {{ backSectionTitle }}
        </button>
      </div>

      <!-- Content Section - Scrollable -->
      <div class="tw:p-6 tw:overflow-y-auto tw:flex-1 tw:space-y-4" style="height: 0;">

        <!-- Loading State -->
        <div v-if="listLoading" class="tw:text-center tw:py-4 tw:text-gray-400 tw:text-sm">
          {{ loadingLabel }}
        </div>

        <div v-else-if="listError" class="tw:text-center tw:py-4 tw:text-red-500 tw:text-sm">
          {{ listError }}
        </div>

        <!-- List (events / talents / venues / organisers) -->
        <template v-else-if="listItems.length > 0">
          <div
            v-for="item in listItems"
            :key="item.id"
            @click="handleListItemClick(item)"
            :class="[
              'tw:bg-[#F6F1E7] tw:rounded-2xl tw:p-5 tw:border tw:cursor-pointer tw:transition',
              isProfileSidebar ? 'tw:space-y-3' : 'tw:space-y-4',
              selectedListId === item.id
                ? 'tw:border-[#0061FF]'
                : 'tw:border-gray-200 hover:tw:border-gray-300'
            ]"
          >
            <template v-if="isProfileSidebar">
              <div class="tw:flex tw:items-center tw:gap-3 tw:min-w-0">
                <div
                  class="tw:w-10 tw:h-10 tw:rounded-full tw:overflow-hidden tw:bg-gray-200 tw:flex tw:items-center tw:justify-center tw:text-xs tw:font-semibold tw:text-gray-600 tw:shrink-0 tw:border tw:border-gray-200"
                >
                  <img
                    v-if="profileListImage(item)"
                    :src="profileListImage(item)"
                    alt=""
                    class="tw:w-full tw:h-full tw:object-cover"
                  />
                  <span v-else aria-hidden="true">{{ profileListInitials(item) }}</span>
                </div>
                <div class="tw:flex-1 tw:min-w-0">
                  <h2 class="tw:text-xl tw:font-semibold tw:text-[#0061FF] tw:truncate">
                    {{ item.title || item.name || listTitleFallback }}
                  </h2>
                </div>
                <div class="tw:shrink-0 tw:self-center" @click.stop>
                  <ProfileSidebarPublicationStatus
                    :resource-type="sidebarKind"
                    :item="item"
                  />
                </div>
              </div>
            </template>
            <template v-else>
              <div
                :class="[
                  'tw:flex tw:min-w-0 tw:gap-3',
                  sidebarKind === 'events' ? 'tw:items-center' : 'tw:flex-col tw:items-stretch',
                ]"
              >
                <div class="tw:flex-1 tw:min-w-0 tw:space-y-2">
                  <h2
                    :class="[
                      'tw:text-xl tw:font-semibold tw:text-[#0061FF]',
                      sidebarKind === 'events' ? 'tw:truncate' : '',
                    ]"
                  >
                    {{ item.title || item.name || listTitleFallback }}
                  </h2>

                  <div
                    v-if="sidebarKind === 'events' && item.event_date"
                    class="tw:flex tw:items-center tw:text-sm tw:text-[#1E3A8A] tw:gap-2"
                  >
                    <Calendar class="tw:w-4 tw:h-4" />
                    <span>{{ formatEventDateTime(item.event_date, item.start_time) }}</span>
                  </div>
                </div>

                <div
                  v-if="sidebarKind === 'events'"
                  class="tw:shrink-0 tw:self-center"
                  @click.stop
                >
                  <ProfileSidebarPublicationStatus
                    resource-type="events"
                    :item="item"
                  />
                </div>
              </div>
            </template>
          </div>
        </template>

        <!-- Empty State -->
        <div v-else class="tw:text-center tw:py-4 tw:text-gray-400 tw:text-sm">
          {{ emptyLabel }}
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import {
  Home,
  FileText,
  BarChart3,
  Settings,
  Calendar,
  ChevronDown,
  ChevronLeft,
} from "lucide-vue-next"

import { useRouter, useRoute } from "vue-router"
import { onMounted, computed } from "vue"
import { useMyEventStore } from "@/stores/myEventStore"
import { useMyTalentStore } from "@/stores/myTalentStore"
import { useMyVenueStore } from "@/stores/myVenueStore"
import { useMyOrganiserStore } from "@/stores/myOrganiserStore"
import ProfileSidebarPublicationStatus from "@/components/profile/ProfileSidebarPublicationStatus.vue"
import { profileSidebarInitials } from "@/utils/profilePublicationStatusStyles"
import { useProfilePublicationMeta } from "@/composables/useProfilePublicationMeta"

const myEventStore = useMyEventStore()
const myTalentStore = useMyTalentStore()
const myVenueStore = useMyVenueStore()
const myOrganiserStore = useMyOrganiserStore()
const { ensureLoaded: ensurePublicationMeta } = useProfilePublicationMeta()

// Props
const props = defineProps({
  menuItems: {
    type: Array,
    required: true
  },
  /** 'events' (default) uses GET /v2/my-events; 'talents' → /v2/my-talents; 'venues' → /v2/my-venues; 'organisers' → /v2/my-organisers */
  sidebarKind: {
    type: String,
    default: 'events',
    validator: (v) => ['events', 'talents', 'venues', 'organisers'].includes(v)
  }
})

// Emits
const emit = defineEmits(['back', 'event-selected', 'chatbox-click', 'menu-click'])

const listLoading = computed(() => {
  if (props.sidebarKind === 'talents') return myTalentStore.loading
  if (props.sidebarKind === 'venues') return myVenueStore.loading
  if (props.sidebarKind === 'organisers') return myOrganiserStore.loading
  return myEventStore.loading
})

const listItems = computed(() => {
  if (props.sidebarKind === 'talents') return myTalentStore.talents
  if (props.sidebarKind === 'venues') return myVenueStore.venues
  if (props.sidebarKind === 'organisers') return myOrganiserStore.organisers
  return myEventStore.events
})

const selectedListId = computed(() => {
  if (props.sidebarKind === 'talents') return myTalentStore.selectedTalentId
  if (props.sidebarKind === 'venues') return myVenueStore.selectedVenueId
  if (props.sidebarKind === 'organisers') return myOrganiserStore.selectedOrganiserId
  return myEventStore.selectedEventId
})

const listError = computed(() => {
  if (props.sidebarKind === 'talents') return myTalentStore.error
  if (props.sidebarKind === 'venues') return myVenueStore.error
  if (props.sidebarKind === 'organisers') return myOrganiserStore.error
  return null
})

const isProfileSidebar = computed(() =>
  ['talents', 'venues', 'organisers'].includes(props.sidebarKind)
)

function profileListImage(item) {
  return item.image_url || item.cover_image || item.main_image_url || ''
}

function profileListInitials(item) {
  return profileSidebarInitials(item.title || item.name)
}

const backSectionTitle = computed(() => {
  if (props.sidebarKind === 'talents') return 'Back To Talent'
  if (props.sidebarKind === 'venues') return 'Back To Venues'
  if (props.sidebarKind === 'organisers') return 'Back To Organisers'
  return 'Back To Events'
})

const loadingLabel = computed(() => {
  if (props.sidebarKind === 'talents') return 'Loading talents...'
  if (props.sidebarKind === 'venues') return 'Loading venues...'
  if (props.sidebarKind === 'organisers') return 'Loading organisers...'
  return 'Loading events...'
})

const emptyLabel = computed(() => {
  if (props.sidebarKind === 'talents') return 'No talent found'
  if (props.sidebarKind === 'venues') return 'No venues found'
  if (props.sidebarKind === 'organisers') return 'No organisers found'
  return 'No events found'
})

const listTitleFallback = computed(() => {
  if (props.sidebarKind === 'talents') return 'Talent Title'
  if (props.sidebarKind === 'venues') return 'Venue Name'
  if (props.sidebarKind === 'organisers') return 'Organiser Title'
  return 'Event Title'
})

onMounted(() => {
  if (['events', 'talents', 'venues', 'organisers'].includes(props.sidebarKind)) {
    ensurePublicationMeta()
  }
  if (props.sidebarKind === 'talents') myTalentStore.fetchMyTalents()
  else if (props.sidebarKind === 'venues') myVenueStore.fetchMyVenues()
  else if (props.sidebarKind === 'organisers') myOrganiserStore.fetchMyOrganisers()
  else myEventStore.fetchMyEvents()
})

function formatEventDateTime(date, time) {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const timePart = time ? `, ${time.substring(0, 5)}` : ''
  return `${day}.${month}.${year}${timePart}`
}

function handleListItemClick(item) {
  if (props.sidebarKind === 'talents') myTalentStore.selectTalent(item.id)
  else if (props.sidebarKind === 'venues') myVenueStore.selectVenue(item.id)
  else if (props.sidebarKind === 'organisers') myOrganiserStore.selectOrganiser(item.id)
  else myEventStore.selectEvent(item.id)
  emit('event-selected', item.id)

  if (props.sidebarKind === 'events') {
    const home = props.menuItems.find((i) => i.id === 'home' && i.route)
    if (home && route.path !== home.route) {
      myEventStore.setPendingEditorEventId(item.id)
      router.push({ path: home.route })
    }
  }

  // From any sub-route (report, gallery, future pages), open the venue form without ?edit= in the URL.
  if (props.sidebarKind === 'venues') {
    const home = props.menuItems.find((i) => i.id === 'home' && i.route)
    if (home && route.path !== home.route) {
      myVenueStore.setPendingEditorVenueId(item.id)
      router.push({ path: home.route })
    }
  }

  if (props.sidebarKind === 'talents') {
    const home = props.menuItems.find((i) => i.id === 'home' && i.route)
    if (home && route.path !== home.route) {
      myTalentStore.setPendingEditorTalentId(item.id)
      router.push({ path: home.route })
    }
  }

  if (props.sidebarKind === 'organisers') {
    const home = props.menuItems.find((i) => i.id === 'home' && i.route)
    if (home && route.path !== home.route) {
      myOrganiserStore.setPendingEditorOrganiserId(item.id)
      router.push({ path: home.route })
    }
  }
}

const router = useRouter()
const route = useRoute()

function handleMenuClick(item) {
  emit('menu-click', item)
  if (item.route) {
    console.log("Navigating to:", item.route)
    router.push(item.route)
  } else if (item.id === 'back') {
    emit('back')
  } else if (item.id === 'chatbox') {
    emit('chatbox-click')
  }
}

function isActive(item) {
  if (!item.route) return false
  
  const currentPath = route.path
  
  // Check if current route exactly matches the item route
  if (currentPath === item.route) {
    // For home and details on the same route, only activate home
    if (item.id === 'details' && currentPath === item.route) {
      return false
    }
    return true
  }
  
  // For home: active only on base route (not /report, /settings, /gallery-images, or /calendar)
  if (item.id === 'home') {
    const basePath = item.route
    return currentPath === basePath || 
           (currentPath.startsWith(basePath + '/') && 
            !currentPath.includes('/report') && 
            !currentPath.includes('/settings') &&
            !currentPath.includes('/gallery-images') &&
            !currentPath.includes('/invites') &&
            !currentPath.includes('/event-invitations') &&
            !currentPath.includes('/calendar'))
  }
  
  // For details: never active by default (unless you want to add specific logic)
  if (item.id === 'details') {
    return false
  }
  
  // For analytics/settings/other routes with sub-paths
  if (item.id === 'analytics' || item.id === 'settings') {
    return currentPath === item.route || currentPath.startsWith(item.route + '/')
  }

  if (item.id === 'invites' && item.route) {
    return currentPath === item.route
  }

  if (item.id === 'event-invitations' && item.route) {
    return currentPath === item.route
  }
  
  return false
}

function handleBackClick() {
  // Navigate to home page without full page reload
  router.push({ name: 'Home' })
}
</script>

<style scoped>
/* Custom scrollbar styling */
.tw\:overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.tw\:overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.tw\:overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.tw\:overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>