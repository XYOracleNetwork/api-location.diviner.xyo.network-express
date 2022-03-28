import { LocationWitnessPayloadSchema } from '@xyo-network/sdk-xyo-client-js'

// TODO: Move to SDK
export type LocationQuadkeyHeatmapQuerySchema = 'network.xyo.location.heatmap.quadkey.query'
export const locationQuadkeyHeatmapQuerySchema: LocationQuadkeyHeatmapQuerySchema =
  'network.xyo.location.heatmap.quadkey.query'
export type LocationQuadkeyHeatmapAnswerSchema = 'network.xyo.location.heatmap.quadkey.answer'
export const locationQuadkeyHeatmapAnswerSchema: LocationQuadkeyHeatmapAnswerSchema =
  'network.xyo.location.heatmap.quadkey.answer'
export type LocationQuadkeyHeatmapQuery = {
  startTime?: string
  stopTime?: string
  schema: LocationWitnessPayloadSchema
}

export type LocationGeojsonHeatmapQuerySchema = 'network.xyo.location.heatmap.geojson.query'
export const locationGeojsonHeatmapQuerySchema: LocationGeojsonHeatmapQuerySchema =
  'network.xyo.location.heatmap.geojson.query'
export type LocationGeojsonHeatmapAnswerSchema = 'network.xyo.location.heatmap.geojson.answer'
export const locationGeojsonHeatmapAnswerSchema: LocationGeojsonHeatmapAnswerSchema =
  'network.xyo.location.heatmap.geojson.answer'
export type LocationGeojsonHeatmapQuery = {
  startTime?: string
  stopTime?: string
  schema: LocationWitnessPayloadSchema
}
