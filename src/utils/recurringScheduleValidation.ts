import type { RecurringSeriesPayload } from '@/api/recurringSeries'
import { isSeriesEndDateWithinHorizon, maxSeriesEndDate, horizonLabel } from '@/utils/recurringHorizon'

export interface RecurringScheduleValidationOptions {
  isPremium?: boolean
}

export interface RecurringScheduleValidationResult {
  valid: boolean
  message: string | null
  fieldErrors: Record<string, string[]>
}

export function isValidIanaTimezone(timezone: string | null | undefined): boolean {
  const value = timezone?.trim()
  if (!value) return false

  try {
    Intl.DateTimeFormat(undefined, { timeZone: value })
    return true
  } catch {
    return false
  }
}

export function validateRecurringSchedule(
  schedule: RecurringSeriesPayload,
  options: RecurringScheduleValidationOptions = {},
): RecurringScheduleValidationResult {
  const fieldErrors: Record<string, string[]> = {}

  if (options.isPremium === false) {
    return {
      valid: false,
      message: 'Recurring events are available for Premium users only.',
      fieldErrors,
    }
  }

  const weekdays = schedule.recurrence_rules.weekdays ?? []
  if (weekdays.length === 0) {
    fieldErrors['recurrence_rules.weekdays'] = ['Select at least one weekday to repeat on.']
  }

  if (!schedule.start_date?.trim()) {
    fieldErrors.start_date = ['Series start date is required.']
  }

  if (schedule.end_date && schedule.start_date) {
    if (schedule.end_date < schedule.start_date) {
      fieldErrors.end_date = ['End date must be on or after the start date.']
    } else if (!isSeriesEndDateWithinHorizon(schedule.start_date, schedule.end_date)) {
      const max = maxSeriesEndDate(schedule.start_date)
      fieldErrors.end_date = [
        `End date cannot be more than ${horizonLabel()} after the start date (max ${max}).`,
      ]
    }
  }

  if (!isValidIanaTimezone(schedule.timezone)) {
    fieldErrors.timezone = ['Enter a valid IANA timezone (e.g. Europe/Amsterdam).']
  }

  const messages = Object.values(fieldErrors).flat()
  return {
    valid: messages.length === 0,
    message: messages[0] ?? null,
    fieldErrors,
  }
}
