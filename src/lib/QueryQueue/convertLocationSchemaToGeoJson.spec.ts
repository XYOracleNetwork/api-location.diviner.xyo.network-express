import { convertLocationSchemaToGeoJson } from './convertLocationSchemaToGeoJson'
import { LocationWitnessPayload, LocationWitnessPayloadSchema } from './LocationWitnessPayload'

const sample: LocationWitnessPayload = {
  _archive: 'temp',
  _client: 'js',
  _hash: '319adee8ec88ccb4e8783e8b34776cf6afdd1b7ab6102b9e0f26a21920d84c09',
  _id: '6217eaa075ecf7e73fa60352',
  _observeDuration: 22,
  _timestamp: 1645734560250,
  currentLocation: {
    coords: {
      accuracy: 1983.9417522841113,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      latitude: 30.1234567,
      longitude: -85.1234567,
      speed: null,
    },
    timestamp: 1645734561467,
  },
  schema: 'network.xyo.location',
}

describe('convertLocationSchemaToGeoJson', () => {
  it('converts', () => {
    const actual = convertLocationSchemaToGeoJson(sample)
    expect(actual?.id).toBe(sample._hash)
    expect(actual?.type).toBe('Feature')
    expect(actual?.geometry).toBeTruthy()
    expect(actual?.geometry?.type).toBe('Point')
    expect(actual?.geometry?.coordinates).toBeTruthy()
    expect(Array.isArray(actual?.geometry?.coordinates)).toBeTruthy()
    expect(actual?.properties).toBeTruthy()
    expect(actual?.properties?._archive).toBe(sample._archive)
    expect(actual?.properties?._client).toBe(sample._client)
    expect(actual?.properties?._timestamp).toBe(sample._timestamp)
    expect(actual?.properties?.schema).toBe(sample.schema)
  })
})
