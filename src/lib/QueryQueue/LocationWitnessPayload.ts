import { WithXyoPayloadMeta, XyoPayloadBody } from '@xyo-network/sdk-xyo-client-js'

export interface Coordinates {
  accuracy: number | null
  altitude: number | null
  altitudeAccuracy: number | null
  heading: number | null
  latitude: number
  longitude: number
  speed: number | null
}
export interface CurrentLocation {
  coords: Coordinates
  timestamp: number
}

export interface LocationWitnessPayloadBody extends XyoPayloadBody {
  currentLocation: CurrentLocation
  schema: 'network.xyo.location'
}

export type LocationWitnessPayload = WithXyoPayloadMeta<LocationWitnessPayloadBody>
