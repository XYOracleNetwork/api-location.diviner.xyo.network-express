import { LocationQueryCreationResponse, LocationQuerySchema } from '@xyo-network/sdk-xyo-client-js'

import { LocationGeoJsonHeatmapQuerySchema, LocationQuadkeyHeatmapQuerySchema } from '../../model'
import {
  divineLocationHeatmapAnswer,
  divineLocationQuadkeyHeatmapAnswer,
  divineLocationRangeAnswer,
  QueryProcessor,
} from '../Diviners'

interface QueueData {
  response: LocationQueryCreationResponse
  result?: string
}

type ProcessableQueries = LocationQuerySchema | LocationQuadkeyHeatmapQuerySchema | LocationGeoJsonHeatmapQuerySchema

const locationQueryDivinersBySchema: Record<ProcessableQueries, QueryProcessor<LocationQueryCreationResponse>> = {
  'network.xyo.location.heatmap.geojson.query': divineLocationHeatmapAnswer,
  'network.xyo.location.heatmap.quadkey.query': divineLocationQuadkeyHeatmapAnswer,
  'network.xyo.location.heatmap.query': divineLocationHeatmapAnswer,
  'network.xyo.location.range.query': divineLocationRangeAnswer,
}

export class QueryQueue {
  protected queue: Record<string, QueueData> = {}

  public enqueue(hash: string, response: LocationQueryCreationResponse) {
    const schema = response.schema as LocationQuerySchema
    const queryProcessor = locationQueryDivinersBySchema[schema]
    if (!queryProcessor) {
      throw new Error(`Diviner not configured to answer queries for schemas of type: ${schema}`)
    }

    // NOTE: Since we're using the archivist for a state store (we don't have a
    // cache) we're storing the queries in memory. This is fine for now as:
    // • queries are processed immediately anyway
    // • in the rare event of a system restart we can always build out the feature
    // to resume unanswered queries as they're stored in the archivist
    this.queue[hash] = { response }

    // Fire off task in background
    void queryProcessor(response)
      .then((result) => {
        this.queue[hash].result = result
      })
      .catch((err) => {
        console.log(err)
      })
  }

  public get(hash: string): string | undefined {
    // TODO: Better communicate done vs pending
    // error vs success to caller so they know
    // when to stop polling this method
    return this.queue[hash]?.result
  }
}
