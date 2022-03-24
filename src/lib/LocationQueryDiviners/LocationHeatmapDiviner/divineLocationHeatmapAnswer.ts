import {
  locationHeatmapAnswerSchema,
  LocationHeatmapPointProperties,
  LocationHeatmapQueryCreationRequest,
  LocationQueryCreationResponse,
  locationWitnessPayloadSchema,
  XyoAddress,
  XyoArchivistApi,
  XyoArchivistArchiveApi,
} from '@xyo-network/sdk-xyo-client-js'
import { FeatureCollection, Point, Polygon } from 'geojson'

import {
  currentLocationWitnessPayloadSchema,
  FeaturesInRange,
  SupportedLocationWitnessPayloadSchemas,
  WithHashProperties,
} from '../../../model'
import { convertCurrentLocationWitnessForHeatmap, convertLocationWitnessForHeatmap } from '../../LocationConverters'
import { queryCurrentLocationsInRange, queryLocationsInRange } from '../../LocationWitnessQueries'
import { isValidCurrentLocationWitnessPayload, isValidLocationWitnessPayload } from '../../Validators'
import { getFeatureCollection } from '../getFeatureCollection'
import { storeAnswer, storeError } from '../storePayload'
import { getHeatmapFromPoints } from './getHeatmapFromPoints'

const getCurrentLocationWitnesses: FeaturesInRange<Point, WithHashProperties> = async (
  api: XyoArchivistArchiveApi,
  startTime: number,
  stopTime: number
) => {
  return (await queryCurrentLocationsInRange(api, currentLocationWitnessPayloadSchema, startTime, stopTime))
    .filter(isValidCurrentLocationWitnessPayload)
    .map(convertCurrentLocationWitnessForHeatmap)
}

const getLocationWitnesses: FeaturesInRange<Point, WithHashProperties> = async (
  api: XyoArchivistArchiveApi,
  startTime: number,
  stopTime: number
) => {
  return (await queryLocationsInRange(api, locationWitnessPayloadSchema, startTime, stopTime))
    .filter(isValidLocationWitnessPayload)
    .map(convertLocationWitnessForHeatmap)
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
  const sourceArchive = new XyoArchivistApi(response.sourceArchivist).archives.select(response.sourceArchive)
  const resultArchive = new XyoArchivistApi(response.resultArchivist).archives.select(response.resultArchive)
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
