import { locationWitnessSample } from '../../../test'
import { convertLocationWitnessPayloadToPointFeature } from './convertLocationWitnessPayloadToPoint'
describe('convertLocationWitnessPayloadToPointFeature', () => {
  it('converts data formatted according to the schema into a GeoJson Point', () => {
    const payload = locationWitnessSample
    const actual = convertLocationWitnessPayloadToPointFeature(payload)
    expect(actual?.type).toBe('Point')
    expect(Array.isArray(actual?.coordinates)).toBeTruthy()
    expect(actual?.coordinates?.length).toBe(2)
  })
})
