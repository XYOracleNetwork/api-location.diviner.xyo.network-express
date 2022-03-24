import { points, randomPoint } from '@turf/turf'
import { Position } from 'geojson'

import { WithHashProperties } from '../../../model'
import { getQuadkeyHeatmapFromPoints, QuadkeyHeatmapTile } from './getQuadkeyHeatmapFromPoints'

/**
 * Check if a number is close to another number, within the specified tolerance. Only here
 * because the Jest types don't support Jest's version of closeTo
 * https://jestjs.io/docs/expect#expectclosetonumber-numdigits
 * @param actual Actual number
 * @param expected Expected number
 * @param tolerance Allowed deviation (plus/minus) of the actual from the expected value
 * @returns True if within the specified tolerance, false otherwise
 */
const closeTo = (actual: number, expected: number, tolerance: number): boolean => {
  return Math.abs(actual - expected) < tolerance
}

const ensureResultIsValid = (actual: QuadkeyHeatmapTile[], expectedQuadkeys?: number) => {
  expect(actual).toBeTruthy()
  const tilesWithValue = actual.filter((h) => h.density !== 0).map((p) => p.density)
  if (expectedQuadkeys) {
    expect(tilesWithValue.length).toBe(expectedQuadkeys)
  } else {
    expect(tilesWithValue.length).toBeGreaterThan(0)
  }
  // const totalDensity = tilesWithValue.reduce((sum, a) => sum + a, 0)
  // expect(closeTo(totalDensity, 100, 10)).toBeTruthy()
}

type TestDataInput = {
  coordinates: Position[]
}
type TestDataExpected = {
  quadkeys: number
}

type GetQuadkeyHeatmapFromPointsTestData = {
  input: TestDataInput
  expected: TestDataExpected
}
const testData: GetQuadkeyHeatmapFromPointsTestData[] = [
  {
    expected: {
      quadkeys: 4,
    },
    input: {
      coordinates: [
        [-90, -45],
        [-90, 45],
        [90, -45],
        [90, 45],
      ],
    },
  },
]

describe('getQuadkeyHeatmapFromPoints', () => {
  it.each(testData)('calculates with known points', (data) => {
    const locations = points<WithHashProperties>(data.input.coordinates, { hash: 'foo' })
    ensureResultIsValid(getQuadkeyHeatmapFromPoints(locations, 1), data.expected.quadkeys)
  })
  it('calculates with random points', () => {
    const locations = randomPoint(1000, { bbox: [-179, -85, 179, 85] })
    ensureResultIsValid(getQuadkeyHeatmapFromPoints(locations, 1))
  })
})
