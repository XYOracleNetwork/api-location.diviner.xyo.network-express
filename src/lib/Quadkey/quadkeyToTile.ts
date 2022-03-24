export const quadkeyToTile = (quadkey: string) => {
  let x = 0
  let y = 0
  const z = quadkey.length

  for (let i = z; i > 0; i--) {
    const mask = 1 << (i - 1)
    const q = +quadkey[z - i]
    if (q === 1) x |= mask
    if (q === 2) y |= mask
    if (q === 3) {
      x |= mask
      y |= mask
    }
  }
  return [x, y, z]
}
