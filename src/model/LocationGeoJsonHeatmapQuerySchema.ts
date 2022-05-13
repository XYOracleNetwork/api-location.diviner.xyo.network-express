import { LocationWitnessPayloadSchema } from '@xyo-network/sdk-xyo-client-js'

// TODO: Move to SDK
// TODO: Retype default heatmap query to use this schema as it's more explicit
// about the return format
export type LocationGeoJsonHeatmapQuerySchema = 'network.xyo.location.heatmap.geojson.query'
export const locationGeoJsonHeatmapQuerySchema: LocationGeoJsonHeatmapQuerySchema = 'network.xyo.location.heatmap.geojson.query'
export type LocationGeoJsonHeatmapAnswerSchema = 'network.xyo.location.heatmap.geojson.answer'
export const locationGeoJsonHeatmapAnswerSchema: LocationGeoJsonHeatmapAnswerSchema = 'network.xyo.location.heatmap.geojson.answer'
export type LocationGeoJsonHeatmapQuery = {
  startTime?: string
  stopTime?: string
  schema: LocationWitnessPayloadSchema
}
