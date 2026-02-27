<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="visible"
        class="tw:fixed tw:inset-0 tw:z-[9999] tw:flex tw:items-center tw:justify-center tw:bg-black/50 tw:backdrop-blur-sm">
        <div class="tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:p-8 tw:text-center tw:max-w-sm tw:mx-4">
          <div class="tw:flex tw:justify-center tw:mb-5">
            <div class="tw:relative tw:w-14 tw:h-14">
              <svg class="tw:w-14 tw:h-14 tw:animate-spin" style="color: var(--primary-color)" fill="none" viewBox="0 0 24 24">
                <circle class="tw:opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                <path class="tw:opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <div class="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center">
                <svg class="tw:w-6 tw:h-6 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
          <h2 class="tw:text-lg tw:font-bold tw:text-gray-800 tw:mb-1">Redirecting to Secure Payment</h2>
          <p class="tw:text-sm tw:text-gray-500">
            You'll be redirected to Stripe's secure checkout. Please wait...
          </p>
          <div class="tw:mt-5 tw:flex tw:justify-center tw:gap-1">
            <span v-for="i in 3" :key="i"
              class="tw:w-1.5 tw:h-1.5 tw:rounded-full tw:animate-pulse"
              :style="{ backgroundColor: 'var(--primary-color)', animationDelay: `${i * 200}ms` }" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
}>()
</script>

<style scoped>
.overlay-enter-active {
  transition: opacity 0.3s ease;
}
.overlay-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
