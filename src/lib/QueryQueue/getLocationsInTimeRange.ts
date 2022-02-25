import { XyoArchivistApi, XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { LocationWitnessPayload, locationWitnessPayloadSchema } from './LocationWitnessPayload'

interface WithTimestamp {
  _timestamp: number
}

// TODO: Set limit for how much we can loop possibly a
// limit at query receipt time
const maxSupportedPayloads = 1000
export const getLocationsInTimeRange = async (
  api: XyoArchivistApi,
  startTime = 0,
  stopTime = Date.now()
): Promise<LocationWitnessPayload[]> => {
  const allPayloads: LocationWitnessPayload[] = []
  let fromTimestamp = stopTime > startTime ? stopTime : startTime
  do {
    // TODO: Use SDK to get BWs
    // Search backward from last timestamp
    const boundWitnesses: XyoBoundWitness[] = []
    if (!boundWitnesses.length) break
    for (const boundWitness of boundWitnesses) {
      const hash = boundWitness._hash
      if (!hash) break
      // Get payloads associated with that bound witness
      const payloads = await api.getBoundWitnessPayloadsByHash(hash)
      const locations = (payloads as (LocationWitnessPayload & WithTimestamp)[])
        // Using the location schema
        .filter((p) => p.schema === locationWitnessPayloadSchema)
        // Within the range specified
        .filter((p) => p._timestamp && p._timestamp < stopTime && p._timestamp > startTime)
      // TODO: Only take the last N elements if we're past the max
      allPayloads.push(...locations)
      fromTimestamp = Math.min(...locations.map((p) => p._timestamp))
    }
  } while (allPayloads.length < maxSupportedPayloads)

  return allPayloads
}
