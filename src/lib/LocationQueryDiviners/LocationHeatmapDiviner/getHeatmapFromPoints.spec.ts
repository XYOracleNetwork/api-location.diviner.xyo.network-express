import { points } from '@turf/turf'

import { getHeatmapFromPoints } from './getHeatmapFromPoints'

describe('getHeatmapFromPoints', () => {
  it('calculates with zoom level 1', () => {
    const data = points([
      [-90, -45],
      [-90, 45],
      [90, -45],
      [90, 45],
      [0, 0],
    ]).features.map((f) => f.geometry)
    const actual = getHeatmapFromPoints(data, 1)
    console.log(actual)
  })
})
