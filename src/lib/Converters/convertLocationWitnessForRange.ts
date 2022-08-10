import { LocationTimeRangePointProperties, LocationWitnessPayload } from '@xyo-network/api'
import { Feature, Point } from 'geojson'

import { ConvertLocationDataToGeoJsonGeometry } from './ConvertLocationDataToGeoJsonGeometry'

export const convertLocationWitnessForRange: ConvertLocationDataToGeoJsonGeometry<LocationWitnessPayload, Point, LocationTimeRangePointProperties> = (
  payload: LocationWitnessPayload,
) => {
  const { schema, _archive, _client, _timestamp } = payload as LocationTimeRangePointProperties
  const properties: LocationTimeRangePointProperties = {
    _archive,
    _client,
    _timestamp,
    schema,
  }
  // https://www.rfc-editor.org/rfc/rfc7946#section-3.1.1
  // A position is an array of numbers.  There MUST be two or more
  // elements. The first two elements are longitude and latitude
  const geometry: Point = {
    coordinates: [payload.currentLocation.coords.longitude, payload.currentLocation.coords.latitude],
    type: 'Point',
  }
  const feature: Feature<Point, LocationTimeRangePointProperties> = {
    geometry,
    properties,
    type: 'Feature',
  }
  if (payload._hash) feature.id = payload._hash
  return feature
}
