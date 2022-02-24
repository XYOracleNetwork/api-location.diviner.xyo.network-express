import { LocationDivinerQuery } from '../../../model'

const validateDate = (date: Date) => {
  return date instanceof Date && !isNaN(date.valueOf())
}

export const validateQuery = (query: LocationDivinerQuery) => {
  if (!query.schema) {
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
