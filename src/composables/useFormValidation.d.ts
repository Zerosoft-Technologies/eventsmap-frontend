import { Ref, UnwrapRef } from 'vue'

export interface ValidationRule {
  type?: 'text' | 'email' | 'url' | 'tel' | 'number' | 'date' | 'textarea' | 'select' | 'file' | 'multiselect' | 'checkbox'
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  patternMessage?: string
  message?: string
  label?: string
  maxSize?: number
  accept?: string[]
  validator?: (value: any, formData: any) => string | null
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

export interface FormValidationReturn {
  errors: Record<string, string>
  validate: () => boolean
  validateField: (field: string) => string
  clearError: (field: string) => void
  resetErrors: () => void
  scrollToFirstError: () => Promise<void>
}

export function useFormValidation<T extends Record<string, any>>(
  schema: ValidationSchema,
  formData: UnwrapRef<T> | T
): FormValidationReturn
