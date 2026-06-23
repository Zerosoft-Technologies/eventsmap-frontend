/** Time-of-day toggles from the header date picker (events + discovery profile APIs). */
export type DiscoverySessionFilter = {
  morning: boolean
  afternoon: boolean
  evening: boolean
  night: boolean
}

export const DISCOVERY_SESSION_KEYS = [
  'morning',
  'afternoon',
  'evening',
  'night',
] as const satisfies readonly (keyof DiscoverySessionFilter)[]

export function parseStoredSessionFilter(
  raw: string | null,
): DiscoverySessionFilter | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<DiscoverySessionFilter>
    return {
      morning: !!parsed.morning,
      afternoon: !!parsed.afternoon,
      evening: !!parsed.evening,
      night: !!parsed.night,
    }
  } catch {
    return null
  }
}

function formatDiscoveryDateDisplay(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

/** Next 06:00 boundary (rolling “night out” window resets at 06:00 each morning). */
export function getNextMorningSixAm(now = new Date()): Date {
  const boundary = new Date(now)
  boundary.setHours(6, 0, 0, 0)
  if (now.getTime() >= boundary.getTime()) {
    boundary.setDate(boundary.getDate() + 1)
  }
  return boundary
}

/** Logo / home reset: from now until 06:00 the next morning (DD/MM/YYYY + HH:mm). */
export function getHomeStartDiscoveryWindow(now = new Date()): {
  dateRange: [string, string]
  startTime: string
  endTime: string
} {
  const end = getNextMorningSixAm(now)
  const pad2 = (n: number) => String(n).padStart(2, '0')
  const fmtDate = (d: Date) =>
    `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`
  const fmtTime = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
  return {
    dateRange: [fmtDate(now), fmtDate(end)],
    startTime: fmtTime(now),
    endTime: '06:00',
  }
}

/** Default header range: today through the next 30 days (upcoming only, DD/MM/YYYY). */
export function getDefaultDiscoveryDateRange(now = new Date()): [string, string] {
  const [start, end] = getUpcomingRangeFromToday(30, now)
  return [formatDiscoveryDateDisplay(start), formatDiscoveryDateDisplay(end)]
}

/** Start of today (local) and end date `days` calendar days ahead (inclusive span). */
export function getUpcomingRangeFromToday(days: number, now = new Date()): [Date, Date] {
  const start = startOfDiscoveryDay(now)
  const end = new Date(start)
  end.setDate(end.getDate() + days)
  return [start, end]
}

function startOfDiscoveryDay(d: Date): Date {
  const start = new Date(d)
  start.setHours(0, 0, 0, 0)
  return start
}

/** True when the calendar day is strictly before today (past dates are not selectable). */
export function isPastDiscoveryCalendarDate(date: Date, now = new Date()): boolean {
  const today = startOfDiscoveryDay(now)
  const candidate = startOfDiscoveryDay(date)
  return candidate.getTime() < today.getTime()
}

/** Today as YYYY-MM-DD for API query params. */
export function getTodayDiscoveryApiDate(now = new Date()): string {
  return formatDiscoveryDateToApi(formatDiscoveryDateDisplay(now)) ?? ''
}

/**
 * Calendar shortcuts: rolling upcoming windows from today (not calendar week/month/year).
 * Week = today + 7 days, Month = today + 30 days, Year = today + 365 days.
 */
export function createDiscoveryUpcomingShortcuts() {
  return () => {
    const today = () => {
      const d = startOfDiscoveryDay(new Date())
      return [d, d] as [Date, Date]
    }
    const tomorrow = () => {
      const d = startOfDiscoveryDay(new Date())
      d.setDate(d.getDate() + 1)
      return [d, d] as [Date, Date]
    }
    const thisWeekend = () => {
      const now = startOfDiscoveryDay(new Date())
      const day = now.getDay()
      const daysUntilSaturday = (6 - day + 7) % 7
      const saturday = new Date(now)
      saturday.setDate(saturday.getDate() + daysUntilSaturday)
      const sunday = new Date(saturday)
      sunday.setDate(sunday.getDate() + 1)
      const start = now.getTime() > saturday.getTime() ? now : saturday
      return [start, sunday] as [Date, Date]
    }

    return [
      { label: 'Today', atClick: today },
      { label: 'Tomorrow', atClick: tomorrow },
      { label: 'This Weekend', atClick: thisWeekend },
      { label: 'This Week', atClick: () => getUpcomingRangeFromToday(7) },
      { label: 'This Month', atClick: () => getUpcomingRangeFromToday(30) },
      { label: 'This Year', atClick: () => getUpcomingRangeFromToday(365) },
    ]
  }
}

/** DD/MM/YYYY → YYYY-MM-DD for API query params. */
export function formatDiscoveryDateToApi(dateStr: string | null | undefined): string | null {
  if (!dateStr || typeof dateStr !== 'string') return null
  const [day, month, year] = dateStr.split('/')
  if (!day || !month || !year) return null
  const pad2 = (n: string) => String(n).padStart(2, '0')
  return `${year}-${pad2(month)}-${pad2(day)}`
}

/**
 * Merge `from_date`, `to_date`, and active session flags into a params object.
 * Session keys are only sent when `true` (matches GET /api/v2/events).
 */
export function appendDiscoveryDateTimeFilters(
  target: Record<string, unknown>,
  options: {
    dateRange: [string | null, string | null] | null | undefined
    sessionFilter: DiscoverySessionFilter | null | undefined
    formatDate?: (dateStr: string) => string | null
  },
): Record<string, unknown> {
  const formatDate = options.formatDate ?? formatDiscoveryDateToApi
  const range = options.dateRange
  if (range?.[0]) {
    let from = formatDate(range[0])
    const today = getTodayDiscoveryApiDate()
    if (from && today && from < today) from = today
    if (from) target.from_date = from
  }
  if (range?.[1]) {
    const to = formatDate(range[1])
    if (to) target.to_date = to
  }
  const session = options.sessionFilter
  if (!session) return target
  for (const key of DISCOVERY_SESSION_KEYS) {
    if (session[key]) target[key] = true
  }
  return target
}
