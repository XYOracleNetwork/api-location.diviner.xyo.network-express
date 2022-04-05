import {
  locationHeatmapAnswerSchema,
  LocationHeatmapPointProperties,
  LocationQueryCreationRequest,
  XyoArchivistApi,
} from '@xyo-network/sdk-xyo-client-js'
import { FeatureCollection, Point } from 'geojson'

import {
  getArchiveWithLocationsWitnessed,
  getArchivist,
  getTokenForNewUser,
  getValidLocationHeatmapRequest,
  validateQueryAnswer,
} from '../../../test'

const validateQueryResult = (queryResult: FeatureCollection<Point, LocationHeatmapPointProperties>) => {
  expect(queryResult).toBeTruthy()
  expect(queryResult?.type).toBe('FeatureCollection')
  expect(queryResult?.features).toBeTruthy()
  expect(Array.isArray(queryResult?.features)).toBeTruthy()
}

const getQueryAnswer = async (
  api: XyoArchivistApi,
  queryCreationRequest: LocationQueryCreationRequest
): Promise<FeatureCollection<Point, LocationHeatmapPointProperties>> => {
  const answer = await validateQueryAnswer<FeatureCollection<Point, LocationHeatmapPointProperties>>(
    api,
    queryCreationRequest,
    locationHeatmapAnswerSchema
  )
  validateQueryResult(answer)
  return answer
}

describe('Round trip tests', () => {
  const startTime = new Date().toISOString()
  const api = getArchivist()
  let stopTime = ''
  let token = ''
  let archive = ''
  beforeAll(async () => {
    token = await getTokenForNewUser()
    expect(token).toBeTruthy()
    archive = await getArchiveWithLocationsWitnessed()
    stopTime = new Date().toISOString()
  })
  it('Generates answer if data was found', async () => {
    const queryCreationRequest = getValidLocationHeatmapRequest(archive, startTime, stopTime)
    const answer = await getQueryAnswer(api, queryCreationRequest)
    expect(answer?.features?.length).toBeGreaterThan(0)
  }, 10000)
  it('Generates an empty answer if no data was found', async () => {
    const now = new Date()
    const futureStartTime = new Date()
    futureStartTime.setDate(now.getDate() + 1)
    const futureStopTime = new Date()
    futureStopTime.setDate(now.getDate() + 2)
    const queryCreationRequest = getValidLocationHeatmapRequest(
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
