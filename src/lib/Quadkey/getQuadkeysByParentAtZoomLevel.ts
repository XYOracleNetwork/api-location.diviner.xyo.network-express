import { assertEx } from '@xylabs/sdk-js'

import { MaxZoom, MinZoom, Zoom } from '../../model'
import { getQuadkeyAtZoomLevel } from './getQuadkeyAtZoomLevel'

export const getQuadkeysByParentAtZoomLevel = (heatmap: string[], zoom: Zoom): Record<string, string[]> => {
  assertEx(zoom > MinZoom && zoom < MaxZoom, `Zoom supplied to getQuadkeysByParentAtZoomLevel (${zoom}) outside valid range`)
  const quadkeysByParent = heatmap.reduce<Record<string, string[]>>((acc, curr) => {
    const parent = getQuadkeyAtZoomLevel(curr, zoom)
    acc[parent] = acc[parent] || []
    acc[parent].push(curr)
    return acc
  }, {})
  return quadkeysByParent
}
