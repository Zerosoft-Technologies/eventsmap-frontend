/** ISO 3166-1 alpha-2 → regional indicator flag emoji. */
export function countryCodeToFlagEmoji(code: string | null | undefined): string {
  if (!code || code.length !== 2) return ''
  const upper = code.toUpperCase()
  const chars = [...upper]
  if (chars.length !== 2) return ''
  return String.fromCodePoint(
    ...chars.map((c) => 0x1f1e6 - 65 + c.charCodeAt(0)),
  )
}

export interface NationalityListItem {
  code: string
  name: string
  flag?: string
}

/** Parse comma-separated nationality codes from API. */
export function parseNationalityCodes(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .map((v) => String(v ?? '').trim().toUpperCase())
      .filter((c) => c.length === 2)
      .slice(0, 2)
  }
  if (typeof raw !== 'string' || !raw.trim()) return []
  return raw
    .split(',')
    .map((p) => p.trim().toUpperCase())
    .filter((c) => c.length === 2)
    .slice(0, 2)
}

export function formatNationalityLabel(item: NationalityListItem): string {
  const flag = item.flag || countryCodeToFlagEmoji(item.code)
  return flag ? `${flag} ${item.name}` : item.name
}
