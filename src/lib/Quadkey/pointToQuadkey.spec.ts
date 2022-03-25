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

  { expected: '0', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 1 } },
  { expected: '00', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 2 } },
  { expected: '000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 3 } },
  { expected: '0000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 4 } },
  { expected: '00000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 5 } },
  { expected: '000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 6 } },
  { expected: '0000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 7 } },
  { expected: '00000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 8 } },
  { expected: '000000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 9 } },
  { expected: '0000000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 10 } },
  { expected: '00000000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 11 } },
  { expected: '000000000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 12 } },
  { expected: '0000000000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 13 } },
  { expected: '00000000000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 14 } },
  { expected: '000000000000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 15 } },
  { expected: '0000000000000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 16 } },
  { expected: '00000000000000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 17 } },
  { expected: '000000000000000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 18 } },
  { expected: '0000000000000000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 19 } },
  { expected: '00000000000000000000', input: { point: point([-179.999999999, -89.999999999]).geometry, zoom: 20 } },

  { expected: '3', input: { point: point([0, 0]).geometry, zoom: 1 } },
  { expected: '30', input: { point: point([0, 0]).geometry, zoom: 2 } },
  { expected: '300', input: { point: point([0, 0]).geometry, zoom: 3 } },
  { expected: '3000', input: { point: point([0, 0]).geometry, zoom: 4 } },
  { expected: '30000', input: { point: point([0, 0]).geometry, zoom: 5 } },
  { expected: '300000', input: { point: point([0, 0]).geometry, zoom: 6 } },
  { expected: '3000000', input: { point: point([0, 0]).geometry, zoom: 7 } },
  { expected: '30000000', input: { point: point([0, 0]).geometry, zoom: 8 } },
  { expected: '300000000', input: { point: point([0, 0]).geometry, zoom: 9 } },
  { expected: '3000000000', input: { point: point([0, 0]).geometry, zoom: 10 } },
  { expected: '30000000000', input: { point: point([0, 0]).geometry, zoom: 11 } },
  { expected: '300000000000', input: { point: point([0, 0]).geometry, zoom: 12 } },
  { expected: '3000000000000', input: { point: point([0, 0]).geometry, zoom: 13 } },
  { expected: '30000000000000', input: { point: point([0, 0]).geometry, zoom: 14 } },
  { expected: '300000000000000', input: { point: point([0, 0]).geometry, zoom: 15 } },
  { expected: '3000000000000000', input: { point: point([0, 0]).geometry, zoom: 16 } },
  { expected: '30000000000000000', input: { point: point([0, 0]).geometry, zoom: 17 } },
  { expected: '300000000000000000', input: { point: point([0, 0]).geometry, zoom: 18 } },
  { expected: '3000000000000000000', input: { point: point([0, 0]).geometry, zoom: 19 } },
  { expected: '30000000000000000000', input: { point: point([0, 0]).geometry, zoom: 20 } },

  { expected: '1', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 1 } },
  { expected: '11', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 2 } },
  { expected: '111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 3 } },
  { expected: '1111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 4 } },
  { expected: '11111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 5 } },
  { expected: '111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 6 } },
  { expected: '1111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 7 } },
  { expected: '11111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 8 } },
  { expected: '111111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 9 } },
  { expected: '1111111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 10 } },
  { expected: '11111111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 11 } },
  { expected: '111111111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 12 } },
  { expected: '1111111111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 13 } },
  { expected: '11111111111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 14 } },
  { expected: '111111111111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 15 } },
  { expected: '1111111111111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 16 } },
  { expected: '11111111111111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 17 } },
  { expected: '111111111111111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 18 } },
  { expected: '1111111111111111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 19 } },
  { expected: '11111111111111111111', input: { point: point([179.999999999, 89.999999999]).geometry, zoom: 20 } },
]

describe('pointToQuadkey', () => {
  it.each(testData)('converts point to quadkey', (data: PointToQuadkeyTestData) => {
    const { expected } = data
    const { point, zoom } = data.input
    const actual = pointToQuadkey(point, zoom)
    expect(actual).toEqual(expected)
  })
})
