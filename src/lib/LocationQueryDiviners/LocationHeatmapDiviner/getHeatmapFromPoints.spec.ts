import { points, randomPoint } from '@turf/turf'
import { LocationHeatmapPointProperties } from '@xyo-network/sdk-xyo-client-js'
import { FeatureCollection, Polygon } from 'geojson'

import { getHeatmapFromPoints } from './getHeatmapFromPoints'

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
  expect(totalPercent).toBeCloseTo(100.0, 1)
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
    const locations = randomPoint(100, { bbox: [-179, -85, 179, 85] }).features.map((f) => f.geometry)
    ensureResultIsValid(getHeatmapFromPoints(locations, 1))
  })
})
