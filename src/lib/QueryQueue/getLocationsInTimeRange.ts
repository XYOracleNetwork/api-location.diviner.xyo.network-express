import { XyoArchivistApi, XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { LocationWitnessPayload, locationWitnessPayloadSchema } from '../../model'

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

const getLocationWitnessPayloadsForBoundWitnesses = async (api: XyoArchivistApi, boundWitnesses: XyoBoundWitness[]) => {
  const allPayloads: Array<LocationWitnessPayload & WithTimestamp> = []
  for (const boundWitness of boundWitnesses) {
    const hash = boundWitness._hash
    if (!hash) break
    // Get payloads associated with that bound witness
    const payloads = await api.getBoundWitnessPayloadsByHash(hash)
    const locations = (payloads as (LocationWitnessPayload & WithTimestamp)[]).filter((p) => {
      // Filter those matching the appropriate schema and that have a timestamp
      return p.schema === locationWitnessPayloadSchema && p._timestamp
    })
    allPayloads.push(...locations)
  }
  return allPayloads
}

export const getMostRecentLocationsInTimeRange = async (
  api: XyoArchivistApi,
  startTime = 0,
  stopTime = Date.now()
): Promise<LocationWitnessPayload[]> => {
  const allPayloads: LocationWitnessPayload[] = []
  const highestTime = Math.max(startTime, stopTime)
  const lowestTime = Math.min(startTime, stopTime)
  let fromTimestamp = highestTime
  for (let i = 0; i < maxLoops; i++) {
    // Search backward from last timestamp
    const filterPredicate = (x: WithOptionalTimestamp): boolean => withinTimeRange(x, lowestTime, fromTimestamp)
    const boundWitnesses = (await api.getBoundWitnessesBefore(fromTimestamp, limit)).filter(
      filterPredicate
    ) as (XyoBoundWitness & WithTimestamp)[]
    // If there's no results, stop searching
    if (!boundWitnesses.length) break
    const locations =
      // All location witness payloads
      (await getLocationWitnessPayloadsForBoundWitnesses(api, boundWitnesses))
        // Within the range specified
        .filter(filterPredicate)
    // TODO: Only take the last N elements if we're past the max
    allPayloads.push(...locations)
    fromTimestamp = Math.min(fromTimestamp, ...boundWitnesses.filter(filterPredicate).map((p) => p._timestamp))
    if (allPayloads.length >= maxSupportedPayloads) break
  }
  return allPayloads
}
