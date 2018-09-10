
const mongoose = require('mongoose')
const { Mixed, ObjectId } = mongoose.Schema.Types

const addMeta = require('../../../../lib/mongoose-schema-meta')

let movieSchema = new mongoose.Schema({
  doubanId: {
    unique: true,
    required: true,
    type: String
  },
  category: [{
    type: ObjectId,
    ref: 'Category'
  }],
  title: String,
  rate: Number,
  summary: String,
  posterKey: String,
  coverKey: String,
  poster: String,
  cover: String,
  rawTitle: String,
  genres: [String],
  pubDate: Mixed,
  year: Number,
  tags: Array,
})

addMeta(movieSchema)

mongoose.model('Movie', movieSchema)
