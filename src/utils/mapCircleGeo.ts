/** Approximate circle polygon for map region overlays (e.g. talent service area). */
export function circlePolygonCoordinates(
  lat: number,
  lng: number,
  radiusKm: number,
  points = 64,
): number[][] {
  const coords: number[][] = []
  const earthRadiusKm = 6371
  const distanceRadians = radiusKm / earthRadiusKm
  const latRad = (lat * Math.PI) / 180
  const lngRad = (lng * Math.PI) / 180

  for (let i = 0; i <= points; i += 1) {
    const bearing = (i / points) * 2 * Math.PI
    const lat2 = Math.asin(
      Math.sin(latRad) * Math.cos(distanceRadians) +
        Math.cos(latRad) * Math.sin(distanceRadians) * Math.cos(bearing),
    )
    const lng2 =
      lngRad +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distanceRadians) * Math.cos(latRad),
        Math.cos(distanceRadians) - Math.sin(latRad) * Math.sin(lat2),
      )
    coords.push([(lng2 * 180) / Math.PI, (lat2 * 180) / Math.PI])
  }

  return coords
}

export function circlePolygonFeature(
  lat: number,
  lng: number,
  radiusKm: number,
  properties: Record<string, unknown> = {},
) {
  return {
    type: 'Feature' as const,
    properties,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [circlePolygonCoordinates(lat, lng, radiusKm)],
    },
  }
}
