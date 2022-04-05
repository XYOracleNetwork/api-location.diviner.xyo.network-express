import { XyoArchivistArchiveApi, XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { SupportedLocationWitnessPayloads, SupportedLocationWitnessPayloadSchemas, WithTimestamp } from '../../model'
import { isSchemaType } from './isSchemaType'

export const getPayloadsForBoundWitnesses = async <T extends SupportedLocationWitnessPayloads>(
  api: XyoArchivistArchiveApi,
  boundWitnesses: XyoBoundWitness[],
  schema: SupportedLocationWitnessPayloadSchemas
) => {
  const allPayloads: Array<T & WithTimestamp> = []
  const promises = boundWitnesses.map(async (boundWitness) => {
    const hash = boundWitness._hash
    if (!hash) throw new Error('No hash for bound witness')
    // Get payloads associated with that bound witness
    const payloads = await api.block.payloads(hash).get()
    const locations = (payloads || [])
      .flatMap((p) => p)
      .filter<T & WithTimestamp>((p): p is T & WithTimestamp => {
        return isSchemaType(p, schema)
      })
      .slice(0, 1)
    allPayloads.push(...locations)
  })
  await Promise.allSettled(promises)
  return allPayloads
}
