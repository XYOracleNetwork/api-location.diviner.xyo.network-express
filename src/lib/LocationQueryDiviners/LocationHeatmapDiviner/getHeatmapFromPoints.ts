import { featureCollection, pointsWithinPolygon, squareGrid, Units } from '@turf/turf'
import { LocationHeatmapPointProperties } from '@xyo-network/sdk-xyo-client-js'
import { BBox, Feature, FeatureCollection, Point, Polygon } from 'geojson'

import { WithHashProperties } from '../../../model'

// TODO: Move to SDK
export interface LocationHeatmapPolygonProperties extends LocationHeatmapPointProperties {
  count: number
  hashes: string[]
}

// const minLatitude = -85.05112878
// const maxLatitude = 85.05112878
const minLatitude = -85
const maxLatitude = 85
const minLongitude = -180
const maxLongitude = 180

const gridCellSide = 5
const gridOptions: { units: Units } = { units: 'degrees' }

const northWestQuadrantBoundingBox: BBox = [0, 0, minLongitude, maxLatitude]
const northWestQuadrantGrid = squareGrid(northWestQuadrantBoundingBox, gridCellSide, gridOptions)

const northEastQuadrantBoundingBox: BBox = [0, 0, maxLongitude, maxLatitude]
const northEastQuadrantGrid = squareGrid(northEastQuadrantBoundingBox, gridCellSide, gridOptions)

const southEastQuadrantBoundingBox: BBox = [0, 0, maxLongitude, minLatitude]
const southEastQuadrantGrid = squareGrid(southEastQuadrantBoundingBox, gridCellSide, gridOptions)

const southWestQuadrantBoundingBox: BBox = [0, 0, minLongitude, minLatitude]
const southWestQuadrantGrid = squareGrid(southWestQuadrantBoundingBox, gridCellSide, gridOptions)

const grids = [northWestQuadrantGrid, northEastQuadrantGrid, southEastQuadrantGrid, southWestQuadrantGrid]

const isString = (value: string | undefined): value is string => {
  return value !== undefined
}

export const getHeatmapFromPoints = (
  points: FeatureCollection<Point, WithHashProperties>,
  _zoom: number
): FeatureCollection<Polygon, LocationHeatmapPointProperties> => {
  const heatmap: Feature<Polygon, LocationHeatmapPointProperties>[] = []
  // TODO: Replace with QuadKey/H3 implementation for faster performance
  for (let i = 0; i < grids.length; i++) {
    const grid: FeatureCollection<Polygon> = grids[i]
    for (let j = 0; j < grid.features.length; j++) {
      const cell = grid.features[j]
      const searchWithin = cell.geometry
      const hits = pointsWithinPolygon(points, searchWithin)
      if (hits.features.length) {
        const value = (hits.features.length * 100) / points.features.length
        const properties: LocationHeatmapPolygonProperties = {
          count: hits.features.length,
          hash: '',
          hashes: hits.features.map((p) => p?.properties?.hash).filter<string>(isString),
          value,
        }
        heatmap.push({ ...cell, properties })
      }
    }
  }
  return featureCollection(heatmap)
}
