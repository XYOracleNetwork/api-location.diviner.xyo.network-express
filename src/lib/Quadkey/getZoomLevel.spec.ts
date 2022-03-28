import { TestData, Zoom } from '../../model'
import { getZoomLevel } from './getZoomLevel'

interface GetZoomLevelTestData extends TestData<string, Zoom> {
  input: string
  expected: Zoom
}

const testData: GetZoomLevelTestData[] = [
  { expected: 1, input: '1' },
  { expected: 2, input: '11' },
  { expected: 3, input: '111' },
  { expected: 4, input: '1111' },
  { expected: 5, input: '11111' },
  { expected: 6, input: '111111' },
  { expected: 7, input: '1111111' },
  { expected: 8, input: '11111111' },
  { expected: 9, input: '111111111' },
  { expected: 10, input: '1111111111' },
  { expected: 11, input: '11111111111' },
  { expected: 12, input: '111111111111' },
  { expected: 13, input: '1111111111111' },
  { expected: 14, input: '11111111111111' },
  { expected: 15, input: '111111111111111' },
  { expected: 16, input: '1111111111111111' },
  { expected: 17, input: '11111111111111111' },
  { expected: 18, input: '111111111111111111' },
  { expected: 19, input: '1111111111111111111' },
  { expected: 20, input: '11111111111111111111' },
]

describe('getZoomLevel', () => {
  it.each(testData)('gets zoom level for quadkey', (data: GetZoomLevelTestData) => {
    const actual = getZoomLevel(data.input)
    expect(actual).toEqual(data.expected)
  })
})
