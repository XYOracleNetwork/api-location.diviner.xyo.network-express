import { CoordinatesWithZoom } from '../../model'
import { coordinatesToQuadkey } from './coordinatesToQuadkey'

interface CoordinatesQuadkey {
  coordinates: CoordinatesWithZoom
  quadkey: string
}

const testData: CoordinatesQuadkey[] = [
  { coordinates: [-90, 45, 1], quadkey: '2' },
  { coordinates: [90, 45, 1], quadkey: '2' },
  { coordinates: [-90, -45, 1], quadkey: '2' },
  { coordinates: [90, -45, 1], quadkey: '2' },

  { coordinates: [-90, 45, 2], quadkey: '12' },
  { coordinates: [90, 45, 2], quadkey: '12' },
  { coordinates: [-90, -45, 2], quadkey: '32' },
  { coordinates: [90, -45, 2], quadkey: '32' },

  { coordinates: [-90, 45, 3], quadkey: '312' },
  { coordinates: [90, 45, 3], quadkey: '212' },
  { coordinates: [-90, -45, 3], quadkey: '132' },
  { coordinates: [90, -45, 3], quadkey: '032' },
]

describe('coordinatesToQuadkey', () => {
  it.each(testData)('converts coordinates to quadkey', (data: CoordinatesQuadkey) => {
    const { quadkey: expected, coordinates } = data
    const actual = coordinatesToQuadkey(coordinates)
    expect(actual).toEqual(expected)
  })
})
