import { CurrentLocationWitnessPayloadBody, LocationWitnessPayload } from '@xyo-network/api'
import { XyoPayloadWithMeta } from '@xyo-network/core'

export const locationWitnessSample: LocationWitnessPayload = {
  _archive: 'temp',
  _client: 'js',
  _hash: '319adee8ec88ccb4e8783e8b34776cf6afdd1b7ab6102b9e0f26a21920d84c09',
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

export const currentLocationWitnessSample: XyoPayloadWithMeta<CurrentLocationWitnessPayloadBody> = {
  _archive: 'coin-app',
  _hash: 'b7438d08c65061953cc42eb37efd596c8be9f90ba9473afe8a287eb0695c69d7',
  _timestamp: 1630368114646,
  altitudeMeters: 52.123456,
  directionDegrees: 123,
  latitude: 35.123456,
  longitude: -78.123456,
  quadkey: '213',
  schema: 'co.coinapp.currentlocationwitness',
  speedKph: 12.3456,
}
