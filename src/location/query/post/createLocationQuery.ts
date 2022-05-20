import { SupportedLocationQueryCreationRequest, XyoArchivistApi } from '@xyo-network/api'
import { XyoAccount, XyoBoundWitnessBuilder, XyoBoundWitnessBuilderConfig, XyoPayloadBuilder } from '@xyo-network/core'

const config: XyoBoundWitnessBuilderConfig = { inlinePayloads: true }

export const createLocationQuery = async (request: SupportedLocationQueryCreationRequest, account: XyoAccount) => {
  const api = new XyoArchivistApi(request.resultArchivist).archive(request.resultArchive)
  const schema = request.schema
  const payload = new XyoPayloadBuilder({ schema }).fields({ ...request }).build()
  const bw = new XyoBoundWitnessBuilder(config).witness(account).payload(payload).build()
  const response = await api.block.post([bw])
  return response?.[0]?._hash
}
