import {
  XyoAddress,
  XyoArchivistArchiveApi,
  XyoBoundWitnessBuilder,
  XyoPayload,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'

import { LocationAnswerSchema } from '../../model'

export const storePayload = async (
  payload: XyoPayload,
  api: XyoArchivistArchiveApi,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(address).payload(payload).build()
  const response = await api.block.post([bw])
  const hash = response?.[0]?._hash
  if (!hash) throw new Error('Error storing result')
  return hash
}

export const storeAnswer = (
  answer: unknown,
  api: XyoArchivistArchiveApi,
  schema: LocationAnswerSchema,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  const payload = new XyoPayloadBuilder({ schema }).fields({ result: answer }).build()
  return storePayload(payload, api, address)
}

export const storeError = (
  error: string,
  api: XyoArchivistArchiveApi,
  schema: LocationAnswerSchema,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  try {
    const payload = new XyoPayloadBuilder({ schema }).fields({ error }).build()
    return storePayload(payload, api, address)
  } catch (error) {
    return Promise.resolve('')
  }
}
