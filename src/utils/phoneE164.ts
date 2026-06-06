/** E.164: + followed by 1–15 digits (ITU-T recommendation). */
export const E164_PHONE_RE = /^\+[1-9]\d{1,14}$/

export function isValidE164Phone(value: string | null | undefined): boolean {
  const v = String(value ?? '').trim()
  if (!v) return true
  return E164_PHONE_RE.test(v)
}
