<template>
    <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-10 tw:px-6">
        <div class="tw:w-full tw:max-w-7xl tw:flex tw:gap-6">

            <!-- ================= LEFT CARD (Sidebar Component) ================= -->
            <EventSidebar :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected" />

            <!-- ================= RIGHT CARD ================= -->
            <div class="tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-3xl tw:shadow-sm tw:p-6">
                <div class="tw:bg-white tw:rounded-2xl tw:p-8 md:tw:p-12">
                    <h1 class="tw:text-3xl tw:font-bold tw:text-[#2563eb] tw:mb-6">Organiser Settings</h1>

                    <!-- Tab Navigation -->
                    <div class="tw:flex tw:gap-8 tw:border-b tw:border-gray-200 tw:mb-6">
                        <button v-for="tab in tabs" :key="tab.id" :class="[
                            'tw:pb-3 tw:text-sm tw:font-normal tw:transition-colors tw:relative',
                            activeTab === tab.id
                                ? 'tw:text-[#2563eb]'
                                : 'tw:text-[#1E3A8A] hover:tw:text-[#2563eb]'
                        ]" @click="activeTab = tab.id">
                            {{ tab.label }}
                            <span v-if="activeTab === tab.id"
                                class="tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:h-0.5 tw:bg-[#2563eb] tw:-mb-px"></span>
                        </button>
                    </div>

                    <!-- Tab Content -->
                    <div class="tw:transition-opacity tw:duration-300">
                        <!-- Organiser Profile Tab -->
                        <div v-if="activeTab === 'profile'" class="tw:bg-[#F6F1E7] tw:rounded-lg tw:p-8">
                            <UserSettings />
                        </div>

                        <!-- Notification Tab -->
                        <div v-if="activeTab === 'notification'" class="tw:bg-[#F6F1E7] tw:rounded-lg tw:p-8">
                            <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-6">Notifications</h2>

                            <div class="tw:flex tw:flex-col tw:gap-4 tw:mb-6">
                                <div
                                    class="tw:flex tw:justify-between tw:items-center tw:p-4 tw:bg-white tw:rounded-lg tw:border tw:border-gray-200">
                                    <span class="tw:text-sm tw:font-normal tw:text-gray-900">Receive email</span>
                                    <label
                                        class="tw:relative tw:inline-flex tw:items-center tw:w-12 tw:h-6 tw:cursor-pointer">
                                        <!-- Hidden Checkbox -->
                                        <input type="checkbox" v-model="notifications.receiveEmail"
                                            class="tw:sr-only tw:peer" />
                                        <!-- Background -->
                                        <div
                                            class="tw:w-12 tw:h-6 tw:bg-gray-300 tw:rounded-full tw:transition tw:peer-checked:bg-orange-500">
                                        </div>
                                        <!-- Circle -->
                                        <div
                                            class="tw:absolute tw:left-1 tw:top-1 tw:w-4 tw:h-4 tw:bg-white tw:rounded-full tw:transition tw:peer-checked:translate-x-6">
                                        </div>
                                    </label>

                                </div>

                                <div
                                    class="tw:flex tw:justify-between tw:items-center tw:p-4 tw:bg-white tw:rounded-lg tw:border tw:border-gray-200">

                                    <span class="tw:text-sm tw:font-normal tw:text-gray-900">
                                        Receive updates
                                    </span>

                                    <label
                                        class="tw:relative tw:inline-flex tw:items-center tw:w-12 tw:h-6 tw:cursor-pointer">
                                        <!-- Hidden Checkbox -->
                                        <input type="checkbox" v-model="notifications.receiveUpdates"
                                            class="tw:sr-only tw:peer" />
                                        <!-- Background -->
                                        <div
                                            class="tw:w-12 tw:h-6 tw:bg-gray-300 tw:rounded-full tw:transition tw:peer-checked:bg-orange-500">
                                        </div>
                                        <!-- Circle -->
                                        <div
                                            class="tw:absolute tw:left-1 tw:top-1 tw:w-4 tw:h-4 tw:bg-white tw:rounded-full tw:transition tw:peer-checked:translate-x-6">
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button
                                class="tw:bg-white tw:text-[#2563eb] tw:border tw:border-orange-500 tw:px-6 tw:py-2 tw:rounded-md tw:text-sm tw:font-medium tw:transition hover:tw:bg-blue-50"
                                @click="saveNotifications">
                                Save Preferences
                            </button>
                        </div>

                        <!-- Plan Management Tab -->
                        <div v-if="activeTab === 'plan'" class="tw:rounded-lg tw:p-8">
                            <PlanManagement />

                            <!-- Billing History Section -->
                            <div class="tw:mt-8">
                                <div class="tw:flex tw:gap-8 tw:border-b tw:border-gray-200 tw:mb-6">
                                    <button :class="[
                                        'tw:pb-3 tw:text-sm tw:font-normal tw:transition-colors tw:relative',
                                        billingTab === 'history'
                                            ? 'tw:text-[#2563eb]'
                                            : 'tw:text-gray-600 hover:tw:text-[#2563eb]'
                                    ]" @click="billingTab = 'history'">
                                        Billing History
                                        <span v-if="billingTab === 'history'"
                                            class="tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:h-0.5 tw:bg-[#2563eb] tw:-mb-px"></span>
                                    </button>
                                    <button :class="[
                                        'tw:pb-3 tw:text-sm tw:font-normal tw:transition-colors tw:relative',
                                        billingTab === 'invoices'
                                            ? 'tw:text-[#2563eb]'
                                            : 'tw:text-gray-600 hover:tw:text-[#2563eb]'
                                    ]" @click="billingTab = 'invoices'">
                                        Invoices
                                        <span v-if="billingTab === 'invoices'"
                                            class="tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:h-0.5 tw:bg-[#2563eb] tw:-mb-px"></span>
                                    </button>
                                </div>

                                <div v-if="billingTab === 'history'"
                                    class="tw:bg-white tw:border tw:border-gray-200 tw:rounded-lg tw:p-6">
                                    <div class="tw:flex tw:flex-row tw:justify-between md:tw:items-center tw:gap-4">
                                        <div class="tw:flex tw:gap-3 tw:items-center">
                                            <svg class="tw:w-10 tw:h-10 tw:text-gray-400 tw:flex-shrink-0"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <div>
                                                <h4 class="tw:text-sm tw:font-semibold tw:text-gray-900 tw:mb-0.5">
                                                    Download Your Billing History</h4>
                                                <p class="tw:text-xs tw:text-gray-500">View all recent charges for fees
                                                    and
                                                    subscriptions</p>
                                            </div>
                                        </div>
                                        <button
                                            class="tw:flex tw:items-center tw:gap-2 tw:bg-white tw:text-[#2563eb] tw:border tw:border-orange-500 tw:px-4 tw:py-2 tw:rounded-md tw:text-sm tw:font-medium tw:transition hover:tw:bg-blue-50 tw:whitespace-nowrap"
                                            @click="downloadBillingHistory">
                                            <svg class="tw:w-4 tw:h-4" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download
                                        </button>
                                    </div>
                                </div>

                                <div v-if="billingTab === 'invoices'"
                                    class="tw:bg-white tw:border tw:border-gray-200 tw:rounded-lg tw:p-6">
                                    <div class="tw:flex tw:flex-row tw:justify-between md:tw:items-center tw:gap-4">
                                        <div class="tw:flex tw:gap-3 tw:items-center">
                                            <svg class="tw:w-10 tw:h-10 tw:text-gray-400 tw:flex-shrink-0"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <div>
                                                <h4 class="tw:text-sm tw:font-semibold tw:text-gray-900 tw:mb-0.5">
                                                    Download Your Invoices</h4>
                                                <p class="tw:text-xs tw:text-gray-500">View And Download All Your
                                                    Previous
                                                    Invoices</p>
                                            </div>
                                        </div>
                                        <button
                                            class="tw:flex tw:items-center tw:gap-2 tw:bg-white tw:text-[#2563eb] tw:border tw:border-orange-500 tw:px-4 tw:py-2 tw:rounded-md tw:text-sm tw:font-medium tw:transition hover:tw:bg-blue-50 tw:whitespace-nowrap"
                                            @click="downloadBillingHistory">
                                            <svg class="tw:w-4 tw:h-4" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from "vue-router"
import { Home, FileText, BarChart3, Settings, Calendar } from "lucide-vue-next"
import EventSidebar from '../eventsidebar/Eventsidebar.vue'
import UserSettings from '@/components/UserSettings.vue'
import PlanManagement from '@/components/PlanManagement.vue';

const router = useRouter()

const activeTab = ref('profile');
const billingTab = ref('history');

const tabs = [
    { id: 'profile', label: 'Organiser profile' },
    { id: 'notification', label: 'Notification' },
    { id: 'plan', label: 'Plan Management' }
];

// Menu items for CreateEventFree (you can change this based on your route)
const menuItems = [
  { id: "home", icon: Home, label: "Home", route: "/create-organiser-free" },
  { id: "details", icon: FileText, label: "Details", route: "/create-organiser-free" },
  { id: "analytics", icon: BarChart3, route: "/create-organiser-free/report", label: "Analytics" },
  { id: "settings", icon: Settings, route: "/create-organiser-free/settings", label: "Settings" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
]

function handleBack() {
  router.push('/') // Navigate to events list or wherever you need
}

function handleEventSelected(eventId) {
  console.log('Event selected for editing:', eventId)
}

const saveNotifications = () => {
    console.log('Saving notifications...', notifications);
    alert('Notification preferences saved!');
};

const comparePlans = () => {
    console.log('Comparing plans...');
    alert('Opening plan comparison...');
};

const upgradePlan = () => {
    console.log('Upgrading plan...');
    alert('Redirecting to upgrade page...');
};

const downloadBillingHistory = () => {
    console.log('Downloading billing history...');
    alert('Downloading billing history...');
};
</script>