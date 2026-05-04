<template>
    <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6">
        <div class="tw:w-full tw:max-w-7xl tw:min-w-0 tw:flex tw:flex-col tw:md:flex-row tw:gap-4 tw:md:gap-6">
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
                        sidebar-kind="organisers"
                        :menuItems="menuItems"
                        @back="handleBack"
                        @event-selected="handleEventSelected"
                        @menu-click="closeMobileSidebar"
                    />
                </div>
            </div>

            <!-- ================= LEFT CARD (Sidebar Component) ================= -->
            <div class="tw:hidden tw:md:block">
                <EventSidebar sidebar-kind="organisers" :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected" />
            </div>

            <!-- ================= RIGHT CARD ================= -->
            <div class="tw:flex-1 tw:min-w-0 tw:overflow-x-hidden tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6">
                <div class="tw:bg-white tw:rounded-2xl tw:p-5 tw:md:p-12">
                    <h1 class="tw:text-2xl tw:md:text-3xl tw:font-bold tw:text-[#2563eb] tw:mb-4 tw:md:mb-6">Organiser Settings</h1>

                    <!-- Tab Navigation (Desktop only) -->
                    <div class="tw:hidden tw:md:flex tw:gap-4 tw:md:gap-8 tw:border-b tw:border-gray-200 tw:mb-6 tw:overflow-x-auto tw:whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:tw:hidden">
                        <button v-for="tab in tabs" :key="tab.id" :class="[
                            'tw:shrink-0 tw:pb-3 tw:text-base tw:md:text-sm tw:font-normal tw:transition-colors tw:relative',
                            activeTab === tab.id
                                ? 'tw:text-[#2563eb]'
                                : 'tw:text-[#1E3A8A] hover:tw:text-[#2563eb]'
                        ]" @click="activeTab = tab.id">
                            {{ tab.label }}
                            <span v-if="activeTab === tab.id"
                                class="tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:h-0.5 tw:bg-[#2563eb] tw:-mb-px"></span>
                        </button>
                    </div>

                    <!-- Tab Accordion (Mobile only) -->
                    <div class="tw:md:hidden tw:space-y-2 tw:mb-6">
                        <button
                            v-for="tab in tabs"
                            :key="`mobile-${tab.id}`"
                            type="button"
                            @click="activeTab = tab.id"
                            :class="[
                                'tw:w-full tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3 tw:rounded-lg tw:border tw:transition-colors',
                                activeTab === tab.id
                                    ? 'tw:bg-blue-50 tw:border-blue-200 tw:text-[#2563eb]'
                                    : 'tw:bg-white tw:border-gray-200 tw:text-[#1E3A8A]'
                            ]"
                        >
                            <span class="tw:text-sm tw:font-medium">{{ tab.label }}</span>
                            <img src="../../../assets/chevron-down.png" alt="Category" :class="activeTab === tab.id ? 'tw:rotate-180' : ''">
                        </button>
                    </div>

                    <!-- Tab Content -->
                    <div class="tw:transition-opacity tw:duration-300">
                        <!-- Organiser Profile Tab -->
                        <div v-if="activeTab === 'profile'" class="tw:bg-[#F6F1E7] tw:rounded-lg tw:p-4 tw:md:p-8">
                            <UserSettings />
                        </div>

                        <!-- Notification Tab -->
                        <div v-if="activeTab === 'notification'" class="tw:bg-[#F6F1E7] tw:rounded-lg tw:p-4 tw:md:p-8">
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
                                class="tw:w-full tw:md:w-auto tw:bg-white tw:text-[#2563eb] tw:border tw:border-orange-500 tw:px-6 tw:py-3 tw:md:py-2 tw:rounded-md tw:text-sm tw:font-medium tw:transition hover:tw:bg-blue-50"
                                @click="saveNotifications">
                                Save Preferences
                            </button>
                        </div>

                        <!-- Plan Management Tab -->
                        <div v-if="activeTab === 'plan'" class="tw:rounded-lg tw:p-4 tw:md:p-8">
                            <PlanManagement />

                            <!-- Billing History Section -->
                            <div class="tw:mt-8">
                                <div class="tw:flex tw:gap-4 tw:md:gap-8 tw:border-b tw:border-gray-200 tw:mb-6 tw:overflow-x-auto tw:whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:tw:hidden">
                                    <button :class="[
                                        'tw:shrink-0 tw:pb-3 tw:text-base tw:md:text-sm tw:font-normal tw:transition-colors tw:relative',
                                        billingTab === 'history'
                                            ? 'tw:text-[#2563eb]'
                                            : 'tw:text-gray-600 hover:tw:text-[#2563eb]'
                                    ]" @click="billingTab = 'history'">
                                        Billing History
                                        <span v-if="billingTab === 'history'"
                                            class="tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:h-0.5 tw:bg-[#2563eb] tw:-mb-px"></span>
                                    </button>
                                    <button :class="[
                                        'tw:shrink-0 tw:pb-3 tw:text-base tw:md:text-sm tw:font-normal tw:transition-colors tw:relative',
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
                                    <div class="tw:flex tw:flex-col tw:md:flex-row tw:justify-between tw:md:items-center tw:gap-4">
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
                                    <div class="tw:flex tw:flex-col tw:md:flex-row tw:justify-between tw:md:items-center tw:gap-4">
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

                        <!-- Account Information Tab -->
                        <div v-if="activeTab === 'account'" class="tw:bg-[#F6F1E7] tw:rounded-lg tw:p-4 tw:md:p-8">
                            <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-6">Account Information</h2>
                            <AccountInformationHeader />
                            <template v-if="authStore.user">
                            <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-6">
                                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                                    <p class="tw:text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide tw:mb-2">Name</p>
                                    <p class="tw:text-gray-800 tw:font-medium">{{ authStore.user.name }}</p>
                                </div>
                                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                                    <p class="tw:text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide tw:mb-2">Email</p>
                                    <p class="tw:text-gray-800 tw:font-medium">{{ authStore.user.email }}</p>
                                </div>
                                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                                    <p class="tw:text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide tw:mb-2">Profile Type</p>
                                    <p class="tw:text-gray-800 tw:font-medium tw:capitalize">{{ authStore.user.profile_type }}</p>
                                </div>
                                <div class="tw:bg-white tw:rounded-lg tw:p-4 tw:border tw:border-gray-200">
                                    <p class="tw:text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide tw:mb-2">Account Type</p>
                                    <span class="tw:inline-block tw:bg-green-100 tw:text-green-700 tw:text-xs tw:font-semibold tw:px-2.5 tw:py-0.5 tw:rounded-full tw:capitalize">
                                        {{ authStore.user.account_type }}
                                    </span>
                                </div>
                            </div>
                            <!-- Account Status (read-only badges) -->
                            <div class="tw:mt-6 tw:pt-6 tw:border-t tw:border-gray-200">
                                <h3 class="tw:text-base tw:font-semibold tw:text-gray-900 tw:mb-3">Account Status</h3>
                                <div class="tw:flex tw:flex-wrap tw:gap-2">
                                    <span class="tw:inline-flex tw:items-center tw:px-3 tw:py-1 tw:rounded tw:text-xs tw:font-medium tw:bg-blue-100 tw:text-blue-700">
                                        Profile: {{ authStore.user.profile_type }}
                                    </span>
                                    <span
                                        :class="[
                                            'tw:inline-flex tw:items-center tw:px-3 tw:py-1 tw:rounded tw:text-xs tw:font-medium',
                                            authStore.user.account_type === 'premium'
                                                ? 'tw:bg-purple-100 tw:text-purple-700'
                                                : 'tw:bg-gray-100 tw:text-gray-600'
                                        ]"
                                    >
                                        Plan: {{ authStore.user.account_type }}
                                    </span>
                                    <span
                                        :class="[
                                            'tw:inline-flex tw:items-center tw:px-3 tw:py-1 tw:rounded tw:text-xs tw:font-medium',
                                            authStore.user.status === 'active'
                                                ? 'tw:bg-green-100 tw:text-green-700'
                                                : authStore.user.status === 'pending_payment'
                                                    ? 'tw:bg-yellow-100 tw:text-yellow-700'
                                                    : 'tw:bg-red-100 tw:text-red-700'
                                        ]"
                                    >
                                        Status: {{ authStore.user.status }}
                                    </span>
                                    <span
                                        :class="[
                                            'tw:inline-flex tw:items-center tw:px-3 tw:py-1 tw:rounded tw:text-xs tw:font-medium',
                                            authStore.user.email_verified
                                                ? 'tw:bg-green-100 tw:text-green-700'
                                                : 'tw:bg-red-100 tw:text-red-700'
                                        ]"
                                    >
                                        Email Verified: {{ authStore.user.email_verified ? 'Yes' : 'No' }}
                                    </span>
                                </div>
                            </div>
                            </template>
                            <div v-else class="tw:bg-white tw:rounded-lg tw:p-6 tw:border tw:border-gray-200 tw:text-center">
                                <p class="tw:text-gray-500">No account information available</p>
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
import { eventInvitationsNavItem } from '@/utils/eventInvitationsNavItem'
import AccountInformationHeader from '@/components/profile/AccountInformationHeader.vue'
import UserSettings from '@/components/UserSettings.vue'
import PlanManagement from '@/components/PlanManagement.vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter()
const authStore = useAuthStore()
const mobileSidebarOpen = ref(false)

function toggleMobileSidebar() {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
}

function closeMobileSidebar() {
    mobileSidebarOpen.value = false
}

const activeTab = ref('profile');
const billingTab = ref('history');

const tabs = [
    { id: 'profile', label: 'Organiser profile' },
    { id: 'notification', label: 'Notification' },
    { id: 'plan', label: 'Plan Management' },
    { id: 'account', label: 'Account Information' }
];

// Menu items for CreateEventFree (you can change this based on your route)
const menuItems = [
  { id: "home", icon: Home, label: "Home", route: "/create-organiser-free" },
  { id: "details", icon: FileText, label: "Details", route: "/create-organiser-free" },
  { id: "analytics", icon: BarChart3, route: "/create-organiser-free/report", label: "Analytics" },
  eventInvitationsNavItem("/create-organiser-free"),
  { id: "settings", icon: Settings, route: "/create-organiser-free/settings", label: "Settings" },
  // { id: "calendar", icon: Calendar, label: "Calendar" },
]

function handleBack() {
  closeMobileSidebar()
  router.push('/') // Navigate to events list or wherever you need
}

function handleEventSelected(eventId) {
  closeMobileSidebar()
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