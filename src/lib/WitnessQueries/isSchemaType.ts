import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoPayload } from '@xyo-network/payload'

import { SupportedLocationWitnessPayloadSchemas } from '../../model'

export const isSchemaType = <T extends XyoBoundWitness | XyoPayload>(block: XyoBoundWitness | XyoPayload, schema: SupportedLocationWitnessPayloadSchemas): block is T => {
  return block.schema === schema
}
