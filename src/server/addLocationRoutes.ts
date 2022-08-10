import { Express } from 'express'

import { getLocationQuery, postLocationQuery } from '../location'

export const addLocationRoutes = (app: Express) => {
  app.post(
    '/location/query',
    postLocationQuery,
    /* #swagger.tags = ['Location'] */
    /* #swagger.summary = 'Issue a new location query' */
  )
  app.get(
    '/location/query/:hash',
    getLocationQuery,
    /* #swagger.tags = ['Location'] */
    /* #swagger.summary = 'Retrieve a previously issued location query' */
  )
}
