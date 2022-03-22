import { XyoArchivistArchiveApi } from '@xyo-network/sdk-xyo-client-js'

import { SupportedLocationWitnessPayloads, SupportedLocationWitnessPayloadSchemas } from '../../model'

export type QueryLocationDataInRange<T extends SupportedLocationWitnessPayloads> = (
  api: XyoArchivistArchiveApi,
  schema: SupportedLocationWitnessPayloadSchemas,
  startTime: number,
  stopTime: number
) => Promise<T[]>
