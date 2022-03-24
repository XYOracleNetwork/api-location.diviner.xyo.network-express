import { FeatureCollection, Point } from 'geojson'

import { WithHashProperties, Zoom } from '../../../model'
import { featureToQuadkey } from '../../Quadkey'

const maxDensity = 0.25

export interface QuadkeyHeatmapTile {
  quadkey: string
  density: number
}

export const getQuadkeyHeatmapFromPoints = (
  points: FeatureCollection<Point, WithHashProperties>,
  zoom: Zoom = 10
): Array<QuadkeyHeatmapTile> => {
  return points.features.map((p) => {
    return {
      density: 1,
      quadkey: featureToQuadkey(p, zoom),
    }
  })
}
