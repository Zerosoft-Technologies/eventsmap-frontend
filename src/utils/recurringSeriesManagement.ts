import type { RecurringSeries } from '@/api/recurringSeries'
import { formatDisplayDate, formatWeekdayList } from '@/utils/recurringScheduleFormat'

export interface MyEventOccurrence {
  id: number
  series_id?: number | null
  event_date?: string | null
  start_time?: string | null
  start_datetime?: string | null
  status?: string | null
  is_modified?: boolean
  is_series_instance?: boolean
  title?: string
}

export function getSeriesName(series: RecurringSeries): string {
  return (
    series.event_template?.title
    ?? (series.recurrence_rules?.event_template as { title?: string } | undefined)?.title
    ?? `Series #${series.id}`
  )
}

export function formatRecurrencePattern(series: RecurringSeries): string {
  if (series.recurrence_type === 'weekly') {
    const days = formatWeekdayList(series.recurrence_rules?.weekdays)
    return days === '—' ? 'Weekly' : `Weekly · ${days}`
  }
  return series.recurrence_type
}

export function isSeriesInstanceEvent(event: MyEventOccurrence): boolean {
  return !!(event.is_series_instance || event.series_id)
}

export function isCustomOccurrence(event: MyEventOccurrence): boolean {
  return isSeriesInstanceEvent(event) && !!event.is_modified
}

export function isRepeatsWeeklyOccurrence(event: MyEventOccurrence): boolean {
  return isSeriesInstanceEvent(event) && !event.is_modified
}

function eventStartMoment(event: MyEventOccurrence): Date | null {
  if (event.start_datetime) {
    const dt = new Date(event.start_datetime.replace(' ', 'T'))
    if (!Number.isNaN(dt.getTime())) return dt
  }
  if (!event.event_date) return null
  const time = (event.start_time ?? '00:00:00').slice(0, 8)
  const dt = new Date(`${event.event_date}T${time}`)
  return Number.isNaN(dt.getTime()) ? null : dt
}

export function getSeriesOccurrences(
  seriesId: number,
  events: MyEventOccurrence[],
): MyEventOccurrence[] {
  return events
    .filter((e) => Number(e.series_id) === Number(seriesId))
    .sort((a, b) => {
      const aDt = eventStartMoment(a)?.getTime() ?? 0
      const bDt = eventStartMoment(b)?.getTime() ?? 0
      return aDt - bDt
    })
}

export function getNextOccurrenceForSeries(
  seriesId: number,
  events: MyEventOccurrence[],
): MyEventOccurrence | null {
  const now = Date.now()
  const upcoming = getSeriesOccurrences(seriesId, events).filter((event) => {
    if (event.status === 'cancelled') return false
    const start = eventStartMoment(event)
    return start != null && start.getTime() >= now
  })
  return upcoming[0] ?? null
}

export function formatNextOccurrenceLabel(event: MyEventOccurrence | null): string {
  if (!event?.event_date) return 'None scheduled'
  const date = formatDisplayDate(event.event_date)
  const time = event.start_time ? event.start_time.slice(0, 5) : null
  return time ? `${date} · ${time}` : date
}

export type SeriesScheduleStatus = 'active' | 'no_upcoming'

export function getSeriesScheduleStatus(
  seriesId: number,
  events: MyEventOccurrence[],
): SeriesScheduleStatus {
  return getNextOccurrenceForSeries(seriesId, events) ? 'active' : 'no_upcoming'
}

export function seriesScheduleStatusLabel(status: SeriesScheduleStatus): string {
  return status === 'active' ? 'Active' : 'No upcoming'
}

export function seriesApprovalStatusLabel(series: RecurringSeries): string {
  return series.is_approved ? 'Approved' : 'Pending approval'
}
