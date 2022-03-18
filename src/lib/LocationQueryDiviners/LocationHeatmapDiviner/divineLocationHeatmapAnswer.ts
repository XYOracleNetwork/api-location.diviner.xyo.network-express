import {
  locationHeatmapAnswerSchema,
  LocationHeatmapPointProperties,
  LocationHeatmapQueryCreationRequest,
  LocationQueryCreationResponse,
  XyoAddress,
  XyoArchivistApi,
} from '@xyo-network/sdk-xyo-client-js'
import { FeatureCollection, Point, Polygon } from 'geojson'

import { SupportedLocationWitnessPayloadSchemas } from '../../../model'
import { isValidCurrentLocationWitnessPayload } from '../isValidCurrentLocationWitnessPayload'
import { isValidLocationWitnessPayload } from '../isValidLocationWitnessPayload'
import { queryCurrentLocationsInRange } from '../queryCurrentLocationsInRange'
import { queryLocationsInRange } from '../queryLocationsInRange'
import { storeAnswer, storeError } from '../storePayload'
import { convertCurrentLocationWitnessPayloadToPoint } from './convertCurrentLocationWitnessPayloadToPoint'
import { convertLocationWitnessPayloadToPoint } from './convertLocationWitnessPayloadToPoint'
import { getHeatmapFromPoints } from './getHeatmapFromPoints'

type PointGetter = (api: XyoArchivistApi, startTime: number, stopTime: number) => Promise<Point[]>

const getCurrentLocationWitnesses: PointGetter = async (api: XyoArchivistApi, startTime: number, stopTime: number) => {
  return (await queryCurrentLocationsInRange(api, startTime, stopTime))
    .filter(isValidCurrentLocationWitnessPayload)
    .map(convertCurrentLocationWitnessPayloadToPoint)
}

const getLocationWitnesses: PointGetter = async (api: XyoArchivistApi, startTime: number, stopTime: number) => {
  return (await queryLocationsInRange(api, startTime, stopTime))
    .filter(isValidLocationWitnessPayload)
    .map(convertLocationWitnessPayloadToPoint)
}

const locationDataPointsStrategyBySchema: Record<SupportedLocationWitnessPayloadSchemas, PointGetter> = {
  'co.coinapp.currentlocationwitness': getCurrentLocationWitnesses,
  'network.xyo.location': getLocationWitnesses,
}

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
    const geometries = await locationDataPointsStrategyBySchema[request.query.schema](
      sourceArchive,
      start.getTime(),
      stop.getTime()
    )
    const answer: FeatureCollection<Polygon, LocationHeatmapPointProperties> = getHeatmapFromPoints(geometries, 1)
    return await storeAnswer(answer, resultArchive, locationHeatmapAnswerSchema, address)
  } catch (error) {
    console.log(error)
    return await storeError('Error calculating answer', resultArchive, locationHeatmapAnswerSchema, address)
  }
}
