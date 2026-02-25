<template>
  <transition name="slide-right">
    <div 
      v-if="visible"
      class="tw:fixed tw:bg-white tw:rounded-lg tw:md:right-7 tw:bottom-2 tw:z-50 tw:transition-all tw:duration-300 tw:p-4 tw:max-w-[500px] tw:flex tw:flex-col tw:overflow-hidden"
      style="width: 500px; max-width: calc(100vw - 2rem); pointer-events: auto;"
    >
      <!-- Header -->
      <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
        <h3 class="tw:font-semibold tw:text-2xl tw:leading-[1.35] tw:tracking-[-0.006em]">
          {{ $t('wishlist.title') || 'My Wishlist' }}
        </h3>
        <div class="tw:flex tw:gap-2" style="align-items: center;">
          <!-- Clear All Button -->
          <button 
            v-if="wishlistStore.wishlistEvents.length > 0"
            @click="handleClearAll"
            class="tw:text-xs tw:text-red-500 hover:tw:text-red-700 tw:transition-colors"
            :disabled="clearing"
          >
            {{ clearing ? ($t('wishlist.clearing') || 'Clearing...') : ($t('wishlist.clearAll') || 'Clear All') }}
          </button>
          <!-- Close Button -->
          <img 
            class="tw:cursor-pointer" 
            @click="close" 
            src="../assets/cancel.png" 
            alt="Close icon"
          >
        </div>
      </div>

      <!-- Content -->
      <div 
        class="tw:max-h-[80vh] tw:lg:max-h-[60vh] tw:space-y-4 tw:pr-2 tw:overflow-y-auto" 
        ref="scrollContainer"
        style="overflow-y: scroll !important; -webkit-overflow-scrolling: touch;"
      >
        <!-- Loading State -->
        <div v-if="wishlistStore.loading" class="tw:space-y-4">
          <div v-for="i in 3" :key="i" class="tw:p-3 tw:bg-[#ECEEF4] tw:rounded-xl tw:animate-pulse">
            <div class="tw:flex tw:justify-between tw:md:gap-5 tw:flex-wrap tw:items-center">
              <div class="tw:flex tw:gap-[13px] tw:items-center">
                <div class="tw:border tw:w-10 tw:h-10 tw:bg-gray-300 tw:border-gray-400 tw:rounded-full"></div>
                <div class="tw:h-5 tw:bg-gray-300 tw:rounded tw:w-40"></div>
              </div>
              <div class="tw:h-8 tw:bg-gray-300 tw:rounded-md tw:w-24"></div>
            </div>
            <div class="tw:flex tw:md:justify-start tw:justify-between tw:md:gap-4 tw:mt-4">
              <div class="tw:rounded-lg tw:w-30 tw:h-24 tw:bg-gray-300"></div>
              <div class="tw:flex-1 tw:space-y-2">
                <div class="tw:h-4 tw:bg-gray-300 tw:rounded tw:w-3/4"></div>
                <div class="tw:h-4 tw:bg-gray-300 tw:rounded tw:w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div 
          v-else-if="wishlistStore.wishlistEvents.length === 0" 
          class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:text-center tw:py-12 tw:min-h-[200px]"
        >
          <svg class="tw:w-16 tw:h-16 tw:text-gray-300 tw:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p class="tw:text-gray-500 tw:text-lg tw:font-medium tw:mb-2">
            {{ $t('wishlist.empty') || 'No saved events' }}
          </p>
          <p class="tw:text-gray-400 tw:text-sm">
            {{ $t('wishlist.emptyHint') || 'Click the heart icon on events to save them here' }}
          </p>
        </div>

        <!-- Event Cards -->
        <div v-else class="tw:space-y-4">
          <Event 
            v-for="event in wishlistStore.wishlistEvents" 
            :key="event.id" 
            :event="event"
            :hideViewEvent="true"
            @viewEvent="handleViewEvent"
          />
        </div>
      </div>

    </div>
  </transition>

  <!-- Backdrop -->
  <transition name="fade">
    <div 
      v-if="visible" 
      class="tw:fixed tw:inset-0 tw:bg-black/10 tw:z-10"
      @click="close"
      style="pointer-events: auto;"
    ></div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useWishlistStore } from '@/stores/wishlistStore'
import Event from './Event.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'viewEvent'])

const wishlistStore = useWishlistStore()
const scrollContainer = ref(null)
const clearing = ref(false)

// Auto-scroll to top when opened
watch(() => props.visible, async (isVisible) => {
  if (isVisible) {
    // Fetch wishlist if not already fetched
    if (!wishlistStore.fetched) {
      wishlistStore.fetchWishlist()
    }
    // Scroll to top
    await nextTick()
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = 0
    }
  }
})

function close() {
  emit('close')
}

function handleViewEvent(event) {
  emit('viewEvent', event)
}

async function handleClearAll() {
  if (clearing.value) return
  
  const confirmed = confirm('Are you sure you want to remove all events from your wishlist?')
  if (!confirmed) return
  
  clearing.value = true
  try {
    // Remove all events one by one
    const events = [...wishlistStore.wishlistEvents]
    for (const event of events) {
      await wishlistStore.toggleWishlist(event)
    }
  } finally {
    clearing.value = false
  }
}
</script>

<style scoped>
/* Ensure proper scrolling */
.tw\:max-h-\[80vh\] {
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch;
}

/* Slide right animation */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Fade animation for backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modern scrollbar styling - matches AllEvents */
.tw\:max-h-\[80vh\]::-webkit-scrollbar {
  width: 6px;
}
.tw\:max-h-\[80vh\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.tw\:max-h-\[80vh\]::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
  transition: background 0.3s ease;
}
.tw\:max-h-\[80vh\]::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Mobile responsive */
@media (max-width: 640px) {
  div[style*="width: 384px"] {
    width: calc(100vw - 2rem) !important;
    right: 1rem !important;
  }
}
</style>
