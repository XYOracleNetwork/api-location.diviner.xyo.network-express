import { points } from '@turf/turf'
import { Position } from 'geojson'

import { TestData, WithHashProperties } from '../../../model'
import { getQuadkeyHeatmapFromPoints } from './getQuadkeyHeatmapFromPoints'

type TestDataInput = {
  coordinates: Position[]
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
    },
  },
]

describe('getQuadkeyHeatmapFromPoints', () => {
  it.each(testData)('calculates with known points', (data) => {
    const { coordinates } = data.input
    const locations = points<WithHashProperties>(coordinates, { hash: '' })
    expect(getQuadkeyHeatmapFromPoints(locations)).toMatchSnapshot()
  })
})
