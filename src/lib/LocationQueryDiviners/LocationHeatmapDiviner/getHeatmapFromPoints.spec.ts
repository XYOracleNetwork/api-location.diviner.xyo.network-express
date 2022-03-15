import { points } from '@turf/turf'

import { getHeatmapFromPoints } from './getHeatmapFromPoints'

describe('getHeatmapFromPoints', () => {
  it('calculates with zoom level 1', () => {
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
    expect(tilesWithValue.length).toBe(locations.length)
    const totalPercent = tilesWithValue.reduce((sum, a) => sum + a, 0)
    expect(totalPercent).toBeCloseTo(100.0, 1)
  })
})
