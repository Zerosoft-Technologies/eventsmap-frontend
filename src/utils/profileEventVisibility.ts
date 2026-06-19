/**
 * Premium profile helpers for discovery past/upcoming event visibility.
 */

export function isPremiumDiscoveryProfile(profile: { event_type?: string | null } | null | undefined): boolean {
  return String(profile?.event_type || '').toLowerCase() === 'premium'
}

export function isTruthyProfileFlag(value: unknown): boolean {
  return value === true || value === 1 || value === '1'
}

export function showPastEventsOnProfile(profile: { event_type?: string | null; show_past_events?: unknown } | null | undefined): boolean {
  return isPremiumDiscoveryProfile(profile) && isTruthyProfileFlag(profile?.show_past_events)
}

export function showUpcomingEventsOnProfile(profile: { show_upcoming_events?: unknown } | null | undefined): boolean {
  return isTruthyProfileFlag(profile?.show_upcoming_events)
}
