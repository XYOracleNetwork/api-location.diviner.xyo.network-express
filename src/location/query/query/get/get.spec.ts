import { LocationDivinerQueryCreationResponse } from '@xyo-network/sdk-xyo-client-js'

import { createQuery, getQuery } from '../../../../test'

// TODO: Remove hardcoded delay as they always result in intermittent
// test failures
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('GET /location/query/:hash', () => {
  it('returns answerHash', async () => {
    const queryResponse: LocationDivinerQueryCreationResponse = await createQuery()
    await delay(5000)
    const result = await getQuery(queryResponse.hash)
    expect(result).toBeTruthy()
    expect(result.queryHash).toBe(queryResponse.hash)
    expect(result.answerHash).toBeTruthy()
  }, 10000)
})
