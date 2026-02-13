<template>
  <div
    class="tw:w-[400px] tw:bg-[#F3F2EE] tw:rounded-lg tw:border-[10px] tw:border-[#F6F1E7] tw:flex tw:max-h-[85vh] tw:sticky tw:top-10">

    <!-- Sidebar -->
    <div
      class="tw:w-[90px] tw:bg-[#FFFFFF] tw:flex tw:flex-col tw:items-center tw:py-8 tw:space-y-6 tw:rounded-l-lg tw:border-r tw:border-gray-200">
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
    <div class="tw:flex-1 tw:bg-[#FFFFFF] tw:rounded-r-lg tw:overflow-hidden">

      <!-- Header Section -->
      <div class="tw:px-6 tw:py-6 tw:border-b tw:border-gray-300">
        <button
          @click="handleBackClick"
          class="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:text-[#0061FF] hover:tw:text-black tw:font-medium">
          <ChevronLeft class="tw:w-4 tw:h-4" />
          Back To Events
        </button>
      </div>

      <!-- Content Section -->
      <div class="tw:p-6">
        <!-- Event Card -->
        <div class="tw:bg-[#F6F1E7] tw:rounded-2xl tw:p-5 tw:space-y-4 tw:border tw:border-gray-200">

          <h2 class="tw:text-xl tw:font-semibold tw:text-[#0061FF]">
            {{ eventTitle || 'Event Title' }}
          </h2>

          <div class="tw:flex tw:items-center tw:text-sm tw:text-[#1E3A8A] tw:gap-2">
            <Calendar class="tw:w-4 tw:h-4" />
            <span>{{ eventDate || '05.03.2026, 18:30 CET' }}</span>
          </div>

          <button
            class="tw:inline-flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:bg-white tw:text-[#0061FF] tw:rounded-md tw:border tw:border-[#FF7700] hover:tw:bg-gray-50 tw:transition">
            {{ eventStatus || 'Draft' }}
            <ChevronDown class="tw:w-4 tw:h-4" />
          </button>

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

// Props
const props = defineProps({
  eventTitle: {
    type: String,
    default: 'Event Title'
  },
  eventDate: {
    type: String,
    default: '05.03.2026, 18:30 CET'
  },
  eventStatus: {
    type: String,
    default: 'Draft'
  },
  menuItems: {
    type: Array,
    required: true
  }
})

// Emits
const emit = defineEmits(['back'])

const router = useRouter()
const route = useRoute()

function handleMenuClick(item) {
  if (item.route) {
    console.log("Navigating to:", item.route)
    router.push(item.route)
  } else if (item.id === 'back') {
    emit('back')
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
  
  // For home: active only on base route (not /report or /settings)
  if (item.id === 'home') {
    const basePath = item.route
    return currentPath === basePath || 
           (currentPath.startsWith(basePath + '/') && 
            !currentPath.includes('/report') && 
            !currentPath.includes('/settings') &&
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
  emit('back')
  // You can also add default navigation logic here
  // router.push('/events')
}
</script>