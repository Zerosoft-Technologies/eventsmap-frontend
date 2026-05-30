<template>
  <!-- Global Progress Bar (always visible during API calls) -->
  <GlobalProgressBar />
  
  <!-- Full Page Loader (shown during initial auth check) -->
  <FullPageLoader message="Loading Events Map..." />
  
  <!-- Main App Content (hidden during auth check) -->
  <template v-if="!isAuthChecking">
    <Header @toggle-wishlist="toggleWishlist"></Header>
    <router-view />
    
    <!-- Right Wishlist Sidebar (independent from left sidebar) -->
    <RightWishlistSidebar 
      :visible="isWishlistOpen" 
      @close="isWishlistOpen = false"
    />

    <!-- Global Chat Sidebar (premium users) -->
    <ChatSidebar
      v-if="authStore.isAuthenticated"
      :is-open="chatStore.isOpen"
      :current-user-id="authStore.user?.id ?? 0"
      @close="chatStore.close"
    />
  </template>
  
  <!-- Toast Container (always visible) -->
  <ToastContainer />
</template>

<script setup>
  import Header from './components/Header.vue'
  import ToastContainer from './components/ui/ToastContainer.vue'
  import GlobalProgressBar from './components/ui/GlobalProgressBar.vue'
  import FullPageLoader from './components/ui/FullPageLoader.vue'
  import RightWishlistSidebar from './components/RightWishlistSidebar.vue'
  import ChatSidebar from './components/chat/ChatSidebar.vue'
  import { ref, watch, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useLoadingStore } from '@/stores/loading'
  import { useAuthStore } from '@/stores/auth'
  import { useWishlistStore } from '@/stores/wishlistStore'
  import { useChatStore } from '@/stores/chatStore'
  
  const loadingStore = useLoadingStore()
  const authStore = useAuthStore()
  const wishlistStore = useWishlistStore()
  const chatStore = useChatStore()
  const router = useRouter()
  const route = useRoute()
  const isWishlistOpen = ref(false)
  
  const isAuthChecking = computed(() => loadingStore.isAuthChecking)
  
  // Toggle wishlist sidebar with auth guard
  function toggleWishlist() {
    if (!authStore.isAuthenticated) {
      const path = route.path.toLowerCase()
      if (path === '/login' || path === '/register') {
        router.push({ name: 'Login' })
      } else {
        router.push({ name: 'Login', query: { redirect: route.fullPath } })
      }
      return
    }
    isWishlistOpen.value = !isWishlistOpen.value
  }
  
  // Fetch wishlist when user becomes authenticated, clear on logout
  watch(() => authStore.isAuthenticated, (isAuth) => {
    if (isAuth) {
      wishlistStore.fetchWishlist()
      // Sign in to Firebase so notification (and chat) listeners can read Firestore
      import('@/services/chatService').then(({ chatService }) =>
        chatService.getFirebaseToken().then((token) =>
          import('firebase/auth').then(({ signInWithCustomToken }) =>
            import('@/services/firebase').then(({ firebaseAuth }) =>
              signInWithCustomToken(firebaseAuth, token).catch(() => {})
            )
          )
        ).catch(() => {})
      )
    } else {
      wishlistStore.clearWishlist()
      isWishlistOpen.value = false // Close wishlist panel on logout
    }
  }, { immediate: true })
</script>