import { LocationWitnessPayload } from '@xyo-network/sdk-xyo-client-js'

import { currentLocationWitnessSample } from '../../../test'
import { convertLocationWitnessPayloadToPoint } from './convertCurrentLocationWitnessPayloadToPoint'
describe('convertLocationWitnessPayloadToPoint', () => {
  it('converts data formatted according to the schema into a GeoJson Point', () => {
    const payload = currentLocationWitnessSample
    const actual = convertLocationWitnessPayloadToPoint(payload)
    expect(actual?.type).toBe('Point')
    expect(Array.isArray(actual?.coordinates)).toBeTruthy()
    expect(actual?.coordinates?.length).toBe(2)
  })
})
