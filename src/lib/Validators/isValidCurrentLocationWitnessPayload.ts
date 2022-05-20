import { CurrentLocationWitnessPayload } from '@xyo-network/api'

import { PayloadValidator } from './PayloadValidator'

export const isValidCurrentLocationWitnessPayload: PayloadValidator<CurrentLocationWitnessPayload> = (payload) => {
  if (!payload?.longitude) return false
  if (!payload?.latitude) return false
  return true
}
