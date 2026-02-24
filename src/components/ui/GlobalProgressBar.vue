<script setup lang="ts">
import { computed } from 'vue'
import { useLoadingStore } from '@/stores/loading'

const loadingStore = useLoadingStore()

const progressStyle = computed(() => ({
  width: `${loadingStore.progress}%`,
  transition: loadingStore.progress === 0 ? 'none' : 'width 0.3s ease-out'
}))

const isVisible = computed(() => loadingStore.showProgressBar && loadingStore.progress > 0)
</script>

<template>
  <Teleport to="body">
    <div
      v-show="isVisible"
      class="tw:fixed tw:top-0 tw:left-0 tw:right-0 tw:z-[9999] tw:h-1 tw:bg-transparent"
      role="progressbar"
      :aria-valuenow="loadingStore.progress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-live="polite"
    >
      <!-- Progress bar -->
      <div
        class="tw:h-full tw:rounded-r-full tw:shadow-lg"
        :class="[
          loadingStore.progress === 100 ? 'tw:opacity-0' : 'tw:opacity-100'
        ]"
        :style="progressStyle"
        style="
          background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 5px rgba(59, 130, 246, 0.3);
          transition: width 0.3s ease-out, opacity 0.3s ease-out;
        "
      />
      
      <!-- Animated glow effect at the end -->
      <div
        v-if="loadingStore.progress > 0 && loadingStore.progress < 100"
        class="tw:absolute tw:top-0 tw:h-full tw:w-20 tw:rounded-r-full"
        :style="{
          left: `calc(${loadingStore.progress}% - 80px)`,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4))',
          animation: 'pulse 1.5s ease-in-out infinite'
        }"
      />
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
