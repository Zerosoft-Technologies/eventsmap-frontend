/** Tailwind classes for publication status pills (sidebar + badges). */
export function publicationStatusPillClass(slug: string | undefined): string {
  const s = String(slug || '').toLowerCase()
  switch (s) {
    case 'published':
    case 'upcoming':
      return 'tw:bg-sky-100 tw:text-sky-800 tw:border-sky-200/80'
    case 'completed':
      return 'tw:bg-emerald-100 tw:text-emerald-800 tw:border-emerald-200/80'
    case 'suspended':
      return 'tw:bg-amber-100 tw:text-amber-900 tw:border-amber-200/80'
    case 'cancelled':
      return 'tw:bg-gray-100 tw:text-gray-600 tw:border-gray-200/90'
    case 'draft':
      return 'tw:bg-slate-100 tw:text-slate-700 tw:border-slate-200/80'
    default:
      return 'tw:bg-slate-100 tw:text-slate-700 tw:border-slate-200/80'
  }
}

export function profileSidebarInitials(titleOrName: string | undefined): string {
  const parts = String(titleOrName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  const a = parts[0]![0]
  const b = parts[parts.length - 1]![0]
  if (a && b) return (a + b).toUpperCase()
  return parts[0]!.slice(0, 2).toUpperCase()
}
