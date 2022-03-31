import {
  locationHeatmapQuerySchema,
  LocationQueryCreationRequest,
  LocationQueryCreationResponse,
  LocationQuerySchema,
  locationTimeRangeQuerySchema,
  LocationWitnessPayloadBody,
  locationWitnessPayloadSchema,
  XyoAddress,
  XyoArchive,
  XyoArchivistApi,
  XyoAuthApi,
  XyoBoundWitness,
  XyoBoundWitnessBuilder,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'
import { Wallet } from 'ethers'
import { StatusCodes } from 'http-status-codes'
import supertest, { SuperTest, Test } from 'supertest'
import { v4 } from 'uuid'

import { GetLocationQueryResponse } from '../location'
import {
  LocationGeoJsonHeatmapQuerySchema,
  LocationQuadkeyHeatmapQuerySchema,
  locationQuadkeyHeatmapQuerySchema,
} from '../model'

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

export const getAuth = (): XyoAuthApi => {
  return getArchivist().user
}

export const getNewWeb3User = (): TestWeb3User => {
  const wallet = Wallet.createRandom()
  const user = { address: wallet.address, privateKey: wallet.privateKey }
  return user
}

export const signInWeb3User = async (user: TestWeb3User): Promise<string> => {
  const authApi = getAuth()
  const challengeResponse = await authApi.walletChallenge(user.address)
  const message = challengeResponse.state
  const wallet = new Wallet(user.privateKey)
  const signature = await wallet.signMessage(message)
  const tokenResponse = await authApi.walletVerify(user.address, message, signature)
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
  schema:
    | LocationQuerySchema
    | LocationGeoJsonHeatmapQuerySchema
    | LocationQuadkeyHeatmapQuerySchema = locationQuadkeyHeatmapQuerySchema
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
  return payload as LocationWitnessPayloadBody
}

export const getNewLocationWitness = (): XyoBoundWitness => {
  const address = XyoAddress.random()
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

export const getQuery = async (
  hash: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<GetLocationQueryResponse> => {
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

export const pollUntilQueryComplete = async (
  queryCreationResponse: LocationQueryCreationResponse,
  maxPolls = 15,
  pollInterval = 1000
) => {
  for (let i = 0; i < maxPolls; i++) {
    await delay(pollInterval)
    if ((await getQuery(queryCreationResponse.hash)).answerHash) break
  }
}
