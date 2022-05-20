import { LocationQueryCreationResponse } from '@xyo-network/api'
import { XyoAccount } from '@xyo-network/core'

export type QueryProcessor<T extends LocationQueryCreationResponse> = (query: T, account: XyoAccount) => Promise<string>
