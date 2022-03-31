import {
  CurrentLocationWitnessPayload,
  currentLocationWitnessPayloadSchema,
  XyoArchivistArchiveApi,
} from '@xyo-network/sdk-xyo-client-js'

import { queryGenericLocationsInRange } from './queryGenericLocationsInRange'
import { QueryLocationDataInRange } from './QueryLocationDataInRange'

export const queryCurrentLocationsInRange: QueryLocationDataInRange<CurrentLocationWitnessPayload> = (
  api: XyoArchivistArchiveApi,
  startTime = 0,
  stopTime = Date.now(),
  maxSupportedLocations = 20000
) => {
  return queryGenericLocationsInRange(
    api,
    currentLocationWitnessPayloadSchema,
    startTime,
    stopTime,
    maxSupportedLocations
  )
}
