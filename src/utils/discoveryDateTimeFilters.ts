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

/** Default header range: first through last day of the current month (DD/MM/YYYY). */
export function getDefaultDiscoveryDateRange(now = new Date()): [string, string] {
  const year = now.getFullYear()
  const month = now.getMonth()
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  return [formatDiscoveryDateDisplay(first), formatDiscoveryDateDisplay(last)]
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
    const from = formatDate(range[0])
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
