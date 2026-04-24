/**
 * Normalize API `additional_images`: string URLs or `{ url }` objects.
 */
export function collectAdditionalImageUrls(additional: unknown): string[] {
  if (!Array.isArray(additional) || additional.length === 0) return []
  const urls: string[] = []
  for (const item of additional) {
    if (item == null) continue
    if (typeof item === 'string') {
      const t = item.trim()
      if (t) urls.push(t)
      continue
    }
    if (typeof item === 'object' && item !== null && 'url' in item) {
      const u = (item as { url?: unknown }).url
      if (typeof u === 'string' && u.trim()) urls.push(u.trim())
    }
  }
  return urls
}

/**
 * Cover first, then additional URLs. When `additional_images` is empty, returns `[cover]` only.
 */
export function buildEventGalleryImageUrls(event: {
  cover_image?: string | null
  additional_images?: unknown
}): string[] {
  const cover = event.cover_image?.trim() || ''
  const extra = collectAdditionalImageUrls(event.additional_images)
  if (extra.length === 0) {
    return cover ? [cover] : []
  }
  const out: string[] = []
  if (cover) out.push(cover)
  for (const u of extra) {
    if (u === cover) continue
    if (!out.includes(u)) out.push(u)
  }
  return out.length > 0 ? out : extra
}
