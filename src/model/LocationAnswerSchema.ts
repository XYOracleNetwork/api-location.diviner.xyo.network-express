import { LocationHeatmapAnswerSchema, LocationQuadkeyHeatmapAnswerSchema, LocationTimeRangeAnswerSchema } from '@xyo-network/api'

import { LocationGeoJsonHeatmapAnswerSchema } from './LocationGeoJsonHeatmapQuerySchema'

// TODO: Move to SDK
export type LocationAnswerSchema = LocationTimeRangeAnswerSchema | LocationHeatmapAnswerSchema | LocationQuadkeyHeatmapAnswerSchema | LocationGeoJsonHeatmapAnswerSchema
