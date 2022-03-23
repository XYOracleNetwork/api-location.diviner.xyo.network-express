import { Feature, Point } from 'geojson'

import { CurrentLocationWitnessPayload, WithHashProperties } from '../../../model'
import { ConvertLocationDataToGeoJsonGeometry } from '../../Converters'

export const convertCurrentLocationWitnessForHeatmap: ConvertLocationDataToGeoJsonGeometry<
  CurrentLocationWitnessPayload,
  Point,
  WithHashProperties
> = (payload) => {
  const hash = payload._hash
  const properties: WithHashProperties = hash ? { hash } : null
  // https://www.rfc-editor.org/rfc/rfc7946#section-3.1.1
  // A position is an array of numbers.  There MUST be two or more
  // elements. The first two elements are longitude and latitude
  const geometry: Point = {
    coordinates: [payload.longitude, payload.latitude],
    type: 'Point',
  }
  const feature: Feature<Point, WithHashProperties> = {
    geometry,
    properties,
    type: 'Feature',
  }
  return feature
}
