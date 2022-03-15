import {
  GetLocationQueryResponse,
  LocationQueryCreationRequest,
  LocationQueryCreationResponse,
  locationTimeRangeAnswerSchema,
  LocationTimeRangePointProperties,
  XyoArchivistApi,
  XyoPayload,
} from '@xyo-network/sdk-xyo-client-js'
import { FeatureCollection, Point } from 'geojson'

import {
  createQuery,
  delay,
  getArchivist,
  getQuery,
  getValidLocationRangeRequest,
  testArchive,
  witnessNewLocation,
} from '../../../test'

const validateQueryAnswerPayloads = (answerPayloads: XyoPayload[]) => {
  expect(answerPayloads).toBeTruthy()
  expect(answerPayloads.length).toBeGreaterThan(0)
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

const validateGeoJsonFeatureCollection = (queryResult: FeatureCollection<Point, LocationTimeRangePointProperties>) => {
  expect(queryResult).toBeTruthy()
  expect(queryResult?.type).toBe('FeatureCollection')
  expect(queryResult?.features).toBeTruthy()
  expect(Array.isArray(queryResult?.features)).toBeTruthy()
}

const getQueryAnswer = async (
  api: XyoArchivistApi,
  queryCreationRequest: LocationQueryCreationRequest
): Promise<FeatureCollection<Point, LocationTimeRangePointProperties>> => {
  const queryCreationResponse = await createQuery(queryCreationRequest)
  validateQueryCreationResponse(queryCreationResponse)
  await delay(5000)
  const queryAnswerResponse = await getQuery(queryCreationResponse.hash)
  validateQueryAnswerResponse(queryAnswerResponse, queryCreationResponse)
  const answerPayloads = await api.archive.block.getPayloadsByHash(queryAnswerResponse.answerHash || '')
  validateQueryAnswerPayloads(answerPayloads)
  const payload = answerPayloads.pop()
  expect(payload).toBeTruthy()
  expect(payload?.schema).toBe(locationTimeRangeAnswerSchema)
  const answer = payload?.result as FeatureCollection<Point, LocationTimeRangePointProperties>
  validateGeoJsonFeatureCollection(answer)
  return answer
}

describe('Round trip tests', () => {
  const startTime = new Date().toISOString()
  const locationsToWitness = 5
  const api = getArchivist(testArchive)
  let stopTime = ''
  beforeAll(async () => {
    await delay(1000)
    for (let location = 0; location < locationsToWitness; location++) {
      await witnessNewLocation(api)
    }
    await delay(1000)
    stopTime = new Date().toISOString()
  })
  it('Generates answer if data was found', async () => {
    const queryCreationRequest = getValidLocationRangeRequest(testArchive, startTime, stopTime)
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
      testArchive,
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
