<template>
  <div class="map-cluster-carousel">
    <div class="map-cluster-carousel__stage">
      <div
        ref="scrollEl"
        class="map-cluster-carousel__viewport"
        @scroll.passive="onScroll"
      >
        <slot />
      </div>
    </div>

    <footer
      v-if="itemCount > 1"
      class="map-cluster-carousel__footer"
      :class="accent === 'profile' ? 'map-cluster-carousel__footer--profile' : 'map-cluster-carousel__footer--event'"
      role="group"
      :aria-label="t('mapCluster.carouselControls')"
    >
      <div class="map-cluster-carousel__segments" aria-hidden="true">
        <span
          v-for="idx in itemCount"
          :key="idx"
          class="map-cluster-carousel__segment"
          :class="{ 'map-cluster-carousel__segment--active': activeIndex === idx - 1 }"
        />
      </div>

      <div class="map-cluster-carousel__toolbar">
        <button
          type="button"
          class="map-cluster-carousel__nav no-hover"
          :disabled="!canGoPrev"
          :aria-label="t('mapCluster.scrollPrevious')"
          @click="goPrev"
        >
          <ChevronLeftIcon class="map-cluster-carousel__nav-icon" aria-hidden="true" />
        </button>

        <span class="map-cluster-carousel__position" aria-live="polite">
          <span class="map-cluster-carousel__position-current">{{ activeIndex + 1 }}</span>
          <span class="map-cluster-carousel__position-sep">/</span>
          <span class="map-cluster-carousel__position-total">{{ itemCount }}</span>
        </span>

        <button
          type="button"
          class="map-cluster-carousel__nav no-hover"
          :disabled="!canGoNext"
          :aria-label="t('mapCluster.scrollNext')"
          @click="goNext"
        >
          <ChevronRightIcon class="map-cluster-carousel__nav-icon" aria-hidden="true" />
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'

const props = defineProps({
  accent: {
    type: String,
    default: 'event',
    validator: (v) => v === 'event' || v === 'profile',
  },
  itemCount: {
    type: Number,
    default: 0,
  },
})

const { t } = useI18n()

const scrollEl = ref(null)
const activeIndex = ref(0)

const canGoPrev = computed(() => activeIndex.value > 0)
const canGoNext = computed(() => activeIndex.value < props.itemCount - 1)

function onScroll() {
  const el = scrollEl.value
  if (!el || el.clientWidth <= 0) return
  const index = Math.round(el.scrollLeft / el.clientWidth)
  activeIndex.value = Math.max(0, Math.min(index, Math.max(0, props.itemCount - 1)))
}

function goToIndex(index) {
  const el = scrollEl.value
  if (!el) return
  const clamped = Math.max(0, Math.min(index, props.itemCount - 1))
  el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
  window.setTimeout(onScroll, 320)
}

function goPrev() {
  goToIndex(activeIndex.value - 1)
}

function goNext() {
  goToIndex(activeIndex.value + 1)
}

let resizeObserver = null

watch(
  scrollEl,
  (el, prev) => {
    if (typeof ResizeObserver === 'undefined') return
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(() => onScroll())
    }
    if (prev) resizeObserver.unobserve(prev)
    if (el) resizeObserver.observe(el)
    nextTick(onScroll)
  },
  { flush: 'post' },
)

watch(
  () => props.itemCount,
  () => {
    activeIndex.value = 0
    nextTick(() => {
      const el = scrollEl.value
      if (el) el.scrollLeft = 0
      onScroll()
    })
  },
)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})
</script>

<style scoped>
.map-cluster-carousel {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.map-cluster-carousel__stage {
  padding: 0.25rem;
  border-radius: 1rem;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.map-cluster-carousel__viewport {
  display: flex;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  border-radius: 0.75rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.map-cluster-carousel__viewport::-webkit-scrollbar {
  display: none;
}

.map-cluster-carousel__viewport :deep(.map-cluster-carousel-slide) {
  flex: 0 0 100%;
  width: 100%;
  min-width: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  box-sizing: border-box;
  padding: 0.125rem 0;
}

.map-cluster-carousel__viewport :deep(.map-cluster-carousel-slide__inner) {
  width: 350px;
  max-width: 100%;
  margin: 0 auto;
}

.map-cluster-carousel__viewport :deep(.map-cluster-embed-card) {
  box-shadow: none;
  border-color: rgba(15, 23, 42, 0.07);
}

.map-cluster-carousel__footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0.375rem 0.125rem;
}

.map-cluster-carousel__segments {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.125rem;
}

.map-cluster-carousel__segment {
  flex: 1;
  height: 3px;
  border-radius: 9999px;
  background: #e2e8f0;
  transition:
    background-color 0.25s ease,
    transform 0.25s ease;
}

.map-cluster-carousel__footer--event .map-cluster-carousel__segment--active {
  background: linear-gradient(90deg, #ff7700 0%, #fb923c 100%);
  transform: scaleY(1.15);
}

.map-cluster-carousel__footer--profile .map-cluster-carousel__segment--active {
  background: linear-gradient(90deg, #0061ff 0%, #3b82f6 100%);
  transform: scaleY(1.15);
}

.map-cluster-carousel__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.25rem 0.125rem 0;
}

.map-cluster-carousel__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 9999px;
  background: #fff;
  color: #475569;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.15s ease;
}

.map-cluster-carousel__footer--event .map-cluster-carousel__nav:not(:disabled):hover {
  border-color: rgba(255, 119, 0, 0.35);
  color: #ea580c;
  box-shadow: 0 2px 10px rgba(255, 119, 0, 0.15);
}

.map-cluster-carousel__footer--profile .map-cluster-carousel__nav:not(:disabled):hover {
  border-color: rgba(0, 97, 255, 0.3);
  color: var(--primary-color, #0061ff);
  box-shadow: 0 2px 10px rgba(0, 97, 255, 0.12);
}

.map-cluster-carousel__nav:not(:disabled):active {
  transform: scale(0.94);
}

.map-cluster-carousel__nav:disabled {
  opacity: 0.32;
  cursor: default;
}

.map-cluster-carousel__nav-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.map-cluster-carousel__position {
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  min-width: 3.5rem;
  font-variant-numeric: tabular-nums;
  user-select: none;
}

.map-cluster-carousel__position-current {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.map-cluster-carousel__footer--event .map-cluster-carousel__position-current {
  color: #c2410c;
}

.map-cluster-carousel__footer--profile .map-cluster-carousel__position-current {
  color: #1d4ed8;
}

.map-cluster-carousel__position-sep {
  margin: 0 0.15rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #94a3b8;
}

.map-cluster-carousel__position-total {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;
}
</style>
