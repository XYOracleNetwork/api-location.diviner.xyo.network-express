import { Polygon } from 'geojson'

import { getLowerRight, getUpperLeft } from './geoJsonPolygonUtils'
import { tileFromPoint } from './tileFromPoint'

export const tilesFromBoundingBox = (box: Polygon, zoom: number): number[][] => {
  const nw = tileFromPoint(getUpperLeft(box), zoom)
  const se = tileFromPoint(getLowerRight(box), zoom)
  const size = Math.pow(2, zoom)

  let minX = nw[0]
  let maxX = se[0]
  let minY = nw[1]
  let maxY = se[1]

  //in case of horizontal wrapping
  if (minX >= maxX) {
    maxX = maxX + size
  }

  if (zoom < 4) {
    minX = 0
    maxX = size - 1
    minY = 0
    maxY = size - 1
  }

  const result: number[][] = []

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const val: number[] = [x % size, y, zoom]
      result.push(val)
    }
  }

  return result
}
