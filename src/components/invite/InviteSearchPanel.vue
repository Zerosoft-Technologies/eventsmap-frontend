<template>
  <div class="tw:mt-2 tw:rounded-xl tw:border tw:border-gray-200 tw:shadow-lg tw:bg-white tw:overflow-hidden">

    <!-- Search Input -->
    <div class="tw:p-3 tw:border-b tw:border-gray-100">
      <div class="tw:relative">
        <Search
          class="tw:absolute tw:left-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none"
        />
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          :placeholder="placeholder"
          class="tw:w-full tw:pl-9 tw:pr-4 tw:py-2 tw:text-sm tw:bg-gray-50 tw:border tw:border-gray-200 tw:rounded-lg tw:text-gray-800 tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all"
        />
        <button
          v-if="searchQuery"
          type="button"
          @click="searchQuery = ''"
          class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-300 hover:tw:text-gray-500 tw:transition-colors"
        >
          <svg class="tw:w-4 tw:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Scrollable Results -->
    <div class="tw:overflow-y-auto tw:overscroll-contain" style="max-height: 300px;">

      <!-- Empty State -->
      <div v-if="filteredProfiles.length === 0" class="tw:py-10 tw:text-center">
        <div class="tw:w-12 tw:h-12 tw:mx-auto tw:mb-3 tw:rounded-full tw:bg-gray-100 tw:flex tw:items-center tw:justify-center">
          <Search class="tw:w-5 tw:h-5 tw:text-gray-300" />
        </div>
        <p class="tw:text-sm tw:font-medium tw:text-gray-500">No results found</p>
        <p class="tw:text-xs tw:text-gray-400 tw:mt-1">Try a different name or country</p>
      </div>

      <template v-else>
        <!-- Recommended Section (only when not actively searching) -->
        <div v-if="!searchQuery.trim() && recommended.length > 0">
          <div class="tw:px-4 tw:py-2 tw:text-xs tw:font-semibold tw:text-gray-400 tw:uppercase tw:tracking-wider tw:bg-gray-50 tw:border-b tw:border-gray-100 tw:sticky tw:top-0">
            Recommended for this event
          </div>
          <InviteListItem
            v-for="profile in recommended"
            :key="`rec-${profile.id}`"
            :profile="profile"
            :is-selected="selectedIds.includes(profile.id)"
            :is-recommended="true"
            @toggle="$emit('toggle', profile)"
          />
          <div class="tw:border-t tw:border-dashed tw:border-gray-200 tw:mx-4 tw:my-1" />
          <div class="tw:px-4 tw:py-2 tw:text-xs tw:font-semibold tw:text-gray-400 tw:uppercase tw:tracking-wider tw:sticky tw:top-0">
            All {{ roleLabel }}s
          </div>
        </div>

        <!-- Profile List -->
        <InviteListItem
          v-for="profile in filteredProfiles"
          :key="profile.id"
          :profile="profile"
          :is-selected="selectedIds.includes(profile.id)"
          @toggle="$emit('toggle', profile)"
        />
      </template>
    </div>

    <!-- Footer: selected count hint -->
    <div
      v-if="selectedIds.length > 0"
      class="tw:px-4 tw:py-2 tw:border-t tw:border-gray-100 tw:bg-gray-50 tw:text-xs tw:text-gray-500"
    >
      {{ selectedIds.length }} selected
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search } from 'lucide-vue-next'
import InviteListItem from './InviteListItem.vue'

const props = defineProps({
  role:        { type: String, required: true },
  profiles:    { type: Array,  default: () => [] },
  recommended: { type: Array,  default: () => [] },
  selectedIds: { type: Array,  default: () => [] },
})

defineEmits(['toggle'])

const searchInputRef = ref(null)
const searchQuery    = ref('')

const ROLE_LABELS = {
  talent:    { label: 'Talent',    placeholder: 'Search talent by name or country…'    },
  organizer: { label: 'Organizer', placeholder: 'Search organiser by name or country…' },
  venue:     { label: 'Venue',     placeholder: 'Search venue by name or country…'     },
}

const placeholder = computed(() => ROLE_LABELS[props.role]?.placeholder ?? 'Search…')
const roleLabel   = computed(() => ROLE_LABELS[props.role]?.label       ?? 'Profile')

const filteredProfiles = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return props.profiles
  return props.profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q)
  )
})

onMounted(() => {
  searchInputRef.value?.focus()
})
</script>
