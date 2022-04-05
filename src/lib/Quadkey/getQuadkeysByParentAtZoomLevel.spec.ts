import { Zoom } from '../../model'
import { getQuadkeysByParentAtZoomLevel } from './getQuadkeysByParentAtZoomLevel'

const testData = [
  { input: { quadkeys: ['000', '0330', '03330'], zoom: 2 } },
  { input: { quadkeys: ['1000', '12200', '122200'], zoom: 3 } },
  { input: { quadkeys: ['20000', '211000', '2111000'], zoom: 4 } },
  { input: { quadkeys: ['300000', '3000000', '30000000'], zoom: 5 } },
  { input: { quadkeys: ['4000000', '4000000', '4000000'], zoom: 6 } },
]

describe('getQuadkeysByParent', () => {
  it.each(testData)('converts the quadkey at the specified zoom level', (data) => {
    const { quadkeys, zoom } = data.input
    const actual = getQuadkeysByParentAtZoomLevel(quadkeys, zoom as Zoom)
    expect(actual).toMatchSnapshot()
  })
})
