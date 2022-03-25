import { points } from '@turf/turf'
import { Position } from 'geojson'

import { TestData, WithHashProperties, Zoom } from '../../../model'
import { getQuadkeyHeatmapFromPoints } from './getQuadkeyHeatmapFromPoints'

type TestDataInput = {
  coordinates: Position[]
  zoom: Zoom
}
type TestDataExpected = {
  quadkeys: number
}

const testData: TestData<TestDataInput, TestDataExpected>[] = [
  {
    expected: {
      quadkeys: 4,
    },
    input: {
      coordinates: [
        [-90, -45],
        [-90, 45],
        [90, -45],
        [90, 45],
      ],
      zoom: 1,
    },
  },
]

describe('getQuadkeyHeatmapFromPoints', () => {
  it.each(testData)('calculates with known points', (data) => {
    const { coordinates, zoom } = data.input
    const locations = points<WithHashProperties>(coordinates, { hash: '' })
    expect(getQuadkeyHeatmapFromPoints(locations, zoom)).toMatchSnapshot()
  })
})
