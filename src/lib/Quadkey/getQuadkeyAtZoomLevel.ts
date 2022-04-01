import { Zoom } from '../../model'

export const getQuadkeyAtZoomLevel = (quadkey: string, zoom: Zoom): string => {
  return quadkey.substring(0, zoom).padEnd(zoom, '0')
}
