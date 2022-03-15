import {
  locationHeatmapQuerySchema,
  LocationQueryCreationRequest,
  LocationQueryCreationResponse,
  locationTimeRangeQuerySchema,
  XyoAddress,
  XyoArchivistApi,
  XyoBoundWitness,
  XyoBoundWitnessBuilder,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'
import supertest, { SuperTest, Test } from 'supertest'
import { v4 } from 'uuid'

import { GetLocationQueryResponse } from '../location'
import { LocationWitnessPayloadBody, locationWitnessPayloadSchema } from '../model'

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

const request = supertest(`http://localhost:${process.env.APP_PORT}`)

const randBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getDiviner = (): SuperTest<Test> => {
  return request
}

export const getNewArchive = (): string => {
  return v4()
}

export const getArchivist = (archive = testArchive): XyoArchivistApi => {
  return new XyoArchivistApi({ apiDomain, archive })
}

export const getValidLocationRangeRequest = (
  archive = testArchive,
  startTime = new Date(0).toISOString(),
  stopTime = new Date().toISOString()
): LocationQueryCreationRequest => {
  return {
    query: { schema: locationWitnessPayloadSchema, startTime, stopTime },
    resultArchive: { apiDomain, archive },
    schema: locationTimeRangeQuerySchema,
    sourceArchive: { apiDomain, archive },
  }
}
export const getValidLocationHeatmapRequest = (
  archive = testArchive,
  startTime = new Date(0).toISOString(),
  stopTime = new Date().toISOString()
): LocationQueryCreationRequest => {
  return {
    query: { schema: locationWitnessPayloadSchema, startTime, stopTime },
    resultArchive: { apiDomain, archive },
    schema: locationHeatmapQuerySchema,
    sourceArchive: { apiDomain, archive },
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

export const witnessNewLocation = async (api: XyoArchivistApi) => {
  return await api.archive.block.post(getNewLocationWitness())
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
