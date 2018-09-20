
import { upload } from '../../../lib/oss'

module.exports = function(movies) {
  return new Promise(resolve => {
    const loadingPromises = movies.map(async movie => {
      if (movie && movie.video && !movie.videoKey) {
        let result = await upload(movie.video, '.mp4')
        if (result && result.name) {
          movie.videoKey = result.name
        }
      }

      if (movie && movie.cover && !movie.coverKey) {
        let result = await upload(movie.cover, '.jpg')
        if (result && result.name) {
          movie.coverKey = result.name
        }
      }

      if (movie && movie.poster && !movie.posterKey) {
        let result = await upload(movie.poster, '.jpg')
        if (result && result.name) {
          movie.posterKey = result.name
        }
      }
      return movie
    })

    Promise.all(loadingPromises)
      .then(res => resolve(res))
  })
}
