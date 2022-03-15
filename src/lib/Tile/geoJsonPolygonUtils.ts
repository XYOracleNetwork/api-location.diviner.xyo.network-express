import { Point, Polygon } from 'geojson'

export const getUpperLeft = (box: Polygon): Point => {
  // Find two left most points
  // Find higher of the two
  return {
    coordinates: box.coordinates[0][1],
    type: 'Point',
  }
}

export const getLowerRight = (box: Polygon): Point => {
  return {
    coordinates: box.coordinates[0][3],
    type: 'Point',
  }
}
