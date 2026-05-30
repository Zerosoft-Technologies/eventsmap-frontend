<template>
  <button
    type="button"
    @click="$emit('toggle')"
    :class="[
      'tw:w-full tw:flex tw:items-center tw:gap-3 tw:px-4 tw:py-3 tw:text-left tw:transition-colors tw:cursor-pointer tw:border-none tw:outline-none',
      isSelected
        ? 'tw:bg-blue-50'
        : isRecommended
          ? 'tw:bg-amber-50/60 hover:tw:bg-amber-50'
          : 'hover:tw:bg-gray-50'
    ]"
  >
    <!-- Avatar -->
    <div
      :class="[
        'tw:w-9 tw:h-9 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-white tw:text-xs tw:font-bold tw:flex-shrink-0 tw:select-none',
        avatarColor
      ]"
    >
      {{ initials }}
    </div>

    <!-- Name + meta -->
    <div class="tw:flex-1 tw:min-w-0">
      <div class="tw:flex tw:items-center tw:gap-2 tw:flex-wrap">
        <span class="tw:text-sm tw:font-medium tw:text-[var(--text-primary)] tw:truncate">
          {{ profile.name }}
        </span>
        <span
          v-if="profile.account_type === 'premium'"
          class="tw:text-xs tw:font-semibold tw:px-1.5 tw:py-0.5 tw:rounded tw:bg-amber-100 tw:text-amber-700 tw:flex-shrink-0"
        >
          Premium
        </span>
        <span
          v-if="isRecommended"
          class="tw:text-xs tw:font-medium tw:px-1.5 tw:py-0.5 tw:rounded tw:bg-blue-100 tw:text-[var(--primary-color)] tw:flex-shrink-0"
        >
          ★ Recommended
        </span>
      </div>
      <div class="tw:flex tw:items-center tw:gap-1.5 tw:mt-0.5">
        <span class="tw:text-xs tw:text-gray-400 tw:capitalize">{{ profile.profile_type }}</span>
        <span class="tw:text-gray-300 tw:text-xs">·</span>
        <span class="tw:text-xs tw:text-gray-400">{{ profile.country }}</span>
      </div>
    </div>

    <!-- Checkbox -->
    <div class="tw:flex-shrink-0">
      <div
        :class="[
          'tw:w-5 tw:h-5 tw:rounded tw:border-2 tw:flex tw:items-center tw:justify-center tw:transition-all',
          isSelected
            ? 'tw:border-blue-600 tw:bg-blue-600'
            : 'tw:border-gray-300 group-hover:tw:border-gray-400'
        ]"
      >
        <svg
          v-if="isSelected"
          class="tw:w-3 tw:h-3 tw:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="3"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  profile:       { type: Object,  required: true },
  isSelected:    { type: Boolean, default: false },
  isRecommended: { type: Boolean, default: false },
})

defineEmits(['toggle'])

const AVATAR_COLORS = [
  'tw:bg-blue-500',
  'tw:bg-purple-500',
  'tw:bg-green-500',
  'tw:bg-rose-500',
  'tw:bg-orange-500',
  'tw:bg-teal-500',
  'tw:bg-indigo-500',
  'tw:bg-pink-500',
]

const initials = computed(() => {
  const parts = props.profile.name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
})

const avatarColor = computed(() => {
  const hash = props.profile.name
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
})
</script>
