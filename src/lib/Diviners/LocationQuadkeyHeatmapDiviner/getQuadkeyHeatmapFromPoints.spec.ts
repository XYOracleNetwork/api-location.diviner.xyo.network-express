import { points } from '@turf/turf'
import { Position } from 'geojson'

import { TestData, WithHashProperties, Zoom } from '../../../model'
import { r2d } from '../../Quadkey'
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

const toLongitude = (x: number, z: number): number => {
  return (x / Math.pow(2, z)) * 360 - 180
}

const toLatitude = (y: number, z: number): number => {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z)
  return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
}

describe('getQuadkeyHeatmapFromPoints', () => {
  it.each(testData)('calculates with known points', (data) => {
    const { coordinates } = data.input
    const locations = points<WithHashProperties>(coordinates, { hash: '' })
    const heatmap = getQuadkeyHeatmapFromPoints(locations)
    expect(heatmap).toMatchSnapshot()
  })
  it('calculates with many points', () => {
    const zoom: Zoom = 4
    const tiles: Array<[number, number]> = []
    // Generate a gradient of tiles
    for (let i = 0; i < 2 ** zoom; i++) {
      for (let j = 0; j < 2 ** zoom; j++) {
        const x = [...Array(i).keys()]
        const y = [...Array(i).keys()]
        for (let k = 0; k < x.length; k++) {
          tiles.push([x[k], y[k]])
        }
      }
    }
    const coordinates = tiles.map((t) => {
      const long = toLongitude(t[0], zoom)
      const lat = toLatitude(t[1], zoom)
      return [long, lat]
    })
    const locations = points<WithHashProperties>(coordinates, { hash: '' })
    const heatmap = getQuadkeyHeatmapFromPoints(locations)
    expect(heatmap).toMatchSnapshot()
  })
})
