import { r2d } from './constants'

export const toLatitude = (y: number, z: number): number => {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z)
  return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
}
