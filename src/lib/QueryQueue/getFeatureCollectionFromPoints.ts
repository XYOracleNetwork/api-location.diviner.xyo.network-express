import { Feature, FeatureCollection, Point } from 'geojson'

import { GeoJsonPointProperties } from './GeoJsonPointProperties'

export const getFeatureCollectionFromPoints = (
  points: Feature<Point, GeoJsonPointProperties>[]
): FeatureCollection<Point, GeoJsonPointProperties> => {
  return {
    features: [...points],
    type: 'FeatureCollection',
  }
}
