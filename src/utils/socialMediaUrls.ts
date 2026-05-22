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
