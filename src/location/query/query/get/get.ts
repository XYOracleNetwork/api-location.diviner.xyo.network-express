import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'

const handler: RequestHandler = (req, res, next) => {
  throw new Error('Not Implemented')
}

export const getLocationQuery = asyncHandler(handler)
