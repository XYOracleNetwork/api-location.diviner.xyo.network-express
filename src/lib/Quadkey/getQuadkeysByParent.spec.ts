import { getQuadkeysByParent } from './getQuadkeysByParent'

const testData: string[][] = [
  ['00', '033', '0333'],
  ['10', '122', '1222'],
  ['20', '211', '2111'],
  ['30', '300', '3000'],
]

describe('getQuadkeysByParent', () => {
  it.each(testData)('converts the quadkey at the specified zoom level', (data) => {
    const actual = getQuadkeysByParent([...data])
    expect(actual).toMatchSnapshot()
  })
})
