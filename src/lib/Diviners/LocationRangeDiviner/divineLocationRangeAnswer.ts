import { LocationQueryCreationResponse, locationTimeRangeAnswerSchema, LocationTimeRangeQueryCreationRequest, XyoArchivistApi } from '@xyo-network/api'
import { XyoAccount } from '@xyo-network/core'

import { convertLocationWitnessForRange } from '../../Converters'
import { isValidLocationWitnessPayload } from '../../Validators'
import { queryLocationsInRange } from '../../WitnessQueries'
import { getFeatureCollection } from '../getFeatureCollection'
import { storeAnswer, storeError } from '../storePayload'

export const divineLocationRangeAnswer = async (response: LocationQueryCreationResponse, account: XyoAccount): Promise<string> => {
  const sourceArchive = new XyoArchivistApi(response.sourceArchivist).archive(response.sourceArchive)
  const resultArchive = new XyoArchivistApi(response.resultArchivist).archive(response.resultArchive)
  try {
    // TODO: Remove cast once SDK supports generic responses as well
    const request = response as unknown as LocationTimeRangeQueryCreationRequest
    const start = request.query.startTime ? new Date(request.query.startTime) : new Date(0)
    const stop = request.query.stopTime ? new Date(request.query.stopTime) : new Date()
    const startTime = start.getTime()
    const stopTime = stop.getTime()
    const locations = await queryLocationsInRange(sourceArchive, startTime, stopTime)
    const geometries = locations.filter(isValidLocationWitnessPayload).map(convertLocationWitnessForRange)
    const answer = getFeatureCollection(geometries)
    return await storeAnswer(answer, resultArchive, locationTimeRangeAnswerSchema, account)
  } catch (error) {
    console.log(error)
    return await storeError('Error calculating answer', resultArchive, locationTimeRangeAnswerSchema, account)
  }
}
