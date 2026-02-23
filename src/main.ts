import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useAuthStore } from '@/stores/auth'
import './assets/styles/event-form.css'

// Add hover-enabled class to body for system-wide hover effects
document.body.classList.add('hover-enabled')

const app = createApp(App)
const pinia = createPinia()

// IMPORTANT: Pinia must be registered BEFORE using any store
app.use(pinia)

// Initialize auth state BEFORE router processes any navigation
// This ensures user session is restored on page refresh
const authStore = useAuthStore()

async function bootstrap() {
  // Wait for auth initialization to complete
  await authStore.initializeAuth()
  
  // Now register router (guards will have access to auth state)
  app.use(router)
  app.use(i18n)
  
  // Wait for router to be ready before mounting
  await router.isReady()
  
  app.mount('#app')
}

bootstrap()
