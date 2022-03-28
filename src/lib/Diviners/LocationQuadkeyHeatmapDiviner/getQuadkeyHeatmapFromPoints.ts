import { FeatureCollection, Point } from 'geojson'

import { MaxZoom, MinZoom, WithHashProperties } from '../../../model'
import { featureToQuadkey, getParentQuadkey, getZoomLevel } from '../../Quadkey'

const minDensity = 2
const maxAllowableZoom = MaxZoom

// TODO: Make SDK type
export interface QuadkeyHeatmapTile {
  quadkey: string
  density: number
}

type QuadkeyHeatmapTilesByParent = Record<string, string[]>

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

const getQuadkeysByParent = (heatmap: string[]): QuadkeyHeatmapTilesByParent => {
  const quadkeysByParent = heatmap.reduce<QuadkeyHeatmapTilesByParent>((acc, curr) => {
    const parent = getParentQuadkey(curr)
    acc[parent] = acc[parent] || []
    acc[parent].push(curr)
    return acc
  }, {})
  return quadkeysByParent
}

const rollup = (heatmap: string[]): string[] => {
  const quadkeysByParent = getQuadkeysByParent(heatmap)
  const ret: string[] = []
  for (const parent in quadkeysByParent) {
    const quadkeys = quadkeysByParent[parent]
    if (quadkeys.length < minDensity && getZoomLevel(parent) > MinZoom) {
      // Take all the points and promote them to the parent
      ret.push(...Array(quadkeys.length).fill(parent))
    } else {
      ret.push(...quadkeys)
    }
  }
  return ret
}

export const getQuadkeyHeatmapFromPoints = (
  points: FeatureCollection<Point, WithHashProperties>
): QuadkeyHeatmapTile[] => {
  let quadkeys = points.features
    // Calculate each point at max allowable zoom level
    .map<string>((p) => featureToQuadkey(p, maxAllowableZoom))

  for (let zoom = maxAllowableZoom; zoom > MinZoom - 1; zoom--) {
    quadkeys = rollup(quadkeys)
  }
  const quadkeysByParent = getQuadkeysByParent(quadkeys)
  return Object.keys(quadkeysByParent).map<QuadkeyHeatmapTile>((quadkey) => {
    return {
      density: quadkeysByParent[quadkey].length,
      quadkey: quadkey,
    }
  })
}
