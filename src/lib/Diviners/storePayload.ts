import {
  XyoAddress,
  XyoArchivistArchiveApi,
  XyoBoundWitnessBuilder,
  XyoPayload,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'

import { LocationAnswerSchema, LocationQuadkeyHeatmapAnswerSchema } from '../../model'

export const storePayload = async (
  payload: XyoPayload,
  api: XyoArchivistArchiveApi,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  const resultWitness = new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(address).payload(payload).build()
  if (!resultWitness._hash) throw new Error('Error creating stored result')
  const result = await api.block.post(resultWitness)
  if (result?.boundWitnesses !== 1 || result?.payloads !== 1) throw new Error('Error creating stored result')
  return resultWitness._hash
}

export const storeAnswer = (
  answer: unknown,
  api: XyoArchivistArchiveApi,
  schema: LocationAnswerSchema | LocationQuadkeyHeatmapAnswerSchema,
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
