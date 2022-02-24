import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { LocationDivinerQueryRequest } from './postLocationQuerySchema'
import { validateArchiveConfig } from './validateArchiveConfig'
import { validateQuery } from './validateQuery'

const sourceArchiveConfigError = {
  message: 'Invalid source archive config',
  name: ReasonPhrases.BAD_REQUEST,
  statusCode: StatusCodes.BAD_REQUEST,
}

const resultArchiveConfigError = {
  message: 'Invalid result archive config',
  name: ReasonPhrases.BAD_REQUEST,
  statusCode: StatusCodes.BAD_REQUEST,
}

const queryValidationError = {
  message: 'Invalid query',
  name: ReasonPhrases.BAD_REQUEST,
  statusCode: StatusCodes.BAD_REQUEST,
}

const handler: RequestHandler<NoReqParams, LocationDivinerQueryRequest, LocationDivinerQueryRequest> = (
  req,
  res,
  next
) => {
  const { sourceArchive, resultArchive, query } = req.body
  if (!validateArchiveConfig(sourceArchive)) next(sourceArchiveConfigError)
  if (!validateArchiveConfig(resultArchive)) next(resultArchiveConfigError)
  if (!validateQuery(query)) next(queryValidationError)
  next({ message: ReasonPhrases.NOT_IMPLEMENTED, statusCode: StatusCodes.NOT_IMPLEMENTED })
}

export const postLocationQuery = asyncHandler(handler)
