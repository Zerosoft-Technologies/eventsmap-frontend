import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import './assets/css/responsive.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import { setupLoadingInterceptors } from '@/services/api'
import './assets/styles/event-form.css'

// Add hover-enabled class to body for system-wide hover effects
document.body.classList.add('hover-enabled')

const app = createApp(App)
const pinia = createPinia()

// IMPORTANT: Pinia must be registered BEFORE using any store
app.use(pinia)

// Initialize stores
const authStore = useAuthStore()
const loadingStore = useLoadingStore()

// Setup Axios loading interceptors with the loading store
setupLoadingInterceptors({
  startLoading: () => loadingStore.startLoading(),
  stopLoading: () => loadingStore.stopLoading(),
  forceStop: () => loadingStore.forceStop()
})

async function bootstrap() {
  // Register router and i18n first
  app.use(router)
  app.use(i18n)

  // Mount the app immediately so FullPageLoader is visible
  app.mount('#app')

  loadingStore.setAuthChecking(true)

  const AUTH_INIT_TIMEOUT_MS = 20_000

  try {
    await Promise.race([
      authStore.initializeAuth(),
      new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error('Auth initialization timed out')), AUTH_INIT_TIMEOUT_MS)
      }),
    ])
    await router.isReady()
  } catch (error) {
    console.error('Auth initialization failed:', error)
    // Never block the UI on a stuck /auth/me call
    authStore.setToken(null)
    authStore.markAuthReady()
    try {
      await router.isReady()
    } catch {
      // ignore
    }
  } finally {
    loadingStore.setAuthChecking(false)
  }
}

bootstrap().catch((error) => {
  console.error('App bootstrap failed:', error)
  useAuthStore().markAuthReady()
  loadingStore.setAuthChecking(false)
})
