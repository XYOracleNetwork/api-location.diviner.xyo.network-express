import { LocationTimeRangePointProperties } from '@xyo-network/sdk-xyo-client-js'
import { Feature, FeatureCollection, Point } from 'geojson'

export const getFeatureCollectionFromPoints = (
  points: Feature<Point, LocationTimeRangePointProperties>[]
): FeatureCollection<Point, LocationTimeRangePointProperties> => {
  return {
    features: [...points],
    type: 'FeatureCollection',
  }
}
