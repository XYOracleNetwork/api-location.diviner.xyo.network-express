import { LocationDivinerQueryCreationResponse } from '../../model'
import { generateAnswer } from './generateAnswer'

interface QueueData {
  response: LocationDivinerQueryCreationResponse
  // TODO: richer result than just the hash?
  // like maybe store the whole answer
  result?: string
}

export class QueryQueue {
  protected queue: Record<string, QueueData> = {}

  public enqueue(hash: string, response: LocationDivinerQueryCreationResponse) {
    // Store in memory
    // TODO: Distributed help
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
    // TODO: How to communicate done vs pending
    // error vs success to caller
    // when to stop polling this method
    return this.queue[hash]?.result
  }
}
