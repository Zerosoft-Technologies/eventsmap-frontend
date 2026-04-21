import { ref } from 'vue'

/** Fly-to target from event cards (e.g. Event.vue Route). Kept outside Pinia to avoid HMR/stale-store issues. */
export interface MapEventFocusPulse {
  lat: number
  lng: number
  seq: number
}

export const eventMapFocusPulse = ref<MapEventFocusPulse | null>(null)

let eventMapFocusSeq = 0

export function requestEventMapFocus(lat: number, lng: number) {
  const la = Number(lat)
  const ln = Number(lng)
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return
  eventMapFocusSeq += 1
  eventMapFocusPulse.value = { lat: la, lng: ln, seq: eventMapFocusSeq }
}
