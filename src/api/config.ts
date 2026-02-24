/**
 * API Configuration
 * 
 * The API_BASE_URL can be configured via environment variable VITE_API_BASE_URL
 * or defaults to localhost:8000 for local development.
 * 
 * To configure:
 * 1. Create a .env file in project root
 * 2. Add: VITE_API_BASE_URL=https://your-api-domain.com
 * 
 * For production, set the environment variable in your deployment config.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const API_PREFIX_V1 = '/api/v1'
export const API_PREFIX_V2 = '/api/v2'

// Legacy v1 API helper (for backwards compatibility)
export const API_PREFIX = API_PREFIX_V1

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${API_PREFIX_V1}${endpoint}`
}

export const getApiUrlV2 = (endpoint: string): string => {
  return `${API_BASE_URL}${API_PREFIX_V2}${endpoint}`
}
