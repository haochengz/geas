
const mongoose = require('mongoose')
require('./category.schema')
const Category = mongoose.model('Category')

describe('movie schema of mongodb database', () => {
  it('should create a model object', () => {
    const m = new Category({
      name: '12345',
    })
    expect(m.name).toBe('12345')
  })
})