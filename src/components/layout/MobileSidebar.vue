<template>
  <div class="tw:h-full tw:flex tw:flex-col">
    <!-- Header -->
    <div class="tw:px-4 tw:py-4 tw:border-b tw:border-gray-200 tw:flex tw:items-center tw:justify-between">
      <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900">Menu</h2>
      <button
        @click="$emit('close')"
        class="tw:p-2 tw:rounded-lg tw:hover:tw:bg-gray-100 tw:transition-colors"
      >
        <X class="tw:w-5 tw:h-5 tw:text-gray-700" />
      </button>
    </div>

    <!-- Navigation Items -->
    <div class="tw:flex-1 tw:overflow-y-auto tw:py-4">
      <div class="tw-space-y-1 tw:px-3">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="$emit('menu-click', item)"
          :class="[
            'tw:w-full tw:flex tw:items-center tw:gap-3 tw:px-3 tw:py-3 tw:rounded-lg tw:transition-colors',
            item.id === activeItem
              ? 'tw:bg-blue-50 tw:text-blue-600'
              : 'tw:text-gray-700 hover:tw:bg-gray-50'
          ]"
        >
          <component :is="item.icon" class="tw:w-5 tw:h-5 tw:tw-flex-shrink-0" />
          <span class="tw-text-sm tw:font-medium">{{ item.label }}</span>
        </button>
      </div>

      <!-- Events Section -->
      <div class="tw:mt-6 tw:px-3">
        <h3 class="tw:text-xs tw:font-semibold tw:text-gray-500 tw:uppercase tw:tracking-wider tw:mb-3">
          My Events
        </h3>
        <div class="tw-space-y-2">
          <div
            v-for="event in events"
            :key="event.id"
            @click="handleEventClick(event)"
            :class="[
              'tw:p-3 tw:rounded-lg tw:cursor-pointer tw:transition-colors',
              selectedEventId === event.id
                ? 'tw:bg-blue-50 tw:border tw:border-blue-200'
                : 'tw:bg-gray-50 hover:tw:bg-gray-100'
            ]"
          >
            <h4 class="tw-text-sm tw:font-medium tw:text-gray-900 tw:truncate">
              {{ event.title || 'Untitled Event' }}
            </h4>
            <div class="tw-flex tw-items-center tw:gap-1 tw:mt-1 tw:text-xs tw:text-gray-500">
              <Calendar class="tw:w-3 tw:h-3" />
              <span>{{ formatDate(event.event_date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="tw-p-4 tw-border-t tw:border-gray-200">
      <button
        @click="$emit('menu-click', { id: 'back', label: 'Back to Events' })"
        class="tw:w-full tw:flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-blue-600 tw:bg-blue-50 tw:rounded-lg hover:tw:bg-blue-100 tw:transition-colors"
      >
        <ChevronLeft class="tw:w-4 tw:h-4" />
        Back to Events
      </button>
    </div>
  </div>
</template>

<script setup>
import { X, Calendar, ChevronLeft } from 'lucide-vue-next'
import { useMyEventStore } from '@/stores/myEventStore'

const props = defineProps({
  menuItems: { type: Array, required: true },
  activeItem: { type: String, default: '' }
})

const emit = defineEmits(['menu-click', 'close', 'event-selected'])

const myEventStore = useMyEventStore()

const events = computed(() => myEventStore.events)
const selectedEventId = computed(() => myEventStore.selectedEventId)

function handleEventClick(event) {
  emit('event-selected', event.id)
  emit('close')
}

function formatDate(dateString) {
  if (!dateString) return 'No date'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
