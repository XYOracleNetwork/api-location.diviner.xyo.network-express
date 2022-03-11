import { Feature, FeatureCollection, Point } from 'geojson'

import { LocationRangePointProperties } from './LocationRangePointProperties'

export const getFeatureCollectionFromPoints = (
  points: Feature<Point, LocationRangePointProperties>[]
): FeatureCollection<Point, LocationRangePointProperties> => {
  return {
    features: [...points],
    type: 'FeatureCollection',
  }
}
