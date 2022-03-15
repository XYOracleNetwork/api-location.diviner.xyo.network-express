import {
  LocationQueryCreationResponse,
  locationTimeRangeAnswerSchema,
  LocationTimeRangeQueryCreationRequest,
  XyoAddress,
  XyoArchivistApi,
} from '@xyo-network/sdk-xyo-client-js'

import { convertLocationWitnessPayloadToGeoJson } from '../convertLocationWitnessPayloadToGeoJson'
import { getFeatureCollectionFromGeometries } from '../getFeatureCollectionFromGeometries'
import { getMostRecentLocationsInTimeRange } from '../getLocationsInTimeRange'
import { isValidLocationWitnessPayload } from '../isValidLocationWitnessPayload'
import { storeAnswer, storeError } from '../storePayload'

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
    const locations = await getMostRecentLocationsInTimeRange(sourceArchive, start.getTime(), stop.getTime())
    const points = locations.filter(isValidLocationWitnessPayload).map(convertLocationWitnessPayloadToGeoJson)
    const answer = getFeatureCollectionFromGeometries(points)
    return await storeAnswer(answer, resultArchive, locationTimeRangeAnswerSchema, address)
  } catch (error) {
    console.log(error)
    return await storeError('Error calculating answer', resultArchive, locationTimeRangeAnswerSchema, address)
  }
}
