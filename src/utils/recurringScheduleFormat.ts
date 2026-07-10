import type { RecurringSeriesPayload } from '@/api/recurringSeries'
import { horizonLabel } from '@/utils/recurringHorizon'

export interface WeekdayOption {
  value: number
  label: string
  fullLabel: string
}

export const WEEKDAY_OPTIONS: WeekdayOption[] = [
  { value: 1, label: 'Mon', fullLabel: 'Monday' },
  { value: 2, label: 'Tue', fullLabel: 'Tuesday' },
  { value: 3, label: 'Wed', fullLabel: 'Wednesday' },
  { value: 4, label: 'Thu', fullLabel: 'Thursday' },
  { value: 5, label: 'Fri', fullLabel: 'Friday' },
  { value: 6, label: 'Sat', fullLabel: 'Saturday' },
  { value: 7, label: 'Sun', fullLabel: 'Sunday' },
]

const weekdayByValue = new Map(WEEKDAY_OPTIONS.map((d) => [d.value, d]))

export function formatWeekdayList(weekdays: number[] | undefined, fullNames = false): string {
  const sorted = [...(weekdays ?? [])].sort((a, b) => a - b)
  if (sorted.length === 0) return '—'

  return sorted
    .map((value) => {
      const day = weekdayByValue.get(value)
      if (!day) return String(value)
      return fullNames ? day.fullLabel : day.label
    })
    .join(fullNames ? '\n' : ', ')
}

export function formatDisplayDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Open-ended'
  const date = new Date(`${dateStr}T12:00:00`)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatRecurringScheduleSummary(schedule: RecurringSeriesPayload): {
  repeatLabel: string
  startLabel: string
  endLabel: string
  timezoneLabel: string
  horizonLabel: string
} {
  return {
    repeatLabel: formatWeekdayList(schedule.recurrence_rules.weekdays, true),
    startLabel: formatDisplayDate(schedule.start_date),
    endLabel: formatDisplayDate(schedule.end_date),
    timezoneLabel: schedule.timezone || '—',
    horizonLabel: horizonLabel(),
  }
}

export function isoWeekdayFromDate(dateStr: string): number {
  const d = new Date(`${dateStr}T12:00:00`)
  const day = d.getDay()
  return day === 0 ? 7 : day
}
