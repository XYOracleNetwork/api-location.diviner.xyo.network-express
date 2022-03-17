import { LocationWitnessPayload, LocationWitnessPayloadSchema } from '@xyo-network/sdk-xyo-client-js'

import { CurrentLocationWitnessPayload, CurrentLocationWitnessPayloadSchema } from './currentLocationWitness'

export type SupportedLocationWitnessPayloadSchemas = LocationWitnessPayloadSchema | CurrentLocationWitnessPayloadSchema
export type SupportedLocationWitnessPayloads = LocationWitnessPayload | CurrentLocationWitnessPayload
