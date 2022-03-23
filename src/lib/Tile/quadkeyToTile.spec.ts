import { TileWithZoom } from '../../model'
import { quadkeyToTile } from './quadkeyToTile'

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

describe('quadkeyToTile', () => {
  it.each(testData)('converts quadkey to tile', (data: TileQuadkey) => {
    const { quadkey, tile: expected } = data
    const actual = quadkeyToTile(quadkey)
    expect(actual).toEqual(expected)
  })
})
