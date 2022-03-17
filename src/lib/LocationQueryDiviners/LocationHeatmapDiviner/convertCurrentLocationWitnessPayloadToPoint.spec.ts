import { currentLocationWitnessSample } from '../../../test'
import { convertCurrentLocationWitnessPayloadToPoint } from './convertCurrentLocationWitnessPayloadToPoint'
describe('convertLocationWitnessPayloadToPoint', () => {
  it('converts data formatted according to the schema into a GeoJson Point', () => {
    const payload = currentLocationWitnessSample
    const actual = convertCurrentLocationWitnessPayloadToPoint(payload)
    expect(actual?.type).toBe('Point')
    expect(Array.isArray(actual?.coordinates)).toBeTruthy()
    expect(actual?.coordinates?.length).toBe(2)
  })
})
