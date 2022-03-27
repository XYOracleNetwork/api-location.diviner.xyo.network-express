import { Zoom } from '../../model'
import { decreaseZoom } from './decreaseZoom'
import { getZoomLevel } from './getZoomLevel'

export const decrementZoom = (quadkey: string): string => {
  const currentZoom = getZoomLevel(quadkey)
  const desiredZoom = (currentZoom - 1) as Zoom
  return decreaseZoom(quadkey, desiredZoom)
}
