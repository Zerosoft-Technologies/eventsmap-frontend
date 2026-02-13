<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-10 tw:px-6">
    <div class="tw:w-full tw:max-w-7xl tw:flex tw:gap-6">

      <!-- ================= LEFT CARD (Sidebar Component) ================= -->
      <EventSidebar 
        :eventTitle="eventTitle"
        :eventDate="eventDate"
        :eventStatus="eventStatus"
        :menuItems="menuItems"
        @back="handleBack"
      />

      <!-- ================= RIGHT CARD ================= -->
      <div class="tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-3xl tw:shadow-sm tw:p-6">

        <!-- Inner White Card -->
        <div class="tw:bg-white tw:rounded-2xl tw:p-10">

          <!-- Header -->
          <h1 class="tw:text-3xl tw:font-bold tw:text-[#1E5EFF]">
            Event Views
          </h1>
          <p class="tw:text-sm tw:text-gray-600 tw:mt-2">
            Monthly overview of Event visits
          </p>

          <!-- Stats Container -->
          <div class="tw:mt-8 tw:bg-[#F6F1E7] tw:rounded-2xl tw:p-6 tw:space-y-6">

            <!-- Month Row -->
            <div
              v-for="item in monthlyViews"
              :key="item.month"
              class="tw:bg-white tw:rounded-xl tw:px-6 tw:py-4 tw:flex tw:justify-between tw:items-center"
            >
              <span class="tw:text-gray-800 tw:font-medium">
                {{ item.month }}
              </span>
              <span class="tw:text-[#1E3A8A] tw:text-sm tw:font-medium">
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
import { Home, FileText, BarChart3, Settings, Calendar } from "lucide-vue-next"
import EventSidebar from "../eventsidebar/Eventsidebar.vue"

const router = useRouter()

// Event data (you can fetch this from API or store)
const eventTitle = ref("Event Title")
const eventDate = ref("05.03.2026, 18:30 CET")
const eventStatus = ref("Draft")

const monthlyViews = ref([
  { month: "January 2026", views: 120 },
  { month: "February 2026", views: 245 },
  { month: "March 2026", views: 310 },
  { month: "April 2026", views: 180 },
])

// Menu items for CreateEventFree (you can change this based on your route)
const menuItems = [
  { id: "home", icon: Home, label: "Home", route: "/create-event-organiser-free" },
  { id: "details", icon: FileText, label: "Details", route: "/create-event-organiser-free" },
  { id: "analytics", icon: BarChart3, route: "/create-event-organiser-free/report", label: "Analytics" },
  { id: "settings", icon: Settings, route: "/create-event-organiser-free/settings", label: "Settings" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
]

function handleBack() {
  router.push('/events') // Navigate to events list or wherever you need
}
</script>