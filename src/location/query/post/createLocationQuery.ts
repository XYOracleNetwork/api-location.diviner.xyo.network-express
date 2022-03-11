import {
  LocationDivinerQueryCreationRequest,
  XyoAddress,
  XyoArchivistApi,
  XyoArchivistApiConfig,
  XyoBoundWitnessBuilder,
  XyoBoundWitnessBuilderConfig,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'

import { locationRangeQuerySchema } from '../../../model'

const boundWitnessBuilderConfig: XyoBoundWitnessBuilderConfig = { inlinePayloads: true }

const getArchivistApiSdk = (config: XyoArchivistApiConfig) => {
  return new XyoArchivistApi(config)
}

export const createLocationQuery = async (request: LocationDivinerQueryCreationRequest) => {
  const api = getArchivistApiSdk(request.resultArchive)
  const payload = new XyoPayloadBuilder({ schema: locationRangeQuerySchema }).fields({ ...request }).build()
  const address = XyoAddress.random()
  const bw = new XyoBoundWitnessBuilder(boundWitnessBuilderConfig).witness(address).payload(payload).build()
  const { boundWitnesses, payloads } = await api.postBoundWitness(bw)
  return boundWitnesses && payloads ? bw._hash : undefined
}
