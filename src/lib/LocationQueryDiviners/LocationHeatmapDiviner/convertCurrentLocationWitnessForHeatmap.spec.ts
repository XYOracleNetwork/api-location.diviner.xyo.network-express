import { currentLocationWitnessSample } from '../../../test'
import { convertCurrentLocationWitnessForHeatmap } from './convertCurrentLocationWitnessForHeatmap'
describe('convertCurrentLocationWitnessForHeatmap', () => {
  it('converts data formatted according to the schema into a GeoJson Point', () => {
    const payload = currentLocationWitnessSample
    const actual = convertCurrentLocationWitnessForHeatmap(payload)
    expect(actual?.type).toBe('Feature')
    expect(actual?.geometry?.type).toBe('Point')
    expect(Array.isArray(actual?.geometry?.coordinates)).toBeTruthy()
    expect(actual?.geometry?.coordinates?.length).toBe(2)
  })
})
