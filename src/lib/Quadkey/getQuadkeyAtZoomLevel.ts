export const getQuadkeyAtZoomLevel = (quadkey: string, zoom: number): string => {
  return quadkey.substring(0, zoom).padEnd(zoom, '0')
}
