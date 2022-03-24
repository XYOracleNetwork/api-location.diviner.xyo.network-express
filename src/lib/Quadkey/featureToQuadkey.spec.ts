import { point } from '@turf/turf'
import { Feature, Point } from 'geojson'

import { Zoom } from '../../model'
import { featureToQuadkey } from './featureToQuadkey'
import { TestData } from './TestData'

interface FeatureWithZoom {
  feature: Feature<Point>
  zoom: Zoom
}
interface FeatureToQuadkeyTestData extends TestData<FeatureWithZoom, string> {
  input: FeatureWithZoom
  expected: string
}

const testData: FeatureToQuadkeyTestData[] = [
  { expected: '0', input: { feature: point([-90, 45]), zoom: 1 } },
  { expected: '1', input: { feature: point([90, 45]), zoom: 1 } },
  { expected: '2', input: { feature: point([-90, -45]), zoom: 1 } },
  { expected: '3', input: { feature: point([90, -45]), zoom: 1 } },

  { expected: '033', input: { feature: point([-1, 1]), zoom: 3 } },
  { expected: '122', input: { feature: point([1, 1]), zoom: 3 } },
  { expected: '211', input: { feature: point([-1, -1]), zoom: 3 } },
  { expected: '300', input: { feature: point([1, -1]), zoom: 3 } },
]

describe('pointToQuadkey', () => {
  it.each(testData)('converts feature to quadkey', (data: FeatureToQuadkeyTestData) => {
    const { expected } = data
    const { feature, zoom } = data.input
    const actual = featureToQuadkey(feature, zoom)
    expect(actual).toEqual(expected)
  })
})
