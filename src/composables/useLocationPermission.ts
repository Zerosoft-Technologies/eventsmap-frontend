import { ref, readonly, computed } from 'vue'

// Store coords at module level for one-location-per-session
let sessionCoords: GeolocationPosition | null = null

export type PermissionStatus = 'granted' | 'prompt' | 'denied' | 'unsupported'

export interface LocationCoords {
  latitude: number
  longitude: number
  accuracy: number
}

export interface LocationError {
  code: number
  message: string
  isPermissionDenied?: boolean
}

// Browser types for instructions
type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'unknown'

// Reactive state
const permissionStatus = ref<PermissionStatus>('prompt')
const coords = ref<LocationCoords | null>(null)
const error = ref<LocationError | null>(null)
const isLoading = ref(false)

// Fallback state for denied permissions
const isPermissionDenied = computed(() => permissionStatus.value === 'denied')
const showManualEnablePrompt = ref(false)
const lastRetryTime = ref(0)
const RETRY_COOLDOWN = 10000 // 10 seconds

// Check if Permissions API is supported
const isPermissionsSupported = () => {
  return 'permissions' in navigator && 'query' in (navigator.permissions as any)
}

// Check if Geolocation API is supported
const isGeolocationSupported = () => {
  return 'geolocation' in navigator
}

// Detect browser type for instructions
const detectBrowser = (): BrowserType => {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('chrome') && !ua.includes('edg')) return 'chrome'
  if (ua.includes('edg')) return 'edge'
  if (ua.includes('firefox')) return 'firefox'
  if (ua.includes('safari') && !ua.includes('chrome')) return 'safari'
  return 'unknown'
}

// Get browser-specific instructions
const getBrowserInstructions = (): string => {
  const browser = detectBrowser()
  switch (browser) {
    case 'chrome':
    case 'edge':
      return 'Click the 🔒 icon in the address bar → Location → Allow'
    case 'firefox':
      return 'Click the 🔒 icon in the address bar → More permissions → Allow'
    case 'safari':
      return 'Safari menu → Settings → Websites → Location → Allow'
    default:
      return 'Enable location access from your browser settings'
  }
}

// Convert GeolocationPosition to our coords format
const positionToCoords = (position: GeolocationPosition): LocationCoords => ({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
  accuracy: position.coords.accuracy
})

// Convert GeolocationPositionError to our error format
const positionErrorToError = (err: GeolocationPositionError): LocationError => ({
  code: err.code,
  message: err.message,
  isPermissionDenied: err.code === err.PERMISSION_DENIED
})

// Check current permission status
const checkPermissionStatus = async (): Promise<PermissionStatus> => {
  if (!isGeolocationSupported()) {
    return 'unsupported'
  }

  if (!isPermissionsSupported()) {
    // If Permissions API isn't supported, we can't check status
    // Assume prompt and try to get location
    return 'prompt'
  }

  try {
    const result = await (navigator.permissions as any).query({ name: 'geolocation' })
    return result.state as PermissionStatus
  } catch (err) {
    console.warn('Permission check failed:', err)
    return 'prompt'
  }
}

// Request location access
const requestLocation = async (): Promise<LocationCoords | null> => {
  if (!isGeolocationSupported()) {
    error.value = {
      code: 0,
      message: 'Geolocation is not supported by this browser',
      isPermissionDenied: false
    }
    permissionStatus.value = 'unsupported'
    return null
  }

  isLoading.value = true
  error.value = null

  return new Promise((resolve) => {
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        sessionCoords = position
        coords.value = positionToCoords(position)
        permissionStatus.value = 'granted'
        isLoading.value = false
        error.value = null
        resolve(coords.value)
      },
      (err) => {
        const locationError = positionErrorToError(err)
        error.value = locationError
        
        // Update permission status based on error
        if (locationError.isPermissionDenied) {
          permissionStatus.value = 'denied'
        } else {
          permissionStatus.value = 'prompt'
        }
        
        isLoading.value = false
        resolve(null)
      },
      options
    )
  })
}

// Get location (check permission first, then request if needed)
const getLocation = async (): Promise<LocationCoords | null> => {
  // Return session coords if already fetched
  if (sessionCoords) {
    coords.value = positionToCoords(sessionCoords)
    permissionStatus.value = 'granted'
    return coords.value
  }

  // Check current permission status
  const status = await checkPermissionStatus()
  permissionStatus.value = status

  if (status === 'granted') {
    // Permission already granted, get location
    showManualEnablePrompt.value = false
    return await requestLocation()
  } else if (status === 'prompt') {
    // Need to request permission
    showManualEnablePrompt.value = false
    return await requestLocation()
  } else if (status === 'denied') {
    // Permission denied, show manual enable prompt
    showManualEnablePrompt.value = true
    error.value = {
      code: 1,
      message: 'Location permission has been denied.',
      isPermissionDenied: true
    }
    return null
  } else {
    // Unsupported
    error.value = {
      code: 0,
      message: 'Geolocation is not supported by this browser',
      isPermissionDenied: false
    }
    return null
  }
}

// Check if retry is allowed (with cooldown)
const canRetryLocation = computed(() => {
  return Date.now() - lastRetryTime.value > RETRY_COOLDOWN
})

// Retry location check
const retryLocation = async (): Promise<LocationCoords | null> => {
  if (!canRetryLocation.value) {
    return null
  }
  
  lastRetryTime.value = Date.now()
  
  // Re-check permission status
  const status = await checkPermissionStatus()
  permissionStatus.value = status
  
  if (status === 'granted') {
    showManualEnablePrompt.value = false
    return await requestLocation()
  } else {
    // Still denied, keep prompt visible
    showManualEnablePrompt.value = true
    return null
  }
}

// Dismiss the manual enable prompt
const dismissLocationPrompt = () => {
  showManualEnablePrompt.value = false
}

// Reset location (for testing or manual location selection)
const resetLocation = () => {
  sessionCoords = null
  coords.value = null
  error.value = null
  permissionStatus.value = 'prompt'
}

// Listen for permission changes if supported
const watchPermissionChanges = () => {
  if (!isPermissionsSupported()) return

  (navigator.permissions as any).query({ name: 'geolocation' }).then((result: any) => {
    result.addEventListener('change', () => {
      permissionStatus.value = result.state
    })
  })
}

export function useLocationPermission() {
  // Start watching permission changes on mount
  watchPermissionChanges()

  return {
    // State (readonly to prevent external mutation)
    permissionStatus: readonly(permissionStatus),
    coords: readonly(coords),
    error: readonly(error),
    isLoading: readonly(isLoading),
    
    // Fallback state
    isPermissionDenied,
    showManualEnablePrompt: readonly(showManualEnablePrompt),
    canRetryLocation,
    
    // Methods
    getLocation,
    requestLocation,
    checkPermissionStatus,
    retryLocation,
    dismissLocationPrompt,
    resetLocation,
    
    // Utilities
    getBrowserInstructions,
    detectBrowser
  }
}
