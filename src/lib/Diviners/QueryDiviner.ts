import { LocationQueryCreationResponse, XyoAccount } from '@xyo-network/sdk-xyo-client-js'

export type QueryProcessor<T extends LocationQueryCreationResponse> = (query: T, account: XyoAccount) => Promise<string>
