import { TileWithZoom } from '../../model'
import { tileToQuadkey } from './tileToQuadkey'

interface TileQuadkey {
  tile: TileWithZoom
  quadkey: string
}

const testData: TileQuadkey[] = [
  { quadkey: '0', tile: [0, 0, 1] },
  { quadkey: '1', tile: [1, 0, 1] },
  { quadkey: '2', tile: [0, 1, 1] },
  { quadkey: '3', tile: [1, 1, 1] },
]

describe('tileToQuadkey', () => {
  it.each(testData)('converts tile to quadkey', (data: TileQuadkey) => {
    const { quadkey: expected, tile } = data
    const actual = tileToQuadkey(tile)
    expect(actual).toEqual(expected)
  })
})
