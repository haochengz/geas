
const mongoose = require('mongoose')
require('./movie')
const Movie = mongoose.model('Movie')

test('should run with test environment', () => {
  expect(process.env.NODE_ENV).toBe('test')
})

describe('movie schema of mongodb database', () => {
  it('should create a model object', () => {
    const m = new Movie({
      doubanId: '12345',
    })
    expect(m.doubanId).toBe('12345')
  })
})
