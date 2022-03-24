import { Point } from 'geojson'

import { Zoom } from '../../model'
import { pointToTile } from './pointToTile'
import { tileToQuadkey } from './tileToQuadkey'

export const pointToQuadkey = (point: Point, z: Zoom): string => {
  const [x, y] = pointToTile(point, z)
  return tileToQuadkey([x, y, z])
}
