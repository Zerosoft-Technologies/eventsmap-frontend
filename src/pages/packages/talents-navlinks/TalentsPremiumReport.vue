<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6 tw:overflow-x-hidden">
    <div class="tw:w-full tw:max-w-7xl tw:flex tw:flex-col tw:md:flex-row tw:gap-4 tw:md:gap-6">
      <!-- Mobile Header -->
      <div class="tw:md:hidden tw:flex tw:items-center tw:justify-between tw:bg-white tw:rounded-xl tw:shadow-sm tw:px-4 tw:py-3">
        <button type="button" @click="handleBack" class="tw:text-sm tw:font-medium tw:text-[#0061FF]">Event Map</button>
        <button type="button" @click="toggleMobileSidebar" aria-label="Open menu" class="tw:text-2xl tw:leading-none tw:text-gray-700">☰</button>
      </div>

      <!-- Mobile Sidebar Drawer -->
      <div v-if="mobileSidebarOpen" class="tw:md:hidden tw:fixed tw:inset-0 tw:z-50">
        <div class="tw:absolute tw:inset-0 tw:bg-black/30" @click="closeMobileSidebar"></div>
        <div class="tw:absolute tw:left-0 tw:top-0 tw:h-screen tw:max-w-[92vw] tw:w-full tw:p-2">
          <EventSidebar
            sidebar-kind="talents"
            :menuItems="menuItems"
            @back="handleBack"
            @event-selected="handleEventSelected"
            @chatbox-click="handleChatboxClick"
            @menu-click="closeMobileSidebar"
          />
        </div>
      </div>

      <!-- ================= LEFT CARD (Sidebar Component) ================= -->
      <div class="tw:hidden tw:md:block">
        <EventSidebar 
          sidebar-kind="talents"
          :menuItems="menuItems"
          @back="handleBack"
          @event-selected="handleEventSelected"
          @chatbox-click="handleChatboxClick"
        />
      </div>

      <!-- ================= RIGHT CARD ================= -->
      <div class="tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6">

        <!-- Inner White Card -->
        <div class="tw:bg-white tw:rounded-2xl tw:p-5 tw:md:p-10">

          <!-- Header -->
          <h1 class="tw:text-2xl tw:md:text-3xl tw:font-bold tw:text-[#1E5EFF]">
            Talent Views
          </h1>
          <p class="tw:text-sm tw:text-gray-600 tw:mt-2">
            Monthly overview of Talent visits
          </p>

          <!-- Stats Container -->
          <div class="tw:mt-6 tw:md:mt-8 tw:bg-[#F6F1E7] tw:rounded-2xl tw:p-4 tw:md:p-6 tw:space-y-4 tw:md:space-y-6">

            <!-- Month Row -->
            <div
              v-for="item in monthlyViews"
              :key="item.month"
              class="tw:bg-white tw:rounded-xl tw:px-4 tw:md:px-6 tw:py-4 tw:flex tw:flex-col tw:md:flex-row tw:items-start tw:md:items-center tw:justify-between tw:gap-2"
            >
              <span class="tw:text-gray-800 tw:font-medium tw:text-lg tw:md:text-base tw:break-words">
                {{ item.month }}
              </span>
              <span class="tw:text-[#1E3A8A] tw:text-sm tw:font-medium tw:whitespace-nowrap">
                {{ item.views }} Views
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useChatStore } from "@/stores/chatStore"
import { Home, FileText, BarChart3, Settings, Calendar, MessageSquareText, Images } from "lucide-vue-next"
import EventSidebar from "../eventsidebar/Eventsidebar.vue"

const router = useRouter()
const chatStore = useChatStore()
const mobileSidebarOpen = ref(false)

function toggleMobileSidebar() {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

function closeMobileSidebar() {
  mobileSidebarOpen.value = false
}

// Event data (you can fetch this from API or store)
const monthlyViews = ref([
  { month: "January 2026", views: 120 },
  { month: "February 2026", views: 245 },
  { month: "March 2026", views: 310 },
  { month: "April 2026", views: 180 },
])

// Menu items for CreateEventFree (you can change this based on your route)
const menuItems = [
  { id: "home", icon: Home, label: "Home", route: "/create-talents-premium" },
  { id: "details", icon: FileText, label: "Details", route: "/create-talents-premium" },
  { id: "analytics", icon: BarChart3, route: "/create-talents-premium/report", label: "Analytics" },
  { id: "gallery", icon: Images, route: "/create-talents-premium/gallery-images", label: "Gallery" },
  { id: "settings", icon: Settings, route: "/create-talents-premium/settings", label: "Settings" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
  { id: "chatbox", icon: MessageSquareText, label: "Chatbox" },
]

function handleBack() {
  closeMobileSidebar()
  router.push('/') // Navigate to events list or wherever you need
}

function handleEventSelected(eventId) {
  closeMobileSidebar()
  console.log('Event selected for editing:', eventId)
}

function handleChatboxClick() {
  closeMobileSidebar()
  chatStore.open()
}
</script>