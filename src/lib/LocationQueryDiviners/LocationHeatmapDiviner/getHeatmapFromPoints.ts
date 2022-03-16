import { feature, featureCollection, pointsWithinPolygon, polygon, squareGrid } from '@turf/turf'
import { LocationHeatmapPointProperties } from '@xyo-network/sdk-xyo-client-js'
import { BBox, Feature, FeatureCollection, Point, Polygon } from 'geojson'

const minLatitude = -85.05112878
const maxLatitude = 85.05112878
const minLongitude = -180
const maxLongitude = 180

const gridCellSide = 0.5

const northWestQuadrant = polygon([
  [
    [minLongitude, maxLatitude],
    [0, maxLatitude],
    [0, 0],
    [minLongitude, 0],
    [minLongitude, maxLatitude],
  ],
])
const northWestQuadrantBoundingBox: BBox = [0, 0, -180, 90]
const northWestQuadrantGrid = squareGrid(northWestQuadrantBoundingBox, gridCellSide, { units: 'degrees' })

const northEastQuadrant = polygon([
  [
    [0, maxLatitude],
    [maxLongitude, maxLatitude],
    [maxLongitude, 0],
    [0, 0],
    [0, maxLatitude],
  ],
])
const northEastQuadrantBoundingBox: BBox = [0, 0, 180, 90]
const northEastQuadrantGrid = squareGrid(northEastQuadrantBoundingBox, gridCellSide, { units: 'degrees' })

const southEastQuadrant = polygon([
  [
    [0, 0],
    [maxLongitude, 0],
    [maxLongitude, minLatitude],
    [0, minLatitude],
    [0, 0],
  ],
])
const southEastQuadrantBoundingBox: BBox = [0, 0, 180, -90]
const southEastQuadrantGrid = squareGrid(southEastQuadrantBoundingBox, gridCellSide, { units: 'degrees' })

const southWestQuadrant = polygon([
  [
    [minLongitude, 0],
    [0, 0],
    [0, minLatitude],
    [minLongitude, minLatitude],
    [minLongitude, 0],
  ],
])
const southWestQuadrantBoundingBox: BBox = [0, 0, -180, -90]
const southWestQuadrantGrid = squareGrid(southWestQuadrantBoundingBox, gridCellSide, { units: 'degrees' })

export const getHeatmapFromPoints = (
  points: Point[],
  zoom: number
): FeatureCollection<Polygon, LocationHeatmapPointProperties> => {
  const pointsAsFeatures: Feature<Point>[] = points.map((p) => feature(p))
  const pointsAsFeatureCollection: FeatureCollection<Point> = featureCollection(pointsAsFeatures)
  const heatmap: Feature<Polygon, LocationHeatmapPointProperties>[] = []
  const grids = [northWestQuadrantGrid, northEastQuadrantGrid, southEastQuadrantGrid, southWestQuadrantGrid]
  for (let i = 0; i < grids.length; i++) {
    const grid: FeatureCollection<Polygon> = grids[i]
    grid.features.map((cell) => {
      const searchWithin = cell.geometry
      const hits = pointsWithinPolygon(pointsAsFeatureCollection, searchWithin)
      const value = hits.features.length ? (hits.features.length * 100) / points.length : 0
      const properties: LocationHeatmapPointProperties = {
        hash: '',
        value,
      }
      heatmap.push({ ...cell, properties })
    })
  }
  return featureCollection(heatmap)
}
