import { TileWithZoom } from '../../model'
import { quadkeyToTile } from './quadkeyToTile'
import { TestData } from './TestData'

interface QuadkeyToTileTestData extends TestData<string, TileWithZoom> {
  expected: TileWithZoom
  input: string
}

const testData: QuadkeyToTileTestData[] = [
  { expected: [0, 0, 1], input: '0' },
  { expected: [1, 0, 1], input: '1' },
  { expected: [0, 1, 1], input: '2' },
  { expected: [1, 1, 1], input: '3' },
]

describe('quadkeyToTile', () => {
  it.each(testData)('converts quadkey to tile', (data: QuadkeyToTileTestData) => {
    const { input, expected } = data
    const actual = quadkeyToTile(input)
    expect(actual).toEqual(expected)
  })
})
