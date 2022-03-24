import { WithOptionalTimestamp, WithTimestamp } from '../../model'

export const isWithTimestamp = <T extends WithOptionalTimestamp>(block: T): block is T & WithTimestamp => {
  return !!block._timestamp
}
