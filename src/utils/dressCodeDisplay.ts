function sentenceCase(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
}

/**
 * Display dress_code values as stored in The Events Map (sentence case).
 * Maps canonical option values; does not invent labels such as "Formal".
 */
export function formatDressCodeForDisplay(
  raw: unknown,
  translate?: (key: string) => string,
): string {
  if (raw == null || String(raw).trim() === '') return ''

  const normalized = String(raw).trim().replace(/_/g, ' ')
  const key = normalized.toLowerCase()

  if (key === 'no dress code' || key === 'no_dress_code') {
    return translate?.('eventDetails.dressCodeNone') ?? 'No dress code'
  }
  if (key === 'dress code' || key === 'formal' || key === 'dress_code') {
    return translate?.('eventDetails.dressCodeSelected') ?? 'Dress code'
  }

  return sentenceCase(normalized)
}
