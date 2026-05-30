import { groupIntoMapClusters } from '@/utils/mapClustering'
import { getEventCardScheduleDisplay } from '@/utils/eventSchedule'

export function groupEventsIntoClusters(
  points: Array<{ event: Record<string, unknown>; latitude: number; longitude: number }>,
  precision: number,
) {
  return groupIntoMapClusters(
    points.map((p) => ({
      latitude: p.latitude,
      longitude: p.longitude,
      item: p.event,
    })),
    precision,
  ).map((c) => ({
    key: c.key,
    latitude: c.latitude,
    longitude: c.longitude,
    events: c.items,
  }))
}

export function eventTitle(event: Record<string, unknown>): string {
  const title = event.title ?? event.name
  return title != null && String(title).trim() ? String(title).trim() : '—'
}

export function eventCategoryName(event: Record<string, unknown>): string {
  const c = event.category
  if (c == null) return ''
  if (typeof c === 'string') return c.trim()
  if (typeof c === 'object' && c !== null && 'name' in c) {
    const name = (c as { name?: string }).name
    return typeof name === 'string' ? name : ''
  }
  return ''
}

export function eventScheduleLine(event: Record<string, unknown>, locale: string): string {
  const s = getEventCardScheduleDisplay(event, locale)
  if (!s.date && !s.startTime) return ''
  const timePart = [s.startTime, s.endTime].filter(Boolean).join(' – ')
  if (s.endDate) {
    return timePart ? `${s.date}, ${timePart} – ${s.endDate}` : `${s.date} – ${s.endDate}`
  }
  return timePart ? `${s.date}, ${timePart}` : s.date
}
