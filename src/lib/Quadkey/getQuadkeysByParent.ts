import { getParentQuadkey } from './getParentQuadkey'

export const getQuadkeysByParent = (heatmap: string[]): Record<string, string[]> => {
  const quadkeysByParent = heatmap.reduce<Record<string, string[]>>((acc, curr) => {
    const parent = getParentQuadkey(curr)
    acc[parent] = acc[parent] || []
    acc[parent].push(curr)
    return acc
  }, {})
  return quadkeysByParent
}
