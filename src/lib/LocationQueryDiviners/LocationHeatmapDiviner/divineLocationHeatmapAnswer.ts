import {
  locationHeatmapAnswerSchema,
  LocationHeatmapPointProperties,
  LocationHeatmapQueryCreationRequest,
  LocationQueryCreationResponse,
  XyoAddress,
  XyoArchivistApi,
} from '@xyo-network/sdk-xyo-client-js'
import { FeatureCollection, Polygon } from 'geojson'

import { getMostRecentLocationsInTimeRange } from '../getLocationsInTimeRange'
import { isValidLocationWitnessPayload } from '../isValidLocationWitnessPayload'
import { storeAnswer, storeError } from '../storePayload'
import { convertLocationWitnessPayloadToPoint } from './convertLocationWitnessPayloadToPoint'
import { getHeatmapFromPoints } from './getHeatmapFromPoints'

export const divineLocationHeatmapAnswer = async (
  response: LocationQueryCreationResponse,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  const sourceArchive = new XyoArchivistApi(response.sourceArchive)
  const resultArchive = new XyoArchivistApi(response.resultArchive)
  try {
    const request = response as unknown as LocationHeatmapQueryCreationRequest
    const start = request.query.startTime ? new Date(request.query.startTime) : new Date(0)
    const stop = request.query.stopTime ? new Date(request.query.stopTime) : new Date()
    const locations = await getMostRecentLocationsInTimeRange(sourceArchive, start.getTime(), stop.getTime())
    const geometries = locations.filter(isValidLocationWitnessPayload).map(convertLocationWitnessPayloadToPoint)
    const answer: FeatureCollection<Polygon, LocationHeatmapPointProperties> = getHeatmapFromPoints(geometries, 1)
    return await storeAnswer(answer, resultArchive, locationHeatmapAnswerSchema, address)
  } catch (error) {
    console.log(error)
    return await storeError('Error calculating answer', resultArchive, locationHeatmapAnswerSchema, address)
  }
}
