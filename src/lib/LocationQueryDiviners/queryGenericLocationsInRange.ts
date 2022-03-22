import { XyoArchivistArchiveApi, XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { SupportedLocationWitnessPayloads, SupportedLocationWitnessPayloadSchemas } from '../../model'
import { getBoundWitnessesInTimeRange } from './getBoundWitnessesInTimeRange'
import { getPayloadsForBoundWitnesses } from './getPayloadsBySchema'
import { QueryLocationDataInRange } from './QueryLocationDataInRange'

interface WithTimestamp {
  _timestamp: number
}

interface WithOptionalTimestamp {
  _timestamp?: number
}

// Set limit for how much data we can loop over
const maxSupportedPayloads = 1000
const limit = 100
const maxLoops = Math.floor(maxSupportedPayloads / limit)

const withinTimeRange = (x: WithOptionalTimestamp, t1: number, t2: number): boolean => {
  const highestTime = Math.max(t1, t2)
  const lowestTime = Math.min(t1, t2)
  return x?._timestamp && x?._timestamp <= highestTime && x?._timestamp >= lowestTime ? true : false
}

const hasTimestamp = (x: WithOptionalTimestamp): x is WithTimestamp => {
  throw new Error('')
}

export const queryGenericLocationsInRange: QueryLocationDataInRange<SupportedLocationWitnessPayloads> = async (
  api: XyoArchivistArchiveApi,
  schema: SupportedLocationWitnessPayloadSchemas,
  startTime = 0,
  stopTime = Date.now()
) => {
  const allPayloads: SupportedLocationWitnessPayloads[] = []
  const highestTime = Math.max(startTime, stopTime)
  const lowestTime = Math.min(startTime, stopTime)
  let fromTimestamp = highestTime
  for (let i = 0; i < maxLoops; i++) {
    // Search backward from last timestamp
    const filterPredicate = (x: WithOptionalTimestamp): boolean => withinTimeRange(x, lowestTime, fromTimestamp)

    const boundWitnesses = await getBoundWitnessesInTimeRange(api, lowestTime, fromTimestamp)
    // If there's no results, stop searching
    if (!boundWitnesses.length) break
    // Filter by only those BW that have desired schema before getting payloads
    const boundWitnessesWithLocations = boundWitnesses.filter((bw) => bw.payload_schemas.find((s) => s === schema))

    // All location witness payloads
    const payloads = await getPayloadsForBoundWitnesses(api, boundWitnessesWithLocations, schema)
    // Within the range specified
    const locations = payloads.filter(filterPredicate)
    // TODO: Only take the last N elements if we're past the max
    allPayloads.push(...locations)
    if (allPayloads.length >= maxSupportedPayloads) break

    // Update the search timestamp to the last boundWitness we iterated over
    fromTimestamp = Math.min(
      fromTimestamp,
      ...boundWitnesses
        .filter<XyoBoundWitness & WithTimestamp>((p): p is XyoBoundWitness & WithTimestamp => {
          return filterPredicate(p)
        })
        .map((p) => p._timestamp)
    )
  }
  return allPayloads
}
