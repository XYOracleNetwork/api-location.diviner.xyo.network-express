import { assertEx } from '@xylabs/sdk-js'

import { MinZoom } from '../../model'
import { getZoomLevel } from './getZoomLevel'

export const decrementZoom = (quadkey: string): string => {
  const currentZoom = getZoomLevel(quadkey)
  assertEx(currentZoom > MinZoom, 'Specified zoom is not possible based on current zoom level')
  return quadkey.substring(0, quadkey.length - 1)
}
