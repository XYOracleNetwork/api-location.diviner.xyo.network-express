import { LocationHeatmapPointProperties } from '@xyo-network/sdk-xyo-client-js'
import { Feature, Point } from 'geojson'

import { LocationWitnessPayload } from '../../../model'

export const convertLocationWitnessPayloadToGeoJson = (
  payload: LocationWitnessPayload,
  value = 0
): Feature<Point, LocationHeatmapPointProperties> => {
  const hash = payload._hash || ''
  const properties: LocationHeatmapPointProperties = {
    hash,
    value,
  }
  // https://www.rfc-editor.org/rfc/rfc7946#section-3.1.1
  // A position is an array of numbers.  There MUST be two or more
  // elements. The first two elements are longitude and latitude
  const geometry: Point = {
    coordinates: [payload.currentLocation.coords.longitude, payload.currentLocation.coords.latitude],
    type: 'Point',
  }
  const feature: Feature<Point, LocationHeatmapPointProperties> = {
    geometry,
    properties,
    type: 'Feature',
  }
  if (payload._hash) feature.id = payload._hash
  return feature
}
