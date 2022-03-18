import {
  LocationQueryCreationResponse,
  locationTimeRangeAnswerSchema,
  LocationTimeRangeQueryCreationRequest,
  XyoAddress,
  XyoArchivistApi,
} from '@xyo-network/sdk-xyo-client-js'

import { getFeatureCollectionFromGeometries } from '../getFeatureCollectionFromGeometries'
import { isValidLocationWitnessPayload } from '../isValidLocationWitnessPayload'
import { queryLocationsInRange } from '../queryLocationsInRange'
import { storeAnswer, storeError } from '../storePayload'
import { convertLocationWitnessPayloadToFeature } from './convertLocationWitnessPayloadToFeature'

export const divineLocationRangeAnswer = async (
  response: LocationQueryCreationResponse,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  const sourceArchive = new XyoArchivistApi(response.sourceArchive)
  const resultArchive = new XyoArchivistApi(response.resultArchive)
  try {
    // TODO: Remove cast once SDK supports generic responses as well
    const request = response as unknown as LocationTimeRangeQueryCreationRequest
    const start = request.query.startTime ? new Date(request.query.startTime) : new Date(0)
    const stop = request.query.stopTime ? new Date(request.query.stopTime) : new Date()
    const locations = await queryLocationsInRange(sourceArchive, start.getTime(), stop.getTime())
    const geometries = locations.filter(isValidLocationWitnessPayload).map(convertLocationWitnessPayloadToFeature)
    const answer = getFeatureCollectionFromGeometries(geometries)
    return await storeAnswer(answer, resultArchive, locationTimeRangeAnswerSchema, address)
  } catch (error) {
    console.log(error)
    return await storeError('Error calculating answer', resultArchive, locationTimeRangeAnswerSchema, address)
  }
}
