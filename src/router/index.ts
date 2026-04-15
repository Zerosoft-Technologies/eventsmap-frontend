import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import { getCreateRoute, getProfileAndAccountFromPath } from '@/utils/routeResolver'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresPremium?: boolean
    guest?: boolean
  }
}

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

import CreateRedirect from '../components/CreateRedirect.vue'

// Auth pages (lazy-loaded)
const Login = () => import('../pages/auth/Login.vue')
const Register = () => import('../pages/auth/Register.vue')
const ForgotPassword = () => import('../pages/auth/ForgotPassword.vue')
const ResetPassword = () => import('../pages/auth/ResetPassword.vue')
const VerifyEmail = () => import('../pages/auth/VerifyEmail.vue')
const EmailVerified = () => import('../pages/auth/EmailVerified.vue')
const PaymentSuccess = () => import('../pages/payment/PaymentSuccess.vue')
const PaymentCancel = () => import('../pages/payment/PaymentCancel.vue')
const PaymentRequired     = () => import('../pages/payment/PaymentRequired.vue')
const InvitationResponse  = () => import('../pages/InvitationResponse.vue')
const GalleryImagesPage   = () => import('../pages/GalleryImagesPage.vue')

const routes: RouteRecordRaw[] = [
  // ── Public Routes ───────────────────────────────────────
  { path: '/', name: 'Home', component: Home },
  { path: '/invitations/:id/respond', name: 'InvitationResponse', component: InvitationResponse },

  // ── Auth Routes (guest only) ────────────────────────────
  { path: '/login', name: 'Login', component: Login, meta: { guest: true } },
  { path: '/register', name: 'Register', component: Register, meta: { guest: true } },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword, meta: { guest: true } },
  { path: '/auth/reset-password', name: 'ResetPassword', component: ResetPassword, meta: { guest: true } },
  { path: '/email/verify/:id/:hash', name: 'VerifyEmail', component: VerifyEmail },
  { path: '/auth/email-verified', name: 'EmailVerified', component: EmailVerified },

  // ── Payment Routes ─────────────────────────────────────────
  { path: '/payment/success', name: 'PaymentSuccess', component: PaymentSuccess },
  { path: '/payment/cancel', name: 'PaymentCancel', component: PaymentCancel },
  { path: '/payment-required', name: 'PaymentRequired', component: PaymentRequired, meta: { requiresAuth: true } },

  // ── Protected Routes ────────────────────────────────────
  { path: '/create-profile', name: 'CreateProfile', component: CreateProfile, meta: { requiresAuth: true } },
  { path: '/create-redirect', name: 'CreateRedirect', component: CreateRedirect, meta: { requiresAuth: true } },

  { path: '/create-event-free', name: 'CreateEventFree', component: CreateEventFree, meta: { requiresAuth: true } },
  { path: '/create-event-free/report', name: 'EventReport', component: EventReport, meta: { requiresAuth: true } },
  { path: '/create-event-free/settings', name: 'EventSettings', component: EventSettings, meta: { requiresAuth: true } },

  { path: '/create-event-premium', name: 'CreateEventPremium', component: CreateEventPremium, meta: { requiresAuth: true, requiresPremium: true } },
  { path: '/create-event-premium/report', name: 'EventPremiumReport', component: EventPremiumReport, meta: { requiresAuth: true, requiresPremium: true } },
  { path: '/create-event-premium/settings', name: 'EventPremiumSettings', component: EventPremiumSettings, meta: { requiresAuth: true, requiresPremium: true } },
  { path: '/create-event-premium/gallery-images', name: 'EventPremiumGallery', component: GalleryImagesPage, meta: { requiresAuth: true, requiresPremium: true } },

  { path: '/create-organiser-free', name: 'CreateEventOrganiserFree', component: CreateEventOrganiserFree, meta: { requiresAuth: true } },
  { path: '/create-organiser-free/report', name: 'EventOrganiserReport', component: EventOrganiserReport, meta: { requiresAuth: true } },
  { path: '/create-organiser-free/settings', name: 'EventOrganiserSettings', component: EventOrganiserSettings, meta: { requiresAuth: true } },
  { path: '/create-organiser-free/gallery-images', name: 'EventOrganiserFreeGallery', component: GalleryImagesPage, meta: { requiresAuth: true } },

  { path: '/create-organiser-premium', name: 'CreateEventOrganiserPremium', component: CreateEventOrganiserPremium, meta: { requiresAuth: true, requiresPremium: true } },
  { path: '/create-organiser-premium/report', name: 'EventOrganiserPremiumReport', component: EventOrganiserPremiumReport, meta: { requiresAuth: true, requiresPremium: true } },
  { path: '/create-organiser-premium/settings', name: 'EventOrganiserPremiumSettings', component: EventOrganiserPremiumSettings, meta: { requiresAuth: true, requiresPremium: true } },
  { path: '/create-organiser-premium/gallery-images', name: 'EventOrganiserPremiumGallery', component: GalleryImagesPage, meta: { requiresAuth: true, requiresPremium: true } },

  { path: '/create-talents-free', name: 'CreateTalentsFree', component: CreateTalentsFree, meta: { requiresAuth: true } },
  { path: '/create-talents-free/report', name: 'TalentsReport', component: TalentsReport, meta: { requiresAuth: true } },
  { path: '/create-talents-free/settings', name: 'TalentsSettings', component: TalentsSettings, meta: { requiresAuth: true } },

  { path: '/create-talents-premium', name: 'CreateTalentsPremium', component: CreateTalentsPremium, meta: { requiresAuth: true, requiresPremium: true } },
  { path: '/create-talents-premium/report', name: 'TalentsPremiumReport', component: TalentsPremiumReport, meta: { requiresAuth: true, requiresPremium: true } },
  { path: '/create-talents-premium/settings', name: 'TalentsPremiumSettings', component: TalentsPremiumSettings, meta: { requiresAuth: true, requiresPremium: true } },
  { path: '/create-talents-premium/gallery-images', name: 'TalentsPremiumGallery', component: GalleryImagesPage, meta: { requiresAuth: true, requiresPremium: true } },

  { path: '/create-venue-free', name: 'CreateVenueFree', component: CreateVenueFree, meta: { requiresAuth: true } },
  { path: '/create-venue-free/report', name: 'VenueReport', component: VenueReport, meta: { requiresAuth: true } },
  { path: '/create-venue-free/settings', name: 'VenueSettings', component: VenueSettings, meta: { requiresAuth: true } },

  { path: '/create-venue-premium', name: 'CreateVenuePremium', component: CreateVenuePremium, meta: { requiresAuth: true, requiresPremium: true } },
  { path: '/create-venue-premium/report', name: 'VenuePremiumReport', component: VenuePremiumReport, meta: { requiresAuth: true, requiresPremium: true } },
  { path: '/create-venue-premium/settings', name: 'VenuePremiumSettings', component: VenuePremiumSettings, meta: { requiresAuth: true, requiresPremium: true } },
  { path: '/create-venue-premium/gallery-images', name: 'VenuePremiumGallery', component: GalleryImagesPage, meta: { requiresAuth: true, requiresPremium: true } },

  ]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ── Navigation Guard ──────────────────────────────────────
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const loadingStore = useLoadingStore()

  // Start page loading indicator
  loadingStore.startPageLoading()

  // Wait for auth to be initialized (important for page refresh)
  if (!authStore.authReady) {
    await authStore.initializeAuth()
  }

  // Legacy /dashboard → redirect to user's create page
  if (to.path === '/dashboard') {
    if (!authStore.token) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }
    if (!authStore.user) await authStore.fetchUser()
    if (!authStore.user) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }
    return next(getCreateRoute(authStore.user.profile_type, authStore.user.account_type))
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
    // Premium enforcement: premium user whose payment is not complete
    if (
      to.meta.requiresPremium &&
      authStore.user.account_type === 'premium' &&
      authStore.user.status === 'pending_payment'
    ) {
      return next({ name: 'PaymentRequired' })
    }

    // Premium-only route accessed by free user → redirect to home
    if (to.meta.requiresPremium && authStore.user.account_type !== 'premium') {
      return next({ name: 'Home' })
    }

    // Restrict create pages: user may only access their own create page (profile_type + account_type)
    const pathProfile = getProfileAndAccountFromPath(to.path)
    if (pathProfile) {
      const userProfile = authStore.user.profile_type === 'organizer' ? 'organiser' : authStore.user.profile_type
      const userProfileNorm = userProfile === 'talent' ? 'talents' : userProfile
      if (pathProfile.profileType !== userProfileNorm || pathProfile.accountType !== authStore.user.account_type) {
        return next(getCreateRoute(authStore.user.profile_type, authStore.user.account_type))
      }
    }

    // User is authenticated, allow access
    return next()
  }

  // Guest-only route: redirect authenticated users based on profile_type & account_type
  if (to.meta.guest && authStore.token && authStore.user) {
    return next(getCreateRoute(authStore.user.profile_type, authStore.user.account_type))
  }

  next()
})

// ── After Navigation Hook ─────────────────────────────────
router.afterEach(() => {
  const loadingStore = useLoadingStore()
  loadingStore.stopPageLoading()
})

export default router
