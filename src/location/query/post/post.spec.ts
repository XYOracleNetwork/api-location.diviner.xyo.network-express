import { StatusCodes } from 'http-status-codes'

import { createQuery, getValidRequest } from '../../../test'

describe('/location/query', () => {
  describe('Archive Config', () => {
    it('With invalid source archive config', async () => {
      const query = getValidRequest()
      query.sourceArchive.apiDomain = ''
      await createQuery(query, StatusCodes.BAD_REQUEST)
    })
    it('With invalid response archive config', async () => {
      const query = getValidRequest()
      query.resultArchive.apiDomain = ''
      await createQuery(query, StatusCodes.BAD_REQUEST)
    })
  })
})
