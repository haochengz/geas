
const mongoose = require('mongoose')
const addMeta = require('./index')

describe('test add meta information to exists schema', () => {
  it('should add meta to the schema', () => {
    const schema = mongoose.Schema({
      username: String
    })
    addMeta(schema)
    mongoose.model('Model1', schema)
    const Model = mongoose.model('Model1')
    const instance = new Model({
      username: 'testuser'
    })

    expect(typeof instance.meta).toBe('object')
  })

  it('should reserve the original meta field', () => {
    const schema = mongoose.Schema({
      username: String,
      meta: {
        t: String
      }
    })
    addMeta(schema)
    mongoose.model('Model2', schema)
    const Model = mongoose.model('Model2')
    const instance = new Model({
      username: 'testuser',
      meta: {
        t: 'user'
      }
    })

    expect(instance.meta.t).toBe('user')
    const modelCreateTime = instance.meta.created
    const now = new Date()
    const interval = now.valueOf() - modelCreateTime.valueOf()
    expect(interval).toBeLessThan(1000)
  })

  it('should match between created time and updated time with new instance', () => {
    const schema = mongoose.Schema({
      username: String,
      meta: {
        t: String
      }
    })
    addMeta(schema)
    mongoose.model('Model3', schema)
    const Model = mongoose.model('Model3')
    const instance = new Model({
      username: 'testuser'
    })

    expect(instance.meta.created).toEqual(instance.meta.updated)
  })

  // TODO: schema.pre('save') un-test
})
