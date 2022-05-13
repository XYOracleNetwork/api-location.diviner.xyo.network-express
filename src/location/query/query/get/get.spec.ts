import { createQuery, getArchiveWithLocationsWitnessed, getQuery, getValidLocationRangeRequest, pollUntilQueryComplete } from '../../../../test'

describe('GET /location/query/:hash', () => {
  const startTime = new Date().toISOString()
  let stopTime = ''
  let archive = ''
  beforeAll(async () => {
    archive = await getArchiveWithLocationsWitnessed()
    stopTime = new Date().toISOString()
  })
  it('returns answerHash', async () => {
    const queryCreationRequest = getValidLocationRangeRequest(archive, startTime, stopTime)
    const queryResponse = await createQuery(queryCreationRequest)
    await pollUntilQueryComplete(queryResponse)
    const result = await getQuery(queryResponse.hash)
    expect(result).toBeTruthy()
    expect(result.queryHash).toBe(queryResponse.hash)
    expect(result.answerHash).toBeTruthy()
  }, 20000)
})
