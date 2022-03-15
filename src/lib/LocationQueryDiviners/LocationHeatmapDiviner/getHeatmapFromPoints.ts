import { LocationHeatmapPointProperties } from '@xyo-network/sdk-xyo-client-js'
import { Feature, Point, Polygon } from 'geojson'

export const getHeatmapFromPoints = (points: Point[]): Feature<Polygon, LocationHeatmapPointProperties>[] => {
  throw new Error('Not Implemented')
}
