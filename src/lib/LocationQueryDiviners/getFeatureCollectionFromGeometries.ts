import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'

export const getFeatureCollectionFromGeometries = <G extends Geometry | null = Geometry, P = GeoJsonProperties>(
  points: Feature<G, P>[]
): FeatureCollection<G, P> => {
  return {
    features: [...points],
    type: 'FeatureCollection',
  }
}
