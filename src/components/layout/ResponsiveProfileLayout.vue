<template>
  <div class="tw:min-h-screen tw:bg-gray-50">
    <!-- Mobile Header with Hamburger Menu -->
    <div class="lg:tw:hidden tw:sticky tw:top-0 tw:z-40 tw:bg-white tw:border-b tw:border-gray-200">
      <div class="tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3">
        <button
          @click="toggleMobileSidebar"
          class="tw:p-2 tw:rounded-lg tw:hover:tw:bg-gray-100 tw:transition-colors"
        >
          <Menu class="tw:w-6 tw:h-6 tw:text-gray-700" />
        </button>
        <h1 class="tw:text-lg tw:font-semibold tw:text-gray-900">{{ pageTitle }}</h1>
        <div class="tw:w-10"></div> <!-- Spacer for centering -->
      </div>
    </div>

    <!-- Main Layout Container -->
    <div class="tw:flex tw:min-h-screen">
      <!-- Mobile Sidebar Overlay -->
      <Transition
        enter-active-class="tw:transition tw:duration-300 tw:ease-out"
        enter-from-class="tw:opacity-0"
        enter-to-class="tw:opacity-100"
        leave-active-class="tw:transition tw:duration-200 tw:ease-in"
        leave-from-class="tw:opacity-100"
        leave-to-class="tw:opacity-0"
      >
        <div
          v-if="showMobileSidebar"
          class="lg:tw:hidden tw:fixed tw:inset-0 tw:z-50 tw:bg-black tw:bg-opacity-50"
          @click="closeMobileSidebar"
        ></div>
      </Transition>

      <!-- Mobile Sidebar Drawer -->
      <Transition
        enter-active-class="tw:transition tw:duration-300 tw:ease-out"
        enter-from-class="tw:-translate-x-full"
        enter-to-class="tw:translate-x-0"
        leave-active-class="tw:transition tw:duration-200 tw:ease-in"
        leave-from-class="tw:translate-x-0"
        leave-to-class="tw:-translate-x-full"
      >
        <div
          v-if="showMobileSidebar"
          class="lg:tw:hidden tw:fixed tw:inset-y-0 tw:left-0 tw:z-50 tw:w-80 tw:bg-white tw:shadow-xl"
        >
          <MobileSidebar
            :menuItems="menuItems"
            :activeItem="activeItem"
            @menu-click="handleMenuClick"
            @close="closeMobileSidebar"
          />
        </div>
      </Transition>

      <!-- Desktop Sidebar -->
      <div class="tw:hidden lg:tw:flex">
        <slot name="sidebar" />
      </div>

      <!-- Main Content Area -->
      <div class="tw:flex-1 tw:overflow-x-hidden">
        <!-- Mobile Padding Top -->
        <div class="lg:tw-hidden tw:h-4"></div>
        
        <!-- Content Container -->
        <div class="tw:px-4 tw:py-4 sm:tw:px-6 lg:tw:px-8 lg:tw:py-6">
          <slot name="content" />
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Navigation (Optional) -->
    <div v-if="showBottomNav" class="lg:tw:hidden tw:fixed tw:bottom-0 tw:left-0 tw:right-0 tw:z-40 tw:bg-white tw:border-t tw:border-gray-200">
      <div class="tw:grid tw:grid-cols-5 tw:gap-1">
        <button
          v-for="item in bottomNavItems"
          :key="item.id"
          @click="handleBottomNavClick(item)"
          :class="[
            'tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-2 tw:px-1 tw:text-xs tw:transition-colors',
            item.id === activeItem
              ? 'tw:text-blue-600'
              : 'tw:text-gray-400 hover:tw:text-gray-600'
          ]"
        >
          <component :is="item.icon" class="tw:w-5 tw:h-5 tw:mb-1" />
          <span class="tw-capitalize">{{ item.label.split(' ')[0] }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Menu } from 'lucide-vue-next'
import MobileSidebar from './MobileSidebar.vue'

const props = defineProps({
  pageTitle: { type: String, default: 'Profile' },
  menuItems: { type: Array, required: true },
  activeItem: { type: String, default: '' },
  showBottomNav: { type: Boolean, default: true }
})

const emit = defineEmits(['menu-click'])

const showMobileSidebar = ref(false)

// Filter menu items for bottom navigation (show only first 5)
const bottomNavItems = computed(() => {
  return props.menuItems.slice(0, 5)
})

function toggleMobileSidebar() {
  showMobileSidebar.value = !showMobileSidebar.value
}

function closeMobileSidebar() {
  showMobileSidebar.value = false
}

function handleMenuClick(item) {
  emit('menu-click', item)
  closeMobileSidebar()
}

function handleBottomNavClick(item) {
  emit('menu-click', item)
}

// Handle escape key to close sidebar
function handleEscape(e) {
  if (e.key === 'Escape' && showMobileSidebar.value) {
    closeMobileSidebar()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
/* Ensure smooth transitions on mobile */
@media (max-width: 1023px) {
  .tw\:translate-x-0 {
    transform: translateX(0);
  }
  .tw\:-translate-x-full {
    transform: translateX(-100%);
  }
}
</style>
