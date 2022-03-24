import { TestData, TileWithZoom } from '../../model'
import { tileToQuadkey } from './tileToQuadkey'

interface TileToQuadkeyTestData extends TestData<TileWithZoom, string> {
  input: TileWithZoom
  expected: string
}

const testData: TileToQuadkeyTestData[] = [
  { expected: '0', input: [0, 0, 1] },
  { expected: '1', input: [1, 0, 1] },
  { expected: '2', input: [0, 1, 1] },
  { expected: '3', input: [1, 1, 1] },

  { expected: '03', input: [1, 1, 2] },
  { expected: '12', input: [2, 1, 2] },
  { expected: '21', input: [1, 2, 2] },
  { expected: '30', input: [2, 2, 2] },

  { expected: '000', input: [0, 0, 3] },
  { expected: '111', input: [7, 0, 3] },
  { expected: '222', input: [0, 7, 3] },
  { expected: '333', input: [7, 7, 3] },
  { expected: '213', input: [3, 5, 3] },
]

describe('tileToQuadkey', () => {
  it.each(testData)('converts tile to quadkey', (data: TileToQuadkeyTestData) => {
    const { expected, input } = data
    const actual = tileToQuadkey(input)
    expect(actual).toEqual(expected)
  })
})
