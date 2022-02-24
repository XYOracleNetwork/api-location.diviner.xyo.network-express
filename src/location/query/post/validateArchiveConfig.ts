import { ArchiveConfig } from './postLocationQuerySchema'

export const validateArchiveConfig = (config?: ArchiveConfig) => {
  if (!config) {
    return false
  }
  if (!config.apiDomain) {
    return false
  }
  if (!config.apiKey) {
    return false
  }
  return true
}
