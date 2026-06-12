<template>
  <div
    ref="rootRef"
    class="events-chips tw:flex tw:flex-wrap tw:gap-2 tw:px-4 tw:pt-3 tw:pb-2 tw:flex-shrink-0 tw:relative tw:z-[100]"
  >
    <!-- Subcategories -->
    <div class="tw:relative tw:flex-shrink-0">
      <button
        ref="subBtnRef"
        type="button"
        :disabled="disabledSubcategories"
        @click.stop="openSubMenu"
        class="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-[#FF7700]/35 tw:text-sm tw:whitespace-nowrap tw:bg-white tw:transition-colors tw:max-w-[min(200px,46vw)]"
        :class="
          disabledSubcategories
            ? 'tw:opacity-50 tw:cursor-not-allowed tw:text-gray-500'
            : 'tw:text-gray-700 hover:tw:bg-[#FF7700]/5'
        "
      >
        <span class="tw:truncate">{{ subcategoryLabel }}</span>
        <ChevronDown class="tw:w-3.5 tw:h-3.5 tw:text-gray-400 tw:flex-shrink-0" aria-hidden="true" />
      </button>
    </div>

    <!-- Time range (events list only) -->
    <div v-if="showTimeRange" class="tw:relative tw:flex-shrink-0">
      <button
        ref="timeBtnRef"
        type="button"
        @click.stop="openTimeMenu"
        class="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-[#FF7700]/35 tw:text-sm tw:whitespace-nowrap tw:text-gray-700 tw:bg-white hover:tw:bg-[#FF7700]/5 tw:transition-colors tw:max-w-[min(220px,52vw)]"
      >
        <span class="tw:truncate">{{ timeRangeLabel }}</span>
        <ChevronDown class="tw:w-3.5 tw:h-3.5 tw:text-gray-400 tw:flex-shrink-0" aria-hidden="true" />
      </button>
    </div>

    <!-- Venue opening hours window (venues discovery list) -->
    <div v-if="showVenueHoursFilter" class="tw:relative tw:flex-shrink-0">
      <button
        ref="hoursBtnRef"
        type="button"
        @click.stop="openVenueHoursMenu"
        class="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-[#FF7700]/35 tw:text-sm tw:whitespace-nowrap tw:text-gray-700 tw:bg-white hover:tw:bg-[#FF7700]/5 tw:transition-colors tw:max-w-[min(220px,52vw)]"
      >
        <span class="tw:truncate">{{ venueHoursLabel }}</span>
        <ChevronDown class="tw:w-3.5 tw:h-3.5 tw:text-gray-400 tw:flex-shrink-0" aria-hidden="true" />
      </button>
    </div>
  </div>

  <!-- Portaled to body so parent overflow / stacking does not clip or hide menus -->
  <Teleport to="body">
    <div
      v-show="openMenu === 'sub'"
      ref="subPanelRef"
      class="map-filter-dropdown tw:fixed tw:min-w-[220px] tw:max-w-[min(100vw-2rem,280px)] tw:rounded-xl tw:border tw:border-[#FF7700]/35 tw:bg-white tw:shadow-xl tw:py-0 tw:overflow-hidden tw:flex tw:flex-col"
      :style="subPanelStyle"
      role="dialog"
      aria-label="Subcategories"
    >
      <div
        class="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:px-3 tw:py-2.5 tw:border-b tw:border-gray-100 tw:bg-gray-50/80"
      >
        <span class="tw:text-sm tw:font-semibold tw:text-gray-900">All Subcategories</span>
        <button
          type="button"
          class="no-hover tw:flex tw:h-8 tw:w-8 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:text-gray-500 tw:transition-colors hover:tw:bg-gray-200/80 hover:tw:text-gray-800 focus:tw:outline-none focus-visible:tw:ring-2 focus-visible:tw:ring-[var(--secondary-color)]/40"
          aria-label="Close subcategories menu"
          @click="closeSubMenu"
        >
          <X class="tw:h-4 tw:w-4" aria-hidden="true" stroke-width="2" />
        </button>
      </div>
      <button
        type="button"
        class="no-hover tw:w-full tw:px-3 tw:py-2 tw:text-left tw:text-sm tw:font-medium tw:text-[var(--secondary-color)] hover:tw:bg-orange-50/60 tw:border-b tw:border-gray-100"
        @click="onClearSubcategories"
      >
        Reset to all subcategories
      </button>
      <div
        v-if="!availableSubcategories.length"
        class="tw:px-3 tw:py-2 tw:text-xs tw:text-gray-500"
      >
        {{ disabledSubcategories ? 'Select a category in the header first.' : 'No subcategories for this category.' }}
      </div>
      <div v-else class="tw:max-h-48 tw:overflow-y-auto tw:min-h-0">
        <label
          v-for="sub in availableSubcategories"
          :key="sub.id"
          class="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 hover:tw:bg-gray-50 tw:cursor-pointer"
        >
          <input
            type="checkbox"
            class="tw:rounded tw:border-[#FF7700]/45 tw:text-[var(--secondary-color,#FF7700)] tw:focus:ring-[var(--secondary-color,#FF7700)]/25"
            :checked="selectedSlugs.includes(sub.slug)"
            @change="emit('toggle-subcategory', sub.slug)"
          />
          <span class="tw:text-sm tw:text-gray-800">{{ sub.name }}</span>
        </label>
      </div>
    </div>

    <div
      v-show="showTimeRange && openMenu === 'time'"
      ref="timePanelRef"
      class="map-filter-dropdown tw:fixed tw:w-[248px] tw:rounded-xl tw:border tw:border-[#FF7700]/35 tw:bg-white tw:shadow-xl tw:p-3"
      :style="timePanelStyle"
    >
      <div class="tw:space-y-2">
        <div>
          <label class="tw:block tw:text-xs tw:font-medium tw:text-gray-500 tw:mb-1">{{ t('dateLocation.startTime') }}</label>
          <input
            type="time"
            :value="startTime || ''"
            step="60"
            class="tw:w-full tw:rounded-lg tw:border tw:border-[#FF7700]/35 tw:px-2 tw:py-1.5 tw:text-sm tw:outline-none focus:tw:ring-2 focus:tw:ring-[var(--secondary-color,#FF7700)]/30 focus:tw:border-[#FF7700]"
            @input="onStartInput($event)"
          />
        </div>
        <div>
          <label class="tw:block tw:text-xs tw:font-medium tw:text-gray-500 tw:mb-1">{{ t('dateLocation.endTime') }}</label>
          <input
            type="time"
            :value="endTime || ''"
            step="60"
            class="tw:w-full tw:rounded-lg tw:border tw:border-[#FF7700]/35 tw:px-2 tw:py-1.5 tw:text-sm tw:outline-none focus:tw:ring-2 focus:tw:ring-[var(--secondary-color,#FF7700)]/30 focus:tw:border-[#FF7700]"
            @input="onEndInput($event)"
          />
        </div>
        <button
          type="button"
          class="tw:w-full tw:mt-1 tw:py-1.5 tw:text-xs tw:text-gray-500 hover:tw:text-gray-800 tw:rounded-md hover:tw:bg-gray-50"
          @click="onClearTimes"
        >
          {{ t('mapListingFilter.clearTimes') }}
        </button>
      </div>
    </div>

    <div
      v-show="showVenueHoursFilter && openMenu === 'hours'"
      ref="hoursPanelRef"
      class="map-filter-dropdown tw:fixed tw:w-[248px] tw:rounded-xl tw:border tw:border-[#FF7700]/35 tw:bg-white tw:shadow-xl tw:p-3"
      :style="hoursPanelStyle"
    >
      <div class="tw:space-y-2">
        <div>
          <label class="tw:block tw:text-xs tw:font-medium tw:text-gray-500 tw:mb-1">{{ t('mapListingFilter.venueOpensAt') }}</label>
          <input
            type="time"
            :value="venueOpenTime || ''"
            step="60"
            class="tw:w-full tw:rounded-lg tw:border tw:border-[#FF7700]/35 tw:px-2 tw:py-1.5 tw:text-sm tw:outline-none focus:tw:ring-2 focus:tw:ring-[var(--secondary-color,#FF7700)]/30 focus:tw:border-[#FF7700]"
            @input="onVenueOpenInput($event)"
          />
        </div>
        <div>
          <label class="tw:block tw:text-xs tw:font-medium tw:text-gray-500 tw:mb-1">{{ t('mapListingFilter.venueClosesAt') }}</label>
          <input
            type="time"
            :value="venueCloseTime || ''"
            step="60"
            class="tw:w-full tw:rounded-lg tw:border tw:border-[#FF7700]/35 tw:px-2 tw:py-1.5 tw:text-sm tw:outline-none focus:tw:ring-2 focus:tw:ring-[var(--secondary-color,#FF7700)]/30 focus:tw:border-[#FF7700]"
            @input="onVenueCloseInput($event)"
          />
        </div>
        <button
          type="button"
          class="tw:w-full tw:mt-1 tw:py-1.5 tw:text-xs tw:text-gray-500 hover:tw:text-gray-800 tw:rounded-md hover:tw:bg-gray-50"
          @click="onClearVenueHours"
        >
          {{ t('mapListingFilter.clearTimes') }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown, X } from 'lucide-vue-next'
import type { Subcategory } from '@/api/categories'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    availableSubcategories: Subcategory[]
    selectedSlugs: string[]
    startTime: string | null
    endTime: string | null
    disabledSubcategories?: boolean
    /** When false, hide the event time window pill. */
    showTimeRange?: boolean
    /** When true, show venue opening-hours filter (venues discovery). */
    showVenueHoursFilter?: boolean
    venueOpenTime?: string | null
    venueCloseTime?: string | null
  }>(),
  {
    disabledSubcategories: false,
    showTimeRange: true,
    showVenueHoursFilter: false,
    venueOpenTime: null,
    venueCloseTime: null,
  }
)

const emit = defineEmits<{
  (e: 'toggle-subcategory', slug: string): void
  (e: 'clear-subcategories'): void
  (e: 'update:startTime', value: string | null): void
  (e: 'update:endTime', value: string | null): void
  (e: 'update:venueOpenTime', value: string | null): void
  (e: 'update:venueCloseTime', value: string | null): void
}>()

const openMenu = ref<'sub' | 'time' | 'hours' | null>(null)
const rootRef = ref<HTMLElement | null>(null)
const subBtnRef = ref<HTMLButtonElement | null>(null)
const timeBtnRef = ref<HTMLButtonElement | null>(null)
const hoursBtnRef = ref<HTMLButtonElement | null>(null)
const subPanelRef = ref<HTMLElement | null>(null)
const timePanelRef = ref<HTMLElement | null>(null)
const hoursPanelRef = ref<HTMLElement | null>(null)

const subPanelStyle = ref<Record<string, string>>({})
const timePanelStyle = ref<Record<string, string>>({})
const hoursPanelStyle = ref<Record<string, string>>({})

const DROPDOWN_Z = 2147483000

function positionFixedBelowTrigger(
  btn: HTMLElement | null,
  styleRef: typeof subPanelStyle,
  opts?: { panelWidth?: number; maxListHeight?: number }
) {
  if (!btn) {
    styleRef.value = { display: 'none' }
    return
  }
  const r = btn.getBoundingClientRect()
  const pad = 8
  const defaultW = Math.min(280, window.innerWidth - pad * 2)
  const panelW = opts?.panelWidth ?? defaultW
  const maxW = Math.min(panelW, window.innerWidth - pad * 2)
  let left = r.left
  if (left + maxW > window.innerWidth - pad) {
    left = Math.max(pad, window.innerWidth - pad - maxW)
  }
  const top = r.bottom + 6
  const listMax = opts?.maxListHeight ?? 320
  styleRef.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    width: `${maxW}px`,
    zIndex: String(DROPDOWN_Z),
    maxHeight: `min(${listMax}px, calc(100vh - ${top + pad}px))`
  }
}

function updatePositions() {
  if (openMenu.value === 'sub') {
    positionFixedBelowTrigger(subBtnRef.value, subPanelStyle, { maxListHeight: 320 })
  } else if (openMenu.value === 'time') {
    positionFixedBelowTrigger(timeBtnRef.value, timePanelStyle, { panelWidth: 248, maxListHeight: 400 })
  } else if (openMenu.value === 'hours') {
    positionFixedBelowTrigger(hoursBtnRef.value, hoursPanelStyle, { panelWidth: 248, maxListHeight: 400 })
  }
}

function openSubMenu() {
  if (props.disabledSubcategories) return
  openMenu.value = openMenu.value === 'sub' ? null : 'sub'
}

function openTimeMenu() {
  openMenu.value = openMenu.value === 'time' ? null : 'time'
}

function openVenueHoursMenu() {
  openMenu.value = openMenu.value === 'hours' ? null : 'hours'
}

function closeSubMenu() {
  openMenu.value = null
}

watch(openMenu, () => {
  nextTick(() => updatePositions())
})

watch(
  () => props.showTimeRange,
  (show) => {
    if (!show && openMenu.value === 'time') openMenu.value = null
  },
)

watch(
  () => props.showVenueHoursFilter,
  (show) => {
    if (!show && openMenu.value === 'hours') openMenu.value = null
  },
)

onMounted(() => {
  window.addEventListener('scroll', updatePositions, true)
  window.addEventListener('resize', updatePositions)
  document.addEventListener('pointerdown', onDocPointerDown, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updatePositions, true)
  window.removeEventListener('resize', updatePositions)
  document.removeEventListener('pointerdown', onDocPointerDown, true)
})

function onDocPointerDown(e: MouseEvent) {
  const target = e.target as Node
  const insideRoot = rootRef.value?.contains(target)
  const insideSub = subPanelRef.value?.contains(target)
  const insideTime = timePanelRef.value?.contains(target)
  const insideHours = hoursPanelRef.value?.contains(target)
  if (insideRoot || insideSub || insideTime || insideHours) return
  openMenu.value = null
}

const subcategoryLabel = computed(() => {
  if (props.disabledSubcategories) return 'Subcategories'
  if (!props.availableSubcategories.length) return 'Subcategories'
  const n = props.selectedSlugs.length
  if (n === 0) return 'All Subcategories'
  if (n === 1) {
    const s = props.availableSubcategories.find((x) => x.slug === props.selectedSlugs[0])
    return s?.name ?? props.selectedSlugs[0]
  }
  if (n <= 2) {
    return props.selectedSlugs
      .map((slug) => props.availableSubcategories.find((x) => x.slug === slug)?.name ?? slug)
      .join(', ')
  }
  return `${n} selected`
})

const timeRangeLabel = computed(() => {
  const a = props.startTime?.trim()
  const b = props.endTime?.trim()
  if (a && b) return `${formatTimeDisplay(a)} – ${formatTimeDisplay(b)}`
  if (a) return `${formatTimeDisplay(a)} – …`
  if (b) return `… – ${formatTimeDisplay(b)}`
  return t('mapListingFilter.timeRange')
})

const venueHoursLabel = computed(() => {
  const a = props.venueOpenTime?.trim()
  const b = props.venueCloseTime?.trim()
  if (a && b) return `${formatTimeDisplay(a)} – ${formatTimeDisplay(b)}`
  if (a) return `${formatTimeDisplay(a)} – …`
  if (b) return `… – ${formatTimeDisplay(b)}`
  return t('mapListingFilter.venueHours')
})

function formatTimeDisplay(t: string) {
  return t.length >= 5 ? t.slice(0, 5) : t
}

function onClearSubcategories() {
  emit('clear-subcategories')
}

function onClearTimes() {
  emit('update:startTime', null)
  emit('update:endTime', null)
}

function onStartInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:startTime', v || null)
}

function onEndInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:endTime', v || null)
}

function onClearVenueHours() {
  emit('update:venueOpenTime', null)
  emit('update:venueCloseTime', null)
}

function onVenueOpenInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:venueOpenTime', v || null)
}

function onVenueCloseInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:venueCloseTime', v || null)
}
</script>

<style scoped>
.map-filter-dropdown {
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.08),
    0 4px 6px -4px rgb(0 0 0 / 0.06);
}
</style>
