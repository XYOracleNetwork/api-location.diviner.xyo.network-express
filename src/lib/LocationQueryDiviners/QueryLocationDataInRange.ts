import { XyoArchivistApi } from '@xyo-network/sdk-xyo-client-js'

import { SupportedLocationWitnessPayloads, SupportedLocationWitnessPayloadSchemas } from '../../model'

export type QueryLocationDataInRange<T extends SupportedLocationWitnessPayloads> = (
  api: XyoArchivistApi,
  schema: SupportedLocationWitnessPayloadSchemas,
  startTime: number,
  stopTime: number
) => Promise<T[]>
