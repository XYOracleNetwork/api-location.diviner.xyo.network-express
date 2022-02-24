import { XyoArchivistApiConfig } from '@xyo-network/sdk-xyo-client-js'

export const validateArchiveConfig = (config?: XyoArchivistApiConfig) => {
  if (!config) {
    return false
  }
  if (!config.apiDomain) {
    return false
  }
  return true
}
