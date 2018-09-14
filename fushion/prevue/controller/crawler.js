
import fetchList from '../tasks/fetch-list'
import { updateMovie, getMovie, addMovie } from './movie'

export function fetchMovieList() {
  return new Promise(async (resolve, reject) => {
    let created = 0, updated = 0
    const movies = await fetchList()
    if(!movies || !movies.data || !movies.data.length) {
      reject('No any data were found, maybe network is down')
    }
    movies.data.forEach(async (movie, index) => {
      const exists = await getMovie(movie)
      if(!exists) {
        await addMovie(movie).then(() => created++)
      } else {
        await updateMovie(movie).then(() => updated++)
      }
      if(index === movies.data.length - 1) {
        resolve(`Updated ${updated} movies and created ${created} new movies`)
      }
    })
  })
}
