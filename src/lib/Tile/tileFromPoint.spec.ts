import { point } from '@turf/turf'
import { Feature, Point } from 'geojson'

import { tileFromPoint } from './tileFromPoint'

interface PointZoomTile {
  point: Feature<Point>
  zoom: number
  tile: number[]
}

const testData: PointZoomTile[] = [
  { point: point([-90, 180]), tile: [0, 0, 1], zoom: 1 },
  { point: point([90, 180]), tile: [1, 0, 1], zoom: 1 },
  { point: point([-90, -180]), tile: [0, 1, 1], zoom: 1 },
  { point: point([90, -180]), tile: [1, 1, 1], zoom: 1 },
]

describe('tileFromPoint', () => {
  it.each(testData)('converts tiles to points', (data: PointZoomTile) => {
    const { point, zoom, tile: expected } = data
    const actual = tileFromPoint(point.geometry, zoom)
    expect(actual).toEqual(expected)
  })
})
