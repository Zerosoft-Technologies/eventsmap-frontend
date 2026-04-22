<template>
  <div
    class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6 tw:overflow-x-hidden"
  >
    <div
      class="tw:w-full tw:max-w-7xl tw:flex tw:flex-col tw:md:flex-row tw:gap-4 tw:md:gap-6"
    >
      <!-- Mobile Header -->
      <div
        class="tw:md:hidden tw:flex tw:items-center tw:justify-between tw:bg-white tw:rounded-xl tw:shadow-sm tw:px-4 tw:py-3"
      >
        <button
          type="button"
          @click="handleBack"
          class="tw:text-sm tw:font-medium tw:text-[#0061FF]"
        >
          Event Map
        </button>
        <button
          type="button"
          @click="toggleMobileSidebar"
          aria-label="Open menu"
          class="tw:text-2xl tw:leading-none tw:text-gray-700"
        >
          ☰
        </button>
      </div>

      <div
        v-if="mobileSidebarOpen"
        class="tw:md:hidden tw:fixed tw:inset-0 tw:z-50"
      >
        <div
          class="tw:absolute tw:inset-0 tw:bg-black/30"
          @click="closeMobileSidebar"
        />
        <div
          class="tw:absolute tw:left-0 tw:top-0 tw:h-screen tw:max-w-[92vw] tw:w-full tw:p-2"
        >
          <EventSidebar
            :menuItems="menuItems"
            @back="handleBack"
            @event-selected="handleEventSelected"
            @chatbox-click="handleChatboxClick"
            @menu-click="closeMobileSidebar"
          />
        </div>
      </div>

      <div class="tw:hidden tw:md:block">
        <EventSidebar
          :menuItems="menuItems"
          @back="handleBack"
          @event-selected="handleEventSelected"
          @chatbox-click="handleChatboxClick"
        />
      </div>

      <div
        class="tw:flex-1 tw:max-w-full tw:overflow-x-hidden tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6"
      >
        <div class="tw:space-y-4 tw:md:space-y-6">
          <!-- Page header -->
          <div
            class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:flex tw:flex-col tw:lg:flex-row tw:lg:items-start tw:lg:justify-between tw:gap-4"
          >
            <div>
              <h1 class="tw:text-2xl tw:md:text-3xl tw:font-bold tw:text-gray-900">
                All Invitations
              </h1>
              <p class="tw:text-sm tw:text-gray-600 tw:mt-2 tw:max-w-2xl">
                Manage all invited talents, venues, and organisers across your events.
              </p>
            </div>
            <button
              type="button"
              class="tw:shrink-0 tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2.5 tw:rounded-xl tw:text-sm tw:font-medium tw:text-white tw:bg-[#0061FF] hover:tw:bg-blue-700 tw:transition-colors"
              @click="goInviteNew"
            >
              <UserPlus class="tw:w-4 tw:h-4" />
              Invite New
            </button>
          </div>

          <!-- Summary cards -->
          <div
            class="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-5 tw:gap-3 tw:md:gap-4"
          >
            <div
              v-for="card in statCards"
              :key="card.key"
              class="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:p-4 tw:shadow-sm"
            >
              <p class="tw:text-xs tw:font-medium tw:text-gray-500 tw:uppercase tw:tracking-wide">
                {{ card.label }}
              </p>
              <p class="tw:text-2xl tw:font-bold tw:text-gray-900 tw:mt-1">
                {{ card.value }}
              </p>
            </div>
          </div>

          <!-- Filters -->
          <div
            class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-4 tw:space-y-3 tw:md:space-y-0 tw:md:flex tw:md:flex-wrap tw:md:items-end tw:md:gap-3"
          >
            <div class="tw:flex-1 tw:min-w-[200px]">
              <label
                class="tw:block tw:text-xs tw:font-medium tw:text-gray-500 tw:mb-1.5"
                for="account-invite-search"
                >Search</label
              >
              <div class="tw:relative">
                <Search
                  class="tw:absolute tw:left-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400"
                />
                <input
                  id="account-invite-search"
                  v-model="search"
                  type="search"
                  placeholder="Name or event…"
                  class="tw:w-full tw:h-11 tw:pl-9 tw:pr-3 tw:rounded-xl tw:border tw:border-gray-200 tw:text-sm tw:text-gray-900 placeholder:tw:text-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
                />
              </div>
            </div>

            <div class="tw:min-w-[160px]">
              <label
                class="tw:block tw:text-xs tw:font-medium tw:text-gray-500 tw:mb-1.5"
                for="account-invite-type"
                >Type</label
              >
              <div class="tw:relative">
                <select
                  id="account-invite-type"
                  v-model="filterType"
                  class="tw:w-full tw:h-11 tw:appearance-none tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:pr-10 tw:text-sm tw:text-gray-900 tw:bg-white focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="talent">Talents</option>
                  <option value="organiser">Organisers</option>
                  <option value="venue">Venues</option>
                </select>
                <ChevronDown
                  class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none"
                />
              </div>
            </div>

            <div class="tw:min-w-[200px]">
              <label
                class="tw:block tw:text-xs tw:font-medium tw:text-gray-500 tw:mb-1.5"
                for="account-invite-event"
                >Event</label
              >
              <div class="tw:relative">
                <select
                  id="account-invite-event"
                  v-model="selectedEvent"
                  class="tw:w-full tw:h-11 tw:appearance-none tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:pr-10 tw:text-sm tw:text-gray-900 tw:bg-white focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
                >
                  <option value="all">All Events</option>
                  <option
                    v-for="opt in eventOptions"
                    :key="String(opt.id)"
                    :value="String(opt.id)"
                  >
                    {{ opt.title }}
                  </option>
                </select>
                <ChevronDown
                  class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none"
                />
              </div>
            </div>
          </div>

          <!-- List -->
          <div class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:overflow-hidden">
            <div
              v-if="loading"
              class="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:py-16 tw:text-gray-500"
            >
              <Loader2 class="tw:w-5 tw:h-5 tw:animate-spin" />
              <span>Loading invites…</span>
            </div>

            <div
              v-else-if="loadError"
              class="tw:p-8 tw:text-center tw:text-red-600 tw:text-sm"
            >
              {{ loadError }}
            </div>

            <div
              v-else-if="visibleInvites.length === 0"
              class="tw:py-16 tw:px-4 tw:text-center"
            >
              <Users
                class="tw:w-12 tw:h-12 tw:mx-auto tw:text-gray-300"
              />
              <p class="tw:mt-4 tw:text-gray-600 tw:font-medium">
                No invites yet across your account.
              </p>
            </div>

            <!-- Desktop table -->
            <div v-else class="tw:hidden tw:md:block tw:overflow-x-auto">
              <table class="tw:w-full tw:text-left tw:text-sm">
                <thead
                  class="tw:bg-gray-50 tw:text-xs tw:uppercase tw:text-gray-500"
                >
                  <tr>
                    <th class="tw:px-4 tw:py-3">Invite</th>
                    <th class="tw:px-4 tw:py-3">Type</th>
                    <th class="tw:px-4 tw:py-3">Event</th>
                    <!-- <th class="tw:px-4 tw:py-3 tw:text-right">Actions</th> -->
                  </tr>
                </thead>
                <tbody class="tw:divide-y tw:divide-gray-100">
                  <tr v-for="row in visibleInvites" :key="String(row.id)">
                    <td class="tw:px-4 tw:py-3">
                      <div class="tw:flex tw:items-center tw:gap-3">
                        <div
                          class="tw:w-10 tw:h-10 tw:rounded-full tw:overflow-hidden tw:bg-gray-100 tw:flex-shrink-0 tw:border tw:border-gray-200"
                        >
                          <img
                            v-if="row.imageUrl"
                            :src="row.imageUrl"
                            alt=""
                            class="tw:w-full tw:h-full tw:object-cover"
                          />
                          <div
                            v-else
                            class="tw:w-full tw:h-full tw:flex tw:items-center tw:justify-center tw:text-gray-400 tw:text-xs"
                          >
                            ?
                          </div>
                        </div>
                        <span class="tw:font-medium tw:text-gray-900">{{
                          row.name
                        }}</span>
                      </div>
                    </td>
                    <td class="tw:px-4 tw:py-3">
                      <span
                        :class="badgeClass(row.inviteType)"
                        class="tw:inline-flex tw:items-center tw:px-2.5 tw:py-0.5 tw:rounded-full tw:text-xs tw:font-medium"
                      >
                        {{ typeLabel(row.inviteType) }}
                      </span>
                    </td>
                    <td class="tw:px-4 tw:py-3">
                      <span
                        class="tw:inline-flex tw:items-center tw:px-2.5 tw:py-0.5 tw:rounded-md tw:text-xs tw:font-medium tw:bg-[#EEF2FF] tw:text-indigo-800"
                      >
                        {{ row.eventTitle }}
                      </span>
                    </td>
                    <!-- <td
                      class="tw:px-4 tw:py-3 tw:text-right tw:whitespace-nowrap"
                    >
                      <a
                        v-if="row.viewProfileUrl"
                        :href="row.viewProfileUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="tw:text-sm tw:font-medium tw:text-[#0061FF] hover:tw:underline tw:mr-3"
                        >View Profile</a
                      >
                      <span
                        v-else
                        class="tw:text-sm tw:text-gray-400 tw:mr-3 tw:cursor-not-allowed"
                        >View Profile</span
                      >
                      <button
                        type="button"
                        class="tw:text-sm tw:font-medium tw:text-red-600 hover:tw:text-red-700 disabled:tw:opacity-50"
                        :disabled="removingId === row.id"
                        @click="removeInvite(row)"
                      >
                        {{
                          removingId === row.id ? "Removing…" : "Remove Invite"
                        }}
                      </button>
                    </td> -->
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile cards -->
            <div class="tw:md:hidden tw:divide-y tw:divide-gray-100">
              <div
                v-for="row in visibleInvites"
                :key="`m-${row.id}`"
                class="tw:p-4 tw:space-y-3"
              >
                <div class="tw:flex tw:items-start tw:gap-3">
                  <div
                    class="tw:w-12 tw:h-12 tw:rounded-full tw:overflow-hidden tw:bg-gray-100 tw:flex-shrink-0 tw:border tw:border-gray-200"
                  >
                    <img
                      v-if="row.imageUrl"
                      :src="row.imageUrl"
                      alt=""
                      class="tw:w-full tw:h-full tw:object-cover"
                    />
                    <div
                      v-else
                      class="tw:w-full tw:h-full tw:flex tw:items-center tw:justify-center tw:text-gray-400"
                    >
                      ?
                    </div>
                  </div>
                  <div class="tw:flex-1 tw:min-w-0">
                    <p class="tw:font-semibold tw:text-gray-900">
                      {{ row.name }}
                    </p>
                    <div class="tw:flex tw:flex-wrap tw:gap-2 tw:mt-2">
                      <span
                        :class="badgeClass(row.inviteType)"
                        class="tw:inline-flex tw:px-2 tw:py-0.5 tw:rounded-full tw:text-xs tw:font-medium"
                        >{{ typeLabel(row.inviteType) }}</span
                      >
                      <span
                        class="tw:inline-flex tw:px-2 tw:py-0.5 tw:rounded-md tw:text-xs tw:font-medium tw:bg-[#EEF2FF] tw:text-indigo-800"
                        >{{ row.eventTitle }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="tw:flex tw:flex-wrap tw:gap-2 tw:pt-1">
                  <a
                    v-if="row.viewProfileUrl"
                    :href="row.viewProfileUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="tw:flex-1 tw:min-w-[120px] tw:text-center tw:px-3 tw:py-2 tw:rounded-lg tw:text-sm tw:font-medium tw:text-[#0061FF] tw:border tw:border-[#0061FF] hover:tw:bg-blue-50"
                    >View Profile</a
                  >
                  <button
                    v-else
                    type="button"
                    disabled
                    class="tw:flex-1 tw:min-w-[120px] tw:px-3 tw:py-2 tw:rounded-lg tw:text-sm tw:font-medium tw:text-gray-400 tw:border tw:border-gray-200 tw:cursor-not-allowed"
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    class="tw:flex-1 tw:min-w-[120px] tw:px-3 tw:py-2 tw:rounded-lg tw:text-sm tw:font-medium tw:text-white tw:bg-red-600 hover:tw:bg-red-700 disabled:tw:opacity-50"
                    :disabled="removingId === row.id"
                    @click="removeInvite(row)"
                  >
                    {{ removingId === row.id ? "Removing…" : "Remove Invite" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
  Home,
  FileText,
  BarChart3,
  Settings,
  Calendar,
  ChevronDown,
  UserPlus,
  Users,
  Search,
  Loader2,
  MessageSquareText,
  Images,
  SkipBackIcon,
} from "lucide-vue-next"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import { useChatStore } from "@/stores/chatStore"
import {
  fetchAccountInvites,
  deleteAccountInvite,
  type AccountInviteRow,
} from "@/services/accountInvitesService"
import { useToast } from "@/composables/useToast"
const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const toast = useToast()

const mobileSidebarOpen = ref(false)
const invites = ref<AccountInviteRow[]>([])
const summary = ref({
  totalEvents: 0,
  talentsInvited: 0,
  organisersInvited: 0,
  venuesInvited: 0,
  totalInvites: 0,
})
const loading = ref(false)
const loadError = ref("")
const filterType = ref<"all" | "talent" | "organiser" | "venue">("all")
const search = ref("")
const selectedEvent = ref("all")
const removingId = ref<string | number | null>(null)

const isPremium = computed(
  () => route.path.includes("create-event-premium") === true,
)
const createBase = computed(() =>
  isPremium.value ? "/create-event-premium" : "/create-event-free",
)
const invitesRoute = computed(() => `${createBase.value}/invites`)

const menuItems = computed(() => {
  const b = createBase.value
  if (isPremium.value) {
    return [
      { id: "home", icon: Home, label: "Home", route: b },
      { id: "details", icon: FileText, label: "Details", route: b },
      {
        id: "analytics",
        icon: BarChart3,
        route: `${b}/report`,
        label: "Analytics",
      },
      {
        id: "gallery",
        label: "Gallery",
        icon: Images,
        route: `${b}/gallery-images`,
      },
      { id: "settings", icon: Settings, route: `${b}/settings`, label: "Settings" },
      { id: "invites", icon: UserPlus, label: "Invites", route: invitesRoute.value },
      { id: "calendar", icon: Calendar, label: "Calendar" },
      { id: "back", icon: SkipBackIcon, label: "Back" },
      { id: "chatbox", icon: MessageSquareText, label: "Chatbox" },
    ]
  }
  return [
    { id: "home", icon: Home, label: "Home", route: b },
    { id: "details", icon: FileText, label: "Details", route: b },
    { id: "analytics", icon: BarChart3, route: `${b}/report`, label: "Analytics" },
    { id: "settings", icon: Settings, route: `${b}/settings`, label: "Settings" },
    { id: "invites", icon: UserPlus, label: "Invites", route: invitesRoute.value },
    { id: "calendar", icon: Calendar, label: "Calendar" },
  ]
})

const statCards = computed(() => {
  const s = summary.value
  return [
    { key: "events", label: "Total Events", value: s.totalEvents },
    { key: "talents", label: "Talents Invited", value: s.talentsInvited },
    { key: "org", label: "Organisers Invited", value: s.organisersInvited },
    { key: "venues", label: "Venues Invited", value: s.venuesInvited },
    { key: "total", label: "Total Invites", value: s.totalInvites },
  ]
})

const eventOptions = computed(() => {
  const map = new Map<string, { id: string; title: string }>()
  for (const i of invites.value) {
    if (i.eventId == null) continue
    const id = String(i.eventId)
    if (!map.has(id)) map.set(id, { id, title: i.eventTitle || "Event" })
  }
  return Array.from(map.values()).sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
  )
})

const visibleInvites = computed(() => {
  let list = invites.value
  if (filterType.value !== "all") {
    list = list.filter((i) => i.inviteType === filterType.value)
  }
  if (selectedEvent.value !== "all") {
    list = list.filter(
      (i) => i.eventId != null && String(i.eventId) === selectedEvent.value,
    )
  }
  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.eventTitle && i.eventTitle.toLowerCase().includes(q)),
    )
  }
  return list
})

function typeLabel(t: AccountInviteRow["inviteType"]): string {
  if (t === "venue") return "Venue"
  if (t === "organiser") return "Organiser"
  return "Talent"
}

function badgeClass(t: AccountInviteRow["inviteType"]): string {
  if (t === "venue") return "tw:bg-emerald-100 tw:text-emerald-800"
  if (t === "organiser") return "tw:bg-violet-100 tw:text-violet-800"
  return "tw:bg-sky-100 tw:text-sky-800"
}

function toggleMobileSidebar() {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}
function closeMobileSidebar() {
  mobileSidebarOpen.value = false
}
function handleBack() {
  closeMobileSidebar()
  router.push("/")
}
function handleEventSelected() {
  closeMobileSidebar()
}
function handleChatboxClick() {
  closeMobileSidebar()
  chatStore.open()
}

function goInviteNew() {
  router.push(createBase.value)
}

async function load() {
  loading.value = true
  loadError.value = ""
  const res = await fetchAccountInvites()
  if (!res.success) {
    loadError.value = res.message || "Could not load invites."
    invites.value = []
    summary.value = {
      totalEvents: 0,
      talentsInvited: 0,
      organisersInvited: 0,
      venuesInvited: 0,
      totalInvites: 0,
    }
  } else {
    invites.value = res.invites
    summary.value = { ...res.summary }
  }
  loading.value = false
}

async function removeInvite(row: AccountInviteRow) {
  if (!row.id) return
  if (!window.confirm("Remove this invite?")) return
  removingId.value = row.id
  const r = await deleteAccountInvite(row.id)
  removingId.value = null
  if (r.success) {
    toast.success("Invite removed")
    await load()
  } else {
    toast.error(r.message || "Remove failed")
  }
}

watch(
  () => route.path,
  () => {
    load()
  },
  { immediate: true },
)
</script>
