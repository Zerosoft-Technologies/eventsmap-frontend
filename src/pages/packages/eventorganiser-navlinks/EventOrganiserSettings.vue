<template>
  <ResponsiveProfileLayout
    :pageTitle="'Organiser Settings'"
    :menuItems="menuItems"
    :activeItem="activeMenuItem"
    @menu-click="handleMenuClick"
  >
    <template #sidebar>
      <EventSidebar
        :menuItems="menuItems"
        @back="handleBack"
        @event-selected="handleEventSelected"
      />
    </template>

    <template #content>
      <div class="tw:w-full tw:max-w-7xl tw:mx-auto">
        <div class="tw:mb-6 tw:px-1">
          <h1 class="tw:text-2xl sm:tw:text-3xl tw:font-bold tw:text-[#2563eb] tw:mb-2">
            Organiser Settings
          </h1>
          <p class="tw:text-sm sm:tw:text-base tw:text-gray-600">
            Manage your organiser profile and preferences
          </p>
        </div>

        <ResponsiveTabs
          :tabs="tabs"
          :initial-tab="activeTab"
          @tab-change="activeTab = $event"
        >
          <template #default="{ activeTab }">
            <div
              v-if="activeTab === 'profile'"
              class="tw:bg-[#F6F1E7] tw:rounded-lg tw:p-4 sm:tw:p-6 lg:tw:p-8"
            >
              <UserSettings />
            </div>

            <div
              v-else-if="activeTab === 'notification'"
              class="tw:bg-[#F6F1E7] tw:rounded-lg tw:p-4 sm:tw:p-6 lg:tw:p-8"
            >
              <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-6">
                Notifications
              </h2>

              <div class="tw-space-y-4 tw:mb-6">
                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                  <div class="tw:flex tw:items-center tw:justify-between tw:gap-3">
                    <div>
                      <p class="tw:text-sm tw:font-medium tw:text-gray-900">
                        Receive email notifications
                      </p>
                      <p class="tw-text-xs tw:text-gray-500 tw:mt-1">
                        Get updates about your events via email
                      </p>
                    </div>
                    <label class="tw:relative tw:inline-flex tw:items-center tw:w-12 tw:h-6 tw:cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="notifications.receiveEmail"
                        class="tw:sr-only tw:peer"
                      />
                      <div class="tw:w-12 tw:h-6 tw:bg-gray-300 tw:rounded-full tw:transition tw:peer-checked:bg-orange-500"></div>
                      <div class="tw:absolute tw:left-1 tw:top-1 tw:w-4 tw:h-4 tw:bg-white tw:rounded-full tw:transition tw:peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                </div>

                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                  <div class="tw:flex tw:items-center tw:justify-between tw:gap-3">
                    <div>
                      <p class="tw:text-sm tw:font-medium tw:text-gray-900">
                        Receive updates
                      </p>
                      <p class="tw-text-xs tw:text-gray-500 tw:mt-1">
                        Get important product and feature updates
                      </p>
                    </div>
                    <label class="tw:relative tw:inline-flex tw:items-center tw:w-12 tw:h-6 tw:cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="notifications.receiveUpdates"
                        class="tw:sr-only tw:peer"
                      />
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

            <div
              v-else-if="activeTab === 'plan'"
              class="tw:rounded-lg tw:p-4 sm:tw:p-6 lg:tw:p-8"
            >
              <PlanManagement />

              <div class="tw-mt-8">
                <div class="lg:tw-hidden tw:space-y-2">
                  <div class="tw-border tw:border-gray-200 tw:rounded-lg tw:overflow-hidden">
                    <button
                      @click="billingTab = billingTab === 'history' ? '' : 'history'"
                      :class="[
                        'tw-w-full tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3 tw:text-left tw:transition-colors',
                        billingTab === 'history'
                          ? 'tw:bg-blue-50 tw:text-blue-600'
                          : 'tw:bg-white tw:text-gray-700 hover:tw:bg-gray-50'
                      ]"
                    >
                      <span class="tw-text-sm tw:font-medium">Billing History</span>
                      <ChevronDown
                        :class="[
                          'tw-w-4 tw:h-4 tw-transition-transform',
                          billingTab === 'history' ? 'tw-rotate-180' : ''
                        ]"
                      />
                    </button>
                    <div
                      v-if="billingTab === 'history'"
                      class="tw-px-4 tw:py-3 tw:bg-gray-50 tw:border-t tw:border-gray-200"
                    >
                      <div class="tw-flex tw:flex-col tw:gap-3">
                        <div class="tw-flex tw:items-center tw:gap-3">
                          <FileText class="tw:w-8 tw:h-8 tw:text-gray-400" />
                          <div class="tw-flex-1">
                            <h4 class="tw-text-sm tw:font-semibold tw:text-gray-900">
                              Download Your Billing History
                            </h4>
                            <p class="tw-text-xs tw:text-gray-500">
                              View all recent charges for fees and subscriptions
                            </p>
                          </div>
                        </div>
                        <button
                          class="tw-w-full tw:flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-[#2563eb] tw:bg-white tw:border tw:border-orange-500 tw:rounded-lg hover:tw:bg-blue-50 tw:transition-colors"
                          @click="downloadBillingHistory"
                        >
                          <Download class="tw:w-4 tw:h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="tw-border tw:border-gray-200 tw:rounded-lg tw:overflow-hidden">
                    <button
                      @click="billingTab = billingTab === 'invoices' ? '' : 'invoices'"
                      :class="[
                        'tw-w-full tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3 tw:text-left tw:transition-colors',
                        billingTab === 'invoices'
                          ? 'tw:bg-blue-50 tw:text-blue-600'
                          : 'tw:bg-white tw:text-gray-700 hover:tw:bg-gray-50'
                      ]"
                    >
                      <span class="tw-text-sm tw:font-medium">Invoices</span>
                      <ChevronDown
                        :class="[
                          'tw-w-4 tw:h-4 tw-transition-transform',
                          billingTab === 'invoices' ? 'tw-rotate-180' : ''
                        ]"
                      />
                    </button>
                    <div
                      v-if="billingTab === 'invoices'"
                      class="tw-px-4 tw:py-3 tw:bg-gray-50 tw:border-t tw:border-gray-200"
                    >
                      <div class="tw-flex tw:flex-col tw:gap-3">
                        <div class="tw-flex tw:items-center tw:gap-3">
                          <FileText class="tw:w-8 tw:h-8 tw:text-gray-400" />
                          <div class="tw-flex-1">
                            <h4 class="tw:text-sm tw:font-semibold tw:text-gray-900">
                              Download Your Invoices
                            </h4>
                            <p class="tw-text-xs tw:text-gray-500">
                              View And Download All Your Previous Invoices
                            </p>
                          </div>
                        </div>
                        <button
                          class="tw-w-full tw:flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-[#2563eb] tw:bg-white tw:border tw:border-orange-500 tw:rounded-lg hover:tw:bg-blue-50 tw:transition-colors"
                          @click="downloadBillingHistory"
                        >
                          <Download class="tw:w-4 tw:h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="tw-hidden lg:tw-flex tw:gap-8 tw:border-b tw:border-gray-200 tw:mb-6">
                  <button
                    :class="[
                      'tw:pb-3 tw:text-sm tw:font-normal tw:transition-colors tw:relative',
                      billingTab === 'history'
                        ? 'tw:text-[#2563eb]'
                        : 'tw:text-gray-600 hover:tw:text-[#2563eb]'
                    ]"
                    @click="billingTab = 'history'"
                  >
                    Billing History
                    <span
                      v-if="billingTab === 'history'"
                      class="tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:h-0.5 tw:bg-[#2563eb] tw:-mb-px"
                    ></span>
                  </button>
                  <button
                    :class="[
                      'tw:pb-3 tw:text-sm tw:font-normal tw:transition-colors tw:relative',
                      billingTab === 'invoices'
                        ? 'tw:text-[#2563eb]'
                        : 'tw:text-gray-600 hover:tw:text-[#2563eb]'
                    ]"
                    @click="billingTab = 'invoices'"
                  >
                    Invoices
                    <span
                      v-if="billingTab === 'invoices'"
                      class="tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:h-0.5 tw:bg-[#2563eb] tw:-mb-px"
                    ></span>
                  </button>
                </div>

                <div class="tw-hidden lg:tw-block">
                  <div
                    v-if="billingTab === 'history'"
                    class="tw:bg-white tw:border tw:border-gray-200 tw:rounded-lg tw:p-6"
                  >
                    <div class="tw:flex tw:items-center tw:justify-between tw:gap-4">
                      <div class="tw:flex tw:gap-3 tw:items-center">
                        <FileText class="tw:w-10 tw:h-10 tw:text-gray-400" />
                        <div>
                          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-900 tw:mb-0.5">
                            Download Your Billing History
                          </h4>
                          <p class="tw:text-xs tw:text-gray-500">
                            View all recent charges for fees and subscriptions
                          </p>
                        </div>
                      </div>
                      <button
                        class="tw:flex tw:items-center tw:gap-2 tw:bg-white tw:text-[#2563eb] tw:border tw:border-orange-500 tw:px-4 tw:py-2 tw:rounded-md tw:text-sm tw:font-medium tw:transition hover:tw:bg-blue-50 tw:whitespace-nowrap"
                        @click="downloadBillingHistory"
                      >
                        <Download class="tw:w-4 tw:h-4" />
                        Download
                      </button>
                    </div>
                  </div>

                  <div
                    v-if="billingTab === 'invoices'"
                    class="tw:bg-white tw:border tw:border-gray-200 tw:rounded-lg tw:p-6"
                  >
                    <div class="tw:flex tw:items-center tw:justify-between tw:gap-4">
                      <div class="tw:flex tw:gap-3 tw:items-center">
                        <FileText class="tw:w-10 tw:h-10 tw:text-gray-400" />
                        <div>
                          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-900 tw:mb-0.5">
                            Download Your Invoices
                          </h4>
                          <p class="tw:text-xs tw:text-gray-500">
                            View And Download All Your Previous Invoices
                          </p>
                        </div>
                      </div>
                      <button
                        class="tw:flex tw:items-center tw:gap-2 tw:bg-white tw:text-[#2563eb] tw:border tw:border-orange-500 tw:px-4 tw:py-2 tw:rounded-md tw:text-sm tw:font-medium tw:transition hover:tw:bg-blue-50 tw:whitespace-nowrap"
                        @click="downloadBillingHistory"
                      >
                        <Download class="tw:w-4 tw:h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else-if="activeTab === 'account'"
              class="tw:bg-[#F6F1E7] tw:rounded-lg tw:p-4 sm:tw:p-6 lg:tw:p-8"
            >
              <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-6">
                Account Information
              </h2>

              <div
                v-if="authStore.user"
                class="tw-grid tw:grid-cols-1 sm:tw:grid-cols-2 tw:gap-4"
              >
                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                  <p class="tw:text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide tw:mb-2">
                    Name
                  </p>
                  <p class="tw:text-gray-800 tw:font-medium">
                    {{ authStore.user.name }}
                  </p>
                </div>
                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                  <p class="tw:text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide tw:mb-2">
                    Email
                  </p>
                  <p class="tw:text-gray-800 tw:font-medium">
                    {{ authStore.user.email }}
                  </p>
                </div>
                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                  <p class="tw:text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide tw:mb-2">
                    Profile Type
                  </p>
                  <p class="tw:text-gray-800 tw:font-medium tw:capitalize">
                    {{ authStore.user.profile_type }}
                  </p>
                </div>
                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                  <p class="tw:text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide tw:mb-2">
                    Account Type
                  </p>
                  <span
                    class="tw:inline-block tw:bg-green-100 tw:text-green-700 tw:text-xs tw:font-semibold tw:px-2.5 tw:py-0.5 tw:rounded-full tw:capitalize"
                  >
                    {{ authStore.user.account_type }}
                  </span>
                </div>
              </div>
              <div
                v-else
                class="tw:bg-white tw:rounded-lg tw:px-4 tw:py-6 tw:border tw:border-gray-200 tw:text-center"
              >
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
import { Home, FileText, BarChart3, Settings, Calendar, ChevronDown, Download } from 'lucide-vue-next'
import ResponsiveProfileLayout from '@/components/layout/ResponsiveProfileLayout.vue'
import ResponsiveTabs from '@/components/ResponsiveTabs.vue'
import EventSidebar from '../eventsidebar/Eventsidebar.vue'
import UserSettings from '@/components/UserSettings.vue'
import PlanManagement from '@/components/PlanManagement.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('profile')
const billingTab = ref('history')

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

const menuItems = [
  { id: 'home', icon: Home, label: 'Home', route: '/create-organiser-free' },
  { id: 'details', icon: FileText, label: 'Details', route: '/create-organiser-free' },
  { id: 'analytics', icon: BarChart3, route: '/create-organiser-free/report', label: 'Analytics' },
  { id: 'settings', icon: Settings, route: '/create-organiser-free/settings', label: 'Settings' },
  { id: 'calendar', icon: Calendar, label: 'Calendar' }
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

function downloadBillingHistory() {
  console.log('Downloading billing history...')
  alert('Downloading billing history...')
}
</script>