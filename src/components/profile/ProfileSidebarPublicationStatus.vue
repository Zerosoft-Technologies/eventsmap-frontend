<template>
  <div class="tw:relative tw:shrink-0" @click.stop @keydown.stop>
    <button
      ref="buttonRef"
      type="button"
      class="tw:inline-flex tw:items-center tw:gap-1 tw:max-w-[10.5rem] tw:rounded-full tw:border tw:px-2.5 tw:py-1 tw:text-xs tw:font-medium tw:transition focus:tw:outline-none focus-visible:tw:ring-2 focus-visible:tw:ring-[#0061FF] focus-visible:tw:ring-offset-1 disabled:tw:opacity-60 disabled:tw:pointer-events-none"
      :class="pillClass"
      :disabled="loading"
      :aria-label="ariaLabel"
      :aria-expanded="open"
      :aria-controls="menuId"
      :aria-busy="loading"
      aria-haspopup="menu"
      @keydown="onTriggerKeydown"
      @click="toggleMenu"
    >
      <Loader2
        v-if="loading"
        class="tw:w-3.5 tw:h-3.5 tw:animate-spin tw:shrink-0"
        aria-hidden="true"
      />
      <span class="tw:truncate">{{ displayLabel }}</span>
      <ChevronDown
        class="tw:w-3.5 tw:h-3.5 tw:opacity-70 tw:shrink-0"
        :class="open ? 'tw:rotate-180' : ''"
        aria-hidden="true"
      />
    </button>

    <div
      :id="liveRegionId"
      class="tw:sr-only"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ liveMessage }}
    </div>

    <div
      v-show="open"
      :id="menuId"
      ref="menuRef"
      role="menu"
      class="tw:absolute tw:right-0 tw:top-[calc(100%+0.35rem)] tw:z-40 tw:min-w-[11rem] tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:py-1 tw:shadow-lg"
      @keydown="onMenuKeydown"
    >
      <button
        v-for="opt in pickerOptions"
        :key="opt"
        type="button"
        role="menuitemradio"
        class="tw:flex tw:w-full tw:items-center tw:px-3 tw:py-2 tw:text-left tw:text-sm tw:text-gray-800 hover:tw:bg-gray-50 focus:tw:outline-none focus:tw:bg-gray-50"
        :aria-checked="opt === currentSlug"
        @click="selectStatus(opt)"
      >
        <span
          class="tw:mr-2 tw:h-2 tw:w-2 tw:rounded-full tw:shrink-0"
          :class="dotClass(opt)"
          aria-hidden="true"
        />
        {{ labelForSlug(opt) }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { ChevronDown, Loader2 } from 'lucide-vue-next'
import { publicationStatusPillClass } from '@/utils/profilePublicationStatusStyles'
import { useProfilePublicationMeta } from '@/composables/useProfilePublicationMeta'
import { patchProfilePublicationStatus } from '@/services/profilePublicationStatusService'
import { useMyEventStore } from '@/stores/myEventStore'
import { useMyTalentStore } from '@/stores/myTalentStore'
import { useMyVenueStore } from '@/stores/myVenueStore'
import { useMyOrganiserStore } from '@/stores/myOrganiserStore'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  resourceType: {
    type: String,
    required: true,
    validator: (v) => ['events', 'talents', 'venues', 'organisers'].includes(v),
  },
  item: {
    type: Object,
    required: true,
  },
})

const { meta, ensureLoaded } = useProfilePublicationMeta()
const toast = useToast()
const myEventStore = useMyEventStore()
const myTalentStore = useMyTalentStore()
const myVenueStore = useMyVenueStore()
const myOrganiserStore = useMyOrganiserStore()

const open = ref(false)
const loading = ref(false)
const menuRef = ref(null)
const buttonRef = ref(null)
const liveMessage = ref('')

const menuId = computed(
  () => `profile-pub-menu-${props.resourceType}-${props.item.id}`,
)
const liveRegionId = computed(
  () => `profile-pub-live-${props.resourceType}-${props.item.id}`,
)

const profileTitle = computed(() => {
  const t = props.item.title
  const n = props.item.name
  if (typeof t === 'string' && t.trim()) return t.trim()
  if (typeof n === 'string' && n.trim()) return n.trim()
  return 'Profile'
})

const ariaLabel = computed(
  () => `Publication status for ${profileTitle.value}`,
)

const mergedLabels = computed(() => {
  const fromMeta = meta.value?.labels ?? {}
  const fromItem = props.item.labels
  const itemLabels =
    fromItem && typeof fromItem === 'object' && !Array.isArray(fromItem)
      ? fromItem
      : {}
  return { ...fromMeta, ...itemLabels }
})

const pickerOptions = computed(() => {
  const fromItem = props.item.sidebar_options
  const itemList = Array.isArray(fromItem)
    ? fromItem.map((s) => String(s))
    : null
  const fromMeta = meta.value?.sidebar_options ?? []
  const raw =
    itemList && itemList.length > 0
      ? itemList
      : fromMeta.length > 0
        ? fromMeta
        : ['upcoming', 'completed', 'suspended', 'cancelled']
  return raw.filter((s) => String(s).toLowerCase() !== 'draft')
})

const currentSlug = computed(() =>
  String(props.item.status ?? 'draft').toLowerCase(),
)

const displayLabel = computed(() => {
  const slug = currentSlug.value
  if (typeof props.item.status_label === 'string' && props.item.status_label)
    return props.item.status_label
  const fromMap = mergedLabels.value[slug]
  if (fromMap) return fromMap
  return slug.replace(/_/g, ' ') || '—'
})

const pillClass = computed(() => publicationStatusPillClass(currentSlug.value))

function labelForSlug(slug) {
  return mergedLabels.value[slug] || slug.replace(/_/g, ' ')
}

function dotClass(slug) {
  const s = slug.toLowerCase()
  if (s === 'upcoming') return 'tw:bg-sky-500'
  if (s === 'completed') return 'tw:bg-emerald-500'
  if (s === 'suspended') return 'tw:bg-amber-500'
  if (s === 'cancelled') return 'tw:bg-gray-400'
  return 'tw:bg-slate-400'
}

function applyStore(status, status_label) {
  const id = Number(props.item.id)
  const patch = {}
  if (status != null) patch.status = status
  if (status_label != null) patch.status_label = status_label
  if (props.resourceType === 'events') myEventStore.mergeListItem(id, patch)
  else if (props.resourceType === 'talents') myTalentStore.mergeListItem(id, patch)
  else if (props.resourceType === 'venues') myVenueStore.mergeListItem(id, patch)
  else myOrganiserStore.mergeListItem(id, patch)
}

function announce(msg) {
  liveMessage.value = ''
  nextTick(() => {
    liveMessage.value = msg
  })
}

function closeMenu() {
  open.value = false
}

function toggleMenu() {
  if (loading.value) return
  open.value = !open.value
}

async function selectStatus(slug) {
  if (loading.value) return
  closeMenu()
  if (slug === currentSlug.value) return

  loading.value = true
  try {
    const res = await patchProfilePublicationStatus(
      props.resourceType,
      Number(props.item.id),
      slug,
    )
    const payload = res?.data
    const st = payload?.status ?? slug
    const lbl = payload?.status_label ?? labelForSlug(st)
    applyStore(st, lbl)
    announce(`Publication status changed to ${lbl}`)
  } catch (err) {
    toast.error(
      err?.response?.data?.message ||
        err?.message ||
        'Could not update publication status',
    )
  } finally {
    loading.value = false
    buttonRef.value?.focus()
  }
}

function onDocumentMouseDown(e) {
  if (!open.value) return
  const t = e.target
  if (menuRef.value?.contains(t) || buttonRef.value?.contains(t)) return
  closeMenu()
}

function onTriggerKeydown(e) {
  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (!open.value) open.value = true
    nextTick(focusFirstMenuitem)
  }
  if (e.key === 'Escape') closeMenu()
}

function getMenuButtons() {
  const root = menuRef.value
  if (!root) return []
  return Array.from(root.querySelectorAll('[role="menuitemradio"]'))
}

function focusFirstMenuitem() {
  const items = getMenuButtons()
  items[0]?.focus()
}

function focusMenuitem(delta) {
  const items = getMenuButtons()
  if (!items.length) return
  const current = items.findIndex((el) => el === document.activeElement)
  let next = current < 0 ? 0 : current + delta
  if (next < 0) next = items.length - 1
  if (next >= items.length) next = 0
  items[next]?.focus()
}

function onMenuKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    closeMenu()
    buttonRef.value?.focus()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusMenuitem(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    focusMenuitem(-1)
  }
}

watch(open, (v) => {
  if (v) nextTick(focusFirstMenuitem)
})

onMounted(() => {
  ensureLoaded()
  document.addEventListener('mousedown', onDocumentMouseDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMouseDown)
})
</script>
