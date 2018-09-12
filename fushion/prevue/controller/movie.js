
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

const getAllMovies = async () => {
  let movies = await Movie.find({}).sort({
    'meta.createdAt': -1
  })
  return movies
}

const getMovie = async id => {
  let movie = await Movie.findOne({
    _id: id
  })
  return movie
}

const findOneMovie = async movie => {
  if(movie.id) return findOneMovieById(movie.id)
  else if(movie.doubanId) return findOneMovieByDoubanId(movie.doubanId)
  else throw new Error('Find one movie must contains a id or a doubanId field')
}

const findOneMovieById = async id => {
  try {
    const movie = await Movie.findOne({
      id: id
    })
    return movie
  } catch(error) {
    throw new Error(error)
  }
}

const findOneMovieByDoubanId = async doubanId => {
  try {
    const movie = await Movie.findOne({
      doubanId: doubanId
    })
    return movie
  } catch(error) {
    throw new Error(error)
  }
}

const addMovie = async movie => {
  try {
    const doc = new Movie(movie)
    doc.save()
    return doc
  } catch(error) {
    console.error(error)
    throw new Error('Create movie failed')
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
  findOneMovie,
  findOneMovieById,
  findOneMovieByDoubanId,
  updateMovie
}
