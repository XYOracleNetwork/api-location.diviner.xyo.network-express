import { getParentQuadkey } from './getParentQuadkey'
import { getQuadkeyAtZoomLevel } from './getQuadkeyAtZoomLevel'

export const getQuadkeysByParentAtZoomLevel = (heatmap: string[], zoom: number): Record<string, string[]> => {
  const quadkeysByParent = heatmap.reduce<Record<string, string[]>>((acc, curr) => {
    const quadkey = getQuadkeyAtZoomLevel(curr, zoom + 1)
    const parent = getParentQuadkey(quadkey)
    acc[parent] = acc[parent] || []
    acc[parent].push(quadkey)
    return acc
  }, {})
  return quadkeysByParent
}
