import { CurrentLocationWitnessPayload } from '../../model'

export const isValidCurrentLocationWitnessPayload = (payload: CurrentLocationWitnessPayload): boolean => {
  if (!payload?.longitude) return false
  if (!payload?.latitude) return false
  return true
}
