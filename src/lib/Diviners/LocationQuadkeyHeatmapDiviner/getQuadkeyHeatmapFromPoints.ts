import { FeatureCollection, Point } from 'geojson'

import { QuadkeyWithDensity, WithHashProperties, Zoom } from '../../../model'
import {
  featureToQuadkey,
  getQuadkeyAtZoomLevel,
  getQuadkeysByParent,
  getQuadkeysByParentAtZoomLevel,
  getZoomLevel,
} from '../../Quadkey'

/**
 * The number of location results within a quadkey at which
 * to stop decomposing into smaller quadkeys at higher zoom levels
 */
const minLocationsPerQuadkey = 2

/**
 * The minimum zoom to use when calculating quadkeys for the
 * heatmap
 */
const minHeatmapZoom: Zoom = 9

/**
 * The maximum zoom to use when calculating quadkeys for the
 * heatmap
 */
const maxHeatmapZoom: Zoom = 12

/**
 * Multiplier to ensure that density is higher for the same number of
 * counts at a higher zoom level. Since physical density is calculated
 * as count per unit area, we attempt to maintain that principle by
 * using zoom as the "area" since a higher zoom directly corresponds
 * to a smaller area and vice versa
 */
const densityZoomMultiplier = 1 / (minLocationsPerQuadkey * maxHeatmapZoom)

/**
 * Recursively decompose an array of quadkeys into a heatmap based on
 * the min/max zoom levels and minimum number of locations per quadkey
 * @param quadkeys An array of quadkeys
 * @param zoom The zoom at which to
 * @returns
 */
const rollup = (quadkeys: string[], zoom: Zoom): string[] => {
  const locations = quadkeys.length
  if (zoom >= maxHeatmapZoom - 1 || locations < minLocationsPerQuadkey) {
    // Base case, stop recursing
    // Convert keys to this zoom level (this is lossy and
    // that's what we want)
    return quadkeys.map((q) => getQuadkeyAtZoomLevel(q, zoom))
  } else {
    // Recursive case
    const nextZoom = (zoom + 1) as Zoom
    // Group by parent quadkey
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
      density: quadkeysByParent[parent].length * parentZoom * densityZoomMultiplier,
      quadkey: parent,
    }
  })
  // Find the maximum density across all results
  const maxDensity = Math.max(...quadkeysWithDensity.map((q) => q.density))

  // Using the max density, shift the range of all the quadkey densities to
  // ensure that the resultant density is always always in the range [0.0, 1.0]
  return quadkeysWithDensity.map((q) => {
    return {
      density: q.density / maxDensity,
      quadkey: q.quadkey,
    }
  })
}
