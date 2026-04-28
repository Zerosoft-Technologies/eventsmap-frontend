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
        <button type="button" class="tw:text-sm tw:font-medium tw:text-[#0061FF]" @click="handleBack">
          Event Map
        </button>
        <button
          type="button"
          aria-label="Open menu"
          class="tw:text-2xl tw:leading-none tw:text-gray-700"
          @click="toggleMobileSidebar"
        >
          ☰
        </button>
      </div>

      <div v-if="mobileSidebarOpen" class="tw:md:hidden tw:fixed tw:inset-0 tw:z-50">
        <div class="tw:absolute tw:inset-0 tw:bg-black/30" @click="closeMobileSidebar" />
        <div class="tw:absolute tw:left-0 tw:top-0 tw:h-screen tw:max-w-[92vw] tw:w-full tw:p-2">
          <EventSidebar
            :sidebar-kind="sidebarKind"
            :menu-items="menuItems"
            @back="handleBack"
            @event-selected="handleEventSelected"
            @chatbox-click="handleChatboxClick"
            @menu-click="closeMobileSidebar"
          />
        </div>
      </div>

      <div class="tw:hidden tw:shrink-0 tw:md:block">
        <EventSidebar
          :sidebar-kind="sidebarKind"
          :menu-items="menuItems"
          @back="handleBack"
          @event-selected="handleEventSelected"
          @chatbox-click="handleChatboxClick"
        />
      </div>

      <div
        class="tw:min-w-0 tw:flex-1 tw:max-w-full tw:overflow-x-hidden tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6"
      >
        <div class="tw:space-y-4 tw:md:space-y-6">
          <!-- Header -->
          <div
            class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-6 tw:border tw:border-gray-100/80"
          >
            <h1 class="tw:text-2xl tw:md:text-3xl tw:font-bold tw:text-gray-900">
              Event invitations
            </h1>
            <p class="tw:text-sm tw:text-gray-600 tw:mt-2 tw:max-w-2xl">
              Events you were invited to as a {{ receiverRoleLabel }}. Accept or decline pending invites; review past
              responses anytime.
            </p>
          </div>

          <!-- Filters -->
          <div
            class="tw:bg-white tw:rounded-2xl tw:shadow-sm tw:p-4 tw:md:p-4 tw:border tw:border-gray-100/80 tw:flex tw:flex-col tw:md:flex-row tw:md:flex-wrap tw:md:items-end tw:gap-3"
          >
            <div class="tw:min-w-[160px] tw:flex-1">
              <label class="tw:block tw:text-xs tw:font-medium tw:text-gray-500 tw:mb-1.5" for="inv-status">
                Status
              </label>
              <select
                id="inv-status"
                v-model="statusFilter"
                class="tw:w-full tw:h-11 tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:text-sm tw:text-gray-900 tw:bg-white focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="all">All</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div class="tw:min-w-[160px] tw:flex-1">
              <label class="tw:block tw:text-xs tw:font-medium tw:text-gray-500 tw:mb-1.5" for="inv-timing">
                Event timing
              </label>
              <select
                id="inv-timing"
                v-model="timingFilter"
                class="tw:w-full tw:h-11 tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:text-sm tw:text-gray-900 tw:bg-white focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
              >
                <option value="all">All events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
            <p v-if="pagination" class="tw:text-xs tw:text-gray-500 tw:md:ml-auto tw:md:self-center">
              {{ pagination.total }} total
            </p>
          </div>

          <!-- Error -->
          <div
            v-if="loadError"
            class="tw:rounded-2xl tw:border tw:border-red-200 tw:bg-red-50 tw:px-4 tw:py-3 tw:text-sm tw:text-red-800"
            role="alert"
          >
            {{ loadError }}
          </div>

          <!-- Skeleton -->
          <ul v-if="initialLoading" class="tw:space-y-4 tw:list-none" aria-busy="true">
            <li
              v-for="n in 4"
              :key="n"
              class="tw:animate-pulse tw:rounded-2xl tw:border tw:border-gray-100 tw:bg-white tw:p-4 tw:md:p-5"
            >
              <div class="tw:h-40 tw:rounded-xl tw:bg-gray-100 tw:mb-4" />
              <div class="tw:h-4 tw:w-2/3 tw:rounded tw:bg-gray-100 tw:mb-2" />
              <div class="tw:h-3 tw:w-1/2 tw:rounded tw:bg-gray-100" />
            </li>
          </ul>

          <!-- List -->
          <ul v-else class="tw:space-y-4 tw:list-none">
            <li
              v-for="(item, idx) in invitations"
              :key="invitationKey(item) || `inv-row-${idx}`"
              class="tw:rounded-2xl tw:border tw:border-gray-100/90 tw:bg-white tw:shadow-sm tw:overflow-hidden tw:transition-shadow hover:tw:shadow-md"
            >
              <div class="tw:flex tw:flex-col tw:md:flex-row">
                <div
                  class="tw:relative tw:h-44 tw:md:w-56 tw:md:h-auto tw:md:min-h-[200px] tw:shrink-0 tw:bg-gray-100"
                >
                  <img
                    v-if="eventCover(item)"
                    :src="eventCover(item)!"
                    alt=""
                    class="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover"
                  />
                  <div
                    v-else
                    class="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:text-gray-400"
                  >
                    <CalendarRange class="tw:w-12 tw:h-12" aria-hidden="true" />
                  </div>
                </div>
                <div class="tw:flex-1 tw:p-4 tw:md:p-5 tw:flex tw:flex-col tw:gap-3">
                  <div class="tw:flex tw:flex-wrap tw:items-start tw:justify-between tw:gap-2">
                    <div class="tw:min-w-0 tw:flex-1">
                      <h2 class="tw:text-lg tw:md:text-xl tw:font-semibold tw:text-[#0061FF] tw:leading-snug">
                        {{ item.event?.title || 'Event' }}
                      </h2>
                      <p class="tw:text-sm tw:text-gray-600 tw:mt-1 tw:flex tw:flex-wrap tw:items-center tw:gap-x-2 tw:gap-y-1">
                        <span class="tw:inline-flex tw:items-center tw:gap-1">
                          <Calendar class="tw:w-4 tw:h-4 tw:text-gray-400 shrink-0" aria-hidden="true" />
                          {{ formatEventSchedule(item.event) }}
                        </span>
                        <span v-if="venueSnippet(item.event)" class="tw:text-gray-500">· {{ venueSnippet(item.event) }}</span>
                      </p>
                      <p v-if="item.event?.address" class="tw:text-xs tw:text-gray-500 tw:mt-1 tw:line-clamp-2">
                        {{ item.event.address }}
                      </p>
                    </div>
                    <div class="tw:flex tw:flex-wrap tw:gap-2 tw:shrink-0">
                      <span
                        class="tw:inline-flex tw:items-center tw:rounded-full tw:px-2.5 tw:py-1 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide"
                        :class="statusBadgeClass(item.status)"
                      >
                        {{ item.status }}
                      </span>
                      <span
                        class="tw:inline-flex tw:items-center tw:rounded-full tw:border tw:border-gray-200 tw:bg-gray-50 tw:px-2.5 tw:py-1 tw:text-xs tw:font-medium tw:text-gray-700"
                      >
                        {{ formatReceiverType(item.receiver_type) }}
                      </span>
                    </div>
                  </div>

                  <p class="tw:text-sm tw:text-gray-700">
                    <span class="tw:font-medium tw:text-gray-900">Invited by</span>
                    {{ item.sender?.name || 'Organizer' }}
                    <span v-if="item.sender?.email" class="tw:text-gray-500 tw:text-xs"> · {{ item.sender.email }}</span>
                  </p>
                  <p class="tw:text-xs tw:text-gray-400">
                    Invited {{ formatShortDate(item.invited_at) }}
                    <template v-if="item.responded_at"> · Responded {{ formatShortDate(item.responded_at) }}</template>
                  </p>

                  <div v-if="isPending(item)" class="tw:flex tw:flex-wrap tw:gap-2 tw:pt-1">
                    <button
                      type="button"
                      class="tw:inline-flex tw:items-center tw:justify-center tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white tw:bg-emerald-600 hover:tw:bg-emerald-700 tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed focus-visible:tw:outline-none focus-visible:tw:ring-2 focus-visible:tw:ring-emerald-500 focus-visible:tw:ring-offset-2"
                      :disabled="respondingId === invitationKey(item)"
                      @click="respond(item, 'accepted')"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      class="tw:inline-flex tw:items-center tw:justify-center tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-gray-800 tw:bg-white tw:border tw:border-gray-200 hover:tw:bg-gray-50 tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed focus-visible:tw:outline-none focus-visible:tw:ring-2 focus-visible:tw:ring-gray-400 focus-visible:tw:ring-offset-2"
                      :disabled="respondingId === invitationKey(item)"
                      @click="respond(item, 'rejected')"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <!-- Empty -->
          <div
            v-if="!initialLoading && !loadError && invitations.length === 0"
            class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:rounded-2xl tw:border tw:border-dashed tw:border-gray-200 tw:bg-white tw:px-6 tw:py-16 tw:text-center"
          >
            <Inbox class="tw:w-14 tw:h-14 tw:text-gray-300 tw:mb-4" aria-hidden="true" />
            <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900">
              {{ emptyTitle }}
            </h3>
            <p class="tw:text-sm tw:text-gray-500 tw:mt-2 tw:max-w-md">
              {{ emptySubtitle }}
            </p>
          </div>

          <!-- Pagination -->
          <div
            v-if="pagination && pagination.last_page > 1 && !initialLoading"
            class="tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-3 tw:pt-2"
          >
            <button
              type="button"
              class="tw:rounded-xl tw:border tw:border-gray-200 tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-800 hover:tw:bg-gray-50 disabled:tw:opacity-40"
              :disabled="pagination.current_page <= 1 || listLoading"
              @click="goPage(pagination.current_page - 1)"
            >
              Previous
            </button>
            <span class="tw:text-sm tw:text-gray-600">
              Page {{ pagination.current_page }} / {{ pagination.last_page }}
            </span>
            <button
              type="button"
              class="tw:rounded-xl tw:border tw:border-gray-200 tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-800 hover:tw:bg-gray-50 disabled:tw:opacity-40"
              :disabled="pagination.current_page >= pagination.last_page || listLoading"
              @click="goPage(pagination.current_page + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Home,
  FileText,
  BarChart3,
  Settings,
  Calendar,
  Images,
  MessageSquareText,
  SkipBackIcon,
  Inbox,
  CalendarRange,
} from 'lucide-vue-next'
import EventSidebar from '@/pages/packages/eventsidebar/Eventsidebar.vue'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { eventInvitationsNavItem } from '@/utils/eventInvitationsNavItem'
import {
  fetchReceivedInvitations,
  respondToInvitation,
  type EventInvitationListItem,
  type InvitedEventPayload,
  type InvitationsPagination,
} from '@/services/invitationService'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const authStore = useAuthStore()
const toast = useToast()

const mobileSidebarOpen = ref(false)
const invitations = ref<EventInvitationListItem[]>([])
const pagination = ref<InvitationsPagination | null>(null)
const loadError = ref('')
const initialLoading = ref(true)
const listLoading = ref(false)
const respondingId = ref<number | null>(null)

const statusFilter = ref<'all' | 'pending' | 'accepted' | 'rejected'>('pending')
const timingFilter = ref<'all' | 'upcoming' | 'past'>('all')
const page = ref(1)
const perPage = 15

const profileBasePath = computed(() => route.path.replace(/\/event-invitations\/?$/, ''))

const sidebarKind = computed(() => {
  const p = profileBasePath.value
  if (p.includes('venue')) return 'venues' as const
  if (p.includes('talents')) return 'talents' as const
  return 'organisers' as const
})

const receiverRoleLabel = computed(() => {
  const k = sidebarKind.value
  if (k === 'venues') return 'venue'
  if (k === 'talents') return 'talent'
  return 'organiser'
})

const menuItems = computed(() => {
  const base = profileBasePath.value

  if (base === '/create-talents-free') {
    return [
      { id: 'home', icon: Home, label: 'Home', route: base },
      { id: 'details', icon: FileText, label: 'Details', route: base },
      { id: 'analytics', icon: BarChart3, route: `${base}/report`, label: 'Analytics' },
      eventInvitationsNavItem(base),
      { id: 'settings', icon: Settings, route: `${base}/settings`, label: 'Settings' },
    ]
  }
  if (base === '/create-talents-premium') {
    return [
      { id: 'home', icon: Home, label: 'Home', route: base },
      { id: 'details', icon: FileText, label: 'Details', route: base },
      { id: 'analytics', icon: BarChart3, route: `${base}/report`, label: 'Analytics' },
      { id: 'gallery', icon: Images, route: `${base}/gallery-images`, label: 'Gallery' },
      eventInvitationsNavItem(base),
      { id: 'settings', icon: Settings, route: `${base}/settings`, label: 'Settings' },
      { id: 'back', icon: SkipBackIcon, label: 'Back' },
      { id: 'chatbox', icon: MessageSquareText, label: 'Chatbox' },
    ]
  }
  if (base === '/create-venue-free') {
    return [
      { id: 'home', icon: Home, label: 'Home', route: base },
      { id: 'details', icon: FileText, label: 'Details', route: base },
      { id: 'analytics', icon: BarChart3, route: `${base}/report`, label: 'Analytics' },
      eventInvitationsNavItem(base),
      { id: 'settings', icon: Settings, route: `${base}/settings`, label: 'Settings' },
    ]
  }
  if (base === '/create-venue-premium') {
    return [
      { id: 'home', icon: Home, label: 'Home', route: base },
      { id: 'details', icon: FileText, label: 'Details', route: base },
      { id: 'analytics', icon: BarChart3, route: `${base}/report`, label: 'Analytics' },
      { id: 'gallery', icon: Images, route: `${base}/gallery-images`, label: 'Gallery' },
      eventInvitationsNavItem(base),
      { id: 'settings', icon: Settings, route: `${base}/settings`, label: 'Settings' },
      { id: 'back', icon: SkipBackIcon, label: 'Back' },
      { id: 'chatbox', icon: MessageSquareText, label: 'Chatbox' },
    ]
  }
  if (base === '/create-organiser-free') {
    return [
      { id: 'home', icon: Home, label: 'Home', route: base },
      { id: 'details', icon: FileText, label: 'Details', route: base },
      { id: 'analytics', icon: BarChart3, route: `${base}/report`, label: 'Analytics' },
      eventInvitationsNavItem(base),
      { id: 'settings', icon: Settings, route: `${base}/settings`, label: 'Settings' },
    ]
  }
  if (base === '/create-organiser-premium') {
    return [
      { id: 'home', icon: Home, label: 'Home', route: base },
      { id: 'details', icon: FileText, label: 'Details', route: base },
      { id: 'analytics', icon: BarChart3, route: `${base}/report`, label: 'Analytics' },
      { id: 'gallery', icon: Images, route: `${base}/gallery-images`, label: 'Gallery' },
      eventInvitationsNavItem(base),
      { id: 'settings', icon: Settings, route: `${base}/settings`, label: 'Settings' },
      { id: 'back', icon: SkipBackIcon, label: 'Back' },
      { id: 'chatbox', icon: MessageSquareText, label: 'Chatbox' },
    ]
  }

  return [
    { id: 'home', icon: Home, label: 'Home', route: '/create-talents-free' },
    { id: 'settings', icon: Settings, route: '/create-talents-free/settings', label: 'Settings' },
  ]
})

function toggleMobileSidebar() {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

function closeMobileSidebar() {
  mobileSidebarOpen.value = false
}

function handleBack() {
  closeMobileSidebar()
  router.push('/')
}

function handleEventSelected() {
  closeMobileSidebar()
}

function handleChatboxClick() {
  closeMobileSidebar()
  if (authStore.user?.account_type !== 'premium') {
    toast.warning('Chat is available only for premium users.')
    return
  }
  chatStore.open()
}

function invitationKey(item: EventInvitationListItem) {
  return Number(item.invitation_id ?? item.id ?? 0)
}

function eventCover(item: EventInvitationListItem) {
  const ev = item.event
  if (!ev) return null
  const u = ev.cover_image || ev.image_url
  return typeof u === 'string' && u.trim() !== '' ? u : null
}

function venueSnippet(ev: InvitedEventPayload | null | undefined) {
  if (!ev?.venue) return ''
  if (typeof ev.venue === 'string') return ev.venue
  const v = ev.venue as { name?: string; title?: string }
  return v.name || v.title || ''
}

function formatEventSchedule(ev: InvitedEventPayload | null | undefined) {
  if (!ev) return 'Date TBC'
  const dt = ev.start_datetime || ev.event_date || ev.start_date
  const tm = ev.start_time
  if (dt && tm) {
    try {
      const d = new Date(dt)
      if (!Number.isNaN(d.getTime())) {
        return `${d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} · ${String(tm).slice(0, 5)}`
      }
    } catch {
      /* fall through */
    }
  }
  if (dt) {
    try {
      const d = new Date(dt)
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
      }
    } catch {
      /* fall through */
    }
  }
  if (ev.event_date && ev.start_time) return `${ev.event_date} · ${String(ev.start_time).slice(0, 5)}`
  return 'Date TBC'
}

function formatShortDate(iso: string) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

function formatReceiverType(t: string) {
  const m: Record<string, string> = {
    talent: 'Talent',
    organiser: 'Organiser',
    organizer: 'Organiser',
    venue: 'Venue',
  }
  return m[String(t || '').toLowerCase()] || t
}

function statusBadgeClass(status: string) {
  const s = String(status || '').toLowerCase()
  if (s === 'pending') return 'tw:bg-amber-100 tw:text-amber-900'
  if (s === 'accepted') return 'tw:bg-emerald-100 tw:text-emerald-900'
  if (s === 'rejected') return 'tw:bg-gray-100 tw:text-gray-700'
  return 'tw:bg-gray-100 tw:text-gray-800'
}

function isPending(item: EventInvitationListItem) {
  return String(item.status || '').toLowerCase() === 'pending'
}

const emptyTitle = computed(() => {
  if (statusFilter.value === 'pending') return 'No pending invitations'
  if (statusFilter.value === 'accepted') return 'No accepted invitations'
  if (statusFilter.value === 'rejected') return 'No declined invitations'
  return 'No invitations yet'
})

const emptySubtitle = computed(() => {
  if (timingFilter.value === 'upcoming') return 'Try changing filters — nothing upcoming matches this view.'
  if (timingFilter.value === 'past') return 'Try changing filters — nothing in the past matches this view.'
  return 'When an organiser invites you to an event, it will show up here.'
})

const hasFetchedOnce = ref(false)

async function load(resetPage = false) {
  if (resetPage) {
    page.value = 1
  }
  if (!hasFetchedOnce.value) {
    initialLoading.value = true
  } else {
    listLoading.value = true
  }
  loadError.value = ''

  const res = await fetchReceivedInvitations({
    status: statusFilter.value === 'all' ? '' : statusFilter.value,
    event_timing: timingFilter.value === 'all' ? '' : timingFilter.value,
    page: page.value,
    per_page: perPage,
  })

  initialLoading.value = false
  listLoading.value = false
  hasFetchedOnce.value = true

  if (!res.success || !res.data) {
    loadError.value = res.message || 'Could not load invitations'
    invitations.value = []
    pagination.value = null
    return
  }

  invitations.value = res.data.invitations
  pagination.value = res.data.pagination
}

function goPage(p: number) {
  page.value = p
  load(false)
}

async function respond(item: EventInvitationListItem, status: 'accepted' | 'rejected') {
  const id = invitationKey(item)
  if (!id) {
    toast.error('Invalid invitation')
    return
  }
  respondingId.value = id
  const res = await respondToInvitation(id, { status })
  respondingId.value = null

  if (!res.success) {
    const msg = res.message || 'Could not update invitation'
    if (/already/i.test(msg)) {
      toast.info(msg)
      await load(false)
      return
    }
    toast.error(msg)
    return
  }

  toast.success(status === 'accepted' ? 'Invitation accepted' : 'Invitation declined')
  await load(false)
}

watch([statusFilter, timingFilter], () => {
  load(true)
})

watch(
  () => route.path,
  () => {
    load(true)
  },
)

load(true)
</script>
