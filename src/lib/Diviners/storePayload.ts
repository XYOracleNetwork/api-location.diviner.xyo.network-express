import { XyoArchivistArchiveApi } from '@xyo-network/api'
import { XyoAccount, XyoBoundWitnessBuilder, XyoPayload, XyoPayloadBuilder } from '@xyo-network/core'

import { LocationAnswerSchema } from '../../model'

export const storePayload = async (payload: XyoPayload, api: XyoArchivistArchiveApi, account: XyoAccount): Promise<string> => {
  const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(account).payload(payload).build()
  const response = await api.block.post([bw])
  const hash = response?.[0]?._hash
  if (!hash) throw new Error('Error storing result')
  return hash
}

export const storeAnswer = (answer: unknown, api: XyoArchivistArchiveApi, schema: LocationAnswerSchema, account: XyoAccount): Promise<string> => {
  const payload = new XyoPayloadBuilder({ schema }).fields({ result: answer }).build()
  return storePayload(payload, api, account)
}

export const storeError = (error: string, api: XyoArchivistArchiveApi, schema: LocationAnswerSchema, account: XyoAccount): Promise<string> => {
  try {
    const payload = new XyoPayloadBuilder({ schema }).fields({ error }).build()
    return storePayload(payload, api, account)
  } catch (error) {
    return Promise.resolve('')
  }
}
