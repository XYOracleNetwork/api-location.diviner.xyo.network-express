import { Point } from 'geojson'

import { getHeatmapFromPoints } from './getHeatmapFromPoints'

const getPoint = (longitude: number, latitude: number): Point => {
  return {
    coordinates: [longitude, latitude],
    type: 'Point',
  }
}

describe('getHeatmapFromPoints', () => {
  it('calculates with zoom level 1', () => {
    const points: Point[] = [getPoint(0, 0), getPoint(0, 1), getPoint(1, 0), getPoint(1, 1)]
    const actual = getHeatmapFromPoints(points, 1)
    const expected = [1]
    expect(actual).toBe(expected)
  })
})
