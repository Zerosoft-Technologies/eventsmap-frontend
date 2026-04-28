export interface VenueOpeningDayRow {
  day: string
  is_open: boolean
  open: string
  close: string
}

export const VENUE_OPENING_DAYS_ORDERED = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export function createDefaultVenueOpeningHours(): VenueOpeningDayRow[] {
  return VENUE_OPENING_DAYS_ORDERED.map((day) => ({
    day,
    is_open: false,
    open: '',
    close: '',
  }))
}

export function normalizeTimeForInput(t: unknown): string {
  if (t == null || t === '') return ''
  const s = String(t).trim()
  const m = s.match(/^(\d{1,2}):(\d{2})/)
  if (!m || m[1] === undefined || m[2] === undefined) return ''
  const h = Math.min(23, Math.max(0, parseInt(m[1], 10)))
  const min = Math.min(59, Math.max(0, parseInt(m[2], 10)))
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

export function parseVenueOpeningHoursFromApi(raw: unknown): VenueOpeningDayRow[] {
  const defaults = createDefaultVenueOpeningHours()
  const byDay: Record<string, VenueOpeningDayRow> = Object.fromEntries(
    defaults.map((d) => [d.day, { ...d }])
  )

  const applyRows = (rows: unknown[]) => {
    for (const item of rows) {
      if (!item || typeof item !== 'object') continue
      const rec = item as Record<string, unknown>
      const day = rec.day != null ? String(rec.day) : ''
      if (!byDay[day]) continue
      byDay[day].is_open = !!rec.is_open
      byDay[day].open = normalizeTimeForInput(rec.open)
      byDay[day].close = normalizeTimeForInput(rec.close)
    }
  }

  if (Array.isArray(raw)) {
    applyRows(raw)
    return VENUE_OPENING_DAYS_ORDERED.map((d) => byDay[d]!)
  }

  if (typeof raw === 'string' && raw.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) {
        applyRows(parsed)
        return VENUE_OPENING_DAYS_ORDERED.map((d) => byDay[d]!)
      }
    } catch {
      /* use defaults */
    }
  }

  return defaults
}

export function timeStringToMinutes(t: unknown): number | null {
  const s = normalizeTimeForInput(t)
  if (!s) return null
  const parts = s.split(':')
  const h = parseInt(parts[0] ?? '', 10)
  const m = parseInt(parts[1] ?? '', 10)
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  return h * 60 + m
}

/** Same-day rule: closing must be strictly after opening (no overnight span). */
export function isClosingAfterOpening(open: unknown, close: unknown): boolean {
  const o = timeStringToMinutes(open)
  const c = timeStringToMinutes(close)
  if (o === null || c === null) return false
  return c > o
}

export function serializeVenueOpeningHoursForApi(schedule: VenueOpeningDayRow[]) {
  return schedule.map(({ day, is_open, open, close }) => ({
    day,
    is_open,
    open: is_open ? normalizeTimeForInput(open) : '',
    close: is_open ? normalizeTimeForInput(close) : '',
  }))
}

export function validateVenueOpeningHours(schedule: VenueOpeningDayRow[]): string {
  for (const row of schedule) {
    if (!row.is_open) continue
    const o = normalizeTimeForInput(row.open)
    const c = normalizeTimeForInput(row.close)
    if (!o || !c) {
      return `When ${row.day} is open, both opening and closing times are required.`
    }
    if (!isClosingAfterOpening(row.open, row.close)) {
      return `On ${row.day}, closing time must be after opening time.`
    }
  }
  return ''
}
