import {
  locationHeatmapAnswerSchema,
  LocationHeatmapPointProperties,
  LocationHeatmapQueryCreationRequest,
  LocationQueryCreationResponse,
  XyoAddress,
  XyoArchivistApi,
} from '@xyo-network/sdk-xyo-client-js'
import { FeatureCollection, Point, Polygon } from 'geojson'

import { FeaturesInRange, SupportedLocationWitnessPayloadSchemas, WithHashProperties } from '../../../model'
import { getFeatureCollection } from '../getFeatureCollection'
import { isValidCurrentLocationWitnessPayload } from '../isValidCurrentLocationWitnessPayload'
import { isValidLocationWitnessPayload } from '../isValidLocationWitnessPayload'
import { queryCurrentLocationsInRange } from '../queryCurrentLocationsInRange'
import { queryLocationsInRange } from '../queryLocationsInRange'
import { storeAnswer, storeError } from '../storePayload'
import { convertCurrentLocationWitnessPayloadToPointFeature } from './convertCurrentLocationWitnessPayloadToPointFeature'
import { convertLocationWitnessPayloadToPointFeature } from './convertLocationWitnessPayloadToPoint'
import { getHeatmapFromPoints } from './getHeatmapFromPoints'

const getCurrentLocationWitnesses: FeaturesInRange<Point, WithHashProperties> = async (
  api: XyoArchivistApi,
  startTime: number,
  stopTime: number
) => {
  return (await queryCurrentLocationsInRange(api, startTime, stopTime))
    .filter(isValidCurrentLocationWitnessPayload)
    .map(convertCurrentLocationWitnessPayloadToPointFeature)
}

const getLocationWitnesses: FeaturesInRange<Point, WithHashProperties> = async (
  api: XyoArchivistApi,
  startTime: number,
  stopTime: number
) => {
  return (await queryLocationsInRange(api, startTime, stopTime))
    .filter(isValidLocationWitnessPayload)
    .map(convertLocationWitnessPayloadToPointFeature)
}

const getLocationDataPointsBySchema: Record<
  SupportedLocationWitnessPayloadSchemas,
  FeaturesInRange<Point, WithHashProperties>
> = {
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
    const startTime = start.getTime()
    const stopTime = stop.getTime()
    const points = await getLocationDataPointsBySchema[request.query.schema](sourceArchive, startTime, stopTime)
    const collection = getFeatureCollection(points)
    const answer: FeatureCollection<Polygon, LocationHeatmapPointProperties> = getHeatmapFromPoints(collection, 1)
    return await storeAnswer(answer, resultArchive, locationHeatmapAnswerSchema, address)
  } catch (error) {
    console.log(error)
    return await storeError('Error calculating answer', resultArchive, locationHeatmapAnswerSchema, address)
  }
}
