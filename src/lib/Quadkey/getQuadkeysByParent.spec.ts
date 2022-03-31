import { getQuadkeysByParent } from './getQuadkeysByParent'

const testData = [
  { input: ['00', '033', '0333'] },
  { input: ['10', '122', '1222'] },
  { input: ['20', '211', '2111'] },
  { input: ['30', '300', '3000'] },
  { input: ['40', '40', '40'] },
]

describe('getQuadkeysByParent', () => {
  it.each(testData)('converts the quadkey at the specified zoom level', (data) => {
    const actual = getQuadkeysByParent(data.input)
    expect(actual).toMatchSnapshot()
  })
})
