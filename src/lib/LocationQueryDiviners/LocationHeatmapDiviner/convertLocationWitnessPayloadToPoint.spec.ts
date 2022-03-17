import { locationWitnessSample } from '../../../test'
import { convertLocationWitnessPayloadToPoint } from './convertLocationWitnessPayloadToPoint'
describe('convertLocationWitnessPayloadToPoint', () => {
  it('converts data formatted according to the schema into a GeoJson Point', () => {
    const payload = locationWitnessSample
    const actual = convertLocationWitnessPayloadToPoint(payload)
    expect(actual?.type).toBe('Point')
    expect(Array.isArray(actual?.coordinates)).toBeTruthy()
    expect(actual?.coordinates?.length).toBe(2)
  })
})
