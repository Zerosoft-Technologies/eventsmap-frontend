import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Home from '../pages/Home.vue'
import CreateProfile from '../pages/CreateProfile.vue'
import CreateEventFree from '../pages/packages/CreateEventFree.vue'
import EventReport from '../pages/packages/events-navlinks/EventReport.vue'
import EventSettings from '../pages/packages/events-navlinks/EventSettings.vue'
import CreateEventPremium from '../pages/packages/CreateEventPremium.vue'
import EventPremiumReport from '../pages/packages/events-navlinks/EventPremiumReport.vue'
import EventPremiumSettings from '../pages/packages/events-navlinks/EventPremiumSettings.vue'

import CreateEventOrganiserFree from '../pages/packages/CreateEventOrganiserFree.vue'
import EventOrganiserReport from '../pages/packages/eventorganiser-navlinks/EventOrganiserReport.vue'
import EventOrganiserSettings from '../pages/packages/eventorganiser-navlinks/EventOrganiserSettings.vue'
import CreateEventOrganiserPremium from '../pages/packages/CreateEventOrganiserPremium.vue'
import EventOrganiserPremiumReport from '../pages/packages/eventorganiser-navlinks/EventOrganiserPremiumReport.vue'
import EventOrganiserPremiumSettings from '../pages/packages/eventorganiser-navlinks/EventOrganiserPremiumSettings.vue'

import CreateTalentsFree from '../pages/packages/CreateTalentsFree.vue'
import TalentsReport from '../pages/packages/talents-navlinks/TalentsReport.vue'
import TalentsSettings from '../pages/packages/talents-navlinks/TalentsSettings.vue'
import CreateTalentsPremium from '../pages/packages/CreateTalentsPremium.vue'
import TalentsPremiumReport from '../pages/packages/talents-navlinks/TalentsPremiumReport.vue'
import TalentsPremiumSettings from '../pages/packages/talents-navlinks/TalentsPremiumSettings.vue'

import CreateVenueFree from '../pages/packages/CreateVenueFree.vue'
import VenueReport from '../pages/packages/venue-navlinks/VenueReport.vue'
import VenueSettings from '../pages/packages/venue-navlinks/VenueSettings.vue'
import CreateVenuePremium from '../pages/packages/CreateVenuePremium.vue'
import VenuePremiumReport from '../pages/packages/venue-navlinks/VenuePremiumReport.vue'
import VenuePremiumSettings from '../pages/packages/venue-navlinks/VenuePremiumSettings.vue'

// Auth pages (lazy-loaded)
const Login = () => import('../pages/auth/Login.vue')
const Register = () => import('../pages/auth/Register.vue')
const ForgotPassword = () => import('../pages/auth/ForgotPassword.vue')
const ResetPassword = () => import('../pages/auth/ResetPassword.vue')
const VerifyEmail = () => import('../pages/auth/VerifyEmail.vue')
const Dashboard = () => import('../pages/Dashboard.vue')

const routes: RouteRecordRaw[] = [
  // ── Public Routes ───────────────────────────────────────
  { path: '/', name: 'Home', component: Home },

  // ── Auth Routes (guest only) ────────────────────────────
  { path: '/login', name: 'Login', component: Login, meta: { guest: true } },
  { path: '/register', name: 'Register', component: Register, meta: { guest: true } },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword, meta: { guest: true } },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword, meta: { guest: true } },
  { path: '/email/verify/:id/:hash', name: 'VerifyEmail', component: VerifyEmail },

  // ── Protected Routes ────────────────────────────────────
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/create-profile', name: 'CreateProfile', component: CreateProfile, meta: { requiresAuth: true } },

  { path: '/create-event-free', name: 'CreateEventFree', component: CreateEventFree, meta: { requiresAuth: true } },
  { path: '/create-event-free/report', name: 'EventReport', component: EventReport, meta: { requiresAuth: true } },
  { path: '/create-event-free/settings', name: 'EventSettings', component: EventSettings, meta: { requiresAuth: true } },

  { path: '/create-event-premium', name: 'CreateEventPremium', component: CreateEventPremium, meta: { requiresAuth: true } },
  { path: '/create-event-premium/report', name: 'EventPremiumReport', component: EventPremiumReport, meta: { requiresAuth: true } },
  { path: '/create-event-premium/settings', name: 'EventPremiumSettings', component: EventPremiumSettings, meta: { requiresAuth: true } },

  { path: '/create-organiser-free', name: 'CreateEventOrganiserFree', component: CreateEventOrganiserFree, meta: { requiresAuth: true } },
  { path: '/create-organiser-free/report', name: 'EventOrganiserReport', component: EventOrganiserReport, meta: { requiresAuth: true } },
  { path: '/create-organiser-free/settings', name: 'EventOrganiserSettings', component: EventOrganiserSettings, meta: { requiresAuth: true } },

  { path: '/create-organiser-premium', name: 'CreateEventOrganiserPremium', component: CreateEventOrganiserPremium, meta: { requiresAuth: true } },
  { path: '/create-organiser-premium/report', name: 'EventOrganiserPremiumReport', component: EventOrganiserPremiumReport, meta: { requiresAuth: true } },
  { path: '/create-organiser-premium/settings', name: 'EventOrganiserPremiumSettings', component: EventOrganiserPremiumSettings, meta: { requiresAuth: true } },

  { path: '/create-talents-free', name: 'CreateTalentsFree', component: CreateTalentsFree, meta: { requiresAuth: true } },
  { path: '/create-talents-free/report', name: 'TalentsReport', component: TalentsReport, meta: { requiresAuth: true } },
  { path: '/create-talents-free/settings', name: 'TalentsSettings', component: TalentsSettings, meta: { requiresAuth: true } },

  { path: '/create-talents-premium', name: 'CreateTalentsPremium', component: CreateTalentsPremium, meta: { requiresAuth: true } },
  { path: '/create-talents-premium/report', name: 'TalentsPremiumReport', component: TalentsPremiumReport, meta: { requiresAuth: true } },
  { path: '/create-talents-premium/settings', name: 'TalentsPremiumSettings', component: TalentsPremiumSettings, meta: { requiresAuth: true } },

  { path: '/create-venue-free', name: 'CreateVenueFree', component: CreateVenueFree, meta: { requiresAuth: true } },
  { path: '/create-venue-free/report', name: 'VenueReport', component: VenueReport, meta: { requiresAuth: true } },
  { path: '/create-venue-free/settings', name: 'VenueSettings', component: VenueSettings, meta: { requiresAuth: true } },

  { path: '/create-venue-premium', name: 'CreateVenuePremium', component: CreateVenuePremium, meta: { requiresAuth: true } },
  { path: '/create-venue-premium/report', name: 'VenuePremiumReport', component: VenuePremiumReport, meta: { requiresAuth: true } },
  { path: '/create-venue-premium/settings', name: 'VenuePremiumSettings', component: VenuePremiumSettings, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ── Navigation Guard ──────────────────────────────────────
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Wait for auth to be initialized (important for page refresh)
  if (!authStore.authReady) {
    await authStore.initializeAuth()
  }

  // Protected route: requires authentication
  if (to.meta.requiresAuth) {
    // No token at all → redirect to login
    if (!authStore.token) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }
    // Token exists but user not loaded → try to fetch
    if (!authStore.user) {
      await authStore.fetchUser()
    }
    // After fetch attempt, still no user → token was invalid
    if (!authStore.user) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }
    // User is authenticated, allow access
    return next()
  }

  // Guest-only route: redirect authenticated users based on profile_type
  if (to.meta.guest && authStore.token && authStore.user) {
    return next(getRedirectRouteForUser(authStore.user))
  }

  next()
})

/**
 * Returns the appropriate route based on user's profile_type
 */
function getRedirectRouteForUser(user: { profile_type?: string } | null): string {
  if (!user?.profile_type) return '/dashboard'
  
  switch (user.profile_type) {
    case 'event':
      return '/create-event-free'
    case 'organizer':
      return '/create-organiser-free'
    case 'talent':
      return '/create-talents-free'
    case 'venue':
      return '/create-venue-free'
    default:
      return '/dashboard'
  }
}

export default router
