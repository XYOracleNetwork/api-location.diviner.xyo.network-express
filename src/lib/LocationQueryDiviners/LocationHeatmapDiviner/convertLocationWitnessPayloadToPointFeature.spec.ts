import { locationWitnessSample } from '../../../test'
import { convertLocationWitnessPayloadToPointFeature } from './convertLocationWitnessPayloadToPointFeature'
describe('convertLocationWitnessPayloadToPointFeature', () => {
  it('converts data formatted according to the schema into a GeoJson Point', () => {
    const payload = locationWitnessSample
    const actual = convertLocationWitnessPayloadToPointFeature(payload)
    expect(actual?.type).toBe('Feature')
    expect(actual?.geometry?.type).toBe('Point')
    expect(Array.isArray(actual?.geometry?.coordinates)).toBeTruthy()
    expect(actual?.geometry?.coordinates?.length).toBe(2)
  })
})
