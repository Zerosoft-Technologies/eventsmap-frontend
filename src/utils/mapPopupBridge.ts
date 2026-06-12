/** Window events: Home map popups (separate Vue apps) → Header detail panels */
export const MAP_OPEN_EVENT_DETAIL = 'map-open-event-detail'
export const MAP_OPEN_PROFILE_DETAIL = 'map-open-profile-detail'
/** Re-open the map marker popup after closing View Event (Home.vue) */
export const MAP_RESTORE_EVENT_POPUP = 'map-restore-event-popup'
/** Map info-window closed without opening View Event — restore list dock if it was hidden */
export const MAP_POPUP_CLOSED = 'map-popup-closed'
/** Header logo / home reset — close all map marker popups and return map to start view */
export const MAP_RESET_HOME = 'map-reset-home'

export type MapOpenProfileDetail = {
  profile: Record<string, unknown>
  profileType: string
}
