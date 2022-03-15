import {
  bbox,
  bboxPolygon,
  feature,
  featureCollection,
  pointsWithinPolygon,
  squareGrid,
  transformScale,
} from '@turf/turf'
import { LocationHeatmapPointProperties } from '@xyo-network/sdk-xyo-client-js'
import { BBox, Feature, FeatureCollection, Point, Polygon } from 'geojson'

const minLatitude = -85.05112878
const maxLatitude = 85.05112878
const minLongitude = -180
const maxLongitude = 180

export const getHeatmapFromPoints = (
  points: Point[],
  zoom: number
): Feature<Polygon, LocationHeatmapPointProperties>[] => {
  const pointsAsFeatures: Feature<Point>[] = points.map((p) => feature(p))
  const pointsAsFeatureCollection: FeatureCollection<Point> = featureCollection(pointsAsFeatures)
  const boundingBox: BBox = bbox(pointsAsFeatureCollection)
  const boundingPolygon: Feature<Polygon> = bboxPolygon(boundingBox)
  const scaledBoundingBoxPolygon: Feature<Polygon> = transformScale(boundingPolygon, 1.1)
  const scaledBoundingBox: BBox = bbox(scaledBoundingBoxPolygon)
  // TODO: Based on zoom here
  const cellSide = 15
  let grid: FeatureCollection<Polygon> = squareGrid(scaledBoundingBox, cellSide, { units: 'degrees' })
  if (!grid.features.length) {
    grid = squareGrid(
      [scaledBoundingBox[2], scaledBoundingBox[3], scaledBoundingBox[0], scaledBoundingBox[1]],
      cellSide,
      { units: 'degrees' }
    )
  }
  const heatmap = grid.features.map((cell) => {
    const searchWithin = cell.geometry
    const hits = pointsWithinPolygon(pointsAsFeatureCollection, searchWithin)
    const value = hits.features.length ? (hits.features.length / points.length) * 100 : 0
    const properties: LocationHeatmapPointProperties = {
      hash: '',
      value,
    }
    const ret: Feature<Polygon, LocationHeatmapPointProperties> = { ...cell, properties }
    return ret
  })
  return heatmap
}
