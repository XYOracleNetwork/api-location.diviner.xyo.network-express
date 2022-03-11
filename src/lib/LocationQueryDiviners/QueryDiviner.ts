import { LocationDivinerQueryCreationResponse, XyoAddress } from '@xyo-network/sdk-xyo-client-js'

export type QueryProcessor<T extends LocationDivinerQueryCreationResponse> = (
  query: T,
  address?: XyoAddress
) => Promise<string>
