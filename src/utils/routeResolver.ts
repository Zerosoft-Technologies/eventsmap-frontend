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

const DEFAULT_ROUTE = '/create-profile'

/** Normalize API profile_type to our route keys (e.g. organizer → organiser, talent → talents). */
function normalizeProfileType(profileType: string): string {
  if (profileType === 'organizer') return 'organiser'
  if (profileType === 'talent') return 'talents'
  return profileType
}

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

  const normalized = normalizeProfileType(profileType)
  const profileRoutes = ROUTE_MAP[normalized as ProfileType]
  if (!profileRoutes) return DEFAULT_ROUTE

  return profileRoutes[accountType as AccountType] || DEFAULT_ROUTE
}

const CREATE_PATH_REGEX = /^\/create-(event|organiser|talents|venue)-(free|premium)(?:\/|$)/

/**
 * Parses a path to get the profile and account type it belongs to.
 * Returns null if the path is not a create profile route.
 */
export function getProfileAndAccountFromPath(
  path: string,
): { profileType: ProfileType; accountType: AccountType } | null {
  const match = path.match(CREATE_PATH_REGEX)
  if (!match) return null
  return {
    profileType: match[1] as ProfileType,
    accountType: match[2] as AccountType,
  }
}
