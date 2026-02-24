<template>
  <!-- Global Progress Bar (always visible during API calls) -->
  <GlobalProgressBar />
  
  <!-- Full Page Loader (shown during initial auth check) -->
  <FullPageLoader message="Loading Events Map..." />
  
  <!-- Main App Content (hidden during auth check) -->
  <template v-if="!isAuthChecking">
    <Header @open-login="isLoginOpen = true"></Header>
    <LoginPopup :isOpen="isLoginOpen" @close="isLoginOpen = false" />
    <router-view />
  </template>
  
  <!-- Toast Container (always visible) -->
  <ToastContainer />
</template>

<script setup>
  import LoginPopup from './components/LoginPopup.vue'
  import Header from './components/Header.vue'
  import ToastContainer from './components/ui/ToastContainer.vue'
  import GlobalProgressBar from './components/ui/GlobalProgressBar.vue'
  import FullPageLoader from './components/ui/FullPageLoader.vue'
  import { ref, watch, computed } from 'vue'
  import { useLoadingStore } from '@/stores/loading'
  
  const loadingStore = useLoadingStore()
  const isLoginOpen = ref(false)
  
  const isAuthChecking = computed(() => loadingStore.isAuthChecking)
  
  watch(isLoginOpen, (newVal, oldVal) => {
  })
</script>