import { Feature, Point } from 'geojson'

import { LocationWitnessPayload } from '../../model'
import { GeoJsonPointProperties } from './GeoJsonPointProperties'

export const convertLocationSchemaToGeoJson = (
  payload: LocationWitnessPayload
): Feature<Point, GeoJsonPointProperties> => {
  const { schema, _archive, _client, _timestamp } = payload as GeoJsonPointProperties
  const properties: GeoJsonPointProperties = {
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
  const feature: Feature<Point, GeoJsonPointProperties> = {
    geometry,
    properties,
    type: 'Feature',
  }
  if (payload._hash) feature.id = payload._hash
  return feature
}
