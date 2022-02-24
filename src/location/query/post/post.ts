import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { create } from 'lodash'

import { LocationDivinerQueryResult } from '.'
import { createLocationQuery } from './createLocationQuery'
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

const queryCreationError = {
  message: 'Error creating query',
  name: ReasonPhrases.INTERNAL_SERVER_ERROR,
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}

const handler: RequestHandler<NoReqParams, LocationDivinerQueryRequest, LocationDivinerQueryRequest> = async (
  req,
  res,
  next
) => {
  const { sourceArchive, resultArchive, query } = req.body
  if (!validateArchiveConfig(sourceArchive)) next(sourceArchiveConfigError)
  if (!validateArchiveConfig(resultArchive)) next(resultArchiveConfigError)
  if (!validateQuery(query)) next(queryValidationError)
  const hash = await createLocationQuery(req.body)
  if (hash) {
    const response: LocationDivinerQueryResult = { hash, status: 'pending', ...req.body }
    res.json(response)
    next()
  } else {
    next(queryCreationError)
  }
}

export const postLocationQuery = asyncHandler(handler)
