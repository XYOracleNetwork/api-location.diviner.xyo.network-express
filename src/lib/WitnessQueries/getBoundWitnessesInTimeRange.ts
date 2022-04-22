import { XyoArchivistArchiveApi, XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { WithTimestamp } from '../../model'
import { isWithinTimeRange } from './isWithinTimeRange'

export const boundWitnessWithinTimeRange = (x: XyoBoundWitness, t1: number, t2: number): boolean => {
  const highestTime = Math.max(t1, t2)
  const lowestTime = Math.min(t1, t2)
  return x?._timestamp && x?._timestamp <= highestTime && x?._timestamp >= lowestTime ? true : false
}

export type BoundWitnessWithTimestamp = XyoBoundWitness & WithTimestamp

export const getBoundWitnessesInTimeRange = async (api: XyoArchivistArchiveApi, lowestTime: number, fromTimestamp: number, limit = 100): Promise<BoundWitnessWithTimestamp[]> => {
  const boundWitnesses = (await api.block.findBefore(fromTimestamp, limit)) ?? []
  return boundWitnesses.filter<BoundWitnessWithTimestamp>((x): x is BoundWitnessWithTimestamp => isWithinTimeRange(x, lowestTime, fromTimestamp))
}
