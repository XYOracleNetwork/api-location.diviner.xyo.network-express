import { LocationWitnessPayload } from '../../../model'
import { sample } from '../../../test'
import { convertLocationWitnessPayloadToGeoJson } from './convertLocationWitnessPayloadToGeoJson'
describe('convertLocationWitnessPayloadToGeoJson', () => {
  it('converts data formatted according to the schema into a GeoJson Feature', () => {
    const payload = sample as LocationWitnessPayload
    const actual = convertLocationWitnessPayloadToGeoJson(payload)
    expect(actual?.id).toBe(payload._hash)
    expect(actual?.type).toBe('Feature')
    expect(actual?.geometry).toBeTruthy()
    expect(actual?.geometry?.type).toBe('Point')
    expect(actual?.geometry?.coordinates).toBeTruthy()
    expect(Array.isArray(actual?.geometry?.coordinates)).toBeTruthy()
    expect(actual?.properties).toBeTruthy()
    expect(actual?.properties?.hash).toBe(payload._hash)
    expect(actual?.properties?.value).toBe(0)
  })
})
