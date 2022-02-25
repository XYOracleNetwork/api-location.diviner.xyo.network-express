import { XyoArchivistApi, XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { LocationWitnessPayload, locationWitnessPayloadSchema } from './LocationWitnessPayload'

interface WithTimestamp {
  _timestamp: number
}

// Set limit for how much data we can loop over
const maxSupportedPayloads = 1000
const limit = 100
const maxLoops = Math.floor(maxSupportedPayloads / limit)

const getLocationWitnessPayloadsForBoundWitnesses = async (api: XyoArchivistApi, boundWitnesses: XyoBoundWitness[]) => {
  const allPayloads: Array<LocationWitnessPayload & WithTimestamp> = []
  for (const boundWitness of boundWitnesses) {
    const hash = boundWitness._hash
    if (!hash) break
    // Get payloads associated with that bound witness
    const payloads = await api.getBoundWitnessPayloadsByHash(hash)
    const locations = (payloads as (LocationWitnessPayload & WithTimestamp)[])
      // Using the location schema
      .filter((p) => p.schema === locationWitnessPayloadSchema && p._timestamp)
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
  let fromTimestamp = stopTime > startTime ? stopTime : startTime
  for (let i = 0; i < maxLoops; i++) {
    // Search backward from last timestamp
    const boundWitnesses: XyoBoundWitness[] = await api.getBoundWitnessesAfter(fromTimestamp, 100)
    // If there's no results, stop searching
    if (!boundWitnesses.length) break
    const locations =
      // All location witness payloads
      (await getLocationWitnessPayloadsForBoundWitnesses(api, boundWitnesses))
        // Within the range specified
        .filter((p) => p._timestamp < stopTime && p._timestamp > startTime)
    // TODO: Only take the last N elements if we're past the max
    allPayloads.push(...locations)
    fromTimestamp = Math.min(...locations.map((p) => p._timestamp))
    if (allPayloads.length >= maxSupportedPayloads) break
  }
  return allPayloads
}
