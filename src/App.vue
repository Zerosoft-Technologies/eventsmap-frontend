<template>
  <!-- Global Progress Bar (always visible during API calls) -->
  <GlobalProgressBar />
  
  <!-- Full Page Loader (shown during initial auth check) -->
  <FullPageLoader message="Loading Events Map..." />
  
  <!-- Main App Content (hidden during auth check) -->
  <template v-if="!isAuthChecking">
    <Header 
      @open-login="isLoginOpen = true"
      @toggle-wishlist="toggleWishlist"
    ></Header>
    <LoginPopup :isOpen="isLoginOpen" @close="isLoginOpen = false" />
    <router-view />
    
    <!-- Right Wishlist Sidebar (independent from left sidebar) -->
    <RightWishlistSidebar 
      :visible="isWishlistOpen" 
      @close="isWishlistOpen = false"
    />
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
  import RightWishlistSidebar from './components/RightWishlistSidebar.vue'
  import { ref, watch, computed } from 'vue'
  import { useLoadingStore } from '@/stores/loading'
  import { useAuthStore } from '@/stores/auth'
  import { useWishlistStore } from '@/stores/wishlistStore'
  
  const loadingStore = useLoadingStore()
  const authStore = useAuthStore()
  const wishlistStore = useWishlistStore()
  const isLoginOpen = ref(false)
  const isWishlistOpen = ref(false)
  
  const isAuthChecking = computed(() => loadingStore.isAuthChecking)
  
  // Toggle wishlist sidebar with auth guard
  function toggleWishlist() {
    if (!authStore.isAuthenticated) {
      isLoginOpen.value = true
      return
    }
    isWishlistOpen.value = !isWishlistOpen.value
  }
  
  // Fetch wishlist when user becomes authenticated, clear on logout
  watch(() => authStore.isAuthenticated, (isAuth) => {
    if (isAuth) {
      wishlistStore.fetchWishlist()
    } else {
      wishlistStore.clearWishlist()
      isWishlistOpen.value = false // Close wishlist panel on logout
    }
  }, { immediate: true })
  
  watch(isLoginOpen, (newVal, oldVal) => {
  })
</script>