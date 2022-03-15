import {
  GetLocationQueryResponse,
  locationHeatmapAnswerSchema,
  LocationHeatmapPointProperties,
  LocationQueryCreationRequest,
  LocationQueryCreationResponse,
  XyoArchivistApi,
  XyoPayload,
} from '@xyo-network/sdk-xyo-client-js'
import { FeatureCollection, Point } from 'geojson'

import {
  claimArchive,
  createQuery,
  delay,
  getArchivist,
  getQuery,
  getTokenForNewUser,
  getValidLocationHeatmapRequest,
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

const validateGeoJsonFeatureCollection = (queryResult: FeatureCollection<Point, LocationHeatmapPointProperties>) => {
  expect(queryResult).toBeTruthy()
  expect(queryResult?.type).toBe('FeatureCollection')
  expect(queryResult?.features).toBeTruthy()
  expect(Array.isArray(queryResult?.features)).toBeTruthy()
}

const getQueryAnswer = async (
  api: XyoArchivistApi,
  queryCreationRequest: LocationQueryCreationRequest
): Promise<FeatureCollection<Point, LocationHeatmapPointProperties>> => {
  const queryCreationResponse = await createQuery(queryCreationRequest)
  validateQueryCreationResponse(queryCreationResponse)
  await delay(15000)
  const queryAnswerResponse = await getQuery(queryCreationResponse.hash)
  validateQueryAnswerResponse(queryAnswerResponse, queryCreationResponse)
  const answerPayloads = await api.archive.block.getPayloadsByHash(queryAnswerResponse.answerHash || '')
  validateQueryAnswerPayloads(answerPayloads)
  const payload = answerPayloads.pop()
  expect(payload).toBeTruthy()
  expect(payload?.schema).toBe(locationHeatmapAnswerSchema)
  const answer = payload?.result as FeatureCollection<Point, LocationHeatmapPointProperties>
  validateGeoJsonFeatureCollection(answer)
  return answer
}

// TODO: Create separate archive so that we don't interfere with other tests
describe('Round trip tests', () => {
  const startTime = new Date().toISOString()
  const locationsToWitness = 5
  let api = getArchivist()
  let stopTime = ''
  let token = ''
  let archive = ''
  beforeAll(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    api = getArchivist(archive)
    await delay(1000)
    for (let location = 0; location < locationsToWitness; location++) {
      await witnessNewLocation(api)
    }
    await delay(1000)
    stopTime = new Date().toISOString()
  })
  it('Generates answer if data was found', async () => {
    const queryCreationRequest = getValidLocationHeatmapRequest(archive, startTime, stopTime)
    const answer = await getQueryAnswer(api, queryCreationRequest)
    expect(answer?.features?.length).toBeGreaterThan(0)
  }, 20000)
  it.skip('Generates an empty answer if no data was found', async () => {
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
