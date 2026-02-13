<template>
    <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-10 tw:px-6">
        <div class="tw:w-full tw:max-w-7xl tw:flex tw:gap-6">

            <!-- ================= LEFT CARD (Sidebar Component) ================= -->
            <EventSidebar :eventTitle="eventTitle" :eventDate="eventDate" :eventStatus="eventStatus"
                :menuItems="menuItems" @back="handleBack" />

            <!-- ================= RIGHT CARD ================= -->
            <div class="tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-3xl tw:shadow-sm tw:p-6">
                <div class="tw:bg-white tw:rounded-2xl tw:p-8 md:tw:p-12">
                    <h1 class="tw:text-3xl tw:font-bold tw:text-[#2563eb] tw:mb-6">Event Settings</h1>

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
                        <!-- Event Profile Tab -->
                        <div v-if="activeTab === 'profile'" class="tw:bg-[#F6F1E7] tw:rounded-lg tw:p-8">
                            <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-6">Event Profile</h2>

                            <div class="tw:grid tw:grid-cols-2 tw:gap-x-6 tw:gap-y-4 tw:mb-6">
                                <!-- <div class="tw:flex tw:flex-col tw:gap-2">
                                <label for="username"
                                    class="tw:text-sm tw:font-medium tw:text-gray-900">Username</label>
                                <input id="username" v-model="profileForm.username" type="text" placeholder="Username"
                                    class="tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-900 tw:bg-white tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition" />
                            </div> -->

                                <!-- <div class="tw:flex tw:flex-col tw:gap-2">
                                <label for="lastname" class="tw:text-sm tw:font-medium tw:text-gray-900">Last
                                    Name</label>
                                <input id="lastname" v-model="profileForm.lastName" type="text" placeholder="Full name"
                                    class="tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-900 tw:bg-white tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition" />
                            </div> -->

                                <div class="tw:flex tw:flex-col tw:gap-2">
                                    <label for="email" class="tw:text-sm tw:font-medium tw:text-gray-900">Email</label>
                                    <input id="email" v-model="profileForm.email" type="email"
                                        placeholder="email@example.com"
                                        class="tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-900 tw:bg-white tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition" />
                                </div>

                                <!-- <div class="tw:flex tw:flex-col tw:gap-2">
                                <label for="phone" class="tw:text-sm tw:font-medium tw:text-gray-900">Phone</label>
                                <input id="phone" v-model="profileForm.phone" type="tel" placeholder="+880..."
                                    class="tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-900 tw:bg-white tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition" />
                            </div> -->

                                <!-- <div class="tw:flex tw:flex-col tw:gap-2">
                                <label for="taxnumber" class="tw:text-sm tw:font-medium tw:text-gray-900">Tax
                                    Number</label>
                                <input id="taxnumber" v-model="profileForm.taxNumber" type="text"
                                    placeholder="Tax number"
                                    class="tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-900 tw:bg-white tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition" />
                            </div> -->

                                <!-- <div class="tw:flex tw:flex-col tw:gap-2">
                                <label for="company" class="tw:text-sm tw:font-medium tw:text-gray-900">Company
                                    Name</label>
                                <input id="company" v-model="profileForm.companyName" type="text"
                                    placeholder="Company name"
                                    class="tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-900 tw:bg-white tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition" />
                            </div> -->

                                <!-- <div class="tw:flex tw:flex-col tw:gap-2">
                                <label for="country" class="tw:text-sm tw:font-medium tw:text-gray-900">Country</label>
                                <select id="country" v-model="profileForm.country"
                                    class="tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-500 tw:bg-white focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition tw:appearance-none tw:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjNmI3MjgwIj48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE5IDlsLTcgNy03LTciPjwvcGF0aD48L3N2Zz4=')] tw:bg-no-repeat tw:bg-[position:right_0.75rem_center] tw:bg-[length:1.25rem] tw:pr-10">
                                    <option value="">Country</option>
                                    <option value="us">United States</option>
                                    <option value="uk">United Kingdom</option>
                                    <option value="ca">Canada</option>
                                    <option value="au">Australia</option>
                                    <option value="in">India</option>
                                </select>
                            </div> -->

                                <div class="tw:flex tw:flex-col tw:gap-2">
                                    <label for="password" class="tw:text-sm tw:font-medium tw:text-gray-900">
                                        Password
                                    </label>

                                    <div class="tw:relative">
                                        <input id="password" v-model="profileForm.password"
                                            :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                                            class="tw:w-full tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-900 tw:bg-white tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition tw:pr-10" />

                                        <!-- Eye Icon -->
                                        <button type="button" @click="showPassword = !showPassword"
                                            class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-400 hover:tw:text-gray-600 tw:transition">
                                            <component :is="showPassword ? EyeOff : Eye" class="tw:w-4 tw:h-4" />
                                        </button>
                                    </div>

                                    <!-- Minimum Characters Text -->
                                    <p class="tw:text-xs tw:text-gray-500">
                                        Minimum 8 Characters
                                    </p>
                                </div>
                            </div>

                            <button
                                class="tw:bg-white tw:text-[#2563eb] tw:border tw:border-orange-500 tw:px-6 tw:py-2 tw:rounded-md tw:text-sm tw:font-medium tw:transition hover:tw:bg-blue-50"
                                @click="saveProfile">
                                Save Change
                            </button>
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
                            <!-- Cards Section with Background -->
                            <div class="tw:bg-[#F6F1E7] tw:rounded-lg tw:p-6 tw:mb-8">
                                <!-- Cards in Grid with Headers Outside -->
                                <div class="tw:grid tw:grid-cols-12 tw:gap-6">
                                    <!-- Plan Management Section - Takes 9/12 (3/4) -->
                                    <div class="tw:col-span-7">
                                        <!-- Header Outside -->
                                        <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">Event Package
                                        </h2>
                                        <!-- Card -->
                                        <div
                                            class="tw:bg-[#F6F1E7] tw:border tw:border-gray-200 tw:rounded-lg tw:p-6 tw:flex tw:flex-col tw:min-h-[200px]">
                                            <span
                                                class="tw:inline-block tw:bg-blue-100 tw:text-[#2563eb] tw:px-2.5 tw:py-1 tw:rounded tw:text-xs tw:font-medium tw:w-fit tw:mb-3">
                                                Current Plan
                                            </span>
                                            <h3 class="tw:text-xl tw:font-bold tw:text-gray-900 tw:mb-2">Free</h3>
                                            <p class="tw:text-[#2563eb] tw:text-sm tw:mb-auto">Publish unlimited events
                                                and
                                                tickets
                                                for free!</p>
                                            <div class="tw:flex tw:justify-end tw:mt-4">
                                                <button
                                                    class="tw:bg-white tw:text-[#2563eb] tw:border tw:border-orange-500 tw:px-6 tw:py-2 tw:rounded-md tw:text-sm tw:font-medium tw:transition hover:tw:bg-blue-50"
                                                    @click="comparePlans">
                                                    Compare options
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Upgrade Plan Section - Takes 3/12 (1/4) -->
                                    <div class="tw:col-span-5">
                                        <!-- Header Outside -->
                                        <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">Upgrade to
                                            Premium Package</h2>
                                        <!-- Card -->
                                        <div
                                            class="tw:bg-[#F6F1E7] tw:border tw:border-gray-200 tw:rounded-lg tw:p-6 tw:flex tw:items-center tw:justify-center tw:min-h-[200px]">
                                            <button
                                                class="tw:bg-white tw:text-[#2563eb] tw:border tw:border-orange-500 tw:px-6 tw:py-2 tw:rounded-md tw:text-sm tw:font-medium tw:transition hover:tw:bg-blue-50"
                                                @click="upgradePlan">
                                                Upgrade plan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                                    and subscriptions</p>
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
import { Eye, EyeOff } from 'lucide-vue-next'
import { useRouter } from "vue-router"
import { Home, FileText, BarChart3, Settings, Calendar } from "lucide-vue-next"
import EventSidebar from '../eventsidebar/Eventsidebar.vue'

const router = useRouter()

// Event data (you can fetch this from API or store)
const eventTitle = ref("Event Title")
const eventDate = ref("05.03.2026, 18:30 CET")
const eventStatus = ref("Draft")


const activeTab = ref('plan');
const billingTab = ref('history');

const tabs = [
    { id: 'profile', label: 'Event profile' },
    { id: 'notification', label: 'Notification' },
    { id: 'plan', label: 'Plan Management' }
];


const showPassword = ref(false)

const profileForm = reactive({
    username: '',
    lastName: '',
    email: '',
    phone: '',
    taxNumber: '',
    companyName: '',
    country: '',
    password: ''
});

const notifications = reactive({
    receiveEmail: true,
    receiveUpdates: false
});

const notificationEmail = ref('')

// Menu items for CreateEventFree (you can change this based on your route)
const menuItems = [
  { id: "home", icon: Home, label: "Home", route: "/create-event-organiser-premium" },
  { id: "details", icon: FileText, label: "Details", route: "/create-event-organiser-premium" },
  { id: "analytics", icon: BarChart3, route: "/create-event-organiser-premium/report", label: "Analytics" },
  { id: "settings", icon: Settings, route: "/create-event-organiser-premium/settings", label: "Settings" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
]

function handleBack() {
  router.push('/events') // Navigate to events list or wherever you need
}

const saveProfile = () => {
    console.log('Saving profile...', profileForm);
    alert('Profile changes saved successfully!');
};

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