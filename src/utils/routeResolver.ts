// ── Centralized Route Mapping ─────────────────────────────
// Maps profile_type → account_type → route path.
// To add a new profile type or account tier, simply extend this object.

export type ProfileType = 'event' | 'organiser' | 'talents' | 'venue'
export type AccountType = 'free' | 'premium'

const ROUTE_MAP: Record<ProfileType, Record<AccountType, string>> = {
  event: {
    free: '/create-event-free',
    premium: '/create-event-premium',
  },
  organiser: {
    free: '/create-organiser-free',
    premium: '/create-organiser-premium',
  },
  talents: {
    free: '/create-talents-free',
    premium: '/create-talents-premium',
  },
  venue: {
    free: '/create-venue-free',
    premium: '/create-venue-premium',
  },
}

const DEFAULT_ROUTE = '/dashboard'

/**
 * Returns the correct create-page route for a given profile & account type.
 *
 * - Invalid / missing `profileType` → fallback route
 * - Invalid / missing `accountType` → fallback route
 */
export function getCreateRoute(
  profileType: string | undefined | null,
  accountType: string | undefined | null,
): string {
  if (!profileType || !accountType) return DEFAULT_ROUTE

  const profileRoutes = ROUTE_MAP[profileType as ProfileType]
  if (!profileRoutes) return DEFAULT_ROUTE

  return profileRoutes[accountType as AccountType] || DEFAULT_ROUTE
}
