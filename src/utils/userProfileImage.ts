import type { User } from '@/stores/auth'

/** Strip trailing `/api` so storage URLs hit the app origin (e.g. http://localhost:8001). */
export function apiPublicOrigin(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined) || ''
  const trimmed = raw.replace(/\/$/, '')
  if (!trimmed) return ''
  return trimmed.replace(/\/api$/i, '')
}

/** Build a public URL from a storage-relative path like `profiles/11/uuid.jpg`. */
export function resolveProfileImageFromPath(path: string | null | undefined): string {
  if (!path) return ''
  const s = String(path).trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) return s
  const origin = apiPublicOrigin()
  if (!origin) return s.startsWith('/') ? s : `/storage/${s.replace(/^\//, '')}`
  const clean = s.replace(/^\//, '')
  if (clean.startsWith('storage/')) return `${origin}/${clean}`
  return `${origin}/storage/${clean}`
}

/**
 * Resolved profile photo URL for the authenticated account (or any user-like object from the API).
 */
export function getUserProfileImageUrl(
  user: User | Record<string, unknown> | null | undefined,
): string {
  if (!user) return ''
  const u = user as Record<string, unknown>
  const url = pickFirstString(
    u.profile_image_url,
    u.avatar_url,
    u.profile_photo_url,
  )
  if (url) return url
  const path = u.profile_image_path
  if (typeof path === 'string' && path.trim()) return resolveProfileImageFromPath(path.trim())
  const loose = pickFirstString(u.avatar, u.profile_image)
  if (loose) return resolveProfileImageFromPath(loose)
  const media = pickFirstString(u.image_url, u.image, u.photo_url, u.main_image_url)
  if (media) {
    if (/^https?:\/\//i.test(media) || media.startsWith('/')) return media
    return resolveProfileImageFromPath(media)
  }
  return ''
}

function pickFirstString(...vals: unknown[]): string {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return ''
}
