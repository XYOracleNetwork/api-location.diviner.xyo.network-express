import { TestData } from '../../model'
import { decrementZoom } from './decrementZoom'

interface DecrementZoomTestData extends TestData<string, string> {
  input: string
  expected: string
}

const testData: DecrementZoomTestData[] = [
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

describe('decrementZoom', () => {
  it.each(testData)('reduces the quadkey zoom by one level', (data: DecrementZoomTestData) => {
    const quadkey = data.input
    const expected = data.expected
    const actual = decrementZoom(quadkey)
    expect(actual).toEqual(expected)
  })
})
