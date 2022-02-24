import { StatusCodes } from 'http-status-codes'

describe('standardErrors', () => {
  it('Returns errors in the standard format', () => {
    const response = { body: { errors: [{ detail: 'TODO: Get error from API', status: StatusCodes.NOT_FOUND }] } }
    const errors = response?.body?.errors
    expect(errors).toBeTruthy()
    expect(Array.isArray(errors)).toBe(true)
    expect(errors[0].detail).toBeTruthy()
    expect(errors[0].status).toBeTruthy()
  })
})
