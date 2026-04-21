export interface RouteStep {
  instruction: string
  distance: number
  duration: number
  maneuver: string
}

export interface RouteResult {
  polyline: [number, number][]
  distanceMeters: number
  durationSeconds: number
  steps: RouteStep[]
}

export type TransportMode = 'driving' | 'walking' | 'cycling'

const PROFILE_MAP: Record<TransportMode, string> = {
  driving: 'driving',
  walking: 'foot',
  cycling: 'bike',
}

function formatStepInstruction(step: Record<string, unknown>): string {
  const m = step.maneuver as Record<string, string> | undefined
  const type = m?.type ?? ''
  const modifier = m?.modifier ?? ''
  const name = step.name ? ` onto ${step.name}` : ''

  const labels: Record<string, string> = {
    depart: '📍 Start',
    arrive: '🏁 Arrive at destination',
    merge: '⤵ Merge',
    'on ramp': '⤴ Take ramp',
    'off ramp': '⤵ Take exit',
    continue: '↑ Continue straight',
    roundabout: '🔄 Enter roundabout',
    rotary: '🔄 Enter rotary',
  }

  if (labels[type]) return `${labels[type]}${name}`

  if (type === 'turn' || type === 'end of road') {
    const dir: Record<string, string> = {
      left: '↰ Turn left',
      right: '↱ Turn right',
      'slight left': '↖ Slight left',
      'slight right': '↗ Slight right',
      'sharp left': '⬅ Sharp left',
      'sharp right': '➡ Sharp right',
    }
    return `${dir[modifier] ?? '↕ Turn'}${name}`
  }

  if (type === 'fork') {
    return `${modifier.includes('left') ? '↰ Keep left' : '↱ Keep right'}${name}`
  }

  return `↑ Continue${name}`
}

export async function fetchRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  mode: TransportMode = 'driving',
): Promise<RouteResult> {
  const profile = PROFILE_MAP[mode]
  const url =
    `https://router.project-osrm.org/route/v1/${profile}/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}` +
    `?overview=full&geometries=geojson&steps=true&annotations=false`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Routing request failed: ${res.status}`)

  const data = await res.json()
  if (data.code !== 'Ok' || !data.routes?.length) {
    throw new Error('No route found between these locations')
  }

  const route = data.routes[0]
  const leg = route.legs[0]

  const polyline: [number, number][] = route.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng],
  )

  const steps: RouteStep[] = leg.steps.map((s: Record<string, unknown>) => ({
    instruction: formatStepInstruction(s),
    distance: s.distance as number,
    duration: s.duration as number,
    maneuver: (s.maneuver as Record<string, string>)?.type ?? 'straight',
  }))

  return { polyline, distanceMeters: route.distance, durationSeconds: route.duration, steps }
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const r = mins % 60
  return r > 0 ? `${h}h ${r}min` : `${h}h`
}
