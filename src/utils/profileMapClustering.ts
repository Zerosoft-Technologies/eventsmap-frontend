import type { MapProfileItem } from '@/stores/mapStore'
import { groupIntoMapClusters } from '@/utils/mapClustering'

export type { MapClusterMarkerVariant } from '@/utils/mapClustering'
export { clusterPrecisionForZoom, createMapClusterMarkerElement } from '@/utils/mapClustering'

export interface ProfileMapPoint {
  profile: MapProfileItem
  latitude: number
  longitude: number
}

export interface ProfileMapCluster {
  key: string
  latitude: number
  longitude: number
  profiles: MapProfileItem[]
}

export function groupProfilesIntoClusters(
  points: ProfileMapPoint[],
  precision: number,
): ProfileMapCluster[] {
  return groupIntoMapClusters(
    points.map((p) => ({
      latitude: p.latitude,
      longitude: p.longitude,
      item: p.profile,
    })),
    precision,
  ).map((c) => ({
    key: c.key,
    latitude: c.latitude,
    longitude: c.longitude,
    profiles: c.items,
  }))
}

export function profileTypeLabel(profileType: string): string {
  const map: Record<string, string> = {
    organisers: 'Organiser',
    organizer: 'Organiser',
    talents: 'Talent',
    talent: 'Talent',
    venues: 'Venue',
    venue: 'Venue',
  }
  return map[profileType] ?? profileType
}

function categoryNameFromField(value: unknown): string {
  if (value && typeof value === 'object' && 'name' in value) {
    const name = (value as { name?: string }).name
    return typeof name === 'string' ? name : ''
  }
  return ''
}

export function profileCategoryName(profile: MapProfileItem): string {
  const pt = profile.profileType
  if (pt === 'organisers') {
    return categoryNameFromField(profile.organiser_category) || categoryNameFromField(profile.category)
  }
  if (pt === 'talents') {
    return categoryNameFromField(profile.talent_category) || categoryNameFromField(profile.category)
  }
  if (pt === 'venues') {
    return categoryNameFromField(profile.venue_category) || categoryNameFromField(profile.category)
  }
  return categoryNameFromField(profile.category)
}
