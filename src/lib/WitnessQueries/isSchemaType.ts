import { XyoBoundWitness, XyoPayload } from '@xyo-network/core'

import { SupportedLocationWitnessPayloadSchemas } from '../../model'

export const isSchemaType = <T extends XyoBoundWitness | XyoPayload>(block: XyoBoundWitness | XyoPayload, schema: SupportedLocationWitnessPayloadSchemas): block is T => {
  return block.schema === schema
}
