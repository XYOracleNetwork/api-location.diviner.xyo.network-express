import { FeatureCollection, Point } from 'geojson'

import { MinZoom, WithHashProperties, Zoom } from '../../../model'
import { featureToQuadkey } from '../../Quadkey'

const maxDensity = 0.25

export interface QuadkeyHeatmapTile {
  quadkey: string
  density: number
}

export const getQuadkeyHeatmapFromPoints = (
  points: FeatureCollection<Point, WithHashProperties>,
  minZoom: Zoom = MinZoom
): Array<QuadkeyHeatmapTile> => {
  const quadkeys = points.features.map((p) => {
    return {
      density: 1,
      quadkey: featureToQuadkey(p, minZoom),
    }
  })
  // TODO: Aggregate sparse tiles using density
  return quadkeys
}
