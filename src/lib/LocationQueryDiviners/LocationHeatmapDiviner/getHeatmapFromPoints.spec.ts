import { points, randomPoint } from '@turf/turf'

import { getHeatmapFromPoints } from './getHeatmapFromPoints'

describe('getHeatmapFromPoints', () => {
  it('calculates with known points', () => {
    const coordinates = [
      [-90, -45],
      [-90, 45],
      [90, -45],
      [90, 45],
      [0, 0],
    ]
    const locations = points(coordinates).features.map((f) => f.geometry)
    const actual = getHeatmapFromPoints(locations, 1)
    expect(actual).toBeTruthy()
    const tilesWithValue = actual.filter((h) => h.properties.value !== 0).map((p) => p.properties.value)
    expect(tilesWithValue.length).toBe(coordinates.length)
    const totalPercent = tilesWithValue.reduce((sum, a) => sum + a, 0)
    expect(totalPercent).toBeCloseTo(100.0, 1)
  })
  it('calculates with random points', () => {
    const locations = randomPoint(100, { bbox: [-179, -85, 179, 85] }).features.map((f) => f.geometry)
    const actual = getHeatmapFromPoints(locations, 1)
    expect(actual).toBeTruthy()
    const tilesWithValue = actual.filter((h) => h.properties.value !== 0).map((p) => p.properties.value)
    expect(tilesWithValue.length).toBeGreaterThan(0)
    const totalPercent = tilesWithValue.reduce((sum, a) => sum + a, 0)
    expect(totalPercent).toBeCloseTo(100.0, 1)
  })
})
