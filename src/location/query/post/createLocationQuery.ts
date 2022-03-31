import {
  locationHeatmapQuerySchema,
  LocationQueryCreationRequest,
  locationTimeRangeQuerySchema,
  XyoAddress,
  XyoApiConfig,
  XyoArchivistApi,
  XyoBoundWitnessBuilder,
  XyoBoundWitnessBuilderConfig,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'

const boundWitnessBuilderConfig: XyoBoundWitnessBuilderConfig = { inlinePayloads: true }

const getArchivistApiSdk = (config: XyoApiConfig) => {
  return new XyoArchivistApi(config)
}

export const createLocationQuery = async (request: LocationQueryCreationRequest, address: XyoAddress) => {
  const api = getArchivistApiSdk(request.resultArchivist).archive(request.resultArchive)
  // TODO: Strongly-typed support here
  const schema =
    // Default query to Location Range Query until strongly typed support
    request.schema === locationHeatmapQuerySchema ? locationHeatmapQuerySchema : locationTimeRangeQuerySchema
  const payload = new XyoPayloadBuilder({ schema }).fields({ ...request }).build()
  const bw = new XyoBoundWitnessBuilder(boundWitnessBuilderConfig).witness(address).payload(payload).build()
  const response = await api.block.post([bw])
  return response?.[0]?._hash
}
