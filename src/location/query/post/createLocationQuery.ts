import {
  XyoAddress,
  XyoArchivistApi,
  XyoBoundWitnessBuilder,
  XyoBoundWitnessBuilderConfig,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'

import { ArchiveConfig, LocationDivinerQueryRequest } from './postLocationQuerySchema'

const boundWitnessBuilderConfig: XyoBoundWitnessBuilderConfig = { inlinePayloads: true }

const getArchivistApiSdk = (config: ArchiveConfig) => {
  return new XyoArchivistApi(config)
}

export const createLocationQuery = async (request: LocationDivinerQueryRequest) => {
  const api = getArchivistApiSdk(request.resultArchive)
  const { schema } = request.query
  const payload = new XyoPayloadBuilder({ schema }).fields({ ...request }).build()
  const address = XyoAddress.random()
  const bw = new XyoBoundWitnessBuilder(boundWitnessBuilderConfig).witness(address).payload(payload).build()
  const { boundWitnesses, payloads } = await api.postBoundWitness(bw)
  return boundWitnesses && payloads ? bw._hash : undefined
}
