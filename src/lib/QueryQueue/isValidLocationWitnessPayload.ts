import { LocationWitnessPayload } from '../../model'

export const isValidLocationWitnessPayload = (payload: LocationWitnessPayload): boolean => {
  if (!payload?.currentLocation?.coords?.longitude) return false
  if (!payload?.currentLocation?.coords?.latitude) return false
  return true
}