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

export type LocationGeoJsonHeatmapQuerySchema = 'network.xyo.location.heatmap.geojson.query'
export const locationGeoJsonHeatmapQuerySchema: LocationGeoJsonHeatmapQuerySchema =
  'network.xyo.location.heatmap.geojson.query'
export type LocationGeoJsonHeatmapAnswerSchema = 'network.xyo.location.heatmap.geojson.answer'
export const locationGeoJsonHeatmapAnswerSchema: LocationGeoJsonHeatmapAnswerSchema =
  'network.xyo.location.heatmap.geojson.answer'
export type LocationGeoJsonHeatmapQuery = {
  startTime?: string
  stopTime?: string
  schema: LocationWitnessPayloadSchema
}
