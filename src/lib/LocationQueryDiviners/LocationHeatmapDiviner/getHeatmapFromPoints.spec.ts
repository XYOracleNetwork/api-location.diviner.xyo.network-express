import { points, randomPoint } from '@turf/turf'
import { LocationHeatmapPointProperties } from '@xyo-network/sdk-xyo-client-js'
import { FeatureCollection, Polygon } from 'geojson'

import { getHeatmapFromPoints } from './getHeatmapFromPoints'

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

const ensureResultIsValid = (
  actual: FeatureCollection<Polygon, LocationHeatmapPointProperties>,
  expectedTilesWithValue?: number
) => {
  expect(actual).toBeTruthy()
  const tilesWithValue = actual.features.filter((h) => h.properties.value !== 0).map((p) => p.properties.value)
  if (expectedTilesWithValue) {
    expect(tilesWithValue.length).toBe(expectedTilesWithValue)
  } else {
    expect(tilesWithValue.length).toBeGreaterThan(0)
  }
  const totalPercent = tilesWithValue.reduce((sum, a) => sum + a, 0)
  expect(closeTo(totalPercent, 100, 1)).toBeTruthy()
}

describe('getHeatmapFromPoints', () => {
  it('calculates with known points', () => {
    const coordinates = [
      [-90, -45],
      [-90, 45],
      [90, -45],
      [90, 45],
    ]
    const locations = points(coordinates).features.map((f) => f.geometry)
    ensureResultIsValid(getHeatmapFromPoints(locations, 1), coordinates.length)
  })
  it('calculates with random points', () => {
    const locations = randomPoint(1000, { bbox: [-179, -85, 179, 85] }).features.map((f) => f.geometry)
    ensureResultIsValid(getHeatmapFromPoints(locations, 1))
  })
})
