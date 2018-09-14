
import mongoose from 'mongoose'
const Movie = mongoose.model('Movie')

const getAllMovies = async () => {
  let movies = await Movie.find({}).sort({
    'meta.createdAt': -1
  })
  return movies
}

const getMovie = async movie => {
  if(!movie.id && !movie.doubanId) throw 'Must have an id or doubanId field in parameter'
  let doc = await Movie.findOne({
    $or: [
      {_id: movie.id},
      {doubanId: movie.doubanId}
    ]
  })
  return doc
}

const addMovie = async movie => {
  try {
    const doc = new Movie(movie)
    doc.save()
    return doc
  } catch(error) {
    throw new Error('Create movie failed because: ' + error)
  }
}

const updateMovie = async movie => {
  try {
    Movie.updateOne(
      { doubanId: movie.doubanId },
      movie
    )
  } catch(error) {
    throw new Error('Update movie failed')
  }
}

module.exports = {
  getAllMovies,
  getMovie,
  addMovie,
  updateMovie
}
