import { LocationHeatmapAnswerSchema, LocationQuadkeyHeatmapAnswerSchema, LocationTimeRangeAnswerSchema } from '@xyo-network/sdk-xyo-client-js'

import { LocationGeoJsonHeatmapAnswerSchema } from './LocationGeoJsonHeatmapQuerySchema'

// TODO: Move to SDK
export type LocationAnswerSchema = LocationTimeRangeAnswerSchema | LocationHeatmapAnswerSchema | LocationQuadkeyHeatmapAnswerSchema | LocationGeoJsonHeatmapAnswerSchema
