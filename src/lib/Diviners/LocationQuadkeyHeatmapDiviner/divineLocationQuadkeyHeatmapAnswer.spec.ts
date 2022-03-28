import {
  GetLocationQueryResponse,
  LocationQueryCreationRequest,
  LocationQueryCreationResponse,
  XyoArchivistApi,
  XyoPayload,
} from '@xyo-network/sdk-xyo-client-js'

import { locationQuadkeyHeatmapAnswerSchema } from '../../../model'
import {
  createQuery,
  getArchiveWithLocationsWitnessed,
  getArchivist,
  getQuery,
  getTokenForNewUser,
  getValidLocationRequest,
  pollUntilQueryComplete,
} from '../../../test'
import { QuadkeyHeatmapTile } from './getQuadkeyHeatmapFromPoints'

const validateQueryAnswerPayloads = (answerPayloads: XyoPayload[][]) => {
  expect(answerPayloads).toBeTruthy()
  expect(answerPayloads.length).toBeGreaterThan(0)
  expect(answerPayloads[0].length).toBeGreaterThan(0)
}

const validateQueryCreationResponse = (queryCreationResponse: LocationQueryCreationResponse) => {
  expect(queryCreationResponse?.hash).not.toBeNull()
}

const validateQueryAnswerResponse = (
  queryAnswerResponse: GetLocationQueryResponse,
  queryCreationResponse: LocationQueryCreationResponse
) => {
  expect(queryAnswerResponse).toBeTruthy()
  expect(queryAnswerResponse.queryHash).toBe(queryCreationResponse.hash)
  expect(queryAnswerResponse.answerHash).toBeTruthy()
}

const validateQueryResponseShape = (queryResult: QuadkeyHeatmapTile[]) => {
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
): Promise<QuadkeyHeatmapTile[]> => {
  const queryCreationResponse = await createQuery(queryCreationRequest)
  validateQueryCreationResponse(queryCreationResponse)
  await pollUntilQueryComplete(queryCreationResponse)
  const queryAnswerResponse = await getQuery(queryCreationResponse.hash)
  validateQueryAnswerResponse(queryAnswerResponse, queryCreationResponse)
  const answerPayloads = await api
    .archive(queryCreationRequest.resultArchive)
    .block.getPayloadsByHash(queryAnswerResponse.answerHash || '')
  validateQueryAnswerPayloads(answerPayloads)
  const payload = answerPayloads.pop()?.pop()
  expect(payload).toBeTruthy()
  expect(payload?.schema).toBe(locationQuadkeyHeatmapAnswerSchema)
  const answer = payload?.result as QuadkeyHeatmapTile[]
  validateQueryResponseShape(answer)
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
