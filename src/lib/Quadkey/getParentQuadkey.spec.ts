import { TestData } from '../../model'
import { getParentQuadkey } from './getParentQuadkey'

interface GetParentQuadkeyTestData extends TestData<string, string> {
  input: string
  expected: string
}

const testData: GetParentQuadkeyTestData[] = [
  { expected: '1', input: '11' },
  { expected: '11', input: '111' },
  { expected: '111', input: '1111' },
  { expected: '1111', input: '11111' },
  { expected: '11111', input: '111111' },
  { expected: '111111', input: '1111111' },
  { expected: '1111111', input: '11111111' },
  { expected: '11111111', input: '111111111' },
  { expected: '111111111', input: '1111111111' },
  { expected: '1111111111', input: '11111111111' },
  { expected: '11111111111', input: '111111111111' },
  { expected: '111111111111', input: '1111111111111' },
  { expected: '1111111111111', input: '11111111111111' },
  { expected: '11111111111111', input: '111111111111111' },
  { expected: '111111111111111', input: '1111111111111111' },
  { expected: '1111111111111111', input: '11111111111111111' },
  { expected: '11111111111111111', input: '111111111111111111' },
  { expected: '111111111111111111', input: '1111111111111111111' },
  { expected: '1111111111111111111', input: '11111111111111111111' },
]

describe('getParentQuadkey', () => {
  it.each(testData)('reduces the quadkey zoom by one level', (data: GetParentQuadkeyTestData) => {
    const quadkey = data.input
    const expected = data.expected
    const actual = getParentQuadkey(quadkey)
    expect(actual).toEqual(expected)
  })
})
