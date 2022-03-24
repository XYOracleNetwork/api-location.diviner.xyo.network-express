import { XyoArchivistArchiveApi } from '@xyo-network/sdk-xyo-client-js'

import { SupportedLocationWitnessPayloads } from '../../model'

export type QueryLocationDataInRange<T extends SupportedLocationWitnessPayloads> = (
  api: XyoArchivistArchiveApi,
  startTime: number,
  stopTime: number
) => Promise<T[]>
