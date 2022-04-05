import { FeatureCollection, Point } from 'geojson'

import { QuadkeyWithDensity, WithHashProperties, Zoom } from '../../../model'
import {
  featureToQuadkey,
  getQuadkeyAtZoomLevel,
  getQuadkeysByParent,
  getQuadkeysByParentAtZoomLevel,
  getZoomLevel,
} from '../../Quadkey'

const minLocationsPerTile = 2
const minHeatmapZoom: Zoom = 9
const maxHeatmapZoom: Zoom = 12
const densityMultiplier = 1 / (minLocationsPerTile * maxHeatmapZoom)

// NOTE: Can we use numbers instead of strings for performance
const rollup = (quadkeys: string[], zoom: Zoom): string[] => {
  const locations = quadkeys.length
  if (zoom >= maxHeatmapZoom - 1 || locations < minLocationsPerTile) {
    // Base case, stop recursing
    // Convert keys to this zoom level (this is lossy and
    // that's what we want)
    return quadkeys.map((q) => getQuadkeyAtZoomLevel(q, zoom))
  } else {
    // Recursive case
    const nextZoom = (zoom + 1) as Zoom
    // Group by parent tile
    const quadkeysByParent = getQuadkeysByParentAtZoomLevel(quadkeys, zoom)
    // Rollup all the quadkeys at the next zoom level
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
    .map<string>((p) => featureToQuadkey(p, maxHeatmapZoom))
  // Rollup quadkeys to an array starting at the minium zoom
  const heatmap = rollup(quadkeys, minHeatmapZoom)
  const quadkeysByParent = getQuadkeysByParent(heatmap)
  const quadkeysWithDensity = Object.keys(quadkeysByParent).map<QuadkeyWithDensity>((parent) => {
    const parentZoom = getZoomLevel(parent)
    return {
      // Normalize density to zoom level so that same number of points
      // at higher zoom is a higher density
      density: quadkeysByParent[parent].length * parentZoom * densityMultiplier,
      quadkey: parent,
    }
  })
  const maxCount = Math.max(...quadkeysWithDensity.map((q) => q.density))
  const quadkeysWithNormalizedDensity = quadkeysWithDensity.map((q) => {
    return {
      density: q.density / maxCount,
      quadkey: q.quadkey,
    }
  })
  return quadkeysWithNormalizedDensity
}
