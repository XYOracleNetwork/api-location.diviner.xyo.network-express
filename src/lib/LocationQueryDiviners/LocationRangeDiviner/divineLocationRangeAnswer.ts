import {
  LocationQueryCreationResponse,
  locationTimeRangeAnswerSchema,
  LocationTimeRangeQueryCreationRequest,
  locationWitnessPayloadSchema,
  XyoAddress,
  XyoArchivistApi,
} from '@xyo-network/sdk-xyo-client-js'

import { convertLocationWitnessForRange } from '../../LocationConverters'
import { getFeatureCollection } from '../getFeatureCollection'
import { isValidLocationWitnessPayload } from '../isValidLocationWitnessPayload'
import { queryLocationsInRange } from '../queryLocationsInRange'
import { storeAnswer, storeError } from '../storePayload'

export const divineLocationRangeAnswer = async (
  response: LocationQueryCreationResponse,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  const sourceArchive = new XyoArchivistApi(response.sourceArchivist).archives.select(response.sourceArchive)
  const resultArchive = new XyoArchivistApi(response.resultArchivist).archives.select(response.resultArchive)
  try {
    // TODO: Remove cast once SDK supports generic responses as well
    const request = response as unknown as LocationTimeRangeQueryCreationRequest
    const start = request.query.startTime ? new Date(request.query.startTime) : new Date(0)
    const stop = request.query.stopTime ? new Date(request.query.stopTime) : new Date()
    const startTime = start.getTime()
    const stopTime = stop.getTime()
    const locations = await queryLocationsInRange(sourceArchive, locationWitnessPayloadSchema, startTime, stopTime)
    const geometries = locations.filter(isValidLocationWitnessPayload).map(convertLocationWitnessForRange)
    const answer = getFeatureCollection(geometries)
    return await storeAnswer(answer, resultArchive, locationTimeRangeAnswerSchema, address)
  } catch (error) {
    console.log(error)
    return await storeError('Error calculating answer', resultArchive, locationTimeRangeAnswerSchema, address)
  }
}
