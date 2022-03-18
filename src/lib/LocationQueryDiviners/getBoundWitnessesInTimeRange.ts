import { XyoArchivistApi, XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

const limit = 100

export const boundWitnessWithinTimeRange = (x: XyoBoundWitness, t1: number, t2: number): boolean => {
  const highestTime = Math.max(t1, t2)
  const lowestTime = Math.min(t1, t2)
  return x?._timestamp && x?._timestamp <= highestTime && x?._timestamp >= lowestTime ? true : false
}

export const getBoundWitnessesInTimeRange = async (api: XyoArchivistApi, lowestTime: number, fromTimestamp: number) => {
  const withinSpecifiedTimeRange = (x: XyoBoundWitness): boolean =>
    boundWitnessWithinTimeRange(x, lowestTime, fromTimestamp)
  const boundWitnesses = await api.archive.block.getBefore(fromTimestamp, limit)
  return boundWitnesses.filter(withinSpecifiedTimeRange)
}
