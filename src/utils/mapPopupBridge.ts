/** Window events: Home map popups (separate Vue apps) → Header detail panels */
export const MAP_OPEN_EVENT_DETAIL = 'map-open-event-detail'
export const MAP_OPEN_PROFILE_DETAIL = 'map-open-profile-detail'
/** Re-open the map marker popup after closing View Event (Home.vue) */
export const MAP_RESTORE_EVENT_POPUP = 'map-restore-event-popup'

export type MapOpenProfileDetail = {
  profile: Record<string, unknown>
  profileType: string
}
