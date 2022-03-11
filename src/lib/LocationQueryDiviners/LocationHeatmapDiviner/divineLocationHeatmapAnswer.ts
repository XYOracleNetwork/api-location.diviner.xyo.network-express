import {
  LocationDivinerQueryCreationResponse,
  XyoAddress,
  XyoArchivistApi,
  XyoBoundWitnessBuilder,
  XyoBoundWitnessBuilderConfig,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'
import { readFile } from 'fs/promises'
import { FeatureCollection } from 'geojson'

import { locationHeatmapAnswerSchema } from './LocationHeatmapQuerySchema'

const boundWitnessBuilderConfig: XyoBoundWitnessBuilderConfig = { inlinePayloads: true }
const sampleResponseFilePath =
  'src/lib/LocationQueryDiviners/LocationHeatmapDiviner/samplePolygonHeatmapWithHashes.json'

const storeAnswer = async (api: XyoArchivistApi, answer: FeatureCollection, address: XyoAddress) => {
  const payload = new XyoPayloadBuilder({ schema: locationHeatmapAnswerSchema }).fields({ result: answer }).build()
  const resultWitness = new XyoBoundWitnessBuilder(boundWitnessBuilderConfig).witness(address).payload(payload).build()
  await api.postBoundWitness(resultWitness)
  if (!resultWitness._hash) throw new Error('Error storing answer')
  return resultWitness._hash
}

const storeError = async (api: XyoArchivistApi, error: string, address: XyoAddress) => {
  const payload = new XyoPayloadBuilder({ schema: locationHeatmapAnswerSchema }).fields({ error }).build()
  const resultWitness = new XyoBoundWitnessBuilder(boundWitnessBuilderConfig).witness(address).payload(payload).build()
  await api.postBoundWitness(resultWitness)
  if (!resultWitness._hash) throw new Error('Error storing answer')
  return resultWitness._hash
}

export const divineLocationHeatmapAnswer = async (
  response: LocationDivinerQueryCreationResponse,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  // const sourceArchive = new XyoArchivistApi(response.sourceArchive)
  const resultArchive = new XyoArchivistApi(response.resultArchive)
  try {
    const answer = JSON.parse((await readFile(sampleResponseFilePath)).toString())
    return await storeAnswer(resultArchive, answer, address)
  } catch (error) {
    console.log(error)
    return await storeError(resultArchive, 'Error calculating answer', address)
  }
}
