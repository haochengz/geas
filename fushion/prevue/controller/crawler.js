
import mongoose from 'mongoose'
const Movie = mongoose.model('Movie')

export default function Crawler() {
  this.data = null
  this.start = start
}

function start() {
  const fetchBrief = require('../crawler/movie-appender').default
  const fetchDetail = require('../crawler/movie-detail-provider').default
  const fetchTrailer = require('../crawler/movie-trailer-provider').default
  const ossUploader = require('../crawler/movie-oss-uploader').default
  const wrapper = {
    data: [],
    logs: ['Unfinish'],
    status: 'After initiate',
    discard: 0
  }
  return new Promise(resolve => {
    fetchBrief(wrapper)
      .then(m => {
        console.log('fetching Detail')
        return fetchDetail(m)
      })
      .then(n => {
        console.log('fetching Trailer')
        return fetchTrailer(n)
      })
      .then(o => {
        console.log('uploading to OSS')
        return ossUploader(o)
      })
      .then(wrapper => {
        console.log('final results')
        return wrapper.data
      })
      .then(models => {
        const movies = models.map(async item => {
          const movie = new Movie(item)
          await movie.save()
          return movie
        })
        resolve(movies)
      })
      .catch(error => {
        console.log(error)
      })
  })
}

//------------------------------------------------------------------------------
// v0.2
//------------------------------------------------------------------------------

// import fetchList from '../tasks/fetch-list'
// import { isExisted } from './movie'
// import { fetchMovieDetails } from '../crawler/douban-detail'

// export async function fetchMovies() {
//   let items = await fetchMovieList(createInitialData())
//   items = await filterOutDuplication(items)
//   items = await fetchMovieDetail(items)
//   return items
  
//   // fetchMovieTrailer()
// }

// export async function fetchMovieList(dataSet) {
//   try {
//     const movies = await fetchList()
//     dataSet.models = movies.data
//     dataSet.receiveNum = movies.data.length
//     return dataSet
//   } catch(error) {
//     throw error.message
//   }
// }

// function filterOutDuplication(dataSet) {
//   let discard = 0
//   let after = []
//   return new Promise(resolve => {
//     dataSet.models.forEach(async (movie, index) => {
//       try {
//         const isExists = await isExisted(movie)
//         if(isExists) {
//           discard++
//         } else {
//           after.push(movie)
//         }
//       } catch(error) {
//         discard++
//       }
//       if(index === dataSet.models.length-1) {
//         resolve({
//           models: after,
//           receiveNum: dataSet.receiveNum,
//           discardNum: dataSet.discardNum + discard
//         })
//       }
//     })
//   })
// }

// export async function fetchMovieDetail(dataSet) {
//   const result = await fetchMovieDetails(dataSet.models)
//   dataSet.models = result.data
//   dataSet.discardNum = dataSet.discardNum + result.failedNum
//   return dataSet
// }

// export function fetchMovieTrailer() {}

// function createInitialData() {
//   return {
//     models: [],
//     receiveNum: 0,
//     discardNum: 0
//   }
// }

//------------------------------------------------------------------------------
// v0.1
//------------------------------------------------------------------------------

// export function fetchMovieList() {
//   return new Promise(async (resolve, reject) => {
//     let created = 0, updated = 0
//     let movies = null
//     try {
//       movies = await fetchList()
//     } catch(error) {
//       console.error(error)
//       reject('Fetch Movie list failed because: ', error)
//     }
//     if(!movies || !movies.data || !movies.data.length) {
//       reject('No any data were found, maybe network is down')
//     }
//     movies.data.forEach(async (movie, index) => {
//       const exists = await getMovie(movie)
//       if(!exists) {
//         await addMovie(movie).then(() => created++)
//       } else {
//         await updateMovie(movie).then(() => updated++)
//       }
//       if(index === movies.data.length - 1) {
//         resolve(`Updated ${updated} movies and created ${created} new movies`)
//       }
//     })
//   })
// }

