import { Feature, Point } from 'geojson'

import { GeoJsonPointProperties } from './GeoJsonPointProperties'
import { LocationWitnessPayloadBody } from './getLocationsInTimeRange'

export const convertLocationSchemaToGeoJson = (
  schema: LocationWitnessPayloadBody
): Feature<Point, GeoJsonPointProperties> => {
  const type = 'Feature'
  // TODO: Skip single bad data points, possibly fail hard in some cases
  const properties: GeoJsonPointProperties = {
    ...schema,
  }
  // https://www.rfc-editor.org/rfc/rfc7946#section-3.1.1
  // A position is an array of numbers.  There MUST be two or more
  // elements. The first two elements are longitude and latitude
  const geometry: Point = {
    coordinates: [schema.currentLocation.coords.longitude, schema.currentLocation.coords.latitude],
    type: 'Point',
  }
  return {
    geometry,
    properties,
    type,
  }
}
