<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6">
    <div class="tw:w-full tw:max-w-7xl tw:min-w-0 tw:flex tw:flex-col tw:md:flex-row tw:md:items-stretch tw:gap-4 tw:md:gap-6">
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
          <div class="tw:mb-6">
            <router-link
              to="/create-event-premium/recurring-series"
              class="tw:text-sm tw:text-blue-600 hover:tw:underline"
            >
              ← Back to series list
            </router-link>
          </div>

          <div v-if="loading" class="tw:flex tw:justify-center tw:py-16">
            <Loader2 class="tw:w-8 tw:h-8 tw:animate-spin tw:text-blue-600" />
          </div>

          <div v-else-if="error" class="tw:text-center tw:py-12">
            <p class="tw:text-red-600 tw:mb-4">{{ error }}</p>
            <router-link to="/create-event-premium/recurring-series" class="tw:text-sm tw:text-blue-600">
              Return to list
            </router-link>
          </div>

          <template v-else-if="series">
            <div class="tw:flex tw:flex-col tw:lg:flex-row tw:lg:items-start tw:lg:justify-between tw:gap-4 tw:mb-6">
              <div class="tw:min-w-0">
                <h1 class="tw:text-2xl tw:md:text-3xl tw:font-bold tw:text-[#2563eb] tw:truncate">
                  {{ seriesName }}
                </h1>
                <p class="tw:text-sm tw:text-gray-600 tw:mt-2">{{ recurrencePattern }}</p>
                <div class="tw:mt-3">
                  <RecurringSeriesStatusBadge :series="series" :events="myEvents" />
                </div>
              </div>

              <div class="tw:flex tw:flex-wrap tw:gap-2 tw:shrink-0">
                <router-link
                  :to="`/create-event-premium/recurring-series/${series.id}/edit`"
                  class="tw:inline-flex tw:items-center tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-white tw:bg-blue-600 tw:rounded-lg hover:tw:bg-blue-700"
                >
                  Edit series
                </router-link>
                <button
                  type="button"
                  class="tw:inline-flex tw:items-center tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-amber-800 tw:bg-amber-100 tw:rounded-lg hover:tw:bg-amber-200"
                  @click="openPause"
                >
                  Pause series
                </button>
                <button
                  type="button"
                  class="tw:inline-flex tw:items-center tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-red-700 tw:bg-red-50 tw:rounded-lg hover:tw:bg-red-100"
                  @click="openDelete"
                >
                  Delete series
                </button>
              </div>
            </div>

            <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-3 tw:gap-4 tw:mb-8">
              <div class="tw:rounded-xl tw:border tw:border-gray-200 tw:p-4">
                <p class="tw:text-xs tw:font-medium tw:uppercase tw:tracking-wide tw:text-gray-500">Next occurrence</p>
                <p class="tw:mt-1 tw:text-sm tw:font-semibold tw:text-gray-900">{{ nextOccurrenceLabel }}</p>
              </div>
              <div class="tw:rounded-xl tw:border tw:border-gray-200 tw:p-4">
                <p class="tw:text-xs tw:font-medium tw:uppercase tw:tracking-wide tw:text-gray-500">Date range</p>
                <p class="tw:mt-1 tw:text-sm tw:font-semibold tw:text-gray-900">
                  {{ series.start_date }} — {{ series.end_date || 'Open-ended' }}
                </p>
              </div>
              <div class="tw:rounded-xl tw:border tw:border-gray-200 tw:p-4">
                <p class="tw:text-xs tw:font-medium tw:uppercase tw:tracking-wide tw:text-gray-500">Timezone</p>
                <p class="tw:mt-1 tw:text-sm tw:font-semibold tw:text-gray-900">{{ series.timezone }}</p>
              </div>
            </div>

            <div>
              <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-3">Occurrences</h2>
              <p class="tw:text-sm tw:text-gray-600 tw:mb-4">
                Edit a single date without changing the rest of the series. Customized dates are labeled
                <span class="tw:font-medium">Custom Occurrence</span>.
              </p>

              <div v-if="occurrences.length === 0" class="tw:rounded-lg tw:border tw:border-dashed tw:border-gray-300 tw:p-8 tw:text-center tw:text-sm tw:text-gray-500">
                No generated occurrences yet.
              </div>

              <div v-else class="tw:overflow-x-auto tw:rounded-xl tw:border tw:border-gray-200">
                <table class="tw:min-w-full tw:text-sm">
                  <thead class="tw:bg-gray-50 tw:text-left tw:text-gray-500">
                    <tr>
                      <th class="tw:py-3 tw:px-4">Date</th>
                      <th class="tw:py-3 tw:px-4">Time</th>
                      <th class="tw:py-3 tw:px-4">Label</th>
                      <th class="tw:py-3 tw:px-4">Status</th>
                      <th class="tw:py-3 tw:px-4 tw:text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="event in occurrences"
                      :key="event.id"
                      class="tw:border-t tw:border-gray-100"
                    >
                      <td class="tw:py-3 tw:px-4">{{ formatDisplayDate(event.event_date) }}</td>
                      <td class="tw:py-3 tw:px-4">{{ formatTime(event.start_time) }}</td>
                      <td class="tw:py-3 tw:px-4">
                        <RecurringOccurrenceBadge :event="event" />
                      </td>
                      <td class="tw:py-3 tw:px-4 tw:capitalize">{{ event.status || 'upcoming' }}</td>
                      <td class="tw:py-3 tw:px-4 tw:text-right">
                        <button
                          type="button"
                          class="tw:text-blue-600 hover:tw:underline tw:font-medium"
                          @click="editOccurrence(event.id)"
                        >
                          Edit this occurrence
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :visible="pauseVisible"
      title="Pause recurring series?"
      message="All future events in this series will be cancelled or deleted according to invitation rules. Accepted invitees will be notified. The series definition is kept so you can edit and regenerate later."
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
      @cancel="closeDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import EventSidebar from './eventsidebar/Eventsidebar.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import RecurringOccurrenceBadge from '@/components/recurring/RecurringOccurrenceBadge.vue'
import RecurringSeriesStatusBadge from '@/components/recurring/RecurringSeriesStatusBadge.vue'
import { recurringSeriesApi, type RecurringSeries } from '@/api/recurringSeries'
import { useMyEventStore } from '@/stores/myEventStore'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { createEventPremiumMenuItems } from '@/utils/menuConfig'
import { formatDisplayDate } from '@/utils/recurringScheduleFormat'
import {
  formatNextOccurrenceLabel,
  formatRecurrencePattern,
  getNextOccurrenceForSeries,
  getSeriesName,
  getSeriesOccurrences,
} from '@/utils/recurringSeriesManagement'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const myEventStore = useMyEventStore()
const chatStore = useChatStore()
const authStore = useAuthStore()

const menuItems = createEventPremiumMenuItems

const seriesId = computed(() => {
  const raw = route.params.id
  return typeof raw === 'string' ? parseInt(raw, 10) : NaN
})

const series = ref<RecurringSeries | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const pauseVisible = ref(false)
const deleteVisible = ref(false)
const pausing = ref(false)
const deleting = ref(false)

const myEvents = computed(() => myEventStore.events)

const seriesName = computed(() => (series.value ? getSeriesName(series.value) : ''))
const recurrencePattern = computed(() => (series.value ? formatRecurrencePattern(series.value) : ''))
const nextOccurrenceLabel = computed(() =>
  series.value
    ? formatNextOccurrenceLabel(getNextOccurrenceForSeries(series.value.id, myEvents.value))
    : '—',
)
const occurrences = computed(() =>
  series.value ? getSeriesOccurrences(series.value.id, myEvents.value) : [],
)

function formatTime(time?: string | null): string {
  if (!time) return '—'
  return time.slice(0, 5)
}

async function loadSeries() {
  loading.value = true
  error.value = null
  try {
    await myEventStore.fetchMyEvents()
    const res = await recurringSeriesApi.get(seriesId.value)
    if (res.success) {
      series.value = res.data
    } else {
      error.value = res.message || 'Failed to load series'
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to load series'
  } finally {
    loading.value = false
  }
}

function editOccurrence(eventId: number) {
  myEventStore.setPendingEditorEventId(eventId)
  router.push({ path: '/create-event-premium', query: { occurrence: '1' } })
}

function openPause() {
  pauseVisible.value = true
}

function closePause() {
  if (pausing.value) return
  pauseVisible.value = false
}

function openDelete() {
  deleteVisible.value = true
}

function closeDelete() {
  if (deleting.value) return
  deleteVisible.value = false
}

async function confirmPause() {
  if (!series.value) return
  pausing.value = true
  try {
    const res = await recurringSeriesApi.cancel(series.value.id)
    const lc = res.lifecycle
    if (lc) {
      toast.success(`Series paused. ${lc.cancelled} cancelled, ${lc.deleted} removed, ${lc.notified} notified.`)
    } else {
      toast.success('Series paused')
    }
    closePause()
    await loadSeries()
  } catch (e: unknown) {
    toast.error(e instanceof Error ? e.message : 'Failed to pause series')
  } finally {
    pausing.value = false
  }
}

async function confirmDelete() {
  if (!series.value) return
  deleting.value = true
  try {
    const res = await recurringSeriesApi.remove(series.value.id)
    const lc = res.lifecycle
    if (lc) {
      toast.success(`Series deleted. ${lc.deleted} removed, ${lc.cancelled} cancelled, ${lc.notified} notified.`)
    } else {
      toast.success('Recurring series deleted')
    }
    router.push('/create-event-premium/recurring-series')
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
  // Navigation handled by EventSidebar
}

function handleChatboxClick() {
  if (authStore.user?.account_type !== 'premium') {
    toast.warning('Chat is available only for premium users.')
    return
  }
  chatStore.open()
}

onMounted(loadSeries)
</script>
