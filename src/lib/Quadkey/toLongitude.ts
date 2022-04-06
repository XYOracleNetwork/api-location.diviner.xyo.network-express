export const toLongitude = (x: number, z: number): number => {
  return (x / Math.pow(2, z)) * 360 - 180
}
