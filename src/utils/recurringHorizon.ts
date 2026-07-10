/** Maximum months ahead occurrences are generated (matches backend config). */
export const RECURRING_GENERATION_HORIZON_MONTHS = 12

export function addMonthsToDateString(dateStr: string, months: number): string {
  const parts = dateStr.split('-').map(Number)
  const y = parts[0] ?? 1970
  const m = parts[1] ?? 1
  const d = parts[2] ?? 1
  const date = new Date(y, m - 1, d)
  date.setMonth(date.getMonth() + months)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

export function maxSeriesEndDate(startDate: string): string {
  return addMonthsToDateString(startDate, RECURRING_GENERATION_HORIZON_MONTHS)
}

export function isSeriesEndDateWithinHorizon(startDate: string, endDate: string | null | undefined): boolean {
  if (!endDate) return true
  return endDate <= maxSeriesEndDate(startDate)
}

export function horizonLabel(): string {
  return RECURRING_GENERATION_HORIZON_MONTHS === 12
    ? 'one year'
    : `${RECURRING_GENERATION_HORIZON_MONTHS} months`
}
