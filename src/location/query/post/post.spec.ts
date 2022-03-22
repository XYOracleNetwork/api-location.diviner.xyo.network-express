import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { createQuery, getValidLocationRangeRequest } from '../../../test'

describe('POST /location/query', () => {
  describe('with invalid query', () => {
    it(`returns ${ReasonPhrases.BAD_REQUEST} for invalid schema`, async () => {
      const request = getValidLocationRangeRequest()
      request.query.schema = ''
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
    it(`returns ${ReasonPhrases.BAD_REQUEST} for invalid startTime`, async () => {
      const request = getValidLocationRangeRequest()
      request.query.startTime = ''
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
    it(`returns ${ReasonPhrases.BAD_REQUEST} for invalid stopTime`, async () => {
      const request = getValidLocationRangeRequest()
      request.query.stopTime = ''
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
    it(`returns ${ReasonPhrases.BAD_REQUEST} for invalid source archivist`, async () => {
      const request = getValidLocationRangeRequest()
      delete (request.sourceArchivist as { apiDomain?: string })?.apiDomain
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
    it(`returns ${ReasonPhrases.BAD_REQUEST} for missing source archive`, async () => {
      const request = getValidLocationRangeRequest()
      delete (request as { sourceArchive?: string }).sourceArchive
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
    it(`returns ${ReasonPhrases.BAD_REQUEST} for invalid source archive`, async () => {
      const request = getValidLocationRangeRequest()
      request.sourceArchive = ''
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
    it(`returns ${ReasonPhrases.BAD_REQUEST} for invalid result archivist`, async () => {
      const request = getValidLocationRangeRequest()
      delete (request.resultArchivist as { apiDomain?: string })?.apiDomain
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
    it(`returns ${ReasonPhrases.BAD_REQUEST} for missing result archive`, async () => {
      const request = getValidLocationRangeRequest()
      delete (request as { resultArchive?: string }).resultArchive
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
    it(`returns ${ReasonPhrases.BAD_REQUEST} for invalid result archive`, async () => {
      const request = getValidLocationRangeRequest()
      request.resultArchive = ''
      await createQuery(request, StatusCodes.BAD_REQUEST)
    })
  })
  describe('valid query', () => {
    it('returns the hash of the bound witness block', async () => {
      const response = await createQuery()
      expect(response.hash).toBeTruthy()
    })
  })
})
