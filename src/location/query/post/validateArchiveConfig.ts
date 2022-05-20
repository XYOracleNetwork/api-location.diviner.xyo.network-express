import { XyoApiConfig } from '@xyo-network/api'

export const validateArchiveConfig = (config: XyoApiConfig, archive: string) => {
  if (!config) {
    return false
  }
  if (!config.apiDomain) {
    return false
  }
  if (!archive) {
    return false
  }
  return true
}
