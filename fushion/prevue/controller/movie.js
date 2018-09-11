
import mongoose from 'mongoose'
const Movie = mongoose.Model('Movie')

exports.queryMovie = async function(doubanId) {
  const result = await Movie.findOne({
    doubanId: doubanId
  })
  return result
}
