import { XyoAccount } from '@xyo-network/account'
import { LocationQueryCreationResponse } from '@xyo-network/api'

export type QueryProcessor<T extends LocationQueryCreationResponse> = (query: T, account: XyoAccount) => Promise<string>
