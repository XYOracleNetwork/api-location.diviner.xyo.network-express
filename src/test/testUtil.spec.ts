import { XyoAccount } from '@xyo-network/account'
import {
  locationHeatmapQuerySchema,
  LocationQuadkeyHeatmapQuerySchema,
  locationQuadkeyHeatmapQuerySchema,
  LocationQueryCreationRequest,
  LocationQueryCreationResponse,
  LocationQuerySchema,
  locationTimeRangeQuerySchema,
  LocationWitnessPayloadBody,
  locationWitnessPayloadSchema,
  XyoAccountApi,
  XyoApiResponseBody,
  XyoArchive,
  XyoArchivistApi,
} from '@xyo-network/api'
import { XyoBoundWitness, XyoBoundWitnessBuilder } from '@xyo-network/boundwitness'
import { WithAdditional } from '@xyo-network/core'
import { XyoPayload, XyoPayloadBuilder } from '@xyo-network/payload'
import { Wallet } from 'ethers'
import { StatusCodes } from 'http-status-codes'
import supertest, { SuperTest, Test } from 'supertest'
import { v4 } from 'uuid'

import { GetLocationQueryResponse } from '../location'
import { LocationGeoJsonHeatmapQuerySchema } from '../model'

test('Must have ARCHIVIST_URL ENV VAR defined', () => {
  expect(process.env.ARCHIVIST_URL).toBeTruthy()
})

test('Must have ARCHIVE ENV VAR defined', () => {
  expect(process.env.ARCHIVE).toBeTruthy()
})

test('Must have APP_PORT ENV VAR defined', () => {
  expect(process.env.APP_PORT).toBeTruthy()
})

export const apiDomain = process.env.ARCHIVIST_URL || 'http://localhost:8080'
export const testArchive = process.env.ARCHIVE || 'temp'

export interface TestWeb3User {
  address: string
  privateKey: string
}

const request = supertest(`http://localhost:${process.env.APP_PORT}`)

const randBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getDiviner = (): SuperTest<Test> => {
  return request
}

export const getArchivist = (token?: string): XyoArchivistApi => {
  return token ? new XyoArchivistApi({ apiDomain, jwtToken: token }) : new XyoArchivistApi({ apiDomain })
}

export const getAuth = (user: TestWeb3User): XyoAccountApi => {
  return getArchivist().account(user.address.substring(2))
}

export const getNewWeb3User = (): TestWeb3User => {
  const wallet = Wallet.createRandom()
  const user = { address: wallet.address, privateKey: wallet.privateKey }
  return user
}

export const signInWeb3User = async (user: TestWeb3User): Promise<string> => {
  const authApi = getAuth(user)
  const challengeResponse = await authApi.challenge.post()
  if (!challengeResponse?.state) throw new Error('Challenge not received')
  const message = challengeResponse.state
  const wallet = new Wallet(user.privateKey)
  const signature = await wallet.signMessage(message)
  const data = { message, signature }
  const tokenResponse = await authApi.verify.post(data)
  if (!tokenResponse?.token) throw new Error('Token not received')
  return tokenResponse.token
}

export const getTokenForNewUser = async (): Promise<string> => {
  return await signInWeb3User(getNewWeb3User())
}

export const claimArchive = (token: string, archive: string = v4()): Promise<XyoArchive | undefined> => {
  return getArchivist(token).archive(archive).put()
}

export const getValidLocationRangeRequest = (
  archive = testArchive,
  startTime = new Date(0).toISOString(),
  stopTime = new Date().toISOString()
): LocationQueryCreationRequest => {
  return {
    query: { schema: locationWitnessPayloadSchema, startTime, stopTime },
    resultArchive: archive,
    resultArchivist: { apiDomain },
    schema: locationTimeRangeQuerySchema,
    sourceArchive: archive,
    sourceArchivist: { apiDomain },
  }
}
export const getValidLocationHeatmapRequest = (
  archive = testArchive,
  startTime = new Date(0).toISOString(),
  stopTime = new Date().toISOString()
): LocationQueryCreationRequest => {
  return {
    query: { schema: locationWitnessPayloadSchema, startTime, stopTime },
    resultArchive: archive,
    resultArchivist: { apiDomain },
    schema: locationHeatmapQuerySchema,
    sourceArchive: archive,
    sourceArchivist: { apiDomain },
  }
}

export const getValidLocationRequest = (
  archive = testArchive,
  startTime = new Date(0).toISOString(),
  stopTime = new Date().toISOString(),
  // TODO: Remove when types in SDK
  schema: LocationQuerySchema | LocationGeoJsonHeatmapQuerySchema | LocationQuadkeyHeatmapQuerySchema = locationQuadkeyHeatmapQuerySchema
): LocationQueryCreationRequest => {
  return {
    query: { schema: locationWitnessPayloadSchema, startTime, stopTime },
    resultArchive: archive,
    resultArchivist: { apiDomain },
    // TODO: Remove when types in SDK
    schema: schema as unknown as LocationQuerySchema,
    sourceArchive: archive,
    sourceArchivist: { apiDomain },
  }
}

export const getNewLocation = (): LocationWitnessPayloadBody => {
  const body = {
    _observeDuration: randBetween(1, 90),
    currentLocation: {
      coords: {
        accuracy: 1983.9417522841113,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: randBetween(-90, 90),
        longitude: randBetween(-180, 180),
        speed: null,
      },
      timestamp: Date.now(),
    },
    schema: locationWitnessPayloadSchema,
  }
  const payload = new XyoPayloadBuilder({ schema: locationWitnessPayloadSchema }).fields(body).build()
  return payload as unknown as LocationWitnessPayloadBody
}

export const getNewLocationWitness = (): XyoBoundWitness => {
  const address = XyoAccount.random()
  const payload = getNewLocation()
  return new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(address).payload(payload).build()
}

export const witnessNewLocation = async (api: XyoArchivistApi, archive = 'temp') => {
  return await api.archive(archive).block.post([getNewLocationWitness()])
}

export const createQuery = async (
  data: LocationQueryCreationRequest = getValidLocationRangeRequest(),
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<LocationQueryCreationResponse> => {
  const response = await getDiviner().post('/location/query').send(data).expect(expectedStatus)
  return response.body.data
}

export const getQuery = async (hash: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<GetLocationQueryResponse> => {
  const response = await getDiviner().get(`/location/query/${hash}`).expect(expectedStatus)
  return response.body.data
}

export const getArchiveWithLocationsWitnessed = async (locationsToWitness = 5): Promise<string> => {
  const api = getArchivist()
  const token = await getTokenForNewUser()
  expect(token).toBeTruthy()
  const archive = (await claimArchive(token))?.archive || ''
  expect(archive).toBeTruthy()
  await delay(1000)
  for (let location = 0; location < locationsToWitness; location++) {
    await witnessNewLocation(api, archive)
  }
  await delay(1000)
  return archive
}

export const pollUntilQueryComplete = async (queryCreationResponse: LocationQueryCreationResponse, maxPolls = 15, pollInterval = 1000) => {
  for (let i = 0; i < maxPolls; i++) {
    await delay(pollInterval)
    if ((await getQuery(queryCreationResponse.hash)).answerHash) break
  }
}

export const validateQueryAnswerPayloads = (answerPayloads: XyoApiResponseBody<XyoPayload[][]>) => {
  expect(answerPayloads).toBeTruthy()
  expect(answerPayloads?.length).toBeGreaterThan(0)
  expect(answerPayloads?.[0].length).toBeGreaterThan(0)
  expect(answerPayloads?.[0]?.[0]).toBeTruthy()
}

export const validateQueryCreationResponse = (queryCreationResponse: LocationQueryCreationResponse) => {
  expect(queryCreationResponse?.hash).not.toBeNull()
}

export const validateQueryAnswerResponse = (queryAnswerResponse: GetLocationQueryResponse, queryCreationResponse: LocationQueryCreationResponse) => {
  expect(queryAnswerResponse).toBeTruthy()
  expect(queryAnswerResponse.queryHash).toBe(queryCreationResponse.hash)
  expect(queryAnswerResponse.answerHash).toBeTruthy()
}

export const validateQueryAnswer = async <T>(
  api: XyoArchivistApi,
  queryCreationRequest: LocationQueryCreationRequest,
  expectedSchema: string // TODO: Strongly type response schema in SDK
): Promise<T> => {
  const queryCreationResponse = await createQuery(queryCreationRequest)
  validateQueryCreationResponse(queryCreationResponse)
  await pollUntilQueryComplete(queryCreationResponse)
  const queryAnswerResponse = await getQuery(queryCreationResponse.hash)
  validateQueryAnswerResponse(queryAnswerResponse, queryCreationResponse)
  const answerPayloads = await api
    .archive(queryCreationRequest.resultArchive)
    .block.payloads(queryAnswerResponse.answerHash || '')
    .get()
  validateQueryAnswerPayloads(answerPayloads)
  const payload = answerPayloads?.[0]?.[0] as WithAdditional<XyoPayload> | undefined
  expect(payload).toBeTruthy()
  expect(payload?.schema).toBe(expectedSchema)
  expect(payload?.result).toBeTruthy()
  return payload?.result as T
}
