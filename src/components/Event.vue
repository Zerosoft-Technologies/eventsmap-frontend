<template>
  <div class="tw:bg-white tw:rounded-2xl tw:shadow-md tw:overflow-hidden tw:border tw:border-gray-100 hover:tw:shadow-lg tw:transition-all tw:duration-200">

    <!-- ── Hero Image ── -->
    <div class="tw:relative tw:h-40 tw:overflow-hidden">
      <img :src="event.cover_image" class="tw:w-full tw:h-full tw:object-cover" alt="" />
      <!-- Gradient overlay -->
      <div class="tw:absolute tw:inset-0 tw:bg-gradient-to-t tw:from-black/70 tw:to-transparent"></div>

      <!-- Countdown (upcoming) -->
      <div v-if="isUpcoming" class="tw:absolute tw:bottom-3 tw:left-3 tw:flex tw:items-end tw:gap-1.5">
        <template v-for="(v, k, i) in countdown" :key="k">
          <div class="tw:text-center">
            <p class="tw:text-xl tw:font-bold tw:text-white tw:leading-none">{{ String(v).padStart(2, '0') }}</p>
            <p class="tw:text-[8px] tw:uppercase tw:tracking-widest tw:text-white/75 tw:mt-0.5">{{ k }}</p>
          </div>
          <span v-if="i < 3" class="tw:text-white/60 tw:text-base tw:font-bold tw:pb-4 tw:leading-none">.</span>
        </template>
      </div>

      <!-- Live badge -->
      <div v-else-if="isLive" class="tw:absolute tw:bottom-3 tw:left-3">
        <span class="tw:bg-red-500 tw:text-white tw:text-xs tw:font-semibold tw:px-3 tw:py-1 tw:rounded-md tw:flex tw:items-center tw:gap-1.5">
          <span class="tw:w-1.5 tw:h-1.5 tw:bg-white tw:rounded-full tw:animate-pulse tw:inline-block"></span>
          {{ $t('eventCard.liveNow') }}
        </span>
      </div>

      <!-- Finished badge -->
      <div v-else-if="isFinished" class="tw:absolute tw:bottom-3 tw:left-3">
        <span class="tw:bg-gray-600/80 tw:text-white tw:text-xs tw:font-medium tw:px-3 tw:py-1 tw:rounded-md">
          {{ $t('eventCard.finished') }}
        </span>
      </div>

      <!-- Wishlist button (top-right) -->
      <button
        @click.stop="handleWishlistToggle"
        class="tw:absolute tw:top-3 tw:right-3 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center tw:bg-white/20 tw:backdrop-blur-sm tw:rounded-full tw:transition-all tw:duration-200 hover:tw:bg-white/40"
        :disabled="wishlistLoading"
        :style="wishlistLoading ? 'opacity:0.5' : ''"
      >
        <svg
          class="tw:w-4 tw:h-4 tw:transition-colors tw:duration-200"
          :class="wishlistStore.isWishlisted(event.id) ? 'tw:text-red-500 tw:fill-red-500' : 'tw:text-white tw:fill-none'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    <!-- ── Card Body ── -->
    <div class="tw:p-3 tw:space-y-2">

      <!-- Title + Date badge -->
      <div class="tw:flex tw:items-start tw:justify-between tw:gap-2">
        <h4 class="tw:text-base tw:font-semibold tw:text-blue-600 tw:leading-snug">{{ event.title }}</h4>
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
          <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:mt-0.5 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span class="tw:text-sm tw:text-gray-500 tw:leading-snug">{{ event.formatted_date }}</span>
        </div>

        <!-- Location -->
        <div class="tw:flex tw:items-start tw:gap-2">
          <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:mt-0.5 tw:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="tw:text-sm tw:text-blue-500 tw:underline tw:cursor-pointer tw:leading-snug">{{ event.address }}</span>
        </div>

        <!-- Category + Price (2-col) -->
        <div class="tw:grid tw:grid-cols-2 tw:gap-x-2 tw:gap-y-1.5">
          <div class="tw:flex tw:items-center tw:gap-1.5">
            <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
            <span class="tw:text-xs tw:text-gray-500 tw:truncate">{{ event.category == null ? 'N/A' : event.category.name }}</span>
          </div>
          <div class="tw:flex tw:items-center tw:gap-1.5">
            <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="tw:text-xs tw:font-medium tw:text-gray-700 tw:truncate">{{ event.price }}</span>
          </div>
          <!-- Dresscode + Age (same 2-col grid row) -->
          <div class="tw:flex tw:items-center tw:gap-1.5">
            <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="tw:text-xs tw:text-gray-500 tw:truncate">{{ event.dresscode }}</span>
          </div>
          <div class="tw:flex tw:items-center tw:gap-1.5">
            <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="tw:text-xs tw:text-gray-500 tw:truncate">{{ event.age_limit }}</span>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="tw:flex tw:gap-2 tw:pt-2 tw:border-t tw:border-gray-100">
        <button class="tw:flex-1 tw:text-sm tw:px-2 tw:py-1.5 tw:rounded-lg tw:border tw:border-gray-200 tw:text-gray-600 tw:bg-white tw:transition-all tw:duration-200 hover:tw:bg-gray-50">
          {{ $t('eventCard.link') }}
        </button>
        <button class="tw:flex-1 tw:text-sm tw:px-2 tw:py-1.5 tw:rounded-lg tw:border tw:border-gray-200 tw:text-gray-600 tw:bg-white tw:flex tw:items-center tw:justify-center tw:gap-1 tw:transition-all tw:duration-200 hover:tw:bg-gray-50">
          <svg class="tw:w-3.5 tw:h-3.5 tw:shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import DetailRow from './DetailedRow.vue'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const router = useRouter()
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

/* ------------------ WISHLIST TOGGLE ------------------ */
const wishlistLoading = ref(false)

async function handleWishlistToggle() {
    if (!authStore.isAuthenticated) {
        router.push({ name: 'Login' })
        return
    }
    if (wishlistLoading.value) return
    wishlistLoading.value = true
    try {
        await wishlistStore.toggleWishlist(props.event)
    } finally {
        wishlistLoading.value = false
    }
}

/* ------------------ TIME VALUES ------------------ */
// Combine event_date with start_datetime and end_datetime to create proper Date objects
const startDate = new Date(`${props.event.event_date}T${props.event.start_datetime}`)
const endDate = new Date(`${props.event.event_date}T${props.event.end_datetime}`)
const start = startDate.getTime()
const end = endDate.getTime()

/* ------------------ STATE FLAGS ------------------ */
const isUpcoming = computed(() => Date.now() < start)

const isLive = computed(() => {
    const now = Date.now()
    return now >= start && now <= end
})

const isFinished = computed(() => Date.now() > end)

/* ------------------ COUNTDOWN ------------------ */
const countdown = ref({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
})

let interval = null

const updateCountdown = () => {
    const now = Date.now()

    // Stop countdown once event starts
    if (now >= start) {
        clearInterval(interval)
        return
    }

    const diff = start - now

    countdown.value = {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    }
}

/* ------------------ LIFECYCLE ------------------ */
onMounted(() => {
    updateCountdown()
    interval = setInterval(updateCountdown, 1000)
})

onBeforeUnmount(() => {
    if (interval) clearInterval(interval)
})
</script>
