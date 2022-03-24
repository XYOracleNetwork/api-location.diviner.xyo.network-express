import { LocationQueryCreationResponse } from '@xyo-network/sdk-xyo-client-js'

import { createQuery, getQuery, pollUntilQueryComplete } from '../../../../test'

// TODO: Make our own archive/data here to ensure query runs bounded/fast
describe('GET /location/query/:hash', () => {
  it('returns answerHash', async () => {
    const queryResponse: LocationQueryCreationResponse = await createQuery()
    await pollUntilQueryComplete(queryResponse)
    const result = await getQuery(queryResponse.hash)
    expect(result).toBeTruthy()
    expect(result.queryHash).toBe(queryResponse.hash)
    expect(result.answerHash).toBeTruthy()
  }, 20000)
})
