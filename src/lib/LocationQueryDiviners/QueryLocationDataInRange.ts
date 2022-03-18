import { XyoArchivistApi } from '@xyo-network/sdk-xyo-client-js'

export type QueryLocationDataInRange<T> = (api: XyoArchivistApi, startTime: number, stopTime: number) => Promise<T[]>
