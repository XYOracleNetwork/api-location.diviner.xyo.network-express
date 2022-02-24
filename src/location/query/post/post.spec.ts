import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { createQuery, getValidRequest } from '../../../test'

describe('POST /location/query', () => {
  describe('with invalid archive config', () => {
    it(`returns ${ReasonPhrases.BAD_REQUEST} for invalid source archive`, async () => {
      const request = getValidRequest()
      request.sourceArchive.apiDomain = ''
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
    it(`returns ${ReasonPhrases.BAD_REQUEST} for invalid result archive`, async () => {
      const request = getValidRequest()
      request.resultArchive.apiDomain = ''
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
  })
  describe('with invalid query', () => {
    it(`returns ${ReasonPhrases.BAD_REQUEST} for invalid schema`, async () => {
      const request = getValidRequest()
      request.query.schema = ''
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
    it(`returns ${ReasonPhrases.BAD_REQUEST} for invalid startTime`, async () => {
      const request = getValidRequest()
      request.query.startTime = ''
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
    it(`returns ${ReasonPhrases.BAD_REQUEST} for invalid stopTime`, async () => {
      const request = getValidRequest()
      request.query.stopTime = ''
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
  })
})
