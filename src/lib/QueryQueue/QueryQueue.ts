import {
  XyoAddress,
  XyoArchivistApi,
  XyoBoundWitnessBuilder,
  XyoBoundWitnessBuilderConfig,
  XyoPayload,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'

import { LocationDivinerQueryCreationResponse } from '../../model'
import { convertLocationSchemaToGeoJson } from './convertLocationSchemaToGeoJson'
import { getFeatureCollectionFromPoints } from './getFeatureCollectionFromPoints'
import { getLocationsInTimeRange } from './getLocationsInTimeRange'
import { sampleGeoJson } from './sampleGeoJson'

export const querySchema = 'network.xyo.location.range.query'
export const answerSchema = 'network.xyo.location.range.answer'

const boundWitnessBuilderConfig: XyoBoundWitnessBuilderConfig = { inlinePayloads: true }

const storeAnswer = async (api: XyoArchivistApi, answer: Partial<XyoPayload>, address: XyoAddress) => {
  const payload = new XyoPayloadBuilder({ schema: answerSchema }).fields({ result: answer }).build()
  const resultWitness = new XyoBoundWitnessBuilder(boundWitnessBuilderConfig).witness(address).payload(payload).build()
  await api.postBoundWitness(resultWitness)
  if (!resultWitness._hash) throw new Error('Error storing answer')
  return resultWitness._hash
}

const storeError = async (api: XyoArchivistApi, error: string, address: XyoAddress) => {
  const payload = new XyoPayloadBuilder({ schema: answerSchema }).fields({ error }).build()
  const resultWitness = new XyoBoundWitnessBuilder(boundWitnessBuilderConfig).witness(address).payload(payload).build()
  await api.postBoundWitness(resultWitness)
  if (!resultWitness._hash) throw new Error('Error storing answer')
  return resultWitness._hash
}

const generateAnswer = async (
  response: LocationDivinerQueryCreationResponse,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  const sourceArchive = new XyoArchivistApi(response.sourceArchive)
  const resultArchive = new XyoArchivistApi(response.resultArchive)
  try {
    const locations = await getLocationsInTimeRange(sourceArchive)
    const points = locations.map(convertLocationSchemaToGeoJson)
    const feature = getFeatureCollectionFromPoints(points)
    const answer = sampleGeoJson
    return await storeAnswer(resultArchive, answer, address)
  } catch (error) {
    return await storeError(resultArchive, 'Error calculating answer', address)
  }
}

interface QueueData {
  response: LocationDivinerQueryCreationResponse
  // TODO: richer result than just the hash?
  // like maybe store the whole answer
  result?: string
}

export class QueryQueue {
  protected queue: Record<string, QueueData> = {}

  public enqueue(hash: string, response: LocationDivinerQueryCreationResponse) {
    // Store in memory
    // TODO: Distributed help
    this.queue[hash] = { response }

    // Fire off task in background
    void generateAnswer(response)
      .then((result) => {
        this.queue[hash].result = result
      })
      .catch((err) => {
        console.log(err)
      })
  }

  public get(hash: string): string | undefined {
    // TODO: How to communicate done vs pending
    // error vs success to caller
    // when to stop polling this method
    return this.queue[hash]?.result
  }
}
