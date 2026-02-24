<script setup lang="ts">
import { computed } from 'vue'
import { useLoadingStore } from '@/stores/loading'

defineProps<{
  message?: string
  showLogo?: boolean
}>()

const loadingStore = useLoadingStore()

const isVisible = computed(() => loadingStore.isAuthChecking)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="tw:transition-opacity tw:duration-300 tw:ease-out"
      enter-from-class="tw:opacity-0"
      enter-to-class="tw:opacity-100"
      leave-active-class="tw:transition-opacity tw:duration-300 tw:ease-in"
      leave-from-class="tw:opacity-100"
      leave-to-class="tw:opacity-0"
    >
      <div
        v-if="isVisible"
        class="tw:fixed tw:inset-0 tw:z-[9998] tw:flex tw:items-center tw:justify-center tw:bg-gradient-to-br tw:from-gray-50 tw:to-gray-100"
        role="alert"
        aria-live="assertive"
        aria-busy="true"
      >
        <div class="tw:flex tw:flex-col tw:items-center tw:gap-6">
          <!-- Logo with pulse animation -->
          <div
            v-if="showLogo !== false"
            class="tw:relative tw:animate-pulse"
          >
            <!-- Default logo placeholder - replace with actual logo -->
            <div class="tw:w-16 tw:h-16 tw:rounded-2xl tw:bg-gradient-to-br tw:from-blue-500 tw:to-blue-600 tw:flex tw:items-center tw:justify-center tw:shadow-lg">
              <svg
                class="tw:w-8 tw:h-8 tw:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            
            <!-- Subtle glow ring -->
            <div
              class="tw:absolute tw:inset-0 tw:rounded-2xl tw:bg-blue-400 tw:opacity-20 tw:blur-xl tw:animate-ping"
              style="animation-duration: 2s;"
            />
          </div>

          <!-- Spinner -->
          <div class="tw:relative">
            <svg
              class="tw:w-10 tw:h-10 tw:text-blue-500 tw:animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="tw:opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="3"
              />
              <path
                class="tw:opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>

          <!-- Loading text -->
          <p class="tw:text-sm tw:text-gray-500 tw:font-medium tw:tracking-wide">
            {{ message || 'Checking authentication...' }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
