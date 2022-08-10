import { Feature, GeoJsonProperties, Geometry } from 'geojson'

import { SupportedLocationWitnessPayloads } from '../../model'

export type ConvertLocationDataToGeoJsonGeometry<
  T extends SupportedLocationWitnessPayloads,
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties,
> = (data: T) => Feature<G, P>
