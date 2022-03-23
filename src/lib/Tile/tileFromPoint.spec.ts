import { point } from '@turf/turf'
import { Feature, Point } from 'geojson'

import { tileFromPoint } from './tileFromPoint'

interface PointZoomTile {
  point: Feature<Point>
  zoom: number
  tile: number[]
}

const testData: PointZoomTile[] = [
  { point: point([-90, 45]), tile: [0, 0, 1], zoom: 1 },
  { point: point([90, 45]), tile: [1, 0, 1], zoom: 1 },
  { point: point([-90, -45]), tile: [0, 1, 1], zoom: 1 },
  { point: point([90, -45]), tile: [1, 1, 1], zoom: 1 },

  { point: point([-1, 1]), tile: [3, 3, 3], zoom: 3 },
  { point: point([1, 1]), tile: [4, 3, 3], zoom: 3 },
  { point: point([-1, -1]), tile: [3, 4, 3], zoom: 3 },
  { point: point([1, -1]), tile: [4, 4, 3], zoom: 3 },

  { point: point([-179, 89]), tile: [0, 0, 3], zoom: 3 },
  { point: point([179, 89]), tile: [7, 0, 3], zoom: 3 },
  { point: point([-179, -89]), tile: [0, 7, 3], zoom: 3 },
  { point: point([179, -89]), tile: [7, 7, 3], zoom: 3 },
]

describe('tileFromPoint', () => {
  it.each(testData)('converts tiles to points', (data: PointZoomTile) => {
    const { point, zoom, tile: expected } = data
    const actual = tileFromPoint(point.geometry, zoom)
    expect(actual).toEqual(expected)
  })
})
