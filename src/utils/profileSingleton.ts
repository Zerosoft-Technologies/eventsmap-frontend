/**
 * Stable id to treat organiser / talent / venue as one profile per account in the UI.
 * Uses the smallest numeric id when the API returns more than one row.
 */
export function firstOwnedProfileId(
  list: Array<{ id?: unknown }> | null | undefined,
): number | null {
  if (!list?.length) return null
  const nums = list
    .map((x) => Number(x?.id))
    .filter((n) => Number.isFinite(n) && n > 0)
  if (!nums.length) return null
  return Math.min(...nums)
}
