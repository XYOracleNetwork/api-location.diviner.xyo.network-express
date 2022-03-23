import { Feature, Point } from 'geojson'

import { Zoom } from '../../model'
import { pointToTile } from './pointToTile'
import { tileToQuadkey } from './tileToQuadkey'

export const featureToQuadkey = (point: Feature<Point>, z: Zoom): string => {
  const [x, y] = pointToTile(point.geometry, z)
  return tileToQuadkey([x, y, z])
}
