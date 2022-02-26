import { LocationWitnessPayload } from '../../model'
import { sample } from '../../test'
import { convertLocationSchemaToGeoJson } from './convertLocationSchemaToGeoJson'
describe('convertLocationSchemaToGeoJson', () => {
  it('converts data formatted according to the schema into a GeoJson Feature', () => {
    const payload = sample as LocationWitnessPayload
    const actual = convertLocationSchemaToGeoJson(payload)
    expect(actual?.id).toBe(payload._hash)
    expect(actual?.type).toBe('Feature')
    expect(actual?.geometry).toBeTruthy()
    expect(actual?.geometry?.type).toBe('Point')
    expect(actual?.geometry?.coordinates).toBeTruthy()
    expect(Array.isArray(actual?.geometry?.coordinates)).toBeTruthy()
    expect(actual?.properties).toBeTruthy()
    expect(actual?.properties?._archive).toBe(payload._archive)
    expect(actual?.properties?._client).toBe(payload._client)
    expect(actual?.properties?._timestamp).toBe(payload._timestamp)
    expect(actual?.properties?.schema).toBe(payload.schema)
  })
})
