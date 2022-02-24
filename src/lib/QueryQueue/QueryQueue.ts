import {
  XyoAddress,
  XyoArchivistApi,
  XyoBoundWitnessBuilder,
  XyoBoundWitnessBuilderConfig,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'

import { LocationDivinerQueryCreationResponse } from '../../model'
import { sampleGeoJson } from './sampleGeoJson'

const boundWitnessBuilderConfig: XyoBoundWitnessBuilderConfig = { inlinePayloads: true }

const getAnswer = async (response: LocationDivinerQueryCreationResponse): Promise<string> => {
  // const source = new XyoArchivistApi(response.sourceArchive)
  const result = new XyoArchivistApi(response.resultArchive)
  try {
    const { schema } = response.query
    // TODO: Actually iterate over the data
    // TODO: Answer schema
    const payload = new XyoPayloadBuilder({ schema }).fields({ result: sampleGeoJson }).build()
    // TODO: Same address as when accepted
    const address = XyoAddress.random()
    const resultWitness = new XyoBoundWitnessBuilder(boundWitnessBuilderConfig)
      .witness(address)
      .payload(payload)
      .build()
    await result.postBoundWitness(resultWitness)
    if (resultWitness._hash) {
      return resultWitness._hash
    } else {
      throw 'Hash error'
    }
  } catch (error) {
    console.log(error)
    // TODO: Skip single bad data points, possibly fail hard in some cases
    const { schema } = response.query
    const payload = new XyoPayloadBuilder({ schema }).fields({ ...response }).build()
    // TODO: Same address as when accepted
    const address = XyoAddress.random()
    const errorWitness = new XyoBoundWitnessBuilder(boundWitnessBuilderConfig).witness(address).payload(payload).build()
    await result.postBoundWitness(errorWitness)
    if (errorWitness._hash) {
      return errorWitness._hash
    } else {
      throw 'Hash error'
    }
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
    void getAnswer(response)
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
