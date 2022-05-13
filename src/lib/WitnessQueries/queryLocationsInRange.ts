import { LocationWitnessPayload, locationWitnessPayloadSchema, XyoArchivistArchiveApi } from '@xyo-network/sdk-xyo-client-js'

import { queryGenericLocationsInRange } from './queryGenericLocationsInRange'
import { QueryLocationDataInRange } from './QueryLocationDataInRange'

export const queryLocationsInRange: QueryLocationDataInRange<LocationWitnessPayload> = (
  api: XyoArchivistArchiveApi,
  startTime = 0,
  stopTime = Date.now(),
  maxSupportedLocations = 1000
) => {
  return queryGenericLocationsInRange(api, locationWitnessPayloadSchema, startTime, stopTime, maxSupportedLocations)
}
