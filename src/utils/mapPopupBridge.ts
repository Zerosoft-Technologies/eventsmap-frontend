/** Window events: Home map popups (separate Vue apps) → Header detail panels */
export const MAP_OPEN_EVENT_DETAIL = 'map-open-event-detail'
export const MAP_OPEN_PROFILE_DETAIL = 'map-open-profile-detail'

export type MapOpenProfileDetail = {
  profile: Record<string, unknown>
  profileType: string
}
