import { LocationHeatmapPointProperties } from '@xyo-network/sdk-xyo-client-js'
import { Feature, Point, Polygon } from 'geojson'

export const getHeatmapFromPoints = (
  points: Point[],
  zoom: number
): Feature<Polygon, LocationHeatmapPointProperties>[] => {
  throw new Error('Not Implemented')
}
