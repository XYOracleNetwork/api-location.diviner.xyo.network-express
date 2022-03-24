import { CurrentLocationWitnessPayload } from '../../model'
import { PayloadValidator } from './PayloadValidator'

export const isValidCurrentLocationWitnessPayload: PayloadValidator<CurrentLocationWitnessPayload> = (payload) => {
  if (!payload?.longitude) return false
  if (!payload?.latitude) return false
  return true
}
