import { StatusCodes } from 'http-status-codes'
import supertest, { SuperTest, Test } from 'supertest'

import { LocationDivinerQueryRequest, LocationDivinerQueryResult } from '../location'

test.skip('Must have API_KEY ENV VAR defined', () => {
  expect(process.env.API_KEY).toBeTruthy()
})
test('Must have APP_PORT ENV VAR defined', () => {
  expect(process.env.APP_PORT).toBeTruthy()
})

const request = supertest(`http://localhost:${process.env.APP_PORT}`)

export const getDiviner = (): SuperTest<Test> => {
  return request
}

export const getValidRequest = (): LocationDivinerQueryRequest => {
  // TODO: Get request
  return {} as LocationDivinerQueryRequest
}

export const createQuery = async (
  config: LocationDivinerQueryRequest,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<LocationDivinerQueryResult> => {
  // TODO: .set('x-api-key', apiKey)
  const response = await getDiviner().post('/location/query').expect(expectedStatus)
  return response.body.data
}
