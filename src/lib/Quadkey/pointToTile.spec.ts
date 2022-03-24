import { point } from '@turf/turf'
import { Point } from 'geojson'

import { pointToTile } from './pointToTile'
import { TestData } from './TestData'

interface PointZoom {
  point: Point
  zoom: number
}
interface PointToTileTestData extends TestData<PointZoom, number[]> {
  input: PointZoom
  expected: number[]
}

const testData: PointToTileTestData[] = [
  { expected: [0, 0, 1], input: { point: point([-90, 45]).geometry, zoom: 1 } },
  { expected: [1, 0, 1], input: { point: point([90, 45]).geometry, zoom: 1 } },
  { expected: [0, 1, 1], input: { point: point([-90, -45]).geometry, zoom: 1 } },
  { expected: [1, 1, 1], input: { point: point([90, -45]).geometry, zoom: 1 } },

  { expected: [3, 3, 3], input: { point: point([-1, 1]).geometry, zoom: 3 } },
  { expected: [4, 3, 3], input: { point: point([1, 1]).geometry, zoom: 3 } },
  { expected: [3, 4, 3], input: { point: point([-1, -1]).geometry, zoom: 3 } },
  { expected: [4, 4, 3], input: { point: point([1, -1]).geometry, zoom: 3 } },
]

describe('pointToTile', () => {
  it.each(testData)('converts point to tile', (data: PointToTileTestData) => {
    const { expected } = data
    const { point, zoom } = data.input
    const actual = pointToTile(point, zoom)
    expect(actual).toEqual(expected)
  })
})
