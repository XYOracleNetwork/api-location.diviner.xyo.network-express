import { FeatureCollection, Point } from 'geojson'

import { MaxZoom, MinZoom, QuadkeyWithDensity, WithHashProperties } from '../../../model'
import { featureToQuadkey, getParentQuadkey } from '../../Quadkey'

const minDensity = 2
const maxAllowableZoom = MaxZoom

type QuadkeyHeatmapTilesByParent = Record<string, string[]>

const getQuadkeysByParent = (heatmap: string[]): QuadkeyHeatmapTilesByParent => {
  const quadkeysByParent = heatmap.reduce<QuadkeyHeatmapTilesByParent>((acc, curr) => {
    const parent = getParentQuadkey(curr)
    acc[parent] = acc[parent] || []
    acc[parent].push(curr)
    return acc
  }, {})
  return quadkeysByParent
}

// TODO: Rollup to zoom
const getQuadkeysByParentAtZoomLevel = (heatmap: string[], zoom: number): QuadkeyHeatmapTilesByParent => {
  const quadkeysByParent = heatmap.reduce<QuadkeyHeatmapTilesByParent>((acc, curr) => {
    const quadkey = getQuadkeyAtZoomLevel(curr, zoom)
    const parent = getParentQuadkey(quadkey)
    acc[parent] = acc[parent] || []
    acc[parent].push(quadkey)
    return acc
  }, {})
  return quadkeysByParent
}

const getQuadkeyAtZoomLevel = (quadkey: string, zoom: number): string => {
  return quadkey.substring(0, zoom).padEnd(zoom, '0')
}

// NOTE: Can we use numbers instead of strings for performance
const rollup = (quadkeys: string[], zoom: number): string[] => {
  const density = quadkeys.length
  if (zoom >= maxAllowableZoom || density < minDensity) {
    // Base case, stop recursing
    // Convert keys to this zoom level (this is lossy and
    // that's what we want)
    return quadkeys.map((q) => getQuadkeyAtZoomLevel(q, zoom))
  } else {
    // Recursive case
    const nextZoom = zoom + 1
    // Group by tile and calculate density here
    const quadkeysByParent = getQuadkeysByParentAtZoomLevel(quadkeys, nextZoom)
    return Object.keys(quadkeysByParent)
      .map((q) => rollup(quadkeysByParent[q], nextZoom))
      .flatMap((q) => q)
  }
}

export const getQuadkeyHeatmapFromPoints = (
  points: FeatureCollection<Point, WithHashProperties>
): QuadkeyWithDensity[] => {
  const quadkeys = points.features
    // Calculate each point at max allowable zoom level
    .map<string>((p) => featureToQuadkey(p, maxAllowableZoom))
  // Rollup to a heatmap
  const heatmap = rollup(quadkeys, MinZoom)
  const quadkeysByParent = getQuadkeysByParent(heatmap)
  return Object.keys(quadkeysByParent).map<QuadkeyWithDensity>((quadkey) => {
    return {
      density: quadkeysByParent[quadkey].length,
      quadkey: quadkey,
    }
  })
}
