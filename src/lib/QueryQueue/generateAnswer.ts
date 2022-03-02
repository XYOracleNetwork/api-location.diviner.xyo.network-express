import {
  LocationDivinerQueryCreationResponse,
  XyoAddress,
  XyoArchivistApi,
  XyoBoundWitnessBuilder,
  XyoBoundWitnessBuilderConfig,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'
import { FeatureCollection } from 'geojson'

import { answerSchema } from '../../model'
import { convertLocationSchemaToGeoJson } from './convertLocationSchemaToGeoJson'
import { getFeatureCollectionFromPoints } from './getFeatureCollectionFromPoints'
import { getMostRecentLocationsInTimeRange } from './getLocationsInTimeRange'
import { isValidLocationWitnessPayload } from './isValidLocationWitnessPayload'

const boundWitnessBuilderConfig: XyoBoundWitnessBuilderConfig = { inlinePayloads: true }

const storeAnswer = async (api: XyoArchivistApi, answer: FeatureCollection, address: XyoAddress) => {
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

export const generateAnswer = async (
  response: LocationDivinerQueryCreationResponse,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  const sourceArchive = new XyoArchivistApi(response.sourceArchive)
  const resultArchive = new XyoArchivistApi(response.resultArchive)
  try {
    const start = response.query.startTime ? new Date(response.query.startTime) : new Date(0)
    const stop = response.query.stopTime ? new Date(response.query.stopTime) : new Date()
    const locations = await getMostRecentLocationsInTimeRange(sourceArchive, start.getTime(), stop.getTime())
    const points = locations.filter(isValidLocationWitnessPayload).map(convertLocationSchemaToGeoJson)
    const answer = getFeatureCollectionFromPoints(points)
    return await storeAnswer(resultArchive, answer, address)
  } catch (error) {
    console.log(error)
    return await storeError(resultArchive, 'Error calculating answer', address)
  }
}
