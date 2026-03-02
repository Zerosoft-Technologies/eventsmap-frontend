<template>
  <div>
    <!-- Desktop Tabs -->
    <div class="tw:hidden lg:tw:block">
      <div class="tw:flex tw:gap-2 sm:tw:gap-6 tw:border-b tw:border-gray-200 tw:mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'tw:pb-3 tw:text-sm tw:font-normal tw:transition-colors tw:relative tw:whitespace-nowrap',
            activeTab === tab.id
              ? 'tw:text-[#2563eb]'
              : 'tw:text-[#1E3A8A] hover:tw:text-[#2563eb]'
          ]"
        >
          {{ tab.label }}
          <span
            v-if="activeTab === tab.id"
            class="tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:h-0.5 tw:bg-[#2563eb] tw:-mb-px"
          ></span>
        </button>
      </div>
    </div>

    <!-- Mobile Accordion -->
    <div class="lg:tw-hidden tw:space-y-2 tw:mb-6">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tw-border tw:border-gray-200 tw:rounded-lg tw:overflow-hidden"
      >
        <button
          @click="toggleAccordion(tab.id)"
          :class="[
            'tw:w-full tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3 tw:text-left tw:transition-colors',
            activeTab === tab.id
              ? 'tw:bg-blue-50 tw:text-blue-600 tw:border-blue-200'
              : 'tw:bg-white tw:text-gray-700 hover:tw:bg-gray-50'
          ]"
        >
          <span class="tw-text-sm tw:font-medium">{{ tab.label }}</span>
          <ChevronDown
            :class="[
              'tw:w-4 tw:h-4 tw:transition-transform',
              activeTab === tab.id ? 'tw:rotate-180' : ''
            ]"
          />
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="tw:transition-opacity tw:duration-300">
      <slot :activeTab="activeTab" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  tabs: { type: Array, required: true },
  initialTab: { type: String, default: '' }
})

const emit = defineEmits(['tab-change'])

const activeTab = ref(props.initialTab || props.tabs[0]?.id || '')

function toggleAccordion(tabId) {
  activeTab.value = activeTab.value === tabId ? '' : tabId
  emit('tab-change', activeTab.value)
}
</script>
