import { assertEx } from '@xylabs/sdk-js'

import { Zoom } from '../../model'
import { getZoomLevel } from './getZoomLevel'
import { quadkeyToTile } from './quadkeyToTile'
import { tileToQuadkey } from './tileToQuadkey'

export const decreaseZoom = (quadkey: string, zoom: Zoom): string => {
  const currentZoom = getZoomLevel(quadkey)
  assertEx(currentZoom >= zoom, 'Specified zoom is not possible based on current zoom level')
  if (currentZoom === zoom) return quadkey
  const tileWithZoom = quadkeyToTile(quadkey)
  tileWithZoom[2] = zoom
  // TODO: Calculate appropriate parent tile from this tile
  throw new Error('Not implemented')
}
