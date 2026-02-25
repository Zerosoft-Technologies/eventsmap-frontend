import { reactive, nextTick } from 'vue'

/**
 * Generic reusable form validation composable.
 *
 * @param {Object} schema  – field definitions keyed by field name.
 *   Each field may contain:
 *     type      : 'text' | 'email' | 'url' | 'tel' | 'number' | 'date' | 'textarea' | 'select' | 'file' | 'multiselect' | 'checkbox'
 *     required  : boolean
 *     min       : number  (min length for text/textarea, min value for number, min items for multiselect)
 *     max       : number  (max length for text/textarea, max value for number, max items for multiselect)
 *     pattern   : RegExp  (custom regex)
 *     message   : string  (custom "required" message override)
 *     label     : string  (human-readable label used in error messages)
 *
 * @param {Object} formData – reactive object whose keys match the schema keys.
 *   For 'file' type, the value should be a File object or null.
 *   For 'multiselect' type, the value should be an Array.
 *   For 'checkbox' type, the value should be a boolean.
 *
 * @returns {{ errors: Object, validate: Function, validateField: Function, resetErrors: Function, scrollToFirstError: Function }}
 */
export function useFormValidation(schema, formData) {
  // Build a reactive errors object with one key per schema field, initialised to ''
  const errors = reactive(
    Object.keys(schema).reduce((acc, key) => {
      acc[key] = ''
      return acc
    }, {})
  )

  // ── Regex helpers ──────────────────────────────────────────────
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const URL_RE = /^https?:\/\/.+/i
  const TEL_RE = /^[0-9+\-\s()]{7,20}$/

  // ── Single-field validator ─────────────────────────────────────
  function validateField(field) {
    const rules = schema[field]
    if (!rules) return ''

    const value = formData[field]
    const label = rules.label || formatLabel(field)

    // Required check
    if (rules.required) {
      if (rules.type === 'file') {
        if (!value) return rules.message || `${label} is required`
      } else if (rules.type === 'multiselect') {
        if (!Array.isArray(value) || value.length === 0) return rules.message || `Please select at least one ${label.toLowerCase()}`
      } else if (rules.type === 'checkbox') {
        if (!value) return rules.message || `${label} must be checked`
      } else if (rules.type === 'number') {
        if (value === '' || value === null || value === undefined) return rules.message || `${label} is required`
      } else {
        if (!value || (typeof value === 'string' && !value.trim())) return rules.message || `${label} is required`
      }
    }

    // Skip further checks if value is empty and not required
    if (isEmpty(value, rules.type)) return ''

    // Type-specific validations
    switch (rules.type) {
      case 'email':
        if (!EMAIL_RE.test(value)) return `Invalid email address`
        break

      case 'url':
        if (!URL_RE.test(value)) return `Invalid URL format`
        break

      case 'tel':
        if (!TEL_RE.test(value)) return `Invalid phone number`
        break

      case 'number': {
        const num = Number(value)
        if (isNaN(num)) return `${label} must be a number`
        if (rules.min !== undefined && num < rules.min) return `${label} must be at least ${rules.min}`
        if (rules.max !== undefined && num > rules.max) return `${label} must be at most ${rules.max}`
        break
      }

      case 'date':
        if (isNaN(Date.parse(value))) return `Invalid date`
        break

      case 'multiselect':
        if (rules.min !== undefined && value.length < rules.min) return `Select at least ${rules.min} ${label.toLowerCase()}`
        if (rules.max !== undefined && value.length > rules.max) return `Select at most ${rules.max} ${label.toLowerCase()}`
        break

      case 'file':
        if (value) {
          if (rules.maxSize && value.size > rules.maxSize) {
            const sizeMB = (rules.maxSize / (1024 * 1024)).toFixed(1)
            return `File must be smaller than ${sizeMB} MB`
          }
          if (rules.accept && !rules.accept.some(ext => value.name.toLowerCase().endsWith(ext))) {
            return `Allowed file types: ${rules.accept.join(', ')}`
          }
        }
        break

      case 'text':
      case 'textarea':
      default:
        if (typeof value === 'string') {
          if (rules.min !== undefined && value.trim().length < rules.min) return `${label} must be at least ${rules.min} characters`
          if (rules.max !== undefined && value.trim().length > rules.max) return `${label} must be at most ${rules.max} characters`
        }
        break
    }

    // Custom pattern check
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return rules.patternMessage || `${label} format is invalid`
    }

    // Custom validator function
    if (typeof rules.validator === 'function') {
      const msg = rules.validator(value, formData)
      if (msg) return msg
    }

    return ''
  }

  // ── Validate all fields ────────────────────────────────────────
  function validate() {
    let isValid = true

    for (const field of Object.keys(schema)) {
      const msg = validateField(field)
      errors[field] = msg
      if (msg) isValid = false
    }

    return isValid
  }

  // ── Clear a single field error ─────────────────────────────────
  function clearError(field) {
    if (field in errors) {
      errors[field] = ''
    }
  }

  // ── Reset all errors ───────────────────────────────────────────
  function resetErrors() {
    for (const key of Object.keys(errors)) {
      errors[key] = ''
    }
  }

  // ── Scroll to first error ─────────────────────────────────────
  async function scrollToFirstError() {
    await nextTick()

    // Find the first field with an error
    const firstErrorField = Object.keys(schema).find(field => errors[field])
    if (!firstErrorField) return

    // Try to find DOM element by data-field attribute first, then fallback to name/id
    const el =
      document.querySelector(`[data-field="${firstErrorField}"]`) ||
      document.querySelector(`[name="${firstErrorField}"]`) ||
      document.getElementById(firstErrorField)

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
        el.focus()
      }
    }
  }

  // ── Helpers ────────────────────────────────────────────────────
  function isEmpty(value, type) {
    if (type === 'file') return !value
    if (type === 'multiselect') return !Array.isArray(value) || value.length === 0
    if (type === 'checkbox') return false // checkbox always has a value
    if (type === 'number') return value === '' || value === null || value === undefined
    return !value || (typeof value === 'string' && !value.trim())
  }

  function formatLabel(field) {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .replace(/^\w/, c => c.toUpperCase())
      .trim()
  }

  return {
    errors,
    validate,
    validateField,
    clearError,
    resetErrors,
    scrollToFirstError
  }
}
