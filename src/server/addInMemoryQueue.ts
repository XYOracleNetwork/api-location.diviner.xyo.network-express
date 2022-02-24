import { Express } from 'express'

import { QueryQueue } from '../lib'

export const addInMemoryQueue = (app: Express) => {
  app.locals.queue = new QueryQueue()
}
