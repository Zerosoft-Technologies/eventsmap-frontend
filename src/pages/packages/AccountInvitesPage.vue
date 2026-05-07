<template>
  <div
    class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6"
  >
    <div
      class="tw:w-full tw:max-w-7xl tw:min-w-0 tw:flex tw:flex-col tw:md:flex-row tw:md:items-stretch tw:gap-4 tw:md:gap-6"
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

      <div class="tw:hidden tw:shrink-0 tw:md:block">
        <EventSidebar
          :menuItems="menuItems"
          @back="handleBack"
          @event-selected="handleEventSelected"
          @chatbox-click="handleChatboxClick"
        />
      </div>

      <div
        class="tw:min-w-0 tw:flex-1 tw:max-w-full tw:overflow-x-hidden tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6"
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
            <!-- <button
              type="button"
              class="tw:shrink-0 tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2.5 tw:rounded-xl tw:text-sm tw:font-medium tw:text-white tw:bg-[#0061FF] hover:tw:bg-blue-700 tw:transition-colors"
              @click="goInviteNew"
            >
              <UserPlus class="tw:w-4 tw:h-4" />
              Invite New
            </button> -->
          </div>

          <!-- Summary cards -->
          <div
            class="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-5 tw:gap-3 tw:md:gap-4"
          >
            <div
              v-for="card in statCards"
              :key="card.key"
              class="tw:group tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100/80 tw:p-4 tw:shadow-sm tw:transition-all tw:duration-200 hover:tw:shadow-md hover:tw:border-blue-100 tw:relative tw:overflow-hidden"
            >
              <div
                class="tw:absolute tw:inset-x-0 tw:top-0 tw:h-1 tw:bg-gradient-to-r tw:opacity-95"
                :class="card.accentClass"
              />
              <div class="tw:flex tw:items-start tw:justify-between tw:gap-2">
                <p
                  class="tw:text-[11px] tw:font-semibold tw:text-gray-500 tw:uppercase tw:tracking-wider"
                >
                  {{ card.label }}
                </p>
                <component
                  :is="card.icon"
                  class="tw:w-4 tw:h-4 tw:text-gray-300 group-hover:tw:text-blue-400 tw:transition-colors"
                />
              </div>
              <p class="tw:text-2xl tw:font-bold tw:text-gray-900 tw:mt-2 tw:tabular-nums">
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

          <!-- Invites grid -->
          <div>
            <div
              v-if="loading"
              class="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:py-20 tw:rounded-2xl tw:bg-white/80 tw:backdrop-blur-sm tw:border tw:border-gray-100 tw:shadow-sm tw:text-gray-500"
            >
              <Loader2 class="tw:w-5 tw:h-5 tw:animate-spin tw:text-[#0061FF]" />
              <span>Loading invites…</span>
            </div>

            <div
              v-else-if="loadError"
              class="tw:p-8 tw:rounded-2xl tw:bg-red-50 tw:border tw:border-red-100 tw:text-center tw:text-red-700 tw:text-sm"
            >
              {{ loadError }}
            </div>

            <div
              v-else-if="visibleInvites.length === 0"
              class="tw:py-20 tw:px-4 tw:rounded-2xl tw:bg-gradient-to-b tw:from-white tw:to-gray-50/80 tw:border tw:border-gray-100 tw:shadow-sm tw:text-center"
            >
              <div
                class="tw:mx-auto tw:w-16 tw:h-16 tw:rounded-2xl tw:bg-gray-100 tw:flex tw:items-center tw:justify-center tw:mb-4"
              >
                <Users class="tw:w-7 tw:h-7 tw:text-gray-400" />
              </div>
              <p class="tw:text-lg tw:font-semibold tw:text-gray-800">
                No invites yet
              </p>
              <p class="tw:mt-1 tw:text-sm tw:text-gray-500 tw:max-w-sm tw:mx-auto">
                You have not invited anyone across your events yet. Use Invite New
                to add talents, venues, or organisers.
              </p>
            </div>

            <div
              v-else
              class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:xl:grid-cols-3 tw:gap-4"
            >
              <article
                v-for="row in visibleInvites"
                :key="String(row.id)"
                class="tw:group tw:relative tw:flex tw:flex-col tw:rounded-2xl tw:border tw:border-gray-100/90 tw:bg-white tw:shadow-sm tw:overflow-hidden tw:transition-all tw:duration-200 hover:tw:shadow-lg hover:tw:shadow-blue-500/5 hover:tw:-translate-y-0.5 hover:tw:border-blue-200/60"
              >
                <div
                  class="tw:h-1.5 tw:bg-gradient-to-r"
                  :class="gradientClass(row.inviteType)"
                />
                <div class="tw:p-5 tw:flex-1 tw:flex tw:flex-col tw:gap-4">
                  <div class="tw:flex tw:items-start tw:gap-4">
                    <div
                      class="tw:relative tw:w-16 tw:h-16 tw:rounded-2xl tw:overflow-hidden tw:ring-2 tw:ring-white tw:shadow-md tw:bg-gradient-to-br tw:from-slate-100 tw:to-slate-50 tw:flex-shrink-0"
                    >
                      <img
                        v-if="row.imageUrl"
                        :src="row.imageUrl"
                        :alt="row.name"
                        class="tw:w-full tw:h-full tw:object-cover"
                        loading="lazy"
                      />
                      <div
                        v-else
                        class="tw:w-full tw:h-full tw:flex tw:items-center tw:justify-center tw:text-lg tw:font-bold tw:text-slate-500"
                      >
                        {{ initials(row.name) }}
                      </div>
                    </div>
                    <div class="tw:flex-1 tw:min-w-0">
                      <h3
                        class="tw:text-base tw:font-bold tw:text-gray-900 tw:leading-tight tw:line-clamp-2"
                      >
                        {{ row.name }}
                      </h3>
                      <a
                        v-if="row.email"
                        :href="`mailto:${row.email}`"
                        class="tw:mt-1.5 tw:inline-flex tw:items-center tw:gap-1.5 tw:text-xs tw:text-gray-500 hover:tw:text-[#0061FF] tw:transition-colors tw:max-w-full"
                      >
                        <Mail class="tw:w-3.5 tw:h-3.5 tw:flex-shrink-0" />
                        <span class="tw:truncate">{{ row.email }}</span>
                      </a>
                      <p
                        v-else
                        class="tw:mt-1.5 tw:text-xs tw:text-gray-400"
                      >
                        No email on file
                      </p>
                    </div>
                  </div>

                  <div class="tw:flex tw:flex-wrap tw:gap-2">
                    <span
                      :class="badgeClass(row.inviteType)"
                      class="tw:inline-flex tw:items-center tw:gap-1 tw:pl-2 tw:pr-2.5 tw:py-1 tw:rounded-full tw:text-xs tw:font-semibold tw:ring-1 tw:ring-inset tw:ring-black/5"
                    >
                      <span
                        class="tw:w-1.5 tw:h-1.5 tw:rounded-full tw:bg-current tw:opacity-60"
                      />
                      {{ typeLabel(row.inviteType) }}
                    </span>
                    <span
                      class="tw:inline-flex tw:items-center tw:gap-1 tw:pl-2 tw:pr-2.5 tw:py-1 tw:rounded-lg tw:text-xs tw:font-medium tw:bg-indigo-50 tw:text-indigo-800 tw:ring-1 tw:ring-indigo-100"
                      :title="row.eventTitle"
                    >
                      <Calendar class="tw:w-3.5 tw:h-3.5 tw:flex-shrink-0 tw:opacity-70" />
                      <span class="tw:truncate tw:max-w-[200px]">{{
                        row.eventTitle
                      }}</span>
                    </span>
                  </div>
                </div>
              </article>
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
  Mail,
  LayoutGrid,
  Mic2,
  Briefcase,
  Building2,
} from "lucide-vue-next"
import EventSidebar from "./eventsidebar/Eventsidebar.vue"
import { useChatStore } from "@/stores/chatStore"
import {
  fetchAccountInvites,
  type AccountInviteRow,
  type AccountInviteType,
} from "@/services/accountInvitesService"
const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()

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
      // { id: "calendar", icon: Calendar, label: "Calendar" },
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
    // { id: "calendar", icon: Calendar, label: "Calendar" },
  ]
})

const statCards = computed(() => {
  const s = summary.value
  return [
    {
      key: "events",
      label: "Total Events",
      value: s.totalEvents,
      icon: LayoutGrid,
      accentClass: "tw:from-violet-500 tw:to-fuchsia-500",
    },
    {
      key: "talents",
      label: "Talents Invited",
      value: s.talentsInvited,
      icon: Mic2,
      accentClass: "tw:from-sky-500 tw:to-cyan-400",
    },
    {
      key: "org",
      label: "Organisers Invited",
      value: s.organisersInvited,
      icon: Briefcase,
      accentClass: "tw:from-amber-500 tw:to-orange-400",
    },
    {
      key: "venues",
      label: "Venues Invited",
      value: s.venuesInvited,
      icon: Building2,
      accentClass: "tw:from-emerald-500 tw:to-teal-400",
    },
    {
      key: "total",
      label: "Total Invites",
      value: s.totalInvites,
      icon: Users,
      accentClass: "tw:from-[#0061FF] tw:to-blue-400",
    },
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
    list = list.filter((i) => {
      const email = (i.email || "").toLowerCase()
      return (
        i.name.toLowerCase().includes(q) ||
        (i.eventTitle && i.eventTitle.toLowerCase().includes(q)) ||
        email.includes(q) ||
        (i.slug && i.slug.toLowerCase().includes(q))
      )
    })
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

function gradientClass(t: AccountInviteType): string {
  if (t === "venue") return "tw:from-emerald-500 tw:via-teal-400 tw:to-cyan-300"
  if (t === "organiser") return "tw:from-violet-500 tw:via-purple-500 tw:to-fuchsia-400"
  return "tw:from-sky-500 tw:via-[#0061FF] tw:to-indigo-500"
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const first = parts[0]
  if (parts.length === 1)
    return (first ?? "?").slice(0, 2).toUpperCase()
  const last = parts[parts.length - 1]
  const a = first?.[0]
  const b = last?.[0]
  if (a && b) return (a + b).toUpperCase()
  return (first ?? "?").slice(0, 2).toUpperCase()
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

watch(
  () => route.path,
  () => {
    load()
  },
  { immediate: true },
)
</script>
