import { LocationWitnessPayload } from '@xyo-network/api'

import { PayloadValidator } from './PayloadValidator'

export const isValidLocationWitnessPayload: PayloadValidator<LocationWitnessPayload> = (payload) => {
  if (!payload?.currentLocation?.coords?.longitude) return false
  if (!payload?.currentLocation?.coords?.latitude) return false
  return true
}
