import { LocationDivinerQueryCreationResponse } from '../model'
import { createQuery, getArchivist, getNewArchive, getQuery, getValidRequest, witnessNewLocation } from '.'

// TODO: Remove hardcoded delay as they always result in intermittent
// test failures
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('Round trip tests', () => {
  it('Generates answer if data was found', async () => {
    const locationsToWitness = 5
    const archive = getNewArchive()
    const api = getArchivist(archive)
    for (let location = 0; location < locationsToWitness; location++) {
      await witnessNewLocation(api)
    }
    const queryResponse = await createQuery(getValidRequest(archive))
    await delay(5000)
    const result = await getQuery(queryResponse.hash)
    expect(result).toBeTruthy()
    expect(result.queryHash).toBe(queryResponse.hash)
    expect(result.answerHash).toBeTruthy()
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
