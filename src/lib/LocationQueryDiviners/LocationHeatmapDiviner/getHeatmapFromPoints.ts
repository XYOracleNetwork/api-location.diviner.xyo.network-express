import { featureCollection, pointsWithinPolygon, squareGrid, Units } from '@turf/turf'
import { LocationHeatmapPointProperties } from '@xyo-network/sdk-xyo-client-js'
import { BBox, Feature, FeatureCollection, Point, Polygon } from 'geojson'

import { WithHashProperties } from '../../../model'

// TODO: Move to SDK
export interface LocationHeatmapPolygonProperties extends LocationHeatmapPointProperties {
  count: number
  // hashes: string[]
}

// const minLatitude = -85.05112878
// const maxLatitude = 85.05112878
const minLatitude = -85
const maxLatitude = 85
const minLongitude = -180
const maxLongitude = 180

const gridCellSide = 2
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

const shuffleArray = <T>(array: Array<T>) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
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
          // hashes: hits.features.map((p) => p?.properties?.hash).filter<string>(isString),
          value,
        }
        heatmap.push({ ...cell, properties })
      }
    }
  }
  // shuffleArray(heatmap)
  // return featureCollection(heatmap.slice(0, 300))
  // const descendingHeatmap = heatmap.sort((a, b) => b.properties.value - a.properties.value)
  // return featureCollection(descendingHeatmap.slice(0, 400))
  return featureCollection(heatmap)
}
