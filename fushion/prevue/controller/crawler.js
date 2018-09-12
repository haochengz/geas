
import fetchList from '../tasks/fetch-list'
import { findOneMovie, updateMovie, addMovie } from './movie'

module.exports = async function() {
  let updated = 0
  let created = 0
  const result = await fetchList()
  result.data.forEach(async item => {
    const status = await save(item)
    if(status === 'update') updated++
    else if(status === 'create') created++
  })
  return `Updated ${updated} movies and created ${created} new movies`
}


async function save(movie) {
  try {
    if(await findOneMovie(movie)) {
      await updateMovie(movie)
      return 'update'
    } else {
      await addMovie(movie)
      return 'create'
    }
  } catch(error) {
    console.error(error)
    throw new Error('Fetch movie list failed')
  }
}
