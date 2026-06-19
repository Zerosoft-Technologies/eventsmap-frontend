/** Normalize API date strings for schedule parsing (DD/MM/YYYY or ISO). */
export function normalizeEventDatePart(dateStr: unknown): string {
  if (dateStr == null || dateStr === '') return ''
  const d = String(dateStr).trim()
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(d)) {
    const [dd, mm, yyyy] = d.split('/')
    return `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`
  }
  return d
}

/**
 * Epoch ms for start or end. Supports full ISO `start_datetime` / `end_datetime`
 * and legacy `event_date` + time-only fragments.
 */
export function parseEventInstantMs(
  ev: Record<string, unknown> | null | undefined,
  field: 'start' | 'end',
): number {
  if (!ev) return NaN
  const raw = field === 'start' ? ev.start_datetime : ev.end_datetime
  if (raw == null || raw === '') return NaN
  const s = String(raw).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const t = new Date(s.includes('T') ? s : s.replace(' ', 'T'))
    if (!isNaN(t.getTime())) return t.getTime()
  }
  if (s.includes('T')) {
    const t = new Date(s)
    if (!isNaN(t.getTime())) return t.getTime()
  }
  const datePart = normalizeEventDatePart(ev.event_date)
  if (datePart) {
    const t = new Date(`${datePart}T${s}`)
    if (!isNaN(t.getTime())) return t.getTime()
  }
  const t = new Date(s)
  return isNaN(t.getTime()) ? NaN : t.getTime()
}

export function parseEndInstantMsForDisplay(
  ev: Record<string, unknown> | null | undefined,
): number {
  if (!ev) return NaN
  let e = parseEventInstantMs(ev, 'end')
  if (!isNaN(e)) return e
  const datePart = normalizeEventDatePart(ev.event_date)
  const et = ev.end_time
  if (datePart && et != null && String(et).trim() !== '') {
    const t = new Date(`${datePart}T${String(et).trim()}`)
    if (!isNaN(t.getTime())) return t.getTime()
  }
  return NaN
}

export function formatEventInstantForLocale(
  ms: number,
  locale: string,
  options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  },
): string {
  if (isNaN(ms)) return ''
  const d = new Date(ms)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString(locale, options)
}

export interface EventCardScheduleDisplay {
  date: string
  /** Set when the end instant falls on a different calendar day than the start. */
  endDate: string | null
  startTime: string
  endTime: string
}

const CARD_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}

const CARD_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
}

/**
 * Event listing card: separate date, start time, and end time (locale-aware).
 */
export function getEventCardScheduleDisplay(
  ev: Record<string, unknown> | null | undefined,
  locale: string,
): EventCardScheduleDisplay {
  const empty: EventCardScheduleDisplay = {
    date: '',
    endDate: null,
    startTime: '',
    endTime: '',
  }
  if (!ev) return empty

  const sMs = parseEventInstantMs(ev, 'start')
  let eMs = parseEndInstantMsForDisplay(ev)
  if (!isNaN(sMs) && !isNaN(eMs) && eMs <= sMs) {
    eMs += 24 * 60 * 60 * 1000
  }

  let date = ''
  let endDate: string | null = null
  let startTime = ''
  let endTime = ''

  if (!isNaN(sMs)) {
    const startDate = new Date(sMs)
    date = startDate.toLocaleDateString(locale, CARD_DATE_OPTIONS)
    startTime = startDate.toLocaleTimeString(locale, CARD_TIME_OPTIONS)
  } else {
    const dateStr =
      normalizeEventDatePart(ev.event_date) ||
      normalizeEventDatePart(ev.start_date) ||
      (ev.start_datetime ? String(ev.start_datetime).split('T')[0] : '')
    if (dateStr) {
      const fallback = new Date(`${dateStr}T12:00:00`)
      if (!isNaN(fallback.getTime())) {
        date = fallback.toLocaleDateString(locale, CARD_DATE_OPTIONS)
      }
    }
    if (!date && typeof ev.formatted_date === 'string' && ev.formatted_date.trim()) {
      date = ev.formatted_date.trim()
    }
  }

  if (!isNaN(eMs)) {
    const endInstant = new Date(eMs)
    endTime = endInstant.toLocaleTimeString(locale, CARD_TIME_OPTIONS)
    if (!isNaN(sMs)) {
      const startDate = new Date(sMs)
      if (endInstant.toDateString() !== startDate.toDateString()) {
        endDate = endInstant.toLocaleDateString(locale, CARD_DATE_OPTIONS)
      }
    }
  }

  return { date, endDate, startTime, endTime }
}

export function formatEventScheduleRange(
  ev: Record<string, unknown> | null | undefined,
  locale: string,
): string {
  if (!ev) return ''
  const opt: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  const sMs = parseEventInstantMs(ev, 'start')
  let eMs = parseEndInstantMsForDisplay(ev)
  if (!isNaN(sMs) && !isNaN(eMs) && eMs <= sMs) {
    eMs += 24 * 60 * 60 * 1000
  }
  const fmt = (ms: number) => {
    if (isNaN(ms)) return ''
    const d = new Date(ms)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleString(locale, opt)
  }
  const startLabel = fmt(sMs)
  const endLabel = fmt(eMs)
  if (startLabel && endLabel) return `${startLabel} – ${endLabel}`
  if (startLabel) return startLabel
  return ''
}

/**
 * Compact "middle-point" date/time format for event cards / map info windows:
 * - Upcoming: "Sat, 7 May 2026 · 03:00–09:00"
 * - Live:      "03:00–09:00" (no date prefix)
 *
 * Locale-specific rules:
 * - EN: weekday short + comma (via toLocaleDateString en-GB)
 * - FR: "Sam. ... · 23h00–02h00" (we convert "23:00" → "23h00")
 * - NL: "Za ... · 23:00–02:00" (we capitalize first letter)
 */
export function formatEventCardDateTimeRange(
  ev: Record<string, unknown> | null | undefined,
  locale: string,
  opts?: { isLive?: boolean },
): string {
  if (!ev) return ''
  const isLive = !!opts?.isLive

  const sMs = parseEventInstantMs(ev, 'start')
  let eMs = parseEndInstantMsForDisplay(ev)
  if (!isNaN(sMs) && !isNaN(eMs) && eMs <= sMs) {
    eMs += 24 * 60 * 60 * 1000
  }

  if (isNaN(sMs)) return ''

  const startDate = new Date(sMs)
  const endDate = !isNaN(eMs) ? new Date(eMs) : new Date(sMs)

  const loc = (locale || '').toLowerCase()
  const isFr = loc.startsWith('fr')
  const isNl = loc.startsWith('nl')

  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }

  const fmtTime = (d: Date) => {
    const raw = d.toLocaleTimeString(locale, timeOpts)
    if (isFr) {
      // Convert "23:00" -> "23h00" for FR UX.
      return raw.replace(':', 'h')
    }
    return raw
  }

  const startTime = fmtTime(startDate)
  const endTime = fmtTime(endDate)

  if (isLive) {
    return `${startTime}–${endTime}`
  }

  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }

  let dateLabel = startDate.toLocaleDateString(locale, dateOpts)
  if (isFr || isNl) {
    // fr-FR / nl-NL abbreviations are often lowercase by default ("sam.", "za")
    dateLabel = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)
  }

  return `${dateLabel} · ${startTime}–${endTime}`
}

/** True when the event has ended (hide from map / discovery list). */
export function isDiscoveryEventFinished(
  ev: Record<string, unknown> | null | undefined,
  nowMs = Date.now(),
): boolean {
  const endMs = parseEndInstantMsForDisplay(ev)
  if (!Number.isNaN(endMs)) return endMs < nowMs
  const startMs = parseEventInstantMs(ev, 'start')
  if (!Number.isNaN(startMs) && startMs < nowMs) return true
  return false
}

export function filterActiveDiscoveryEvents<T extends Record<string, unknown>>(
  events: T[],
  nowMs = Date.now(),
): T[] {
  if (!Array.isArray(events)) return []
  return events.filter((ev) => !isDiscoveryEventFinished(ev, nowMs))
}
