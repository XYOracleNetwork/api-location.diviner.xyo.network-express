import { XyoArchivistArchiveApi } from '@xyo-network/api'
import { XyoBoundWitnessWithMeta } from '@xyo-network/boundwitness'

import { SupportedLocationWitnessPayloads, SupportedLocationWitnessPayloadSchemas } from '../../model'
import { getBoundWitnessesInTimeRange } from './getBoundWitnessesInTimeRange'
import { getPayloadsForBoundWitnesses } from './getPayloadsBySchema'
import { isWithinTimeRange } from './isWithinTimeRange'

const limit = 100

export const queryGenericLocationsInRange = async <T extends SupportedLocationWitnessPayloads>(
  api: XyoArchivistArchiveApi,
  schema: SupportedLocationWitnessPayloadSchemas,
  startTime = 0,
  stopTime = Date.now(),
  maxSupportedLocations = 1000
) => {
  const allLocations: T[] = []
  const highestTime = Math.max(startTime, stopTime)
  const lowestTime = Math.min(startTime, stopTime)
  let fromTimestamp = highestTime
  // Set limit for how much data we can loop over
  const maxLoops = Math.floor(maxSupportedLocations / limit)
  for (let i = 0; i < maxLoops; i++) {
    // Search backward from last timestamp
    const boundWitnesses = await getBoundWitnessesInTimeRange(api, lowestTime, fromTimestamp)
    // If there's no results, stop searching
    if (!boundWitnesses.length) break
    // Filter by only those BW that have desired schema before getting payloads
    const boundWitnessesWithLocations = boundWitnesses.filter((bw) => bw.payload_schemas.find((s) => s === schema))
    // All location witness payloads
    const payloads = await getPayloadsForBoundWitnesses<T>(api, boundWitnessesWithLocations as XyoBoundWitnessWithMeta[], schema)
    // Within the range specified
    const locations = payloads.filter((payload) => isWithinTimeRange(payload, lowestTime, fromTimestamp))
    // TODO: Only take the last N elements if we're past the max
    allLocations.push(...locations)
    // If we've found the desired amount of locations
    if (allLocations.length >= maxSupportedLocations) break
    // Update the search timestamp to the last boundWitness we iterated over
    fromTimestamp = Math.min(fromTimestamp, ...boundWitnesses.map((p) => p._timestamp))
  }
  return allLocations
}
