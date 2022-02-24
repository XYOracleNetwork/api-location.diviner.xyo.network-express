import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { QueryQueue } from '../../../lib'
import { LocationDivinerQueryCreationRequest, LocationDivinerQueryCreationResponse } from '../../../model'
import { createLocationQuery } from './createLocationQuery'
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

const queryQueuingError = {
  message: 'Error queuing query',
  name: ReasonPhrases.INTERNAL_SERVER_ERROR,
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}

const handler: RequestHandler<
  NoReqParams,
  LocationDivinerQueryCreationResponse,
  LocationDivinerQueryCreationRequest
> = async (req, res, next) => {
  const { sourceArchive, resultArchive, query } = req.body
  if (!validateArchiveConfig(sourceArchive)) {
    next(sourceArchiveConfigError)
    return
  }
  if (!validateArchiveConfig(resultArchive)) {
    next(resultArchiveConfigError)
    return
  }
  if (!validateQuery(query)) {
    next(queryValidationError)
    return
  }
  const hash = await createLocationQuery(req.body)
  if (!hash) {
    next(queryCreationError)
    return
  }
  const response: LocationDivinerQueryCreationResponse = { hash, status: 'pending', ...req.body }
  const queue: QueryQueue = req.app.locals.queue
  if (!queue) {
    next(queryQueuingError)
    return
  }
  queue.enqueue(hash, response)
  res.json(response)
  next()
}

export const postLocationQuery = asyncHandler(handler)
