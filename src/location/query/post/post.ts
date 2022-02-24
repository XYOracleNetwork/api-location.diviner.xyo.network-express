import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { LocationDivinerQueryRequest } from './postLocationQuerySchema'
import { validateArchiveConfig } from './validateArchiveConfig'

const handler: RequestHandler<NoReqParams, LocationDivinerQueryRequest, LocationDivinerQueryRequest> = (
  req,
  res,
  next
) => {
  const { sourceArchive, resultArchive, query } = req.body
  if (!validateArchiveConfig(sourceArchive)) {
    next({
      message: 'Invalid source archive config',
      name: ReasonPhrases.BAD_REQUEST,
      statusCode: StatusCodes.BAD_REQUEST,
    })
  }
  if (!validateArchiveConfig(resultArchive)) {
    next({
      message: 'Invalid result archive config',
      name: ReasonPhrases.BAD_REQUEST,
      statusCode: StatusCodes.BAD_REQUEST,
    })
  }
  next({ message: ReasonPhrases.NOT_IMPLEMENTED, statusCode: StatusCodes.NOT_IMPLEMENTED })
}

export const postLocationQuery = asyncHandler(handler)
