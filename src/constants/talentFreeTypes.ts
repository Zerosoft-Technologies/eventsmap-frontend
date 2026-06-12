/** Fixed talent types for free talent profiles (no subcategories). */
export const TALENT_FREE_TYPE_OPTIONS = [
  'Musician',
  'Dancer',
  'Singer',
  'Actor',
  'Group',
] as const

export type TalentFreeType = (typeof TALENT_FREE_TYPE_OPTIONS)[number]

export function isTalentFreeType(value: string): value is TalentFreeType {
  return (TALENT_FREE_TYPE_OPTIONS as readonly string[]).includes(value)
}
