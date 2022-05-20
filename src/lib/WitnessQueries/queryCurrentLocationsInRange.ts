import { CurrentLocationWitnessPayload, currentLocationWitnessPayloadSchema, XyoArchivistArchiveApi } from '@xyo-network/api'

import { queryGenericLocationsInRange } from './queryGenericLocationsInRange'
import { QueryLocationDataInRange } from './QueryLocationDataInRange'

export const queryCurrentLocationsInRange: QueryLocationDataInRange<CurrentLocationWitnessPayload> = (
  api: XyoArchivistArchiveApi,
  startTime = 0,
  stopTime = Date.now(),
  maxSupportedLocations = 2000000
) => {
  return queryGenericLocationsInRange(api, currentLocationWitnessPayloadSchema, startTime, stopTime, maxSupportedLocations)
}
