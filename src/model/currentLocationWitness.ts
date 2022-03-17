export type CurrentLocationWitnessSchema = 'co.coinapp.currentlocationwitness'

export interface CurrentLocationWitness {
  _archive: string
  _hash: string
  _timestamp: number
  altitudeMeters: number
  directionDegrees: number
  latitude: number
  longitude: number
  quadkey: string
  schema: CurrentLocationWitnessSchema
  speedKph: number
}
