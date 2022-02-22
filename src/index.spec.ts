import { StatusCodes } from 'http-status-codes'

import { getDiviner } from './test'

describe('/', () => {
  it('Provides health checks', async () => {
    const response = await getDiviner().get('/').expect(StatusCodes.OK)
    expect(response.body.data).toEqual({ alive: true })
  })
})
