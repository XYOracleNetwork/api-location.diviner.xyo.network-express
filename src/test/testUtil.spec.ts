import supertest, { SuperTest, Test } from 'supertest'

test('Must have API_KEY ENV VAR defined', () => {
  expect(process.env.API_KEY).toBeTruthy()
})
test('Must have APP_PORT ENV VAR defined', () => {
  expect(process.env.APP_PORT).toBeTruthy()
})

const request = supertest(`http://localhost:${process.env.APP_PORT}`)

export const getDiviner = (): SuperTest<Test> => {
  return request
}
