import { LocationHeatmapQuerySchema } from './LocationHeatmapQuerySchema'
import { LocationRangeQuerySchema } from './LocationRangeQuerySchema'
import { LocationWitnessPayloadSchema } from './LocationWitnessPayload'

export type LocationQuerySchema =
  | LocationHeatmapQuerySchema
  | LocationRangeQuerySchema
  // TODO: Remove after client migrates to using new format specifying request query schema not source schema
  | LocationWitnessPayloadSchema
