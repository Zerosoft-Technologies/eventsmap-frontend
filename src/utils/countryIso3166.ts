import type { CountryOption } from '@/api/referenceData'
import { fetchCountries } from '@/api/referenceData'

/** Resolve stored nationality (ISO code or legacy country name) to ISO 3166-1 alpha-2. */
export function resolveCountryCode(
  value: string | null | undefined,
  countries: CountryOption[],
): string {
  const raw = String(value ?? '').trim()
  if (!raw) return ''

  if (raw.length === 2) {
    const upper = raw.toUpperCase()
    if (countries.some((c) => c.code === upper)) return upper
  }

  const byName = countries.find((c) => c.name.toLowerCase() === raw.toLowerCase())
  if (byName) return byName.code

  return raw.length === 2 ? raw.toUpperCase() : ''
}

export function countryNameForCode(
  code: string | null | undefined,
  countries: CountryOption[],
): string {
  const resolved = resolveCountryCode(code, countries)
  if (!resolved) return String(code ?? '').trim()
  return countries.find((c) => c.code === resolved)?.name ?? resolved
}

export async function loadCountriesWithFallback(): Promise<CountryOption[]> {
  try {
    return await fetchCountries()
  } catch {
    return []
  }
}
