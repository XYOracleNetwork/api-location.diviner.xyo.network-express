import { createQuery, getQuery } from '../../../../test'
import { LocationDivinerQueryCreationResponse } from '../../post'

describe('GET /location/query/:hash', () => {
  let queryResponse: LocationDivinerQueryCreationResponse
  beforeEach(async () => {
    queryResponse = await createQuery()
  })
  it('Gets successful results', async () => {
    const result = await getQuery(queryResponse.hash)
    expect(result).toBeTruthy()
    expect(result.queryHash).toBe(queryResponse.hash)
    expect(result.answerHash).toBeTruthy()
  })
})
