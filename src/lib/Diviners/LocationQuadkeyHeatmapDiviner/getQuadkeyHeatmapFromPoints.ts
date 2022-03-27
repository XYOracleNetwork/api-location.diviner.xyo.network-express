import { FeatureCollection, Point } from 'geojson'

import { MaxZoom, MinZoom, WithHashProperties } from '../../../model'
import { featureToQuadkey, getParentQuadkey } from '../../Quadkey'

const maxDensity = 0.25
const maxAllowableZoom = MaxZoom

export interface QuadkeyHeatmapTile {
  quadkey: string
  density: number
}

const reduceZoom = (heatmap: QuadkeyHeatmapTile[]): QuadkeyHeatmapTile[] => {
  // TODO: By max density
  return heatmap.map((tile) => {
    return {
      density: tile.density,
      quadkey: getParentQuadkey(tile.quadkey),
    }
  })
}

// TODO: Aggregate sparse tiles using density by tree walking
// from bottom up (with backtrack) to decrease until desired density
const combineDuplicates = (heatmap: QuadkeyHeatmapTile[]): QuadkeyHeatmapTile[] => {
  const densityByQuadkey: Record<string, number> = {}
  for (let p = 0; p < heatmap.length; p++) {
    const point = heatmap[p]
    densityByQuadkey[point.quadkey] = densityByQuadkey[point.quadkey]
      ? densityByQuadkey[point.quadkey] + 1
      : point.density
  }
  return Object.keys(densityByQuadkey).map((quadkey) => {
    return { density: densityByQuadkey[quadkey], quadkey }
  })
}

// TODO: Look ahead and determine if we should combine
const decreaseZoomAndCalculateDensity = (heatmap: QuadkeyHeatmapTile[]): QuadkeyHeatmapTile[] => {
  return combineDuplicates(reduceZoom(heatmap))
}

export const getQuadkeyHeatmapFromPoints = (
  points: FeatureCollection<Point, WithHashProperties>
): QuadkeyHeatmapTile[] => {
  let heatmap = points.features
    // Calculate each point at max allowable zoom level
    .map<QuadkeyHeatmapTile>((p) => {
      return {
        density: 1,
        quadkey: featureToQuadkey(p, maxAllowableZoom),
      }
    })

  for (let zoom = maxAllowableZoom; zoom > MinZoom; zoom--) {
    heatmap = decreaseZoomAndCalculateDensity(heatmap)
  }
  return heatmap
}
