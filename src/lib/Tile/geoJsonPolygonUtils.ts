import { Point, Polygon } from 'geojson'

export const getUpperLeft = (box: Polygon): Point => {
  return {
    coordinates: box.coordinates[0][0],
    type: 'Point',
  }
}

export const getLowerRight = (box: Polygon): Point => {
  return {
    coordinates: box.coordinates[0][0],
    type: 'Point',
  }
}
