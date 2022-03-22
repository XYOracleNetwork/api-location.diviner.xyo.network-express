import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { LocationQueryCreationResponse, SupportedLocationQueryCreationRequest } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { QueryQueue } from '../../../lib'
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
  LocationQueryCreationResponse,
  SupportedLocationQueryCreationRequest
> = async (req, res, next) => {
  const { sourceArchivist, resultArchivist, query } = req.body
  if (!validateArchiveConfig(sourceArchivist)) {
    next(sourceArchiveConfigError)
    return
  }
  if (!validateArchiveConfig(resultArchivist)) {
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
  const response: LocationQueryCreationResponse = { hash, ...req.body }
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
