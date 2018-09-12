
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const addMeta = require('../../../../lib/mongoose-schema-meta')

let categorySchema = new mongoose.Schema({
  name: {
    unique: true,
    required: true,
    type: String
  },
  movies: [{
    type: ObjectId,
    ref: 'Movie'
  }]
})

addMeta(categorySchema)

mongoose.model('Category', categorySchema)
