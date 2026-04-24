<template>
  <div class="tw:bg-white tw:rounded-2xl tw:shadow-md tw:overflow-hidden tw:border tw:border-gray-100 hover:tw:shadow-lg tw:transition-all tw:duration-200">

    <!-- ── Hero: cover only, or carousel when additional_images exist ── -->
    <div class="tw:relative tw:h-40 tw:overflow-hidden tw:rounded-t-2xl">
      <div
        class="tw:flex tw:h-full tw:transition-transform tw:duration-300 tw:ease-in-out"
        :style="{ transform: `translateX(-${heroImageIndex * 100}%)` }"
      >
        <div
          v-for="(src, idx) in heroImages"
          :key="idx"
          class="tw:h-full tw:w-full tw:flex-shrink-0"
        >
          <img :src="src" class="tw:h-full tw:w-full tw:object-cover" alt="" />
        </div>
      </div>
      <button
        v-if="heroImages.length > 1"
        type="button"
        class="tw:absolute tw:left-2 tw:top-1/2 tw:z-[3] tw:flex tw:h-7 tw:w-7 tw:-translate-y-1/2 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/90 tw:shadow-md tw:backdrop-blur-sm tw:transition-colors hover:tw:bg-white"
        :aria-label="t('eventDetails.previousImage')"
        @click.stop="prevHeroImage"
      >
        <ChevronLeftIcon class="tw:h-3.5 tw:w-3.5 tw:text-gray-700" />
      </button>
      <button
        v-if="heroImages.length > 1"
        type="button"
        class="tw:absolute tw:right-2 tw:top-1/2 tw:z-[3] tw:flex tw:h-7 tw:w-7 tw:-translate-y-1/2 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/90 tw:shadow-md tw:backdrop-blur-sm tw:transition-colors hover:tw:bg-white"
        :aria-label="t('eventDetails.nextImage')"
        @click.stop="nextHeroImage"
      >
        <ChevronRightIcon class="tw:h-3.5 tw:w-3.5 tw:text-gray-700" />
      </button>
      <div
        v-if="heroImages.length > 1"
        class="tw:absolute tw:bottom-2 tw:right-2 tw:z-[3] tw:rounded-full tw:bg-black/60 tw:px-2 tw:py-0.5 tw:text-[10px] tw:font-medium tw:text-white tw:backdrop-blur-sm"
      >
        {{ heroImageIndex + 1 }} / {{ heroImages.length }}
      </div>
      <!-- Light vignette (below countdown z-index) -->
      <div class="tw:pointer-events-none tw:absolute tw:inset-0 tw:z-[1] tw:bg-gradient-to-t tw:from-black/25 tw:to-transparent"></div>

      <!-- Bottom gradient + centered countdown (only before event start) -->
      <div
        v-if="isUpcoming"
        class="tw:absolute tw:inset-x-0 tw:bottom-0 tw:z-[2] tw:flex tw:flex-col tw:items-center tw:justify-end tw:px-3 tw:pb-3 tw:pt-14 tw:bg-gradient-to-t tw:from-black/82 tw:via-black/45 tw:to-transparent"
      >
        <div class="tw:flex tw:items-start tw:justify-center tw:gap-0">
          <template v-for="(seg, idx) in countdownSegments" :key="seg.labelKey">
            <span
              v-if="idx > 0"
              class="tw:text-2xl tw:sm:text-3xl tw:font-bold tw:text-white tw:leading-none tw:tabular-nums tw:self-start tw:pt-0.5 tw:px-0.5 tw:drop-shadow-md"
              aria-hidden="true"
            >:</span>
            <div class="tw:text-center tw:min-w-[2.1rem] sm:tw:min-w-[2.75rem]">
              <p class="tw:text-2xl tw:sm:text-3xl tw:font-bold tw:text-white tw:tabular-nums tw:leading-none tw:drop-shadow-md">
                {{ seg.display }}
              </p>
              <p class="tw:mt-1.5 tw:text-[8px] tw:sm:text-[9px] tw:font-bold tw:uppercase tw:tracking-[0.18em] tw:text-white tw:leading-none">
                {{ $t(seg.labelKey) }}
              </p>
            </div>
          </template>
        </div>
      </div>

      <!-- Live badge -->
      <div v-else-if="isLive" class="tw:absolute tw:bottom-3 tw:left-3 tw:z-[2]">
        <span class="tw:bg-red-500 tw:text-white tw:text-xs tw:font-semibold tw:px-3 tw:py-1 tw:rounded-md tw:flex tw:items-center tw:gap-1.5">
          <span class="tw:w-1.5 tw:h-1.5 tw:bg-white tw:rounded-full tw:animate-pulse tw:inline-block"></span>
          {{ $t('eventCard.liveNow') }}
        </span>
      </div>

      <!-- Finished badge -->
      <div v-else-if="isFinished" class="tw:absolute tw:bottom-3 tw:left-3 tw:z-[2]">
        <span class="tw:bg-gray-600/80 tw:text-white tw:text-xs tw:font-medium tw:px-3 tw:py-1 tw:rounded-md">
          {{ $t('eventCard.finished') }}
        </span>
      </div>

    </div>

    <!-- ── Card Body ── -->
    <div class="tw:p-3 tw:space-y-2">

      <!-- Title | Wishlist heart | Date badge (same row) -->
      <div
        class="event-card-title-row tw:grid tw:grid-cols-[minmax(0,1fr)_auto_auto] tw:items-center tw:gap-2"
      >
        <h4 class="tw:min-w-0 tw:text-base tw:font-semibold tw:text-[var(--primary-color)] tw:leading-snug tw:truncate">
          {{ event.title }}
        </h4>
        <button
          type="button"
          :aria-pressed="isWishlisted"
          :aria-label="isWishlisted ? t('eventCard.removeFromWishlist') : t('eventCard.addToWishlist')"
          @click.stop="handleWishlistToggle"
          class="event-card-wishlist-btn tw:flex tw:h-8 tw:w-8 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:border tw:transition-all tw:duration-200 tw:outline-none focus-visible:tw:ring-2 focus-visible:tw:ring-[var(--primary-color)]/40 focus-visible:tw:ring-offset-1"
          :class="wishlistButtonClass"
          :aria-busy="isWishlistPending"
        >
          <svg
            class="tw:w-4 tw:h-4 tw:transition-all tw:duration-200"
            :class="wishlistIconClass"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        <div class="tw:flex-shrink-0 tw:rounded-lg tw:overflow-hidden tw:text-center tw:min-w-[42px]">
          <p class="tw:text-[9px] tw:font-bold tw:uppercase tw:tracking-wide tw:bg-orange-500 tw:text-white tw:py-1 tw:px-1 tw:leading-none">
            {{ new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' }) }}
          </p>
          <p class="tw:text-sm tw:font-bold tw:bg-orange-50 tw:text-orange-500 tw:py-0.5 tw:px-1 tw:leading-tight">
            {{ new Date(event.event_date).getDate() }}
          </p>
        </div>
      </div>

      <!-- Detail rows -->
      <div class="tw:space-y-1.5">

        <!-- Date / Time -->
        <div class="tw:flex tw:items-start tw:gap-2">
          <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:mt-0.5 tw:text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span class="tw:text-sm tw:text-[var(--primary-color)] tw:leading-snug">{{ formatDateTime(event.end_datetime) }}</span>
        </div>

        <!-- Location -->
        <div class="tw:flex tw:items-start tw:gap-2">
          <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:mt-0.5 tw:text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="tw:text-sm tw:text-[var(--primary-color)] tw:underline tw:cursor-pointer tw:leading-snug" style="width: 290px;">{{ event.address }}</span>
        </div>

        <!-- Category + Price (2-col) -->
        <div class="tw:grid tw:grid-cols-2 tw:gap-x-2 tw:gap-y-1.5">
          <div class="tw:flex tw:items-center tw:gap-1.5">
            <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
            <span class="tw:text-xs tw:text-[var(--primary-color)] tw:truncate">{{ event.category == null ? 'N/A' : event.category.name }}</span>
          </div>
          <!-- Dresscode + Age (same 2-col grid row) -->
          <div class="tw:flex tw:items-center tw:gap-1.5">
            <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="tw:text-xs tw:text-[var(--primary-color)] tw:truncate">{{ formatLabel(event.dresscode) }}</span>
          </div>
          <div class="tw:flex tw:items-center tw:gap-1.5">
            <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="tw:text-xs tw:text-[var(--primary-color)] tw:truncate">{{ formatLabel(event.age_limit) }}</span>
          </div>
          <!-- Entrance status -->
          <div class="tw:flex tw:items-center tw:gap-1.5">
            <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 012-2h6M9 19h6m-6 0l3.553 3.553a1 1 0 001.414 0L21 13M5 10h2a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z"/>
            </svg>
            <span class="tw:text-xs tw:text-[var(--primary-color)] tw:truncate">{{ formatLabel(event.entrance_status) }}</span>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="tw:flex tw:gap-2 tw:pt-2 tw:border-t tw:border-gray-100">
        <button
          type="button"
          :disabled="!hasMapCoordinates"
          @click.stop="handleRouteClick"
          class="tw:flex-1 tw:text-sm tw:px-2 tw:py-1.5 tw:rounded-lg tw:border tw:border-[var(--primary-color)]/35 tw:text-[var(--primary-color)] tw:bg-white tw:flex tw:items-center tw:justify-center tw:gap-1 tw:transition-all tw:duration-200 hover:tw:bg-blue-50/90 hover:tw:border-[var(--primary-color)]/50 disabled:tw:opacity-40 disabled:tw:pointer-events-none disabled:hover:tw:bg-white"
        >
          <svg class="tw:w-3.5 tw:h-3.5 tw:shrink-0 tw:text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          </svg>
          {{ $t('eventCard.route') }}
        </button>
        <button
          v-if="!hideViewEvent"
          @click="emit('viewEvent', event)"
          class="tw:flex-1 tw:text-sm tw:px-2 tw:py-1.5 tw:rounded-lg tw:bg-orange-500 tw:text-white tw:border tw:border-orange-500 tw:flex tw:items-center tw:justify-center tw:gap-1 tw:transition-all tw:duration-200 hover:tw:bg-orange-600"
        >
          {{ $t('eventCard.viewEvent') }}
          <svg class="tw:w-3.5 tw:h-3.5 tw:shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

    </div>
  </div>
</template>



<!-- <script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import DetailRow from './DetailedRow.vue'

const { t } = useI18n()

const props = defineProps({ event: Object })

const emit = defineEmits(['viewEvent'])

const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let interval

const updateCountdown = () => {
    // Use start_datetime for accurate countdown
    const target = new Date(props.event.start_datetime).getTime()
    const now = Date.now()
    const diff = Math.max(0, target - now)

    countdown.value = {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    }
}

onMounted(() => {
    updateCountdown()
    interval = setInterval(updateCountdown, 1000)
})

onBeforeUnmount(() => clearInterval(interval))
</script> -->

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
import router from '@/router'
import DetailRow from './DetailedRow.vue'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useAuthStore } from '@/stores/auth'
import { requestEventMapFocus } from '@/utils/mapEventFocus'
import { buildEventGalleryImageUrls } from '@/utils/eventGalleryImages'

const { t } = useI18n()
const wishlistStore = useWishlistStore()
const authStore = useAuthStore()

const props = defineProps({ 
  event: Object,
  hideViewEvent: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['viewEvent'])

const heroImageIndex = ref(0)
const heroImages = computed(() => {
  const urls = buildEventGalleryImageUrls(props.event || {})
  if (urls.length > 0) return urls
  const dummyImage = new URL('../assets/dummy-event.png', import.meta.url).href
  return [dummyImage]
})

function prevHeroImage() {
  const n = heroImages.value.length
  if (n <= 1) return
  heroImageIndex.value = (heroImageIndex.value - 1 + n) % n
}

function nextHeroImage() {
  const n = heroImages.value.length
  if (n <= 1) return
  heroImageIndex.value = (heroImageIndex.value + 1) % n
}

watch(heroImages, (urls) => {
  if (heroImageIndex.value >= urls.length) heroImageIndex.value = 0
})

function getEventCoordinates(ev) {
    if (!ev) return null
    const lat = ev.lat ?? ev.latitude
    const lng = ev.lng ?? ev.longitude
    if (lat == null || lng == null) return null
    const la = Number(lat)
    const ln = Number(lng)
    if (!Number.isFinite(la) || !Number.isFinite(ln)) return null
    return { lat: la, lng: ln }
}

const hasMapCoordinates = computed(() => getEventCoordinates(props.event) != null)

function handleRouteClick() {
    const c = getEventCoordinates(props.event)
    if (!c) return
    requestEventMapFocus(c.lat, c.lng)
}

function formatDateTime(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

/* ------------------ WISHLIST (optimistic in store; pending = block double-click) ------------------ */
const isWishlisted = computed(() => wishlistStore.isWishlisted(props.event.id))
const isWishlistPending = computed(() => wishlistStore.isWishlistPending(props.event.id))

const wishlistButtonClass = computed(() => {
  const base =
    'tw:transition-all tw:duration-200 tw:hover:scale-[1.04] active:tw:scale-[0.98]'
  const pending = isWishlistPending.value
    ? 'tw:pointer-events-none tw:opacity-90 tw:cursor-wait tw:hover:scale-100 active:tw:scale-100'
    : ''
  if (isWishlisted.value) {
    return `${base} ${pending} tw:border-[var(--primary-color)] tw:bg-[var(--primary-color)] tw:shadow-sm hover:tw:brightness-95`
  }
  return `${base} ${pending} tw:border-[var(--primary-color)]/40 tw:bg-white tw:text-[var(--primary-color)] hover:tw:border-[var(--primary-color)] hover:tw:bg-blue-50/90`
})

const wishlistIconClass = computed(() => {
  if (isWishlisted.value) {
    return 'tw:text-white tw:fill-white tw:stroke-white'
  }
  return 'tw:text-[var(--primary-color)] tw:fill-none tw:stroke-[var(--primary-color)]'
})

async function handleWishlistToggle() {
    if (!authStore.isAuthenticated) {
        await router.push({ name: 'Login' })
        return
    }
    await wishlistStore.toggleWishlist(props.event)
}

const formatLabel = (value) => {
  if (!value) return ''

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

/* ------------------ TIME VALUES (API may send full ISO or date + time fragment) ------------------ */
function normalizeEventDatePart(dateStr) {
    if (dateStr == null || dateStr === '') return ''
    const d = String(dateStr).trim()
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(d)) {
        const [dd, mm, yyyy] = d.split('/')
        return `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`
    }
    return d
}

/**
 * Epoch ms for start or end. v2 adapter often sets start_datetime to full ISO;
 * legacy shape uses event_date + time-only string — both must work.
 */
function parseEventInstantMs(ev, field) {
    const raw = field === 'start' ? ev?.start_datetime : ev?.end_datetime
    if (raw == null || raw === '') return NaN
    const s = String(raw).trim()
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
        const t = new Date(s.includes('T') ? s : s.replace(' ', 'T'))
        if (!isNaN(t.getTime())) return t.getTime()
    }
    if (s.includes('T')) {
        const t = new Date(s)
        if (!isNaN(t.getTime())) return t.getTime()
    }
    const datePart = normalizeEventDatePart(ev?.event_date)
    if (datePart) {
        const t = new Date(`${datePart}T${s}`)
        if (!isNaN(t.getTime())) return t.getTime()
    }
    const t = new Date(s)
    return isNaN(t.getTime()) ? NaN : t.getTime()
}

const start = computed(() => parseEventInstantMs(props.event, 'start'))

const end = computed(() => {
    let e = parseEventInstantMs(props.event, 'end')
    const s = start.value
    if (isNaN(e) && !isNaN(s)) {
        e = s + 24 * 60 * 60 * 1000
    }
    return e
})

/* ------------------ STATE FLAGS ------------------ */
const isUpcoming = computed(() => {
    const s = start.value
    return !isNaN(s) && Date.now() < s
})

const isLive = computed(() => {
    const s = start.value
    const en = end.value
    if (isNaN(s) || isNaN(en)) return false
    const now = Date.now()
    return now >= s && now <= en
})

const isFinished = computed(() => {
    const en = end.value
    if (isNaN(en)) return false
    return Date.now() > en
})

/* ------------------ COUNTDOWN ------------------ */
const countdown = ref({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
})

/** Centered overlay: DD : HH : MM : SS with i18n labels (screenshot layout) */
const countdownSegments = computed(() => {
    const c = countdown.value
    const d = Math.max(0, c.days)
    const dayDisplay = d > 99 ? String(d) : String(d).padStart(2, '0')
    const pad2 = (n) => String(Math.max(0, n)).padStart(2, '0')
    return [
        { display: dayDisplay, labelKey: 'eventCard.countdownDays' },
        { display: pad2(c.hours), labelKey: 'eventCard.countdownHours' },
        { display: pad2(c.minutes), labelKey: 'eventCard.countdownMinutes' },
        { display: pad2(c.seconds), labelKey: 'eventCard.countdownSeconds' }
    ]
})

let interval = null

function updateCountdown() {
    const st = start.value
    if (isNaN(st)) return
    const now = Date.now()

    if (now >= st) {
        if (interval) {
            clearInterval(interval)
            interval = null
        }
        return
    }

    const diff = st - now

    countdown.value = {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    }
}

function startCountdownInterval() {
    if (interval) {
        clearInterval(interval)
        interval = null
    }
    const st = start.value
    if (isNaN(st) || Date.now() >= st) return
    updateCountdown()
    interval = setInterval(updateCountdown, 1000)
}

/* ------------------ LIFECYCLE ------------------ */
onMounted(() => {
    startCountdownInterval()
})

watch(
    () => props.event?.id,
    () => {
        heroImageIndex.value = 0
        startCountdownInterval()
    }
)

onBeforeUnmount(() => {
    if (interval) {
        clearInterval(interval)
        interval = null
    }
})
</script>
