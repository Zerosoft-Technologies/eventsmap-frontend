/** API slug when a profile is live (matches sidebar publish-status PATCH). */
export const PUBLISHED_STATUS_SLUG = 'published'

const LEGACY_PUBLISHED_STATUSES = ['upcoming', 'completed', 'suspended', 'cancelled']

/**
 * Normalize API/list `status` or `publish_status` to `draft` | `published` (or other slug).
 */
export function normalizePublicationStatusSlug(
  raw: string | null | undefined
): string {
  const s = String(raw ?? 'draft').toLowerCase().trim()
  if (s === 'draft') return 'draft'
  if (s === PUBLISHED_STATUS_SLUG) return PUBLISHED_STATUS_SLUG
  if (LEGACY_PUBLISHED_STATUSES.includes(s)) return PUBLISHED_STATUS_SLUG
  return s
}

/** True when the profile should be treated as draft (hide from public / show draft banner). */
export function isPublicationDraft(raw: string | null | undefined): boolean {
  return normalizePublicationStatusSlug(raw) === 'draft'
}

/** Read publication status from a list row or detail payload (sidebar + forms). */
export function resolvePublicationStatusSlug(
  record: { publish_status?: string; status?: string } | null | undefined
): string {
  if (!record) return 'draft'
  const raw = record.publish_status ?? record.status ?? 'draft'
  return normalizePublicationStatusSlug(raw)
}
