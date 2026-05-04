export interface VenueOpeningTimeSlot {
  open: string
  close: string
}

export interface VenueOpeningDayRow {
  day: string
  is_open: boolean
  /** One or more open/close periods for this day (split shifts). */
  slots: VenueOpeningTimeSlot[]
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

export function createEmptySlot(): VenueOpeningTimeSlot {
  return { open: '', close: '' }
}

export function createDefaultVenueOpeningHours(): VenueOpeningDayRow[] {
  return VENUE_OPENING_DAYS_ORDERED.map((day) => ({
    day,
    is_open: false,
    slots: [createEmptySlot()],
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

type IncomingDayPiece = {
  day: string
  is_open: boolean
  slots: VenueOpeningTimeSlot[]
}

function isKnownDay(day: string): day is (typeof VENUE_OPENING_DAYS_ORDERED)[number] {
  return (VENUE_OPENING_DAYS_ORDERED as readonly string[]).includes(day)
}

function pieceFromApiItem(item: unknown): IncomingDayPiece | null {
  if (!item || typeof item !== 'object') return null
  const rec = item as Record<string, unknown>
  const day = rec.day != null ? String(rec.day) : ''
  if (!isKnownDay(day)) return null
  const is_open = !!rec.is_open

  if (Array.isArray(rec.slots)) {
    const slots: VenueOpeningTimeSlot[] = []
    for (const s of rec.slots) {
      if (!s || typeof s !== 'object') continue
      const sr = s as Record<string, unknown>
      slots.push({
        open: normalizeTimeForInput(sr.open),
        close: normalizeTimeForInput(sr.close),
      })
    }
    return { day, is_open, slots }
  }

  const open = normalizeTimeForInput(rec.open)
  const close = normalizeTimeForInput(rec.close)
  if (open && close) {
    return { day, is_open, slots: [{ open, close }] }
  }
  return { day, is_open, slots: [] }
}

function dedupeSlots(slots: VenueOpeningTimeSlot[]): VenueOpeningTimeSlot[] {
  const seen = new Set<string>()
  const out: VenueOpeningTimeSlot[] = []
  for (const s of slots) {
    const k = `${s.open}|${s.close}`
    if (!s.open || !s.close || seen.has(k)) continue
    seen.add(k)
    out.push(s)
  }
  return out
}

function sortSlotsByOpen(slots: VenueOpeningTimeSlot[]): VenueOpeningTimeSlot[] {
  return [...slots].sort((a, b) => {
    const ma = timeStringToMinutes(a.open) ?? -1
    const mb = timeStringToMinutes(b.open) ?? -1
    return ma - mb
  })
}

function mergePiecesIntoSchedule(pieces: IncomingDayPiece[]): VenueOpeningDayRow[] {
  const mergedSlots: Record<string, VenueOpeningTimeSlot[]> = {}
  const mergedOpen: Record<string, boolean> = {}

  for (const p of pieces) {
    mergedOpen[p.day] = mergedOpen[p.day] || p.is_open
    let bucket = mergedSlots[p.day]
    if (!bucket) {
      bucket = []
      mergedSlots[p.day] = bucket
    }
    for (const s of p.slots) {
      if (s.open && s.close) bucket.push({ open: s.open, close: s.close })
    }
  }

  return VENUE_OPENING_DAYS_ORDERED.map((day) => {
    const rawSlots = mergedSlots[day] ?? []
    const slots = sortSlotsByOpen(dedupeSlots(rawSlots))
    const isOpenFlag = mergedOpen[day] ?? false

    if (slots.length > 0) {
      return { day, is_open: true, slots }
    }
    if (isOpenFlag) {
      return { day, is_open: true, slots: [createEmptySlot()] }
    }
    return { day, is_open: false, slots: [createEmptySlot()] }
  })
}

export function parseVenueOpeningHoursFromApi(raw: unknown): VenueOpeningDayRow[] {
  let rows: unknown[] = []
  if (Array.isArray(raw)) {
    rows = raw
  } else if (typeof raw === 'string' && raw.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) rows = parsed
    } catch {
      return createDefaultVenueOpeningHours()
    }
  } else {
    return createDefaultVenueOpeningHours()
  }

  const pieces: IncomingDayPiece[] = []
  for (const item of rows) {
    const p = pieceFromApiItem(item)
    if (p) pieces.push(p)
  }

  if (pieces.length === 0) {
    return createDefaultVenueOpeningHours()
  }

  return mergePiecesIntoSchedule(pieces)
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

/** After normalizing and sorting by open time, periods must not overlap (touching endpoints allowed). */
export function areSlotsNonOverlapping(slots: VenueOpeningTimeSlot[]): boolean {
  const filled = slots
    .map((s) => ({
      open: normalizeTimeForInput(s.open),
      close: normalizeTimeForInput(s.close),
    }))
    .filter((s) => s.open && s.close)
  if (filled.length < 2) return true
  const sorted = sortSlotsByOpen(filled)
  for (let i = 1; i < sorted.length; i++) {
    const prevEnd = timeStringToMinutes(sorted[i - 1]!.close)
    const curStart = timeStringToMinutes(sorted[i]!.open)
    if (prevEnd === null || curStart === null) continue
    if (curStart < prevEnd) return false
  }
  return true
}

/**
 * Serialize for API: one object per time period. Same `day` may appear multiple times when there are split shifts.
 * Legacy shape: { day, is_open, open, close }
 */
export function serializeVenueOpeningHoursForApi(schedule: VenueOpeningDayRow[]) {
  const out: Array<{ day: string; is_open: boolean; open: string; close: string }> = []

  for (const row of schedule) {
    if (!row.is_open) {
      out.push({ day: row.day, is_open: false, open: '', close: '' })
      continue
    }

    const validSlots = row.slots
      .map((s) => ({
        open: normalizeTimeForInput(s.open),
        close: normalizeTimeForInput(s.close),
      }))
      .filter((s) => s.open && s.close)

    if (validSlots.length === 0) {
      out.push({ day: row.day, is_open: true, open: '', close: '' })
    } else {
      for (const s of validSlots) {
        out.push({ day: row.day, is_open: true, open: s.open, close: s.close })
      }
    }
  }

  return out
}

export function validateVenueOpeningHours(schedule: VenueOpeningDayRow[]): string {
  for (const row of schedule) {
    if (!row.is_open) continue

    const filled = row.slots
      .map((s) => ({
        open: normalizeTimeForInput(s.open),
        close: normalizeTimeForInput(s.close),
      }))
      .filter((s) => s.open && s.close)

    if (filled.length === 0) {
      return `When ${row.day} is open, add at least one opening and closing time.`
    }

    for (const s of filled) {
      if (!isClosingAfterOpening(s.open, s.close)) {
        return `On ${row.day}, each closing time must be after its opening time.`
      }
    }

    if (!areSlotsNonOverlapping(row.slots)) {
      return `On ${row.day}, time periods must not overlap (order them from earliest to latest).`
    }
  }
  return ''
}
