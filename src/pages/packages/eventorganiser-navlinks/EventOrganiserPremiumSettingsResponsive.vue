<template>
  <ResponsiveProfileLayout
    :pageTitle="'Organiser Settings'"
    :menuItems="menuItems"
    :activeItem="activeMenuItem"
    @menu-click="handleMenuClick"
  >
    <!-- Sidebar Slot -->
    <template #sidebar>
      <EventSidebar sidebar-kind="organisers" :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected" />
    </template>

    <!-- Content Slot -->
    <template #content>
      <div class="tw:w-full tw:max-w-7xl tw:mx-auto">
        <!-- Page Header -->
        <div class="tw:mb-6 tw:px-1">
          <h1 class="tw:text-2xl sm:tw:text-3xl tw:font-bold tw:text-[#2563eb] tw:mb-2">
            Organiser Settings
          </h1>
          <p class="tw:text-sm sm:tw:text-base tw:text-gray-600">
            Manage your organiser profile and preferences
          </p>
        </div>

        <!-- Responsive Tabs -->
        <ResponsiveTabs
          :tabs="tabs"
          :initial-tab="activeTab"
          @tab-change="activeTab = $event"
        >
          <template #default="{ activeTab }">
            <!-- Profile Tab -->
            <div v-if="activeTab === 'profile'" class="tw:bg-[#F6F1E7] tw:rounded-lg tw:p-4 sm:tw:p-6 lg:tw:p-8">
              <UserSettings />
            </div>

            <!-- Notification Tab -->
            <div v-else-if="activeTab === 'notification'" class="tw:bg-[#F6F1E7] tw:rounded-lg tw:p-4 sm:tw:p-6 lg:tw:p-8">
              <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-6">Notifications</h2>

              <div class="tw:space-y-4 tw:mb-6">
                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                  <div class="tw:flex tw:items-center tw:justify-between">
                    <div>
                      <p class="tw:text-sm tw:font-medium tw:text-gray-900">Receive email notifications</p>
                      <p class="tw-text-xs tw:text-gray-500 tw:mt-1">Get updates about your events via email</p>
                    </div>
                    <label class="tw:relative tw:inline-flex tw:items-center tw:w-12 tw:h-6 tw:cursor-pointer">
                      <input type="checkbox" v-model="notifications.receiveEmail" class="tw:sr-only tw:peer" />
                      <div class="tw:w-12 tw:h-6 tw:bg-gray-300 tw:rounded-full tw:transition tw:peer-checked:bg-orange-500"></div>
                      <div class="tw:absolute tw:left-1 tw:top-1 tw:w-4 tw:h-4 tw:bg-white tw:rounded-full tw:transition tw:peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                </div>

                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                  <div class="tw:flex tw:items-center tw:justify-between">
                    <div>
                      <p class="tw:text-sm tw:font-medium tw:text-gray-900">Receive push notifications</p>
                      <p class="tw-text-xs tw:text-gray-500 tw:mt-1">Get instant updates in your browser</p>
                    </div>
                    <label class="tw:relative tw:inline-flex tw:items-center tw:w-12 tw:h-6 tw:cursor-pointer">
                      <input type="checkbox" v-model="notifications.receiveUpdates" class="tw:sr-only tw:peer" />
                      <div class="tw:w-12 tw:h-6 tw:bg-gray-300 tw:rounded-full tw:transition tw:peer-checked:bg-orange-500"></div>
                      <div class="tw:absolute tw:left-1 tw:top-1 tw:w-4 tw:h-4 tw:bg-white tw:rounded-full tw:transition tw:peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                </div>
              </div>

              <button
                class="tw:w-full sm:tw:w-auto tw:px-6 tw:py-3 tw:text-sm tw:font-medium tw:text-[#2563eb] tw:bg-white tw:border tw:border-orange-500 tw:rounded-lg hover:tw:bg-blue-50 tw:transition-colors"
                @click="saveNotifications"
              >
                Save Preferences
              </button>
            </div>

            <!-- Plan Management Tab -->
            <div v-else-if="activeTab === 'plan'" class="tw:rounded-lg tw:p-4 sm:tw:p-6 lg:tw:p-8">
              <PlanManagement />
            </div>

            <!-- Account Information Tab -->
            <div v-else-if="activeTab === 'account'" class="tw:bg-[#F6F1E7] tw:rounded-lg tw:p-4 sm:tw:p-6 lg:tw:p-8">
              <h2 class="tw-text-lg tw:font-semibold tw:text-gray-900 tw:mb-6">Account Information</h2>
              <AccountInformationHeader />
              <div v-if="authStore.user" class="tw-grid tw:grid-cols-1 sm:tw:grid-cols-2 tw:gap-4">
                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                  <p class="tw-text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide tw:mb-2">Name</p>
                  <p class="tw-text-gray-800 tw:font-medium">{{ authStore.user.name }}</p>
                </div>
                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                  <p class="tw-text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide tw:mb-2">Email</p>
                  <p class="tw-text-gray-800 tw:font-medium">{{ authStore.user.email }}</p>
                </div>
                <div class="tw-bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                  <p class="tw-text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide tw:mb-2">Profile Type</p>
                  <p class="tw-text-gray-800 tw:font-medium tw:capitalize">{{ authStore.user.profile_type }}</p>
                </div>
                <div class="tw-bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                  <p class="tw-text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide tw:mb-2">Account Type</p>
                  <span class="tw:inline-block tw:bg-green-100 tw:text-green-700 tw:text-xs tw:font-semibold tw:px-2.5 tw:py-0.5 tw:rounded-full tw:capitalize">
                    {{ authStore.user.account_type }}
                  </span>
                </div>
              </div>
              <div v-else class="tw-bg-white tw:rounded-lg tw:p-6 tw:border tw:border-gray-200 tw:text-center">
                <p class="tw:text-gray-500">No account information available</p>
              </div>
            </div>
          </template>
        </ResponsiveTabs>
      </div>
    </template>
  </ResponsiveProfileLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FileText } from 'lucide-vue-next'
import ResponsiveProfileLayout from '@/components/layout/ResponsiveProfileLayout.vue'
import ResponsiveTabs from '@/components/ResponsiveTabs.vue'
import AccountInformationHeader from '@/components/profile/AccountInformationHeader.vue'
import EventSidebar from '../eventsidebar/Eventsidebar.vue'
import UserSettings from '@/components/UserSettings.vue'
import PlanManagement from '@/components/PlanManagement.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('profile')

const tabs = [
  { id: 'profile', label: 'Organiser Profile' },
  { id: 'notification', label: 'Notification' },
  { id: 'plan', label: 'Plan Management' },
  { id: 'account', label: 'Account Information' }
]

const notifications = reactive({
  receiveEmail: true,
  receiveUpdates: false
})

// Menu items for sidebar
const menuItems = [
  { id: 'home', icon: 'Home', label: 'Home', route: '/create-event-organiser-premium' },
  { id: 'details', icon: 'FileText', label: 'Details', route: '/create-event-organiser-premium' },
  { id: 'analytics', icon: 'BarChart3', route: '/create-event-organiser-premium/report', label: 'Analytics' },
  { id: 'settings', icon: 'Settings', route: '/create-event-organiser-premium/settings', label: 'Settings' },
  { id: 'calendar', icon: 'Calendar', label: 'Calendar' },
  { id: 'chatbox', icon: 'MessageSquareText', label: 'Chatbox' }
]

const activeMenuItem = computed(() => 'settings')

function handleBack() {
  router.push('/')
}

function handleEventSelected(eventId) {
  console.log('Event selected for editing:', eventId)
}

function handleMenuClick(item) {
  if (item.route) {
    router.push(item.route)
  }
}

function saveNotifications() {
  console.log('Saving notifications...', notifications)
  alert('Notification preferences saved!')
}

</script>
