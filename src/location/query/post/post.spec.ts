import { StatusCodes } from 'http-status-codes'

import { createQuery } from '../../../test'
import { LocationDivinerQueryRequest } from './postLocationQuerySchema'

describe('/location/query', () => {
  describe('Archive Config', () => {
    it('With invalid source archive config', async () => {
      await createQuery({} as LocationDivinerQueryRequest, StatusCodes.BAD_REQUEST)
    })
    it('With invalid response archive config', async () => {
      await createQuery({} as LocationDivinerQueryRequest, StatusCodes.BAD_REQUEST)
    })
  })
})
