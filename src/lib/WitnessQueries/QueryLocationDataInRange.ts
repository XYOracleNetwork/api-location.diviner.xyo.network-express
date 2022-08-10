import { XyoArchivistArchiveApi } from '@xyo-network/api'

import { SupportedLocationWitnessPayloads } from '../../model'

export type QueryLocationDataInRange<T extends SupportedLocationWitnessPayloads> = (
  api: XyoArchivistArchiveApi,
  startTime: number,
  stopTime: number,
) => Promise<T[]>
