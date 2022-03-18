import { XyoArchivistApi, XyoBoundWitness, XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { SupportedLocationWitnessPayloads, SupportedLocationWitnessPayloadSchemas } from '../../model'

const isValidPayloadOfSchemaType = <T extends SupportedLocationWitnessPayloads>(
  payload: XyoPayload,
  schema: SupportedLocationWitnessPayloadSchemas
): payload is T => {
  return payload.schema === schema && !!payload._timestamp
}

export const getPayloadsForBoundWitnesses = async <T extends SupportedLocationWitnessPayloads>(
  api: XyoArchivistApi,
  boundWitnesses: XyoBoundWitness[],
  schema: SupportedLocationWitnessPayloadSchemas
) => {
  const allPayloads: Array<T> = []
  // NOTE: Parallelize calls for performance?
  for (const boundWitness of boundWitnesses) {
    const hash = boundWitness._hash
    if (!hash) break
    // Get payloads associated with that bound witness
    const payloads = await api.archive.block.getPayloadsByHash(hash)
    const locations: T[] = payloads.filter<T>((p): p is T => {
      return isValidPayloadOfSchemaType(p, schema)
    })
    allPayloads.push(...locations)
  }
  return allPayloads
}
