import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/`, // Use /api/ to match backend
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
})

// Loading store reference (set after Pinia is initialized)
let loadingStore: {
  startLoading: () => void
  stopLoading: () => void
  forceStop: () => void
} | null = null

// Flag to track if interceptors are set up
let interceptorsSetup = false

// Setup loading interceptors (called after Pinia is initialized)
export function setupLoadingInterceptors(store: typeof loadingStore) {
  if (interceptorsSetup) return // Prevent duplicate interceptors
  
  loadingStore = store
  interceptorsSetup = true
}

// Request interceptor — attach Bearer token + trigger loading
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Start loading
    if (loadingStore) {
      loadingStore.startLoading()
    }
    
    // Attach token
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    // Stop loading on request error
    if (loadingStore) {
      loadingStore.forceStop()
    }
    return Promise.reject(error)
  }
)

// Response interceptor — handle 401/403 globally + stop loading
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Stop loading on success
    if (loadingStore) {
      loadingStore.stopLoading()
    }
    return response
  },
  (error: AxiosError<{ status?: string }>) => {
    // Stop loading on error
    if (loadingStore) {
      loadingStore.stopLoading()
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Avoid circular import: use window location for hard redirect
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    if (
      error.response?.status === 403 &&
      error.response?.data?.status === 'pending_payment'
    ) {
      // Avoid circular import: use window location for hard redirect
      if (window.location.pathname !== '/payment-required') {
        window.location.href = '/payment-required'
      }
    }

    return Promise.reject(error)
  }
)

export default api
