import { StatusCodes } from 'http-status-codes'
import supertest, { SuperTest, Test } from 'supertest'

import { LocationDivinerQueryCreationRequest, LocationDivinerQueryCreationResponse } from '../location'

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
const archive = process.env.ARCHIVE || 'temp'
const schema = 'location.diviner.xyo.network'
const request = supertest(`http://localhost:${process.env.APP_PORT}`)

export const getDiviner = (): SuperTest<Test> => {
  return request
}

export const getValidRequest = (): LocationDivinerQueryCreationRequest => {
  const stopTime = new Date().toISOString()
  return {
    query: { schema, startTime, stopTime },
    resultArchive: { apiDomain, archive },
    sourceArchive: { apiDomain, archive },
  }
}

export const createQuery = async (
  data: LocationDivinerQueryCreationRequest = getValidRequest(),
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<LocationDivinerQueryCreationResponse> => {
  const response = await getDiviner().post('/location/query').send(data).expect(expectedStatus)
  return response.body.data
}
