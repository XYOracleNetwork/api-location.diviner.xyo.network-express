import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'

export const getFeatureCollection = <G extends Geometry | null = Geometry, P = GeoJsonProperties>(
  features: Feature<G, P>[],
): FeatureCollection<G, P> => {
  return {
    features: [...features],
    type: 'FeatureCollection',
  }
}
