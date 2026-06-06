import { getApiUrl } from './config'

export interface CountryOption {
  code: string
  name: string
}

export interface ReferenceListResponse<T> {
  success: boolean
  data: T[]
}

let countriesCache: CountryOption[] | null = null
let languagesCache: string[] | null = null

export async function fetchCountries(force = false): Promise<CountryOption[]> {
  if (!force && countriesCache) return countriesCache

  const response = await fetch(getApiUrl('/countries'))
  if (!response.ok) {
    throw new Error(`Failed to fetch countries: ${response.statusText}`)
  }

  const json = (await response.json()) as ReferenceListResponse<CountryOption>
  countriesCache = Array.isArray(json.data) ? json.data : []
  return countriesCache
}

export async function fetchTalentLanguages(force = false): Promise<string[]> {
  if (!force && languagesCache) return languagesCache

  const response = await fetch(getApiUrl('/talent-languages'))
  if (!response.ok) {
    throw new Error(`Failed to fetch talent languages: ${response.statusText}`)
  }

  const json = (await response.json()) as ReferenceListResponse<string>
  languagesCache = Array.isArray(json.data) ? json.data : []
  return languagesCache
}

export function clearReferenceDataCache(): void {
  countriesCache = null
  languagesCache = null
}
