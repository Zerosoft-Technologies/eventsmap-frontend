import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { AxiosError } from 'axios'

export interface User {
  id: number
  name: string
  email: string
  /** Account profile photo (API may send one or more of these keys) */
  avatar_url?: string | null
  profile_image_url?: string | null
  profile_image_path?: string | null
  profile_photo_url?: string | null
  full_name?: string | null
  role?: string
  is_active?: boolean
  email_verified?: boolean
  email_verified_at?: string | null
  account_type: 'free' | 'premium'
  profile_type: string
  status: 'active' | 'pending_payment' | 'suspended'
  billing_type?: 'individual' | 'business' | 'private' | string | null
  company_name?: string | null
  vat_number?: string | null
  vat_validated?: boolean
  address?: string | null
  postal_code?: string | null
  city?: string | null
  country?: string | null
  created_at: string
  updated_at?: string
}

interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string[]>
  error?: {
    message?: string
    code?: string
  }
}

export function normalizeUserPayload(raw: Record<string, unknown>): User {
  const u = raw as unknown as User & { profileType?: string; accountType?: string }
  return {
    ...raw,
    profile_type: u.profile_type ?? u.profileType ?? '',
    account_type: u.account_type ?? u.accountType ?? 'free',
  } as unknown as User
}

export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────────
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)
  const validationErrors = ref<Record<string, string[]>>({})
  const authReady = ref(false) // Tracks if initial auth check is complete

  // ── Getters ────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const isPremiumPending = computed(() =>
    user.value?.account_type === 'premium' && user.value?.status === 'pending_payment'
  )

  // ── Helpers ────────────────────────────────────────────
  function setToken(newToken: string | null) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  function clearErrors() {
    error.value = null
    validationErrors.value = {}
  }

  function handleError(err: unknown) {
    const axiosErr = err as AxiosError<ApiErrorResponse>
    if (axiosErr.response?.data) {
      const data = axiosErr.response.data
      error.value = data?.message || data?.error?.message || 'An unexpected error occurred.'
      if (data.errors) {
        validationErrors.value = data.errors
      }
    } else {
      error.value = 'Network error. Please try again.'
    }
  }

  // ── Actions ────────────────────────────────────────────

  function setUser(userData: User) {
    user.value = userData
  }

  async function register(payload: {
    name: string
    email: string
    password: string
    password_confirmation: string
    profile_type: string
  }) {
    loading.value = true
    clearErrors()
    try {
      const { data } = await api.post('/auth/register', payload)
      const responseData = data.data || data
      return { success: true, checkout_url: responseData.checkout_url || null }
    } catch (err) {
      handleError(err)
      return { success: false, checkout_url: null }
    } finally {
      loading.value = false
    }
  }

  async function login(payload: { email: string; password: string }) {
    loading.value = true
    clearErrors()
    try {
      const { data } = await api.post('/auth/login', payload)
      
      // Backend returns: { success: true, data: { user, token } }
      const responseData = data.data || data
      const userData = responseData.user || responseData
      const tokenStr = responseData.token || responseData.access_token
      
      if (!userData) {
        throw new Error('No user data received from server')
      }
      
      // Set token first
      if (tokenStr) {
        setToken(tokenStr)
      }
      
      user.value = normalizeUserPayload(userData as Record<string, unknown>)
      
      return { success: true, emailVerified: userData.email_verified ?? userData.emailVerified ?? true }
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>
      handleError(err)
      // Check if the error indicates unverified email
      const msg = axiosErr.response?.data?.message?.toLowerCase() || ''
      if (msg.includes('verify') || msg.includes('verified') || axiosErr.response?.status === 403) {
        return { success: false, emailVerified: false }
      }
      return { success: false, emailVerified: true }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    clearErrors()
    try {
      await api.post('/auth/logout')
    } catch {
      // Logout even if the API call fails
    } finally {
      user.value = null
      setToken(null)
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return
    loading.value = true
    clearErrors()
    try {
      const { data } = await api.get('/auth/me')
      const raw = data.data || data.user || data
      user.value = raw ? normalizeUserPayload(raw as Record<string, unknown>) : null
    } catch (err) {
      handleError(err)
      // Token is invalid — clear it
      user.value = null
      setToken(null)
    } finally {
      loading.value = false
    }
  }

  /** Refresh current user from API without toggling global `loading` (e.g. after profile save). */
  async function syncUserFromServer(): Promise<boolean> {
    if (!token.value) return false
    try {
      const { data } = await api.get('/auth/me')
      const raw = data.data || data.user || data
      if (raw && typeof raw === 'object' && 'id' in raw) {
        user.value = normalizeUserPayload(raw as Record<string, unknown>)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  async function resendVerification(email: string) {
    loading.value = true
    clearErrors()
    try {
      const { data } = await api.post('/auth/email/resend', { email })
      return data.message || 'Verification email sent.'
    } catch (err) {
      handleError(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function verifyEmail(id: string, hash: string, queryParams: string) {
    loading.value = true
    clearErrors()
    try {
      const { data } = await api.post(`/auth/email/verify/${id}/${hash}${queryParams}`)
      return data.message || 'Email verified successfully.'
    } catch (err) {
      handleError(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function forgotPassword(email: string) {
    loading.value = true
    clearErrors()
    try {
      const { data } = await api.post('/auth/password/forgot', { email })
      return data.message || 'Password reset link sent.'
    } catch (err) {
      handleError(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(payload: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }) {
    loading.value = true
    clearErrors()
    try {
      const { data } = await api.post('/auth/password/reset', payload)
      return data.message || 'Password reset successfully.'
    } catch (err) {
      handleError(err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Initialize auth state on app startup.
   * Safe to call from bootstrap and router guards concurrently.
   */
  let authInitPromise: Promise<void> | null = null

  function markAuthReady() {
    authReady.value = true
    authInitPromise = null
  }

  async function initializeAuth(): Promise<void> {
    if (authReady.value) return
    if (authInitPromise) return authInitPromise

    authInitPromise = (async () => {
      try {
        if (token.value) {
          try {
            await fetchUser()
          } catch {
            // Invalid token — already handled in fetchUser
          }
        }
      } finally {
        authReady.value = true
        authInitPromise = null
      }
    })()

    return authInitPromise
  }

  return {
    // state
    user,
    token,
    loading,
    error,
    validationErrors,
    authReady,
    // getters
    isAuthenticated,
    isPremiumPending,
    // actions
    register,
    login,
    logout,
    fetchUser,
    syncUserFromServer,
    setUser,
    setToken,
    resendVerification,
    verifyEmail,
    forgotPassword,
    resetPassword,
    clearErrors,
    initializeAuth,
    markAuthReady,
  }
})
