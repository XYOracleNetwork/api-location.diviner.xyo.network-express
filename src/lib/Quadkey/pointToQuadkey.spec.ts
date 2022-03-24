import { point } from '@turf/turf'
import { Point } from 'geojson'

import { TestData, Zoom } from '../../model'
import { pointToQuadkey } from './pointToQuadkey'

interface PointWithZoom {
  point: Point
  zoom: Zoom
}
interface PointToQuadkeyTestData extends TestData<PointWithZoom, string> {
  input: PointWithZoom
  expected: string
}

const testData: PointToQuadkeyTestData[] = [
  { expected: '0', input: { point: point([-90, 45]).geometry, zoom: 1 } },
  { expected: '1', input: { point: point([90, 45]).geometry, zoom: 1 } },
  { expected: '2', input: { point: point([-90, -45]).geometry, zoom: 1 } },
  { expected: '3', input: { point: point([90, -45]).geometry, zoom: 1 } },

  { expected: '033', input: { point: point([-1, 1]).geometry, zoom: 3 } },
  { expected: '122', input: { point: point([1, 1]).geometry, zoom: 3 } },
  { expected: '211', input: { point: point([-1, -1]).geometry, zoom: 3 } },
  { expected: '300', input: { point: point([1, -1]).geometry, zoom: 3 } },
]

describe('pointToQuadkey', () => {
  it.each(testData)('converts point to quadkey', (data: PointToQuadkeyTestData) => {
    const { expected } = data
    const { point, zoom } = data.input
    const actual = pointToQuadkey(point, zoom)
    expect(actual).toEqual(expected)
  })
})
