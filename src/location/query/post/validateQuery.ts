import { LocationHeatmapQuery, LocationTimeRangeQuery } from '@xyo-network/sdk-xyo-client-js'

import { supportedLocationWitnessSchemasMap } from '../../../model'

const validateDate = (date: Date) => {
  return date instanceof Date && !isNaN(date.valueOf())
}

export const validateQuery = (query: LocationTimeRangeQuery | LocationHeatmapQuery) => {
  const schema = query.schema
  if (!schema || !supportedLocationWitnessSchemasMap[schema]) {
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
