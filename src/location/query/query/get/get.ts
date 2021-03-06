import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { QueryQueue } from '../../../../lib'

export interface GetLocationQueryRequestParams {
  hash: string
}
export interface GetLocationQueryResponse {
  queryHash: string
  answerHash?: string
}

const invalidHashError = {
  message: 'Invalid hash',
  name: ReasonPhrases.BAD_REQUEST,
  statusCode: StatusCodes.BAD_REQUEST,
}

const queryDeQueuingError = {
  message: 'Error dequeuing query',
  name: ReasonPhrases.INTERNAL_SERVER_ERROR,
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}

const handler: RequestHandler<GetLocationQueryRequestParams, GetLocationQueryResponse> = (req, res, next) => {
  const hash = req.params?.hash
  if (!hash) {
    next(invalidHashError)
    return
  }
  const queue: QueryQueue = req.app.locals.queue
  if (!queue) {
    next(queryDeQueuingError)
    return
  }
  const answerHash = queue.get(hash)
  if (!answerHash) {
    res.json({ queryHash: hash })
    next()
    return
  }
  res.json({ answerHash, queryHash: hash })
  next()
}

// NOTE: Wrap in handler if ever async
// export const getLocationQuery = asyncHandler(handler)
export const getLocationQuery = handler
