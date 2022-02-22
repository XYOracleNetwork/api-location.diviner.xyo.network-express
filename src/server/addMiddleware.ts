import { Express } from 'express'

import { jsonBodyParser, responseProfiler, standardResponses, useRequestCounters } from '../middleware'

export const addMiddleware = (app: Express) => {
  app.use(responseProfiler)
  app.use(jsonBodyParser)
  app.use(standardResponses)
  useRequestCounters(app)
}
