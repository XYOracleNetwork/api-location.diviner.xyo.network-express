import { XyoArchivistApi } from '@xyo-network/sdk-xyo-client-js'

import { LocationWitnessPayload } from './LocationWitnessPayload'

export const getLocationsInTimeRange = async (api: XyoArchivistApi): Promise<LocationWitnessPayload[]> => {
  await Promise.resolve('TODO')
  // TODO: Skip single bad data points, possibly fail hard in some cases

  // TODO: Use SDK to get BWs
  // TODO: Use BWs to get Payloads
  return []
}
