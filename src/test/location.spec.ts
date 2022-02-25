import { LocationDivinerQueryCreationResponse } from '../model'
import { createQuery, getArchivist, getQuery, getValidRequest, witnessNewLocation } from './testUtil.spec'

// TODO: Remove hardcoded delay as they always result in intermittent
// test failures
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('Round trip tests', () => {
  it('Generates answer if data was found', async () => {
    const locationsToWitness = 5
    // const archive = getNewArchive()
    const archive = 'temp'
    const api = getArchivist(archive)
    for (let location = 0; location < locationsToWitness; location++) {
      await witnessNewLocation(api)
    }
    // TODO: Start/stop time for query
    const queryResponse = await createQuery(getValidRequest(archive))
    await delay(5000)
    const result = await getQuery(queryResponse.hash)
    expect(result).toBeTruthy()
    expect(result.queryHash).toBe(queryResponse.hash)
    expect(result.answerHash).toBeTruthy()
    const answer = await api.getBoundWitnessPayloadsByHash(result.answerHash || '')
    expect(answer).toBeTruthy()
    // TODO: Validate data
  }, 10000)
  it.skip('Generates an empty answer if no data was found', async () => {
    const queryResponse: LocationDivinerQueryCreationResponse = await createQuery()
    await delay(5000)
    const result = await getQuery(queryResponse.hash)
    expect(result).toBeTruthy()
    expect(result.queryHash).toBe(queryResponse.hash)
    expect(result.answerHash).toBeTruthy()
  }, 10000)
  it.skip('Handles bad/misshapen data', async () => {
    const queryResponse: LocationDivinerQueryCreationResponse = await createQuery()
    await delay(5000)
    const result = await getQuery(queryResponse.hash)
    expect(result).toBeTruthy()
    expect(result.queryHash).toBe(queryResponse.hash)
    expect(result.answerHash).toBeTruthy()
  }, 10000)
})
