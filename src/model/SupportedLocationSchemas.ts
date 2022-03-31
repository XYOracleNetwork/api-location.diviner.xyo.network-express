import {
  CurrentLocationWitnessPayload,
  CurrentLocationWitnessPayloadSchema,
  currentLocationWitnessPayloadSchema,
  LocationWitnessPayload,
  LocationWitnessPayloadSchema,
  locationWitnessPayloadSchema,
} from '@xyo-network/sdk-xyo-client-js'

export const supportedLocationWitnessSchemas = [locationWitnessPayloadSchema, currentLocationWitnessPayloadSchema]
export const supportedLocationWitnessSchemasMap: Record<SupportedLocationWitnessPayloadSchemas, true> = {
  'co.coinapp.currentlocationwitness': true,
  'network.xyo.location': true,
}
export type SupportedLocationWitnessPayloadSchemas = LocationWitnessPayloadSchema | CurrentLocationWitnessPayloadSchema
export type SupportedLocationWitnessPayloads = LocationWitnessPayload | CurrentLocationWitnessPayload
