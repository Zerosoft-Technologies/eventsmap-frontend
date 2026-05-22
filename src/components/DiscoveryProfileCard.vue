<template>
  <div class="tw:flex tw:flex-col tw:w-[350px] tw:bg-white tw:rounded-2xl tw:shadow-md tw:overflow-hidden tw:border tw:border-gray-100 hover:tw:shadow-lg tw:transition-all tw:duration-200">

    <!-- ── Hero: carousel when additional_images exist ── -->
    <div
      class="tw:relative tw:overflow-hidden tw:rounded-t-2xl"
      :class="profileType === 'talents' ? 'tw:aspect-[3/4] tw:max-h-72' : 'tw:h-40'"
    >
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

      <!-- Prev button -->
      <button
        v-if="heroImages.length > 1"
        type="button"
        class="tw:absolute tw:left-2 tw:top-1/2 tw:z-[3] tw:flex tw:h-7 tw:w-7 tw:-translate-y-1/2 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/90 tw:shadow-md tw:backdrop-blur-sm tw:transition-colors hover:tw:bg-white"
        @click.stop="prevHeroImage"
      >
        <svg class="tw:h-3.5 tw:w-3.5 tw:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <!-- Next button -->
      <button
        v-if="heroImages.length > 1"
        type="button"
        class="tw:absolute tw:right-2 tw:top-1/2 tw:z-[3] tw:flex tw:h-7 tw:w-7 tw:-translate-y-1/2 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/90 tw:shadow-md tw:backdrop-blur-sm tw:transition-colors hover:tw:bg-white"
        @click.stop="nextHeroImage"
      >
        <svg class="tw:h-3.5 tw:w-3.5 tw:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      <!-- Image counter -->
      <div
        v-if="heroImages.length > 1"
        class="tw:absolute tw:bottom-2 tw:right-2 tw:z-[3] tw:rounded-full tw:bg-black/60 tw:px-2 tw:py-0.5 tw:text-[10px] tw:font-medium tw:text-white tw:backdrop-blur-sm"
      >
        {{ heroImageIndex + 1 }} / {{ heroImages.length }}
      </div>

      <!-- Gradient overlay -->
      <div class="tw:pointer-events-none tw:absolute tw:inset-0 tw:z-[1] tw:bg-gradient-to-t tw:from-black/25 tw:to-transparent"></div>

      <!-- Profile type badge -->
      <div class="tw:absolute tw:top-2 tw:left-2 tw:z-[3]">
        <span
          class="tw:text-[10px] tw:font-bold tw:uppercase tw:tracking-wider tw:px-2.5 tw:py-1 tw:rounded-full tw:backdrop-blur-sm"
          :class="badgeClass"
        >{{ profileLabel }}</span>
      </div>
    </div>

    <!-- Card body -->
    <div class="tw:p-3 tw:flex tw:flex-col tw:flex-1 tw:space-y-2">

      <!-- Title -->
      <h4 class="tw:text-base tw:font-semibold tw:text-[var(--primary-color)] tw:leading-snug tw:line-clamp-2">
        {{ profile.title }}
      </h4>

      <!-- Detail rows -->
      <div class="tw:space-y-1.5 tw:flex-1">

        <!-- Category (profile-specific) -->
        <div v-if="profileCategoryName" class="tw:flex tw:items-center tw:gap-2">
          <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
          <span class="tw:text-sm tw:text-[var(--primary-color)] tw:leading-snug">{{ profileCategoryName }}</span>
        </div>

        <!-- Location -->
        <div v-if="showLocationRow" class="tw:flex tw:items-start tw:gap-2">
          <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:mt-0.5 tw:text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="tw:text-sm tw:text-[var(--primary-color)] tw:leading-snug tw:line-clamp-2">{{ displayLocationLine }}</span>
        </div>

        <!-- Subcategories chips -->
        <div v-if="subcategoryLabels.length" class="tw:flex tw:flex-wrap tw:gap-1">
          <span
            v-for="sub in subcategoryLabels"
            :key="sub"
            class="tw:text-[10px] tw:font-medium tw:px-2 tw:py-0.5 tw:rounded-full tw:bg-orange-50 tw:text-orange-600 tw:border tw:border-orange-200"
          >{{ sub }}</span>
        </div>

        <!-- Description preview -->
        <p v-if="profile.description" class="tw:text-xs tw:text-gray-500 tw:leading-relaxed tw:line-clamp-2">{{ profile.description }}</p>
      </div>

      <!-- Action buttons -->
      <div class="tw:flex tw:gap-2 tw:pt-2 tw:mt-auto tw:border-t tw:border-gray-100">
        <button
          type="button"
          @click.stop="emit('viewProfile', profile)"
          class="tw:flex-1 tw:text-sm tw:px-2 tw:py-1.5 tw:rounded-lg tw:bg-orange-500 tw:text-white tw:border tw:border-orange-500 tw:flex tw:items-center tw:justify-center tw:gap-1 tw:transition-all tw:duration-200 tw:no-underline"
        >
          {{ $t('discoveryCard.viewProfile') }}
          <svg class="tw:w-3.5 tw:h-3.5 tw:shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { displayProfileLocationLine } from '@/utils/nominatimCityDisplay'

const { t } = useI18n()

const props = defineProps({
  profile: { type: Object, required: true },
  profileType: { type: String, required: true },
})

const emit = defineEmits(['viewProfile'])

const dummyImage = new URL('../assets/dummy-event.png', import.meta.url).href

// ── Hero carousel ────────────────────────────────────────────────
const heroImageIndex = ref(0)

const heroImages = computed(() => {
  const p = props.profile
  const main = p.cover_image || p.image_path || p.profile_image || null
  const extras = Array.isArray(p.additional_images)
    ? p.additional_images.map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
    : []
  const all = [...(main ? [main] : []), ...extras]
  return all.length > 0 ? all : [dummyImage]
})

watch(heroImages, (imgs) => {
  if (heroImageIndex.value >= imgs.length) heroImageIndex.value = 0
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

// ── Badge / label ────────────────────────────────────────────────
const profileLabel = computed(() => {
  const map = { organisers: 'Organiser', talents: 'Talent', venues: 'Venue' }
  return map[props.profileType] ?? props.profileType
})

const badgeClass = computed(() => {
  const map = {
    organisers: 'tw:bg-indigo-500/80 tw:text-white',
    talents: 'tw:bg-emerald-500/80 tw:text-white',
    venues: 'tw:bg-sky-500/80 tw:text-white',
  }
  return map[props.profileType] ?? 'tw:bg-gray-500/80 tw:text-white'
})

// ── Category ────────────────────────────────────────────────────
const profileCategoryName = computed(() => {
  const p = props.profile
  if (props.profileType === 'organisers') return p.organiser_category?.name ?? p.category?.name ?? null
  if (props.profileType === 'talents') return p.talent_category?.name ?? p.category?.name ?? null
  if (props.profileType === 'venues') return p.venue_category?.name ?? p.category?.name ?? null
  return p.category?.name ?? null
})

const subcategoryLabels = computed(() => {
  const p = props.profile
  let subs = []
  if (props.profileType === 'organisers') subs = p.organiser_subcategories ?? p.subcategories ?? []
  else if (props.profileType === 'talents') subs = p.talent_subcategories ?? p.subcategories ?? []
  else if (props.profileType === 'venues') subs = p.venue_subcategories ?? p.subcategories ?? []
  else subs = p.subcategories ?? []
  return subs.slice(0, 4).map(s => s.name)
})

/** Talent cards: city or region only (no postcode). */
const displayLocationLine = computed(() =>
  displayProfileLocationLine(props.profile, props.profileType)
)

const showLocationRow = computed(() => displayLocationLine.value.length > 0)

// ── Profile URL ──────────────────────────────────────────────────
const profileUrl = computed(() => {
  const slug = props.profile.slug
  if (!slug) return '#'
  const map = { organisers: '/organisers', talents: '/talents', venues: '/venues' }
  return `${map[props.profileType] ?? ''}/${slug}`
})
</script>
