<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6">
    <div class="tw:w-full tw:max-w-7xl tw:min-w-0 tw:flex tw:flex-col tw:md:flex-row tw:md:items-stretch tw:gap-4 tw:md:gap-6">
      <div class="tw:md:hidden tw:flex tw:items-center tw:justify-between tw:bg-white tw:rounded-xl tw:shadow-sm tw:px-4 tw:py-3">
        <button type="button" class="tw:text-sm tw:font-medium tw:text-[#0061FF]" @click="handleBack">Event Map</button>
        <button type="button" class="tw:text-2xl tw:leading-none tw:text-gray-700" @click="mobileSidebarOpen = !mobileSidebarOpen">☰</button>
      </div>

      <div v-if="mobileSidebarOpen" class="tw:md:hidden tw:fixed tw:inset-0 tw:z-50">
        <div class="tw:absolute tw:inset-0 tw:bg-black/30" @click="mobileSidebarOpen = false" />
        <div class="tw:absolute tw:left-0 tw:top-0 tw:h-screen tw:max-w-[92vw] tw:w-full tw:p-2">
          <EventSidebar
            :menu-items="menuItems"
            @back="handleBack"
            @event-selected="handleEventSelected"
            @chatbox-click="handleChatboxClick"
            @menu-click="mobileSidebarOpen = false"
          />
        </div>
      </div>

      <div class="tw:hidden tw:shrink-0 tw:md:block">
        <EventSidebar
          :menu-items="menuItems"
          @back="handleBack"
          @event-selected="handleEventSelected"
          @chatbox-click="handleChatboxClick"
        />
      </div>

      <div class="tw:min-w-0 tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6">
        <div class="tw:bg-white tw:rounded-2xl tw:p-5 tw:md:p-10">
          <div class="tw:flex tw:flex-col tw:md:flex-row tw:md:items-center tw:md:justify-between tw:gap-4 tw:mb-6">
            <div>
              <h1 class="tw:text-2xl tw:md:text-3xl tw:font-bold tw:text-[#2563eb]">Recurring series</h1>
              <p class="tw:text-sm tw:text-gray-600 tw:mt-1">Manage schedules, occurrences, and series settings.</p>
            </div>
            <router-link
              to="/create-event-premium/recurring-series/create"
              class="tw:inline-flex tw:items-center tw:justify-center tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-white tw:bg-blue-600 tw:rounded-lg hover:tw:bg-blue-700"
            >
              Create series
            </router-link>
          </div>

          <div v-if="loading" class="tw:flex tw:justify-center tw:py-16">
            <Loader2 class="tw:w-8 tw:h-8 tw:animate-spin tw:text-blue-600" />
          </div>

          <div v-else-if="error" class="tw:text-center tw:py-12">
            <p class="tw:text-red-600 tw:mb-4">{{ error }}</p>
            <button type="button" class="tw:text-sm tw:text-blue-600" @click="fetchSeries">Retry</button>
          </div>

          <div v-else-if="seriesList.length === 0" class="tw:text-center tw:py-16 tw:text-gray-500">
            <p class="tw:mb-4">No recurring series yet.</p>
            <router-link to="/create-event-premium/recurring-series/create" class="tw:text-blue-600 tw:font-medium">
              Create your first series
            </router-link>
          </div>

          <div v-else class="tw:overflow-x-auto">
            <table class="tw:min-w-full tw:text-sm">
              <thead>
                <tr class="tw:border-b tw:border-gray-200 tw:text-left tw:text-gray-500">
                  <th class="tw:py-3 tw:pr-4">Series name</th>
                  <th class="tw:py-3 tw:pr-4">Status</th>
                  <th class="tw:py-3 tw:pr-4">Next occurrence</th>
                  <th class="tw:py-3 tw:pr-4">Recurrence pattern</th>
                  <th class="tw:py-3 tw:text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in seriesList"
                  :key="item.id"
                  class="tw:border-b tw:border-gray-100 hover:tw:bg-gray-50/60"
                >
                  <td class="tw:py-3 tw:pr-4">
                    <router-link
                      :to="`/create-event-premium/recurring-series/${item.id}`"
                      class="tw:font-medium tw:text-blue-600 hover:tw:underline"
                    >
                      {{ getSeriesName(item) }}
                    </router-link>
                  </td>
                  <td class="tw:py-3 tw:pr-4">
                    <RecurringSeriesStatusBadge :series="item" :events="myEvents" />
                  </td>
                  <td class="tw:py-3 tw:pr-4 tw:whitespace-nowrap">
                    {{ formatNextOccurrenceLabel(getNextOccurrenceForSeries(item.id, myEvents)) }}
                  </td>
                  <td class="tw:py-3 tw:pr-4">{{ formatRecurrencePattern(item) }}</td>
                  <td class="tw:py-3 tw:text-right tw:whitespace-nowrap">
                    <router-link
                      :to="`/create-event-premium/recurring-series/${item.id}`"
                      class="tw:text-gray-700 hover:tw:underline tw:mr-3"
                    >
                      Manage
                    </router-link>
                    <router-link
                      :to="`/create-event-premium/recurring-series/${item.id}/edit`"
                      class="tw:text-blue-600 hover:tw:underline tw:mr-3"
                    >
                      Edit
                    </router-link>
                    <button type="button" class="tw:text-amber-700 hover:tw:underline tw:mr-3" @click="openPause(item)">
                      Pause
                    </button>
                    <button type="button" class="tw:text-red-600 hover:tw:underline" @click="openDelete(item)">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :visible="pauseVisible"
      title="Pause recurring series?"
      message="All future events in this series will be cancelled or deleted according to invitation rules. Accepted invitees will be notified. The series record is kept so you can edit and regenerate later."
      confirm-label="Pause series"
      variant="danger"
      :loading="pausing"
      @cancel="closePause"
      @confirm="confirmPause"
    />

    <ConfirmDialog
      :visible="deleteVisible"
      title="Delete recurring series?"
      message="This cannot be undone. Future events may be cancelled or permanently deleted depending on accepted invitations. Past events are not affected."
      confirm-label="Delete series"
      variant="danger"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="closeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import EventSidebar from './eventsidebar/Eventsidebar.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import RecurringSeriesStatusBadge from '@/components/recurring/RecurringSeriesStatusBadge.vue'
import { recurringSeriesApi, type RecurringSeries } from '@/api/recurringSeries'
import { useMyEventStore } from '@/stores/myEventStore'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { createEventPremiumMenuItems } from '@/utils/menuConfig'
import {
  formatNextOccurrenceLabel,
  formatRecurrencePattern,
  getNextOccurrenceForSeries,
  getSeriesName,
} from '@/utils/recurringSeriesManagement'

const router = useRouter()
const toast = useToast()
const myEventStore = useMyEventStore()
const chatStore = useChatStore()
const authStore = useAuthStore()

const menuItems = createEventPremiumMenuItems

const seriesList = ref<RecurringSeries[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const mobileSidebarOpen = ref(false)

const pauseVisible = ref(false)
const pauseTarget = ref<RecurringSeries | null>(null)
const pausing = ref(false)

const deleteVisible = ref(false)
const deleteTarget = ref<RecurringSeries | null>(null)
const deleting = ref(false)

const myEvents = computed(() => myEventStore.events)

async function fetchSeries() {
  loading.value = true
  error.value = null
  try {
    await myEventStore.fetchMyEvents()
    const res = await recurringSeriesApi.list({ per_page: 50 })
    if (res.success) {
      seriesList.value = res.data.series
    } else {
      error.value = res.message || 'Failed to load series'
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to load series'
  } finally {
    loading.value = false
  }
}

function openPause(item: RecurringSeries) {
  pauseTarget.value = item
  pauseVisible.value = true
}

function closePause() {
  if (pausing.value) return
  pauseVisible.value = false
  pauseTarget.value = null
}

function openDelete(item: RecurringSeries) {
  deleteTarget.value = item
  deleteVisible.value = true
}

function closeDelete() {
  if (deleting.value) return
  deleteVisible.value = false
  deleteTarget.value = null
}

async function confirmPause() {
  if (!pauseTarget.value) return
  pausing.value = true
  try {
    const res = await recurringSeriesApi.cancel(pauseTarget.value.id)
    const lc = res.lifecycle
    if (lc) {
      toast.success(`Series paused. ${lc.cancelled} cancelled, ${lc.deleted} removed, ${lc.notified} notified.`)
    } else {
      toast.success('Series paused')
    }
    closePause()
    await fetchSeries()
  } catch (e: unknown) {
    toast.error(e instanceof Error ? e.message : 'Failed to pause series')
  } finally {
    pausing.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    const res = await recurringSeriesApi.remove(deleteTarget.value.id)
    const lc = res.lifecycle
    if (lc) {
      toast.success(`Series deleted. ${lc.deleted} removed, ${lc.cancelled} cancelled, ${lc.notified} notified.`)
    } else {
      toast.success('Recurring series deleted')
    }
    closeDelete()
    await fetchSeries()
  } catch (e: unknown) {
    toast.error(e instanceof Error ? e.message : 'Delete failed')
  } finally {
    deleting.value = false
  }
}

function handleBack() {
  router.push('/')
}

function handleEventSelected() {
  mobileSidebarOpen.value = false
}

function handleChatboxClick() {
  mobileSidebarOpen.value = false
  if (authStore.user?.account_type !== 'premium') {
    toast.warning('Chat is available only for premium users.')
    return
  }
  chatStore.open()
}

onMounted(fetchSeries)
</script>
