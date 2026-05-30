<template>
  <div class="tw:mt-2 tw:rounded-xl tw:border tw:border-gray-200 tw:shadow-lg tw:bg-white tw:overflow-hidden">

    <!-- Search + refetch -->
    <div class="tw:p-3 tw:border-b tw:border-gray-100 tw:space-y-2">
      <div class="tw:flex tw:items-center tw:gap-2">
        <div class="tw:relative tw:flex-1 tw:min-w-0">
          <Search
            class="tw:absolute tw:left-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none"
          />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            :placeholder="placeholder"
            class="tw:w-full tw:pl-9 tw:pr-9 tw:py-2 tw:text-sm tw:bg-gray-50 tw:border tw:border-gray-200 tw:rounded-lg tw:text-[var(--text-primary)] tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all"
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
        <button
          type="button"
          class="invite-refetch-btn no-hover tw:shrink-0 tw:inline-flex tw:items-center tw:justify-center tw:gap-1.5 tw:rounded-lg tw:border tw:border-[var(--primary-color)]/30 tw:bg-white tw:px-2.5 tw:py-2 tw:text-xs tw:font-medium tw:text-[var(--primary-color)] tw:transition-colors hover:tw:bg-blue-50 disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
          :disabled="loading"
          :title="refetchLabel"
          :aria-label="refetchLabel"
          @click="$emit('refetch')"
        >
          <RefreshCw
            class="tw:w-4 tw:h-4"
            :class="loading ? 'tw:animate-spin' : ''"
            aria-hidden="true"
          />
          <span class="tw:hidden sm:tw:inline">{{ refetchLabel }}</span>
        </button>
      </div>
      <p v-if="loadError" class="tw:text-xs tw:text-red-600 tw:m-0">{{ loadError }}</p>
    </div>

    <!-- Scrollable Results -->
    <div class="tw:overflow-y-auto tw:overscroll-contain" style="max-height: 300px;">

      <!-- Loading -->
      <div v-if="loading" class="tw:py-10 tw:text-center">
        <div class="tw:w-8 tw:h-8 tw:mx-auto tw:mb-3 tw:border-2 tw:border-blue-500 tw:border-t-transparent tw:rounded-full tw:animate-spin" />
        <p class="tw:text-sm tw:text-gray-500">Loading profiles…</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProfiles.length === 0" class="tw:py-10 tw:text-center tw:px-4">
        <div class="tw:w-12 tw:h-12 tw:mx-auto tw:mb-3 tw:rounded-full tw:bg-gray-100 tw:flex tw:items-center tw:justify-center">
          <Search class="tw:w-5 tw:h-5 tw:text-gray-300" />
        </div>
        <p class="tw:text-sm tw:font-medium tw:text-gray-500">
          {{ loadError ? 'Could not load profiles' : 'No results found' }}
        </p>
        <p class="tw:text-xs tw:text-gray-400 tw:mt-1">
          {{ loadError ? 'Try refetching from the server' : 'Try a different name or country' }}
        </p>
        <button
          v-if="loadError"
          type="button"
          class="invite-refetch-btn no-hover tw:mt-4 tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-lg tw:bg-[var(--primary-color)] tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:text-white hover:tw:brightness-95"
          @click="$emit('refetch')"
        >
          <RefreshCw class="tw:w-3.5 tw:h-3.5" aria-hidden="true" />
          {{ refetchLabel }}
        </button>
      </div>

      <template v-else>
        <InviteListItem
          v-for="profile in filteredProfiles"
          :key="profile.id"
          :profile="profile"
          :is-selected="selectedIds.map(String).includes(String(profile.id))"
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
import { Search, RefreshCw } from 'lucide-vue-next'
import InviteListItem from './InviteListItem.vue'

const props = defineProps({
  role:        { type: String, required: true },
  profiles:    { type: Array,  default: () => [] },
  recommended: { type: Array,  default: () => [] },
  selectedIds: { type: Array,  default: () => [] },
  loading:     { type: Boolean, default: false },
  loadError:   { type: String,  default: '' },
})

const emit = defineEmits(['toggle', 'refetch'])

const refetchLabel = 'Refetch'

const searchInputRef = ref(null)
const searchQuery    = ref('')

const ROLE_LABELS = {
  talent:    { label: 'Talent',    placeholder: 'Search talent by name or country…'    },
  organizer: { label: 'Organiser', placeholder: 'Search organiser by name or country…' },
  venue:     { label: 'Venue',     placeholder: 'Search venue by name or country…'     },
}

const placeholder = computed(() => ROLE_LABELS[props.role]?.placeholder ?? 'Search…')

function profileMatchesQuery(profile, query) {
  const haystack = [
    profile.name,
    profile.country,
    profile.account_type,
    profile.profile_type,
    profile.id,
  ]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase())
    .join(' ')
  const tokens = query.split(/\s+/).filter(Boolean)
  return tokens.every((token) => haystack.includes(token))
}

const filteredProfiles = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return props.profiles
  return props.profiles.filter((p) => profileMatchesQuery(p, q))
})

onMounted(() => {
  searchInputRef.value?.focus()
})
</script>

<style scoped>
.invite-refetch-btn:hover:not(:disabled) {
  background-color: #eff6ff;
}
.invite-refetch-btn.tw-bg-\[var\(--primary-color\)\]:hover:not(:disabled) {
  background-color: var(--primary-color);
  filter: brightness(0.95);
}
</style>
