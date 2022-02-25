import {
  XyoAddress,
  XyoArchivistApi,
  XyoArchivistApiConfig,
  XyoBoundWitness,
  XyoBoundWitnessBuilder,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'
import supertest, { SuperTest, Test } from 'supertest'
import { v4 } from 'uuid'

import { LocationWitnessPayloadBody, locationWitnessPayloadSchema } from '../lib/QueryQueue/LocationWitnessPayload'
import { GetLocationQueryResponse } from '../location'
import { LocationDivinerQueryCreationRequest, LocationDivinerQueryCreationResponse } from '../model'

test('Must have ARCHIVIST_URL ENV VAR defined', () => {
  expect(process.env.ARCHIVIST_URL).toBeTruthy()
})

test('Must have ARCHIVE ENV VAR defined', () => {
  expect(process.env.ARCHIVE).toBeTruthy()
})

test('Must have APP_PORT ENV VAR defined', () => {
  expect(process.env.APP_PORT).toBeTruthy()
})

const startTime = new Date(0).toISOString()
const apiDomain = process.env.ARCHIVIST_URL || 'http://localhost:8080'
const testArchive = process.env.ARCHIVE || 'temp'
const schema = 'location.diviner.xyo.network'
const request = supertest(`http://localhost:${process.env.APP_PORT}`)

const randBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export const getDiviner = (): SuperTest<Test> => {
  return request
}

export const getNewArchive = (): string => {
  return v4()
}

export const getArchivist = (archive = testArchive): XyoArchivistApi => {
  return new XyoArchivistApi({ apiDomain, archive })
}

export const getValidRequest = (archive = testArchive): LocationDivinerQueryCreationRequest => {
  const stopTime = new Date().toISOString()
  return {
    query: { schema, startTime, stopTime },
    resultArchive: { apiDomain, archive },
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
  const payload = getNewLocation()
  return new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(XyoAddress.random()).payload(payload).build()
}

export const witnessNewLocation = async (api: XyoArchivistApi) => {
  return await api.postBoundWitness(getNewLocationWitness())
}

export const createQuery = async (
  data: LocationDivinerQueryCreationRequest = getValidRequest(),
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<LocationDivinerQueryCreationResponse> => {
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
