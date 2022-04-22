import { FeatureCollection, Point } from 'geojson'

import { QuadkeyWithDensity, WithHashProperties, Zoom } from '../../../model'
import { featureToQuadkey, getQuadkeyAtZoomLevel, getQuadkeysByParent, getQuadkeysByParentAtZoomLevel } from '../../Quadkey'

/**
 * The number of location results within a quadkey at which
 * to stop decomposing into smaller quadkeys at higher zoom levels
 */
const minLocationsPerQuadkey = 2

/**
 * The minimum zoom to use when calculating quadkeys for the
 * heatmap
 */
const minHeatmapZoom: Zoom = 11

/**
 * The maximum zoom to use when calculating quadkeys for the
 * heatmap
 */
const maxHeatmapZoom: Zoom = 11

/**
 * Multiplier to ensure that density is higher for the same number of
 * counts at a higher zoom level. Since physical density is calculated
 * as count per unit area, we attempt to maintain that principle by
 * using zoom as the "area" since a higher zoom directly corresponds
 * to a smaller area and vice versa
 */
// const densityZoomMultiplier = 1 / (maxHeatmapZoom - 1)

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

export const getQuadkeyHeatmapFromPoints = (points: FeatureCollection<Point, WithHashProperties>): QuadkeyWithDensity[] => {
  const quadkeys = points.features
    // Calculate each point at max allowable zoom level
    .map<string>((p) => featureToQuadkey(p, maxHeatmapZoom))
  // Rollup quadkeys to an array starting at the minium zoom
  const heatmap = rollup(quadkeys, minHeatmapZoom)
  const quadkeysByParent = getQuadkeysByParent(heatmap)
  const quadkeysWithDensity = Object.keys(quadkeysByParent).map<QuadkeyWithDensity>((parent) => {
    // const parentZoom = getZoomLevel(parent)
    return {
      // Normalize density to zoom level so that same number of points
      // at higher zoom is a higher density
      // density: quadkeysByParent[parent].length * parentZoom * densityZoomMultiplier,
      density: quadkeysByParent[parent].length,
      quadkey: parent,
    }
  })
  // Find the maximum density across all results
  // const densities = quadkeysWithDensity.map((q) => q.density)
  // const minDensity = Math.min(...densities)
  // const maxDensity = Math.max(...densities)
  // const [, median, standardDeviation] = calculateDistribution(densities)
  // const roundedMedian = Math.max(Math.round(median), 2)
  // const roundedStandardDeviation = Math.round(standardDeviation)
  // const lowerBound = Math.round(Math.max(roundedMedian - roundedStandardDeviation, 1))
  // const upperBound = Math.max(Math.abs(Math.round(roundedMedian - lowerBound)) + roundedMedian, 3)

  // Scale the range of all the quadkey densities to ensure that the
  // resultant density is always always in the range [0.0, 1.0]
  return (
    quadkeysWithDensity
      // .map((q) => {
      //   const clampedDensity = clamp(q.density, lowerBound, upperBound)
      //   const scaledDensity = range(lowerBound, upperBound, 0.1, 0.9, clampedDensity)
      //   return {
      //     density: scaledDensity,
      //     quadkey: q.quadkey,
      //   }
      // })
      .sort((a, b) => b.density - a.density)
  )
}

// const calculateDistribution = (densities: number[]): [number, number, number] => {
//   const count = densities.length
//   if (!count) {
//     return [0, 0, 0]
//   }
//   const sum = densities.reduce((acc, n) => acc + n, 0)
//   const mean = sum / count
//   const variance = densities.reduce((acc, n) => (acc += (n - mean) * (n - mean)), 0) / count
//   const standardDeviation = Math.sqrt(variance)
//   const sortedDensities = densities.sort((a, b) => a - b)
//   const median = sortedDensities[Math.floor(count / 2)]
//   return [mean, median, standardDeviation]
// }

// const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a
// const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x))
// const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a))
// const range = (x1: number, y1: number, x2: number, y2: number, a: number) => lerp(x2, y2, invlerp(x1, y1, a))
