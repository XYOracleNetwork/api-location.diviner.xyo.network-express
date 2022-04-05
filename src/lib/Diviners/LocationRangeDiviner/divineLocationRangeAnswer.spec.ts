import {
  LocationQueryCreationRequest,
  locationTimeRangeAnswerSchema,
  LocationTimeRangePointProperties,
  XyoArchivistApi,
} from '@xyo-network/sdk-xyo-client-js'
import { FeatureCollection, Point } from 'geojson'

import {
  getArchiveWithLocationsWitnessed,
  getArchivist,
  getValidLocationRangeRequest,
  validateQueryAnswer,
} from '../../../test'

const validateQueryResult = (queryResult: FeatureCollection<Point, LocationTimeRangePointProperties>) => {
  expect(queryResult).toBeTruthy()
  expect(queryResult?.type).toBe('FeatureCollection')
  expect(queryResult?.features).toBeTruthy()
  expect(Array.isArray(queryResult?.features)).toBeTruthy()
}

const getQueryAnswer = async (
  api: XyoArchivistApi,
  queryCreationRequest: LocationQueryCreationRequest
): Promise<FeatureCollection<Point, LocationTimeRangePointProperties>> => {
  const answer = await validateQueryAnswer<FeatureCollection<Point, LocationTimeRangePointProperties>>(
    api,
    queryCreationRequest,
    locationTimeRangeAnswerSchema
  )
  validateQueryResult(answer)
  return answer
}

describe('Round trip tests', () => {
  const startTime = new Date().toISOString()
  const locationsToWitness = 5
  const api = getArchivist()
  let stopTime = ''
  let archive = ''
  beforeAll(async () => {
    archive = await getArchiveWithLocationsWitnessed(locationsToWitness)
    stopTime = new Date().toISOString()
  })
  it('Generates answer if data was found', async () => {
    const queryCreationRequest = getValidLocationRangeRequest(archive, startTime, stopTime)
    const answer = await getQueryAnswer(api, queryCreationRequest)
    expect(answer?.features?.length).toBe(locationsToWitness)
  }, 10000)
  it('Generates an empty answer if no data was found', async () => {
    const now = new Date()
    const futureStartTime = new Date()
    futureStartTime.setDate(now.getDate() + 1)
    const futureStopTime = new Date()
    futureStopTime.setDate(now.getDate() + 2)
    const queryCreationRequest = getValidLocationRangeRequest(
      archive,
      futureStartTime.toISOString(),
      futureStopTime.toISOString()
    )
    const answer = await getQueryAnswer(api, queryCreationRequest)
    expect(answer?.features?.length).toBe(0)
  }, 10000)
  it.skip('Handles bad/misshapen data', async () => {
    // TODO: test
  }, 10000)
})
