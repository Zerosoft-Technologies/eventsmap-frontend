import { getApiUrl } from './config'

export interface Subcategory {
  id: number
  name: string
  slug: string
}

export interface Category {
  id: number
  name: string
  slug: string
  subcategories: Subcategory[]
}

export interface CategoriesResponse {
  success: boolean
  data: Category[]
}

export interface CategoryResponse {
  success: boolean
  data: Category
}

/**
 * API Error class for handling non-200 responses
 */
class ApiError extends Error {
  status: number
  response?: unknown
  
  constructor(message: string, status: number, response?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.response = response
  }
}

/**
 * Which profile taxonomy to load categories from (header discovery / map search).
 */
export type ProfileCategorySource = 'events' | 'talents' | 'organisers' | 'venues'

const PROFILE_CATEGORY_PATHS: Record<ProfileCategorySource, string> = {
  events: '/categories',
  talents: '/categories-talents',
  organisers: '/categories-organisers',
  venues: '/categories-venue',
}

/**
 * Fetch categories for a profile type (events, talents, organisers, venues).
 */
export async function fetchCategoriesForProfile(
  source: ProfileCategorySource
): Promise<Category[]> {
  const path = PROFILE_CATEGORY_PATHS[source]
  return fetchCategoriesFromPath(path)
}

async function fetchCategoriesFromPath(path: string): Promise<Category[]> {
  const url = getApiUrl(path)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        `Failed to fetch categories: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    const result: CategoriesResponse = await response.json()

    if (!result.success) {
      throw new ApiError('API returned success: false', 400, result)
    }

    return result.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}

/**
 * Fetch all event categories with subcategories (same as talents/venues taxonomies, events endpoint).
 */
export async function fetchCategories(): Promise<Category[]> {
  return fetchCategoriesForProfile('events')
}

/**
 * Fetch a single category by slug
 */
export async function fetchCategory(slug: string): Promise<Category> {
  const url = getApiUrl(`/categories/${slug}`)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        `Failed to fetch category: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    const result: CategoryResponse = await response.json()
    
    if (!result.success) {
      throw new ApiError('API returned success: false', 400, result)
    }

    return result.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}
