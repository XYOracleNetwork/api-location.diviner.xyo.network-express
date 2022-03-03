import { LocationDivinerQueryCreationResponse } from '@xyo-network/sdk-xyo-client-js'

import { generateAnswer } from './generateAnswer'

interface QueueData {
  response: LocationDivinerQueryCreationResponse
  result?: string
}

export class QueryQueue {
  protected queue: Record<string, QueueData> = {}

  public enqueue(hash: string, response: LocationDivinerQueryCreationResponse) {
    // NOTE: Since we're using the archivist for a state store (we don't have a
    // cache) we're storing the queries in memory. This is fine for now as:
    // • queries are processed immediately anyway
    // • in the rare event of a system restart we can always build out the feature
    // to resume unanswered queries as they're stored in the archivist
    this.queue[hash] = { response }

    // Fire off task in background
    void generateAnswer(response)
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
