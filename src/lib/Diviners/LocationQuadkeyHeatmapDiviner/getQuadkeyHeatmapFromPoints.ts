import { FeatureCollection, Point } from 'geojson'

import { MaxZoom, WithHashProperties } from '../../../model'
import { featureToQuadkey } from '../../Quadkey'

const maxDensity = 0.25
const maxAllowableZoom = MaxZoom

export interface QuadkeyHeatmapTile {
  quadkey: string
  density: number
}

export const getQuadkeyHeatmapFromPoints = (
  points: FeatureCollection<Point, WithHashProperties>
): QuadkeyHeatmapTile[] => {
  const densityByQuadkey = points.features
    // Calculate each point at max allowable zoom level
    .map((p) => {
      return {
        quadkey: featureToQuadkey(p, maxAllowableZoom),
      }
    })
    // Sort numerically (cast to numeric to fix string sort order)
    .sort((a, b) => +a - +b)
    // Combine duplicates to determine density
    .reduce<Record<string, number>>((prev, cur) => {
      prev[cur.quadkey] = (prev[cur.quadkey] || 0) + 1
      return prev
    }, {})
  // TODO: Aggregate sparse tiles using density by tree walking
  // from bottom up (with backtrack) to decrease until desired density
  // TODO: By max density
  return Object.keys(densityByQuadkey).map<QuadkeyHeatmapTile>((quadkey) => {
    return { density: densityByQuadkey[quadkey], quadkey }
  })
}
