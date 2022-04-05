import {
  locationQuadkeyHeatmapAnswerSchema,
  LocationQueryCreationRequest,
  XyoArchivistApi,
} from '@xyo-network/sdk-xyo-client-js'

import { QuadkeyWithDensity } from '../../../model'
import {
  getArchiveWithLocationsWitnessed,
  getArchivist,
  getValidLocationRequest,
  validateQueryAnswer,
} from '../../../test'

const validateQueryResult = (queryResult: QuadkeyWithDensity[]) => {
  expect(queryResult).toBeTruthy()
  expect(Array.isArray(queryResult)).toBeTruthy()
  for (let i = 0; i < queryResult.length; i++) {
    const point = queryResult[i]
    expect(point.density).toBeTruthy()
    expect(point.quadkey).toBeTruthy()
  }
}

const getQueryAnswer = async (
  api: XyoArchivistApi,
  queryCreationRequest: LocationQueryCreationRequest
): Promise<QuadkeyWithDensity[]> => {
  const answer = await validateQueryAnswer<QuadkeyWithDensity[]>(
    api,
    queryCreationRequest,
    locationQuadkeyHeatmapAnswerSchema
  )
  validateQueryResult(answer)
  return answer
}

describe('Round trip tests', () => {
  const startTime = new Date().toISOString()
  const api = getArchivist()
  let stopTime = ''
  let archive = ''
  beforeAll(async () => {
    archive = await getArchiveWithLocationsWitnessed()
    stopTime = new Date().toISOString()
  })
  it('Generates answer if data was found', async () => {
    const queryCreationRequest = getValidLocationRequest(archive, startTime, stopTime)
    const answer = await getQueryAnswer(api, queryCreationRequest)
    expect(answer?.length).toBeGreaterThan(0)
  }, 10000)
  it('Generates an empty answer if no data was found', async () => {
    const now = new Date()
    const futureStartTime = new Date()
    futureStartTime.setDate(now.getDate() + 1)
    const futureStopTime = new Date()
    futureStopTime.setDate(now.getDate() + 2)
    const queryCreationRequest = getValidLocationRequest(
      archive,
      futureStartTime.toISOString(),
      futureStopTime.toISOString()
    )
    const answer = await getQueryAnswer(api, queryCreationRequest)
    expect(answer?.length).toBe(0)
  }, 10000)
  it.skip('Handles bad/misshapen data', async () => {
    // TODO: test
  }, 10000)
})
