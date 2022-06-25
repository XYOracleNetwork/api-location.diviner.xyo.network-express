import { XyoArchivistArchiveApi, XyoPayloadFindFilter } from '@xyo-network/api'
import { XyoBoundWitness, XyoBoundWitnessWithMeta } from '@xyo-network/core'

import { WithTimestamp } from '../../model'
import { isWithinTimeRange } from './isWithinTimeRange'

export const boundWitnessWithinTimeRange = (x: XyoBoundWitnessWithMeta, t1: number, t2: number): boolean => {
  const highestTime = Math.max(t1, t2)
  const lowestTime = Math.min(t1, t2)
  return x?._timestamp && x?._timestamp <= highestTime && x?._timestamp >= lowestTime ? true : false
}

export type BoundWitnessWithTimestamp = XyoBoundWitness & WithTimestamp

export const getBoundWitnessesInTimeRange = async (api: XyoArchivistArchiveApi, lowestTime: number, timestamp: number, limit = 100): Promise<BoundWitnessWithTimestamp[]> => {
  const filter: XyoPayloadFindFilter = {
    limit,
    order: 'desc',
    timestamp,
  }
  const boundWitnesses = (await api.block.find(filter)) ?? []
  return boundWitnesses.filter<BoundWitnessWithTimestamp>((x): x is BoundWitnessWithTimestamp => isWithinTimeRange(x, lowestTime, timestamp))
}
