export interface SocialMediaLinkItem {
  key: string
  label: string
  href: string
}

const PLATFORM_ORDER = [
  'facebook',
  'instagram',
  'tiktok',
  'twitter',
  'x',
  'youtube',
  'linkedin',
  'spotify',
  'threads',
  'snapchat'
] as const

const ORDER_SET = new Set<string>(PLATFORM_ORDER as unknown as string[])

function normalizeKey(key: string): string {
  return String(key).toLowerCase().trim()
}

export function normalizeHref(url: string): string {
  let href = url.trim()
  if (!href) return ''
  if (!/^https?:\/\//i.test(href)) {
    href = `https://${href.replace(/^\/+/, '')}`
  }
  return href
}

/** Matches Laravel `url` validation expectations for optional link fields. */
export function isValidHttpUrl(raw: string): boolean {
  const trimmed = raw.trim()
  if (!trimmed) return false
  const href = normalizeHref(trimmed)
  try {
    const u = new URL(href)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false
    const host = u.hostname.toLowerCase()
    if (!host) return false
    if (host === 'localhost') return true
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true
    if (!host.includes('.')) return false
    const tld = host.split('.').pop() ?? ''
    if (tld.length < 2) return false
    return /^[a-z0-9.-]+$/i.test(host)
  } catch {
    return false
  }
}

export const OPTIONAL_URL_VALIDATION_MESSAGE =
  'Please enter a valid URL (e.g. https://example.com).'

export type OptionalUrlValidationResult =
  | { ok: true; value?: string }
  | { ok: false; error: string }

/** Empty input is allowed; non-empty must be a valid http(s) URL after normalization. */
export function validateOptionalUrlInput(
  raw: string | null | undefined,
): OptionalUrlValidationResult {
  const trimmed = raw?.trim() ?? ''
  if (!trimmed) return { ok: true, value: undefined }
  if (!isValidHttpUrl(trimmed)) {
    return { ok: false, error: OPTIONAL_URL_VALIDATION_MESSAGE }
  }
  return { ok: true, value: normalizeHref(trimmed) }
}

function formatLabel(key: string): string {
  const k = normalizeKey(key).replace(/_/g, ' ')
  const map: Record<string, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    twitter: 'Twitter',
    x: 'X',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    spotify: 'Spotify',
    threads: 'Threads',
    snapchat: 'Snapchat'
  }
  if (map[k]) return map[k]
  return k.replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Build ordered, de-duplicated link list from API `social_media_urls` object.
 */
export function parseSocialMediaUrlEntries(raw: unknown): SocialMediaLinkItem[] {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return []

  const obj = raw as Record<string, unknown>
  const entries: SocialMediaLinkItem[] = []
  const seen = new Set<string>()

  const push = (keyRaw: string, urlRaw: unknown) => {
    if (typeof urlRaw !== 'string') return
    const href = normalizeHref(urlRaw)
    if (!href) return
    const key = normalizeKey(keyRaw)
    if (!key || seen.has(key)) return
    seen.add(key)
    entries.push({ key, label: formatLabel(keyRaw), href })
  }

  for (const k of PLATFORM_ORDER) {
    if (obj[k] != null) push(k, obj[k])
  }

  const rest = Object.keys(obj)
    .filter((k) => !ORDER_SET.has(normalizeKey(k)))
    .sort((a, b) => normalizeKey(a).localeCompare(normalizeKey(b)))

  for (const k of rest) {
    if (obj[k] != null) push(k, obj[k])
  }

  return entries
}
