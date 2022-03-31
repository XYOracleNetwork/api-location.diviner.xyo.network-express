import { TestData, Zoom } from '../../model'
import { getQuadkeyAtZoomLevel } from './getQuadkeyAtZoomLevel'

interface QuadkeyWithZoom {
  quadkey: string
  zoom: Zoom
}
interface QuadkeyAtZoomTestData extends TestData<QuadkeyWithZoom, string> {
  input: QuadkeyWithZoom
  expected: string
}

const testData: QuadkeyAtZoomTestData[] = [
  { expected: '0', input: { quadkey: '00', zoom: 1 } },
  { expected: '1', input: { quadkey: '10', zoom: 1 } },
  { expected: '2', input: { quadkey: '20', zoom: 1 } },
  { expected: '3', input: { quadkey: '30', zoom: 1 } },

  { expected: '033', input: { quadkey: '0333', zoom: 3 } },
  { expected: '122', input: { quadkey: '1222', zoom: 3 } },
  { expected: '211', input: { quadkey: '2111', zoom: 3 } },
  { expected: '300', input: { quadkey: '3000', zoom: 3 } },
]

describe('getQuadkeyAtZoomLevel', () => {
  it.each(testData)('converts the quadkey at the specified zoom level', (data: QuadkeyAtZoomTestData) => {
    const { expected } = data
    const { quadkey: feature, zoom } = data.input
    const actual = getQuadkeyAtZoomLevel(feature, zoom)
    expect(actual).toEqual(expected)
  })
})
