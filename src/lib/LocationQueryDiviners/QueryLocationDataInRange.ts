import { XyoArchivistApi } from '@xyo-network/sdk-xyo-client-js'

import { SupportedLocationWitnessPayloads } from '../../model'

export type QueryLocationDataInRange<T extends SupportedLocationWitnessPayloads> = (
  api: XyoArchivistApi,
  startTime: number,
  stopTime: number
) => Promise<T[]>
