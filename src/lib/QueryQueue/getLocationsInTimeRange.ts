import { XyoArchivistApi, XyoPayload, XyoPayloadBody } from '@xyo-network/sdk-xyo-client-js'

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

export type Foo = XyoPayload

export const getLocationsInTimeRange = async (api: XyoArchivistApi): Promise<LocationWitnessPayloadBody[]> => {
  await Promise.resolve('TODO')
  // TODO: Skip single bad data points, possibly fail hard in some cases

  // TODO: Use SDK to get BWs
  // TODO: Use BWs to get Payloads
  return []
}
