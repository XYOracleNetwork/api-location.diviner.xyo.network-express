import { assertEx } from '@xylabs/sdk-js'

import { MaxZoom, MinZoom, Zoom } from '../../model'

export const getZoomLevel = (quadkey: string): Zoom => {
  const zoom = quadkey.length
  assertEx(zoom >= MinZoom && zoom <= MaxZoom, `Specified zoom (${quadkey}:${zoom}) is outside allowable bounds`)
  return zoom as Zoom
}
