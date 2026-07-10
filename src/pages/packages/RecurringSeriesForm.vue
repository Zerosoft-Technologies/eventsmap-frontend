<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6">
    <div class="tw:w-full tw:max-w-7xl tw:min-w-0 tw:flex tw:flex-col tw:md:flex-row tw:md:items-stretch tw:gap-4 tw:md:gap-6">
      <div class="tw:hidden tw:shrink-0 tw:md:block">
        <EventSidebar
          :menu-items="menuItems"
          template-picker-mode
          @back="handleBack"
          @event-selected="onSourceEventSelected"
          @chatbox-click="handleChatboxClick"
        />
      </div>

      <div class="tw:min-w-0 tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6">
        <div class="tw:bg-white tw:rounded-2xl tw:p-5 tw:md:p-10">
          <div class="tw:mb-6">
            <router-link to="/create-event-premium/recurring-series" class="tw:text-sm tw:text-blue-600 hover:tw:underline">
              ← Back to series list
            </router-link>
            <h1 class="tw:text-2xl tw:md:text-3xl tw:font-bold tw:text-[#2563eb] tw:mt-2">
              {{ isEdit ? 'Edit recurring series' : 'Create recurring series' }}
            </h1>
            <p v-if="!isEdit" class="tw:text-sm tw:text-gray-600 tw:mt-2">
              <span class="tw:hidden tw:md:inline">Select an existing event in the sidebar to use as the template for all generated occurrences.</span>
              <span class="tw:md:hidden">Choose a standalone event below to use as the template for all generated occurrences.</span>
            </p>
          </div>

          <div v-if="!isEdit && !loadingSeries" class="tw:md:hidden tw:mb-4">
            <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">Template event</label>
            <select
              class="tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 tw:text-sm tw:bg-white"
              :value="selectedSourceEventId ?? ''"
              :disabled="loadingTemplate"
              @change="onMobileTemplateSelect"
            >
              <option value="">Select a standalone event…</option>
              <option
                v-for="ev in standaloneTemplateEvents"
                :key="String(ev.id)"
                :value="ev.id"
              >
                {{ ev.title }} — {{ ev.event_date || 'No date' }}
              </option>
            </select>
          </div>

          <div v-if="loadingSeries" class="tw:flex tw:justify-center tw:py-16">
            <Loader2 class="tw:w-8 tw:h-8 tw:animate-spin tw:text-blue-600" />
          </div>

          <form v-else class="tw:max-w-2xl" @submit.prevent="handleSubmit">
            <RecurringSeriesFormFields v-model="form" :errors="fieldErrors" />

            <RecurringSeriesPreview
              v-if="!loadingSeries"
              :schedule="form"
              class="tw:mt-6"
            />

            <div v-if="loadingTemplate" class="tw:flex tw:items-center tw:gap-2 tw:mt-6 tw:text-sm tw:text-gray-500">
              <Loader2 class="tw:w-4 tw:h-4 tw:animate-spin" />
              Loading event template...
            </div>

            <div v-else-if="!isEdit && !selectedSourceEventId" class="tw:mt-6 tw:p-4 tw:rounded-lg tw:border tw:border-dashed tw:border-gray-300 tw:bg-gray-50">
              <p class="tw:text-sm tw:text-gray-600">
                <span class="tw:hidden tw:md:inline">Choose a standalone event from the list on the left. Its title, location, category, and other details become the series template.</span>
                <span class="tw:md:hidden">Choose a standalone event from the dropdown above.</span>
              </p>
            </div>

            <template v-else>
              <RecurringEventSourcePreview
                v-if="sourceEventMeta"
                :source-event="sourceEventMeta"
                class="tw:mt-6"
              />

              <RecurringEventTemplateFields
                v-if="form.event_template"
                v-model="form.event_template"
                :categories="categories"
                :errors="fieldErrors"
                class="tw:mt-6"
              />

              <RecurringEventInviteFields
                v-if="form.event_template"
                v-model:talent-ids="invitedTalentIds"
                v-model:organiser-ids="invitedOrganiserIds"
                v-model:venue-ids="invitedVenueIds"
                class="tw:mt-6"
              />
            </template>

            <div v-if="isEdit" class="tw:mt-6 tw:space-y-4">
              <RecurringSeriesApplyToFuture v-model="applyToFuture" />

              <div class="tw:flex tw:flex-wrap tw:gap-2 tw:pt-2 tw:border-t tw:border-gray-100">
                <router-link
                  :to="`/create-event-premium/recurring-series/${seriesId}`"
                  class="tw:inline-flex tw:items-center tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-700 tw:bg-gray-100 tw:rounded-lg hover:tw:bg-gray-200"
                >
                  Manage occurrences
                </router-link>
                <button
                  type="button"
                  class="tw:inline-flex tw:items-center tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-amber-800 tw:bg-amber-100 tw:rounded-lg hover:tw:bg-amber-200"
                  @click="pauseVisible = true"
                >
                  Pause series
                </button>
                <button
                  type="button"
                  class="tw:inline-flex tw:items-center tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-red-700 tw:bg-red-50 tw:rounded-lg hover:tw:bg-red-100"
                  @click="deleteVisible = true"
                >
                  Delete series
                </button>
              </div>
            </div>

            <p v-if="fieldErrors.source_event_id" class="tw:text-xs tw:text-red-600 tw:mt-4">
              {{ fieldErrors.source_event_id[0] }}
            </p>

            <div class="tw:flex tw:items-center tw:gap-3 tw:mt-8">
              <button
                type="submit"
                :disabled="saving || loadingTemplate || (!isEdit && !selectedSourceEventId)"
                class="tw:inline-flex tw:items-center tw:gap-2 tw:px-5 tw:py-2.5 tw:text-sm tw:font-medium tw:text-white tw:bg-blue-600 tw:rounded-lg hover:tw:bg-blue-700 disabled:tw:opacity-60"
              >
                <Loader2 v-if="saving" class="tw:w-4 tw:h-4 tw:animate-spin" />
                {{ isEdit ? 'Save changes' : 'Create series' }}
              </button>
              <router-link
                to="/create-event-premium/recurring-series"
                class="tw:px-5 tw:py-2.5 tw:text-sm tw:font-medium tw:text-gray-700 tw:bg-gray-100 tw:rounded-lg hover:tw:bg-gray-200"
              >
                Cancel
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :visible="shortenEndDateConfirmVisible"
      title="Shorten series end date?"
      message="Future events after the new end date will be permanently removed, or marked cancelled when accepted invitations exist. This cannot be undone."
      confirm-label="Save changes"
      variant="danger"
      :loading="saving"
      @cancel="shortenEndDateConfirmVisible = false"
      @confirm="confirmShortenEndDate"
    />

    <ConfirmDialog
      :visible="pauseVisible"
      title="Pause recurring series?"
      message="All future events in this series will be cancelled or deleted according to invitation rules. Accepted invitees will be notified. The series record is kept so you can edit and regenerate later."
      confirm-label="Pause series"
      variant="danger"
      :loading="pausing"
      @cancel="pauseVisible = false"
      @confirm="confirmPause"
    />

    <ConfirmDialog
      :visible="deleteVisible"
      title="Delete recurring series?"
      message="This cannot be undone. Future events may be cancelled or permanently deleted depending on accepted invitations. Past events are not affected."
      confirm-label="Delete series"
      variant="danger"
      :loading="deleting"
      @cancel="deleteVisible = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import EventSidebar from './eventsidebar/Eventsidebar.vue'
import RecurringSeriesFormFields from '@/components/recurring/RecurringSeriesFormFields.vue'
import RecurringSeriesPreview from '@/components/recurring/RecurringSeriesPreview.vue'
import RecurringEventTemplateFields from '@/components/recurring/RecurringEventTemplateFields.vue'
import RecurringEventInviteFields from '@/components/recurring/RecurringEventInviteFields.vue'
import RecurringEventSourcePreview from '@/components/recurring/RecurringEventSourcePreview.vue'
import RecurringSeriesApplyToFuture from '@/components/recurring/RecurringSeriesApplyToFuture.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import {
  recurringSeriesApi,
  type RecurringEventSourceSummary,
  type RecurringEventTemplate,
  type RecurringSeriesPayload,
  type RecurringSeriesUpdatePayload,
} from '@/api/recurringSeries'
import { useMyEventStore } from '@/stores/myEventStore'
import eventService from '@/services/eventService'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chatStore'
import { createEventPremiumMenuItems } from '@/utils/menuConfig'
import { validateRecurringSchedule } from '@/utils/recurringScheduleValidation'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const myEvtStore = useMyEventStore()
const authStore = useAuthStore()
const chatStore = useChatStore()

const isPremiumUser = computed(
  () => authStore.user?.account_type === 'premium' && authStore.user?.status === 'active',
)

const seriesId = computed(() => {
  const raw = route.params.id
  return typeof raw === 'string' ? parseInt(raw, 10) : NaN
})
const isEdit = computed(() => route.name === 'RecurringSeriesEdit' && !Number.isNaN(seriesId.value))

const menuItems = createEventPremiumMenuItems

const defaultEventTemplate = (): RecurringEventTemplate => ({
  title: '',
  event_type: 'premium',
  category_id: 0,
  address: '',
  venue_name: '',
  latitude: 52.3676,
  longitude: 4.9041,
  start_time: '18:00:00',
  end_time: '21:00:00',
  description: '',
})

const defaultForm = (): RecurringSeriesPayload => ({
  recurrence_type: 'weekly',
  recurrence_rules: { weekdays: [1] },
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Amsterdam',
  start_date: new Date().toISOString().slice(0, 10),
  end_date: null,
})

const form = ref<RecurringSeriesPayload>(defaultForm())
const categories = ref<Array<{ id: number; name: string }>>([])
const selectedSourceEventId = ref<number | null>(null)
const sourceEventMeta = ref<RecurringEventSourceSummary | null>(null)
const originalEndDate = ref<string | null>(null)
const shortenEndDateConfirmVisible = ref(false)
const pendingPayload = ref<RecurringSeriesUpdatePayload | null>(null)
const applyToFuture = ref(false)
const invitedTalentIds = ref<number[]>([])
const invitedOrganiserIds = ref<number[]>([])
const invitedVenueIds = ref<number[]>([])
const fieldErrors = ref<Record<string, string[]>>({})
const loadingSeries = ref(false)
const loadingTemplate = ref(false)
const saving = ref(false)
const pauseVisible = ref(false)
const deleteVisible = ref(false)
const pausing = ref(false)
const deleting = ref(false)

interface SidebarEventRow {
  id?: number
  title?: string
  event_date?: string
  series_id?: number | null
  is_series_instance?: boolean
}

const standaloneTemplateEvents = computed(() =>
  (myEvtStore.events as SidebarEventRow[]).filter(
    (event) => !event.series_id && !event.is_series_instance,
  ),
)

function onMobileTemplateSelect(event: Event) {
  const target = event.target as HTMLSelectElement
  const id = parseInt(target.value, 10)
  if (Number.isNaN(id)) {
    selectedSourceEventId.value = null
    sourceEventMeta.value = null
    return
  }
  myEvtStore.selectEvent(id)
  void onSourceEventSelected(id)
}

function mapTemplate(raw: RecurringEventTemplate): RecurringEventTemplate {
  const mapped = {
    ...defaultEventTemplate(),
    ...raw,
    event_type: raw.event_type ?? 'premium',
    category_id: Number(raw.category_id) || 0,
    latitude: Number(raw.latitude) || 0,
    longitude: Number(raw.longitude) || 0,
  }

  invitedTalentIds.value = [...(raw.invited_talents ?? [])]
  invitedOrganiserIds.value = [...(raw.invited_organisers ?? [])]
  invitedVenueIds.value = [...(raw.invited_venues ?? [])]

  return mapped
}

function inviteFieldsForTemplate(): Pick<RecurringEventTemplate, 'invited_talents' | 'invited_organisers' | 'invited_venues'> {
  return {
    ...(invitedTalentIds.value.length ? { invited_talents: invitedTalentIds.value } : {}),
    ...(invitedOrganiserIds.value.length ? { invited_organisers: invitedOrganiserIds.value } : {}),
    ...(invitedVenueIds.value.length ? { invited_venues: invitedVenueIds.value } : {}),
  }
}

function resolveEventTemplate(data: {
  event_template?: RecurringEventTemplate
  recurrence_rules?: { event_template?: RecurringEventTemplate }
}): RecurringEventTemplate {
  const raw = data.event_template ?? data.recurrence_rules?.event_template
  if (!raw || typeof raw !== 'object') {
    return defaultEventTemplate()
  }
  return mapTemplate(raw)
}

async function fetchCategories() {
  try {
    const res = await eventService.getCategories()
    if (res.success && Array.isArray(res.data)) {
      categories.value = res.data.map((c: { id: number; name: string }) => ({ id: c.id, name: c.name }))
    }
  } catch {
    toast.error('Failed to load categories')
  }
}

async function onSourceEventSelected(eventId: number) {
  if (isEdit.value) return

  selectedSourceEventId.value = eventId
  loadingTemplate.value = true
  fieldErrors.value = {}

  try {
    const res = await recurringSeriesApi.getEventTemplate(eventId)
    if (res.success) {
      sourceEventMeta.value = res.data.source_event
      form.value.event_template = mapTemplate(res.data.event_template)
      if (res.data.source_event.event_date) {
        form.value.start_date = res.data.source_event.event_date
      }
    }
  } catch {
    toast.error('Failed to load event template')
    selectedSourceEventId.value = null
    sourceEventMeta.value = null
  } finally {
    loadingTemplate.value = false
  }
}

async function loadSeries() {
  if (!isEdit.value) return
  loadingSeries.value = true
  try {
    const res = await recurringSeriesApi.get(seriesId.value)
    if (res.success) {
      const s = res.data
      form.value = {
        recurrence_type: 'weekly',
        recurrence_rules: {
          weekdays: s.recurrence_rules?.weekdays ?? [1],
        },
        timezone: s.timezone,
        start_date: s.start_date,
        end_date: s.end_date,
        event_template: resolveEventTemplate(s),
      }
      originalEndDate.value = s.end_date

      if (s.source_event_id) {
        selectedSourceEventId.value = s.source_event_id
        sourceEventMeta.value = {
          id: s.source_event_id,
          title: form.value.event_template?.title ?? `Event #${s.source_event_id}`,
        }
      }
    }
  } catch {
    toast.error('Failed to load series')
    router.push('/create-event-premium/recurring-series')
  } finally {
    loadingSeries.value = false
  }
}

async function handleSubmit() {
  fieldErrors.value = {}

  if (!isPremiumUser.value) {
    toast.error('Recurring events are available for Premium users only.')
    return
  }

  const scheduleValidation = validateRecurringSchedule(form.value, { isPremium: isPremiumUser.value })
  if (!scheduleValidation.valid) {
    fieldErrors.value = scheduleValidation.fieldErrors
    toast.error(scheduleValidation.message ?? 'Please fix the schedule before continuing.')
    return
  }

  if (!isEdit.value && !selectedSourceEventId.value) {
    fieldErrors.value = { source_event_id: ['Select an existing event to use as the template.'] }
    toast.error('Select a template event from the sidebar')
    return
  }

  const payload: RecurringSeriesUpdatePayload = {
    ...form.value,
    recurrence_type: 'weekly',
    end_date: form.value.end_date || null,
    ...(selectedSourceEventId.value ? { source_event_id: selectedSourceEventId.value } : {}),
    ...(form.value.event_template
      ? {
          event_template: {
            ...form.value.event_template,
            ...inviteFieldsForTemplate(),
            event_type: 'premium',
          },
        }
      : {}),
    ...(isEdit.value && applyToFuture.value ? { apply_to_future: true } : {}),
  }

  if (isEdit.value && isEndDateShortened()) {
    pendingPayload.value = payload
    shortenEndDateConfirmVisible.value = true
    return
  }

  await submitPayload(payload)
}

function isEndDateShortened(): boolean {
  const previous = originalEndDate.value
  const next = form.value.end_date || null
  if (!next) return false
  if (!previous) return true
  return next < previous
}

async function confirmShortenEndDate() {
  if (!pendingPayload.value) return
  await submitPayload(pendingPayload.value)
  shortenEndDateConfirmVisible.value = false
  pendingPayload.value = null
}

async function confirmPause() {
  if (!isEdit.value || Number.isNaN(seriesId.value)) return
  pausing.value = true
  try {
    const res = await recurringSeriesApi.cancel(seriesId.value)
    const lc = res.lifecycle
    if (lc) {
      toast.success(`Series paused. ${lc.cancelled} cancelled, ${lc.deleted} removed, ${lc.notified} notified.`)
    } else {
      toast.success('Series paused')
    }
    pauseVisible.value = false
    router.push(`/create-event-premium/recurring-series/${seriesId.value}`)
  } catch (e: unknown) {
    toast.error(e instanceof Error ? e.message : 'Failed to pause series')
  } finally {
    pausing.value = false
  }
}

async function confirmDelete() {
  if (!isEdit.value || Number.isNaN(seriesId.value)) return
  deleting.value = true
  try {
    const res = await recurringSeriesApi.remove(seriesId.value)
    const lc = res.lifecycle
    if (lc) {
      toast.success(`Series deleted. ${lc.deleted} removed, ${lc.cancelled} cancelled, ${lc.notified} notified.`)
    } else {
      toast.success('Recurring series deleted')
    }
    deleteVisible.value = false
    router.push('/create-event-premium/recurring-series')
  } catch (e: unknown) {
    toast.error(e instanceof Error ? e.message : 'Delete failed')
  } finally {
    deleting.value = false
  }
}

async function submitPayload(payload: RecurringSeriesUpdatePayload | RecurringSeriesPayload) {
  saving.value = true
  fieldErrors.value = {}
  try {
    const res = isEdit.value
      ? await recurringSeriesApi.update(seriesId.value, payload as RecurringSeriesUpdatePayload)
      : await recurringSeriesApi.create(payload as RecurringSeriesPayload)

    if (res.success) {
      if (isEdit.value && res.lifecycle) {
        const lc = res.lifecycle
        toast.success(
          `Series updated. ${lc.deleted} future event(s) removed, ${lc.cancelled} cancelled, ${lc.notified} invitee(s) notified.`
        )
      } else if (isEdit.value && res.propagation) {
        const p = res.propagation
        toast.success(
          `Series updated. ${p.updated} instance(s) updated, ${p.removed} removed, ${p.generation.created} created.`
        )
      } else if (!isEdit.value && res.generation_queued) {
        toast.success('Series created. Event instances are being generated in the background.')
      } else {
        toast.success(isEdit.value ? 'Series updated' : 'Series created')
      }
      router.push('/create-event-premium/recurring-series')
    } else {
      toast.error(res.message || 'Save failed')
    }
  } catch (e: unknown) {
    const err = e as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } }
    if (err.response?.data?.errors) {
      fieldErrors.value = err.response.data.errors
    }
    toast.error(err.response?.data?.message || 'Save failed')
  } finally {
    saving.value = false
  }
}

function handleBack() {
  router.push('/')
}

function handleChatboxClick() {
  if (authStore.user?.account_type !== 'premium') {
    toast.warning('Chat is available only for premium users.')
    return
  }
  chatStore.open()
}

onMounted(async () => {
  await fetchCategories()
  if (!isEdit.value) {
    await myEvtStore.fetchMyEvents()
  }
  await loadSeries()

  const rawSource = route.query.source_event_id
  const sourceId = typeof rawSource === 'string' ? parseInt(rawSource, 10) : NaN
  if (!isEdit.value && !Number.isNaN(sourceId)) {
    myEvtStore.selectEvent(sourceId)
    await onSourceEventSelected(sourceId)
  }
})
</script>
