import {
  XyoAddress,
  XyoArchivistApi,
  XyoBoundWitnessBuilder,
  XyoPayload,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'
import { FeatureCollection } from 'geojson'

import { LocationAnswerSchema } from './LocationAnswerSchema'

export const storePayload = async (
  payload: XyoPayload,
  api: XyoArchivistApi,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  const resultWitness = new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(address).payload(payload).build()
  await api.archive.block.post(resultWitness)
  if (!resultWitness._hash) throw new Error('Error storing value')
  return resultWitness._hash
}

export const storeAnswer = (
  answer: FeatureCollection,
  api: XyoArchivistApi,
  schema: LocationAnswerSchema,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  const payload = new XyoPayloadBuilder({ schema }).fields({ result: answer }).build()
  return storePayload(payload, api, address)
}

export const storeError = (
  error: string,
  api: XyoArchivistApi,
  schema: LocationAnswerSchema,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  const payload = new XyoPayloadBuilder({ schema }).fields({ error }).build()
  return storePayload(payload, api, address)
}
