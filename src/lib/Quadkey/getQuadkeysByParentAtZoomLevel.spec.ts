import { getQuadkeysByParentAtZoomLevel } from './getQuadkeysByParentAtZoomLevel'

const testData = [
  { input: { quadkeys: ['00', '033', '0333'], zoom: 1 } },
  { input: { quadkeys: ['100', '1220', '12220'], zoom: 2 } },
  { input: { quadkeys: ['2000', '21100', '211100'], zoom: 3 } },
  { input: { quadkeys: ['30000', '300000', '3000000'], zoom: 4 } },
  { input: { quadkeys: ['400000', '400000', '400000'], zoom: 5 } },
]

describe('getQuadkeysByParent', () => {
  it.each(testData)('converts the quadkey at the specified zoom level', (data) => {
    const { quadkeys, zoom } = data.input
    const actual = getQuadkeysByParentAtZoomLevel(quadkeys, zoom)
    expect(actual).toMatchSnapshot()
  })
})
