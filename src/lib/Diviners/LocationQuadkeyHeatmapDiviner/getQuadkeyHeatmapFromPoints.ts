import { FeatureCollection, Point } from 'geojson'

import { MaxZoom, MinZoom, QuadkeyWithDensity, WithHashProperties, Zoom } from '../../../model'
import {
  featureToQuadkey,
  getQuadkeyAtZoomLevel,
  getQuadkeysByParent,
  getQuadkeysByParentAtZoomLevel,
} from '../../Quadkey'

const minDensity = 2
const maxAllowableZoom = MaxZoom
const startingHeatmapZoom = (MinZoom + 1) as Zoom

// NOTE: Can we use numbers instead of strings for performance
const rollup = (quadkeys: string[], zoom: Zoom): string[] => {
  const density = quadkeys.length
  if (zoom >= maxAllowableZoom - 1 || density < minDensity) {
    // Base case, stop recursing
    // Convert keys to this zoom level (this is lossy and
    // that's what we want)
    return quadkeys.map((q) => getQuadkeyAtZoomLevel(q, zoom))
  } else {
    // Recursive case
    const nextZoom = (zoom + 1) as Zoom
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
  const heatmap = rollup(quadkeys, startingHeatmapZoom)
  const quadkeysByParent = getQuadkeysByParent(heatmap)
  return Object.keys(quadkeysByParent).map<QuadkeyWithDensity>((quadkey) => {
    return {
      density: quadkeysByParent[quadkey].length,
      quadkey: quadkey,
    }
  })
}
