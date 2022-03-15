import {
  locationHeatmapAnswerSchema,
  LocationQueryCreationResponse,
  XyoAddress,
  XyoArchivistApi,
} from '@xyo-network/sdk-xyo-client-js'
import { readFile } from 'fs/promises'

import { storeAnswer, storeError } from '../storePayload'

const sampleResponseFilePath =
  'src/lib/LocationQueryDiviners/LocationHeatmapDiviner/samplePolygonHeatmapWithHashes.json'

export const divineLocationHeatmapAnswer = async (
  response: LocationQueryCreationResponse,
  address: XyoAddress = XyoAddress.random()
): Promise<string> => {
  // const sourceArchive = new XyoArchivistApi(response.sourceArchive)
  const resultArchive = new XyoArchivistApi(response.resultArchive)
  try {
    const answer = JSON.parse((await readFile(sampleResponseFilePath)).toString())
    return await storeAnswer(answer, resultArchive, locationHeatmapAnswerSchema, address)
  } catch (error) {
    console.log(error)
    return await storeError('Error calculating answer', resultArchive, locationHeatmapAnswerSchema, address)
  }
}
