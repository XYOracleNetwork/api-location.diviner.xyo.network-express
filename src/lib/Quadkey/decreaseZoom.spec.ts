import { TestData, Zoom } from '../../model'
import { decreaseZoom } from './decreaseZoom'

interface ReduceZoomLevelInput {
  quadkey: string
  zoom: Zoom
}

interface ReduceZoomLevelTestData extends TestData<ReduceZoomLevelInput, string> {
  input: ReduceZoomLevelInput
  expected: string
}

const testData: ReduceZoomLevelTestData[] = [
  { expected: '1', input: { quadkey: '11', zoom: 1 } },
  { expected: '11', input: { quadkey: '111', zoom: 2 } },
  { expected: '111', input: { quadkey: '1111', zoom: 3 } },
  { expected: '1111', input: { quadkey: '11111', zoom: 4 } },
  { expected: '11111', input: { quadkey: '111111', zoom: 5 } },
  { expected: '111111', input: { quadkey: '1111111', zoom: 6 } },
  { expected: '1111111', input: { quadkey: '11111111', zoom: 7 } },
  { expected: '11111111', input: { quadkey: '111111111', zoom: 8 } },
  { expected: '111111111', input: { quadkey: '1111111111', zoom: 9 } },
  { expected: '1111111111', input: { quadkey: '11111111111', zoom: 10 } },
  { expected: '11111111111', input: { quadkey: '111111111111', zoom: 11 } },
  { expected: '111111111111', input: { quadkey: '1111111111111', zoom: 12 } },
  { expected: '1111111111111', input: { quadkey: '11111111111111', zoom: 13 } },
  { expected: '11111111111111', input: { quadkey: '111111111111111', zoom: 14 } },
  { expected: '111111111111111', input: { quadkey: '1111111111111111', zoom: 15 } },
  { expected: '1111111111111111', input: { quadkey: '11111111111111111', zoom: 16 } },
  { expected: '11111111111111111', input: { quadkey: '111111111111111111', zoom: 17 } },
  { expected: '111111111111111111', input: { quadkey: '1111111111111111111', zoom: 18 } },
  { expected: '1111111111111111111', input: { quadkey: '11111111111111111111', zoom: 19 } },
]

describe.skip('decreaseZoom', () => {
  it.each(testData)('decreases the zoom to the level specified', (data: ReduceZoomLevelTestData) => {
    const { quadkey, zoom } = data.input
    const expected = data.expected
    const actual = decreaseZoom(quadkey, zoom)
    expect(actual).toEqual(expected)
  })
})
