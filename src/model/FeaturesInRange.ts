import { XyoArchivistApi } from '@xyo-network/sdk-xyo-client-js'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'

export type FeaturesInRange<G extends Geometry | null = Geometry, P = GeoJsonProperties> = (
  api: XyoArchivistApi,
  startTime: number,
  stopTime: number
) => Promise<Feature<G, P>[]>
