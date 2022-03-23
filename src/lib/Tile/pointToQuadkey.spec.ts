import { point } from '@turf/turf'
import { Feature, Point } from 'geojson'

import { Zoom } from '../../model'
import { pointToQuadkey } from './pointToQuadkey'

interface PointZoomTile {
  point: Feature<Point>
  zoom: Zoom
  quadkey: string
}

const testData: PointZoomTile[] = [
  { point: point([-90, 45]), quadkey: '0', zoom: 1 },
  { point: point([90, 45]), quadkey: '1', zoom: 1 },
  { point: point([-90, -45]), quadkey: '2', zoom: 1 },
  { point: point([90, -45]), quadkey: '3', zoom: 1 },

  { point: point([-1, 1]), quadkey: '033', zoom: 3 },
  { point: point([1, 1]), quadkey: '122', zoom: 3 },
  { point: point([-1, -1]), quadkey: '211', zoom: 3 },
  { point: point([1, -1]), quadkey: '300', zoom: 3 },
]

describe('pointToQuadkey', () => {
  it.each(testData)('converts point to quadkey', (data: PointZoomTile) => {
    const { point, zoom, quadkey: expected } = data
    const actual = pointToQuadkey(point.geometry, zoom)
    expect(actual).toEqual(expected)
  })
})
