import { currentLocationWitnessSample } from '../../../test'
import { convertCurrentLocationWitnessPayloadToPointFeature } from './convertCurrentLocationWitnessPayloadToPointFeature'
describe('convertCurrentLocationWitnessPayloadToPointFeature', () => {
  it('converts data formatted according to the schema into a GeoJson Point', () => {
    const payload = currentLocationWitnessSample
    const actual = convertCurrentLocationWitnessPayloadToPointFeature(payload)
    expect(actual?.type).toBe('Feature')
    expect(actual?.geometry?.type).toBe('Point')
    expect(Array.isArray(actual?.geometry?.coordinates)).toBeTruthy()
    expect(actual?.geometry?.coordinates?.length).toBe(2)
  })
})
