import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { AxiosError } from 'axios'

export interface User {
  id: number
  name: string
  email: string
  email_verified?: boolean
  email_verified_at?: string | null
  account_type: 'free' | 'premium'
  profile_type: string
  status: 'active' | 'pending_payment' | 'suspended'
  country?: string | null
  created_at: string
  updated_at?: string
}

interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string[]>
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
      error.value = data.message || 'An unexpected error occurred.'
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
      const user = responseData.user || responseData
      const token = responseData.token || responseData.access_token
      
      if (!user) {
        throw new Error('No user data received from server')
      }
      
      // Set token first
      if (token) {
        setToken(token)
      }
      
      // Then set user data
      user.value = user
      
      return { success: true, emailVerified: user.email_verified || true }
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
      user.value = data.data || data.user || data
    } catch (err) {
      handleError(err)
      // Token is invalid — clear it
      user.value = null
      setToken(null)
    } finally {
      loading.value = false
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
   * Must be called before router is ready.
   * For token-based auth, check if token exists and fetch user.
   */
  async function initializeAuth(): Promise<void> {
    if (authReady.value) return // Already initialized
    
    // For token-based auth, only fetch if token exists
    if (token.value) {
      try {
        await fetchUser()
      } catch {
        // Token invalid - already handled in fetchUser
      }
    }
    authReady.value = true
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
    setUser,
    setToken,
    resendVerification,
    verifyEmail,
    forgotPassword,
    resetPassword,
    clearErrors,
    initializeAuth,
  }
})
