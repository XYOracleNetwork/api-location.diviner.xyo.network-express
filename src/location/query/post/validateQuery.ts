import { LocationDivinerQuery } from '@xyo-network/sdk-xyo-client-js'

import { isSupportedLocationQuerySchema } from '../../../model'

const validateDate = (date: Date) => {
  return date instanceof Date && !isNaN(date.valueOf())
}

export const validateQuery = (query: LocationDivinerQuery) => {
  const schema = query.schema
  if (!schema || !isSupportedLocationQuerySchema(schema)) {
    return false
  }
  const startTime = new Date(query.startTime || '')
  if (!validateDate(startTime)) {
    return false
  }
  const stopTime = new Date(query.stopTime || '')
  if (!validateDate(stopTime)) {
    return false
  }
  return true
}
