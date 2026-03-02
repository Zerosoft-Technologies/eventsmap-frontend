import { ref, computed, watch } from 'vue'

/**
 * Strict 24-hour HH:MM regex.
 * Accepts 00:00 – 23:59 only.
 * Rejects: 25:00, 12:65, 9:7, 123, "12:", partial input.
 */
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/

const MSG = {
  START_REQUIRED: 'Start time is required',
  END_REQUIRED: 'End time is required',
  INVALID_FORMAT: 'Use HH:MM 24-hour format (e.g. 14:30)',
  END_BEFORE_START: 'End time must be after start time',
}

/**
 * Check whether a string is a valid 24-hour HH:MM time.
 * @param {string} value
 * @returns {boolean}
 */
export function isValidTimeFormat(value) {
  if (!value || typeof value !== 'string') return false
  return TIME_REGEX.test(value.trim())
}

/**
 * Convert a valid HH:MM string to total minutes since midnight.
 * Returns null for invalid input.
 * @param {string} value
 * @returns {number|null}
 */
export function parseTimeToMinutes(value) {
  if (!isValidTimeFormat(value)) return null
  const [h, m] = value.trim().split(':').map(Number)
  return h * 60 + m
}

/**
 * Reusable composable for start/end time range validation.
 *
 * @param {import('vue').Ref<string>} startTimeRef  - reactive ref bound to start time input
 * @param {import('vue').Ref<string>} endTimeRef    - reactive ref bound to end time input
 *
 * @returns {{
 *   startError: import('vue').Ref<string>,
 *   endError: import('vue').Ref<string>,
 *   hasStartError: import('vue').ComputedRef<boolean>,
 *   hasEndError: import('vue').ComputedRef<boolean>,
 *   timeValidationError: import('vue').ComputedRef<boolean>,
 *   validateTimeRange: () => boolean,
 *   clearStartError: () => void,
 *   clearEndError: () => void,
 *   resetTimeErrors: () => void,
 *   applyServerErrors: (fieldErrors: object) => void,
 * }}
 */
export function useTimeRangeValidation(startTimeRef, endTimeRef) {
  const startError = ref('')
  const endError = ref('')

  // Convenience computed booleans — use these for :class border bindings
  const hasStartError = computed(() => !!startError.value)
  const hasEndError = computed(() => !!endError.value)

  // True only when both fields are valid format but end <= start
  const timeValidationError = computed(() => endError.value === MSG.END_BEFORE_START)

  // ── Internal helpers ────────────────────────────────────────────────────────

  function _checkFormat(value, field) {
    const v = (value || '').trim()
    if (!v) {
      if (field === 'start') startError.value = MSG.START_REQUIRED
      else endError.value = MSG.END_REQUIRED
      return false
    }
    if (!isValidTimeFormat(v)) {
      if (field === 'start') startError.value = MSG.INVALID_FORMAT
      else endError.value = MSG.INVALID_FORMAT
      return false
    }
    if (field === 'start') startError.value = ''
    else endError.value = ''
    return true
  }

  function _checkRange() {
    const s = parseTimeToMinutes(startTimeRef.value)
    const e = parseTimeToMinutes(endTimeRef.value)
    if (s === null || e === null) return true
    if (e <= s) {
      endError.value = MSG.END_BEFORE_START
      return false
    }
    if (endError.value === MSG.END_BEFORE_START) endError.value = ''
    return true
  }

  // ── Real-time watcher ────────────────────────────────────────────────────────
  // Runs on every change to either ref.
  // • Format error is surfaced as soon as the user has typed something invalid.
  // • Format error is cleared as soon as the user fixes the value.
  // • Range check runs only when BOTH fields pass format validation.
  watch([startTimeRef, endTimeRef], ([s, e]) => {
    // Start time format feedback
    if (s) {
      if (!isValidTimeFormat(s)) {
        if (startError.value === '' || startError.value === MSG.INVALID_FORMAT) {
          startError.value = MSG.INVALID_FORMAT
        }
      } else if (startError.value === MSG.INVALID_FORMAT) {
        startError.value = ''
      }
    }

    // End time format feedback
    if (e) {
      if (!isValidTimeFormat(e)) {
        if (endError.value === '' || endError.value === MSG.INVALID_FORMAT) {
          endError.value = MSG.INVALID_FORMAT
        }
      } else if (endError.value === MSG.INVALID_FORMAT) {
        endError.value = ''
      }
    }

    // Range check (only when both fields are format-valid)
    if (isValidTimeFormat(s) && isValidTimeFormat(e)) {
      _checkRange()
    } else if (endError.value === MSG.END_BEFORE_START) {
      endError.value = ''
    }
  })

  // ── Public API ───────────────────────────────────────────────────────────────

  /**
   * Full validation gate — call this on form submit.
   * Validates required, format, and range in order.
   * @returns {boolean} true if the time range is valid
   */
  function validateTimeRange() {
    startError.value = ''
    endError.value = ''

    const startOk = _checkFormat(startTimeRef.value, 'start')
    const endOk = _checkFormat(endTimeRef.value, 'end')

    if (!startOk || !endOk) return false
    return _checkRange()
  }

  /**
   * Clear start time error.
   * Call on @input of the start time field.
   * Also clears the range error since a change in start time invalidates the prior range check.
   */
  function clearStartError() {
    startError.value = ''
    if (endError.value === MSG.END_BEFORE_START) endError.value = ''
  }

  /**
   * Clear end time error.
   * Call on @input of the end time field.
   * Preserves format errors so the real-time watcher can re-evaluate.
   */
  function clearEndError() {
    if (endError.value !== MSG.INVALID_FORMAT) {
      endError.value = ''
    }
  }

  /**
   * Reset all time errors — call on full form reset.
   */
  function resetTimeErrors() {
    startError.value = ''
    endError.value = ''
  }

  /**
   * Apply backend (Laravel) validation errors to the time fields.
   * Server errors override the current client error for that field.
   * Call after receiving a 422 response that includes field errors.
   *
   * @param {object} fieldErrors  - e.g. { start_time: ['...'], end_time: ['...'] }
   */
  function applyServerErrors(fieldErrors) {
    if (fieldErrors?.start_time?.[0]) startError.value = fieldErrors.start_time[0]
    if (fieldErrors?.end_time?.[0]) endError.value = fieldErrors.end_time[0]
  }

  return {
    startError,
    endError,
    hasStartError,
    hasEndError,
    timeValidationError,
    validateTimeRange,
    clearStartError,
    clearEndError,
    resetTimeErrors,
    applyServerErrors,
  }
}
