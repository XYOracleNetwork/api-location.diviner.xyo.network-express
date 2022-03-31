import { LocationQueryCreationResponse, XyoAddress } from '@xyo-network/sdk-xyo-client-js'

export type QueryProcessor<T extends LocationQueryCreationResponse> = (query: T, address: XyoAddress) => Promise<string>
