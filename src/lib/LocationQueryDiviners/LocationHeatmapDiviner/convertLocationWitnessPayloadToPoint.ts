import { Point } from 'geojson'

import { LocationWitnessPayload } from '../../../model'

export const convertLocationWitnessPayloadToPoint = (payload: LocationWitnessPayload): Point => {
  // https://www.rfc-editor.org/rfc/rfc7946#section-3.1.1
  // A position is an array of numbers.  There MUST be two or more
  // elements. The first two elements are longitude and latitude
  return {
    coordinates: [payload.currentLocation.coords.longitude, payload.currentLocation.coords.latitude],
    type: 'Point',
  }
}
