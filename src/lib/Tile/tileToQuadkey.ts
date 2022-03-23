import { CoordinatesWithZoom } from '../../model'

const tileToQuadkey = (tile: CoordinatesWithZoom): string => {
  let index = ''
  for (let z = tile[2]; z > 0; z--) {
    let b = 0
    const mask = 1 << (z - 1)
    if ((tile[0] & mask) !== 0) b++
    if ((tile[1] & mask) !== 0) b += 2
    index += b.toString()
  }
  return index
}

export { tileToQuadkey as coordinatesToQuadkey }
