import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { isSupportedLocationQuerySchema, LocationQueryCreationResponse, SupportedLocationQueryCreationRequest, XyoAccount } from '@xyo-network/sdk-xyo-client-js'
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

const requestSchemaError = {
  message: 'Invalid request schema',
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

const handler: RequestHandler<NoReqParams, LocationQueryCreationResponse, SupportedLocationQueryCreationRequest> = async (req, res, next) => {
  const { sourceArchivist, sourceArchive, resultArchivist, resultArchive, query, schema } = req.body
  if (!isSupportedLocationQuerySchema(schema)) {
    next(requestSchemaError)
    return
  }
  if (!validateArchiveConfig(sourceArchivist, sourceArchive)) {
    next(sourceArchiveConfigError)
    return
  }
  if (!validateArchiveConfig(resultArchivist, resultArchive)) {
    next(resultArchiveConfigError)
    return
  }
  if (!validateQuery(query)) {
    next(queryValidationError)
    return
  }
  const account = XyoAccount.random()
  const hash = await createLocationQuery(req.body, account)
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
  queue.enqueue(hash, response, account)
  res.json(response)
  next()
}

export const postLocationQuery = asyncHandler(handler)
