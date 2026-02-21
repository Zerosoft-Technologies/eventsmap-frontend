import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
// src/main.js or main.ts
import './assets/styles/event-form.css'

// Add hover-enabled class to body for system-wide hover effects
document.body.classList.add('hover-enabled')

const app = createApp(App)
app.use(router)
app.use(i18n)
console.log('i18n registered successfully')
app.mount('#app')
