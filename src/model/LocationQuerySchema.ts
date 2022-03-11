import { LocationHeatmapQuerySchema } from './LocationHeatmapQuerySchema'
import { LocationRangeQuerySchema } from './LocationRangeQuerySchema'
import { LocationWitnessPayloadSchema } from './LocationWitnessPayload'

export type LocationQuerySchema =
  | LocationHeatmapQuerySchema
  | LocationRangeQuerySchema
  // TODO: Remove after client migrates to using new format specifying request query schema not source schema
  | LocationWitnessPayloadSchema

const locationQuerySchemas: Record<LocationQuerySchema, true> = {
  'network.xyo.location': true,
  'network.xyo.location.heatmap.query': true,
  'network.xyo.location.range.query': true,
}

export const isSupportedLocationQuerySchema = (schema: string): boolean => {
  return locationQuerySchemas[schema as LocationQuerySchema] || false
}
