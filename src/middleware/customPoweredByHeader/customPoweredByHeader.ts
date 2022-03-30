import { Express, NextFunction, Request, Response } from 'express'

const header = 'X-Powered-By'

/**
 * By default Express appends the `X-Powered-By: Express` header to
 * all responses. Calling this method enables that behavior.
 * @param app The Express app to disable the header on.
 */
export const enableExpressDefaultPoweredByHeader = (app: Express) => {
  app.enable(header)
}

/**
 * By default Express appends the `X-Powered-By: Express` header to
 * all responses. Calling this method disables that behavior.
 * @param app The Express app to disable the header on.
 */
export const disableExpressDefaultPoweredByHeader = (app: Express) => {
  app.disable(header)
}

export const customPoweredByHeader = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader(header, 'XYO')
  next()
}
