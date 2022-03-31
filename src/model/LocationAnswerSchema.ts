import {
  LocationHeatmapAnswerSchema,
  LocationQuadkeyHeatmapAnswerSchema,
  LocationTimeRangeAnswerSchema,
} from '@xyo-network/sdk-xyo-client-js'

// TODO: Move to SDK
export type LocationAnswerSchema =
  | LocationTimeRangeAnswerSchema
  | LocationHeatmapAnswerSchema
  | LocationQuadkeyHeatmapAnswerSchema
