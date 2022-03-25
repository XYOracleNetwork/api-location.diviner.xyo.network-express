import { points } from '@turf/turf'
import { Position } from 'geojson'

import { MinZoom, TestData, WithHashProperties, Zoom } from '../../../model'
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
  {
    expected: {
      quadkeys: 4,
    },
    input: {
      coordinates: [
        [-180, -90],
        [-180, -90],
        [-180, -90],
        [-180, -90],
      ],
      zoom: 2,
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
