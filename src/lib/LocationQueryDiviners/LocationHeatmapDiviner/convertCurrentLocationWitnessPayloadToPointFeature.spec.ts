import { currentLocationWitnessSample } from '../../../test'
import { convertCurrentLocationWitnessPayloadToPointFeature } from './convertCurrentLocationWitnessPayloadToPointFeature'
describe('convertCurrentLocationWitnessPayloadToPointFeature', () => {
  it('converts data formatted according to the schema into a GeoJson Point', () => {
    const payload = currentLocationWitnessSample
    const actual = convertCurrentLocationWitnessPayloadToPointFeature(payload)
    expect(actual?.type).toBe('Point')
    expect(Array.isArray(actual?.coordinates)).toBeTruthy()
    expect(actual?.coordinates?.length).toBe(2)
  })
})
