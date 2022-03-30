import { Express } from 'express'

import {
  customPoweredByHeader,
  disableExpressDefaultPoweredByHeader,
  jsonBodyParser,
  responseProfiler,
  standardResponses,
  useRequestCounters,
} from '../middleware'

export const addMiddleware = (app: Express) => {
  app.use(responseProfiler)
  app.use(jsonBodyParser)
  app.use(standardResponses)
  disableExpressDefaultPoweredByHeader(app)
  app.use(customPoweredByHeader)
  useRequestCounters(app)
}
