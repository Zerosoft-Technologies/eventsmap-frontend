<template>
  <div
    class="tw:w-full tw:max-w-[92vw] tw:md:w-[400px] tw:bg-[#F3F2EE] tw:rounded-lg tw:border-[10px] tw:border-[#F6F1E7] tw:flex tw:h-[calc(100vh-1rem)] tw:md:h-[85vh] tw:static tw:md:sticky tw:md:top-4 tw:md:z-20 tw:md:shrink-0"
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

    <!-- Organiser Summary -->
    <div class="tw:flex-1 tw:bg-[#FFFFFF] tw:rounded-r-lg tw:overflow-hidden tw:flex tw:flex-col">

      <!-- Header Section - Fixed -->
      <div class="tw:px-6 tw:py-6 tw:border-b tw:border-gray-300 tw:flex-shrink-0">
        <button
          @click="handleBackClick"
          class="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:text-[#0061FF] hover:tw:text-black tw:font-medium">
          <ChevronLeft class="tw:w-4 tw:h-4" />
          Back To Events
        </button>
      </div>

      <!-- Content Section - Scrollable -->
      <div class="tw:p-6 tw:overflow-y-auto tw:flex-1 tw:space-y-4" style="height: 0;">

        <!-- Loading State -->
        <div v-if="myOrganiserStore.loading" class="tw:text-center tw:py-4 tw:text-gray-400 tw:text-sm">
          Loading organisers...
        </div>

        <!-- Organisers List -->
        <template v-else-if="myOrganiserStore.organisers.length > 0">
          <div
            v-for="organiser in myOrganiserStore.organisers"
            :key="organiser.id"
            @click="handleOrganiserClick(organiser)"
            :class="[
              'tw:bg-[#F6F1E7] tw:rounded-2xl tw:p-5 tw:space-y-4 tw:border tw:cursor-pointer tw:transition',
              myOrganiserStore.selectedOrganiserId === organiser.id
                ? 'tw:border-[#0061FF]'
                : 'tw:border-gray-200 hover:tw:border-gray-300'
            ]"
          >
            <h2 class="tw:text-xl tw:font-semibold tw:text-[#0061FF]">
              {{ organiser.name || 'Organiser Title' }}
            </h2>

            <div class="tw:flex tw:items-center tw:text-sm tw:text-[#1E3A8A] tw:gap-2">
              <User class="tw:w-4 tw:h-4" />
              <span>{{ organiser.account_type || 'Free' }} Account</span>
            </div>
          </div>
        </template>

        <!-- Empty State -->
        <div v-else class="tw:text-center tw:py-4 tw:text-gray-400 tw:text-sm">
          No organisers found
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import {
  FileText,
  BarChart3,
  Settings,
  Calendar,
  ChevronDown,
  ChevronLeft,
  User,
  SkipBackIcon,
  MessageSquareText,
  Images
} from "lucide-vue-next"

import { useRouter, useRoute } from "vue-router"
import { onMounted } from "vue"
import { useMyOrganiserStore } from "@/stores/myOrganiserStore"

const myOrganiserStore = useMyOrganiserStore()

// Props
const props = defineProps({
  menuItems: {
    type: Array,
    required: true
  }
})

// Emits
const emit = defineEmits(['back', 'organiser-selected', 'chatbox-click', 'menu-click'])

onMounted(() => {
  myOrganiserStore.fetchMyOrganisers()
})

function handleOrganiserClick(organiser) {
  myOrganiserStore.selectOrganiser(organiser.id)
  const home = props.menuItems.find((i) => i.id === 'home' && i.route)
  if (home && route.path !== home.route) {
    myOrganiserStore.setPendingEditorOrganiserId(organiser.id)
    router.push({ path: home.route })
    return
  }
  emit('organiser-selected', organiser.id)
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
  
  return false
}

function handleBackClick() {
  // Navigate to home page without full page reload
  router.push({ name: 'Home' })
}

function formatDate(dateString) {
  if (!dateString) return 'No date'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
