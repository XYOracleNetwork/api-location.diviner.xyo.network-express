import { LocationQuerySchema as SdkLocationQuerySchema } from '@xyo-network/sdk-xyo-client-js'

import { LocationGeoJsonHeatmapQuerySchema } from './LocationGeoJsonHeatmapQuerySchema'

// TODO: Delete once LocationGeoJsonHeatmapQuerySchema is moved to SDK
export type LocationQuerySchema = SdkLocationQuerySchema | LocationGeoJsonHeatmapQuerySchema
