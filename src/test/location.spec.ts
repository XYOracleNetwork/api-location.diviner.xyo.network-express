import { LocationDivinerQueryCreationResponse } from '../model'
import { createQuery, getArchivist, getQuery, getValidRequest, witnessNewLocation } from './testUtil.spec'

// TODO: Remove hardcoded delay as they always result in intermittent
// test failures
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('Round trip tests', () => {
  it('Generates answer if data was found', async () => {
    const startTime = new Date().toISOString()
    const locationsToWitness = 5
    // const archive = getNewArchive()
    const archive = 'temp'
    const api = getArchivist(archive)
    for (let location = 0; location < locationsToWitness; location++) {
      await witnessNewLocation(api)
    }
    await delay(1000)
    const stopTime = new Date().toISOString()
    const request = getValidRequest(archive, startTime, stopTime)
    const queryResponse = await createQuery(request)
    await delay(5000)
    const result = await getQuery(queryResponse.hash)
    expect(result).toBeTruthy()
    expect(result.queryHash).toBe(queryResponse.hash)
    expect(result.answerHash).toBeTruthy()
    const answer = await api.getBoundWitnessPayloadsByHash(result.answerHash || '')
    expect(answer).toBeTruthy()
    expect(answer.length).toBe(1)
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
