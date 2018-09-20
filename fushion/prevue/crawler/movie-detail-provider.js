
import { isExist } from '../controller/movie'
import { fetchJSON, extractContent } from './douban-detail'

export default function fetchDetail(wrapper) {
  return new Promise(resolve => {
    if(typeof wrapper !== 'object')
      throw new TypeError('Bad argument: wrapper')
    else if(toString.apply(wrapper.data) !== '[object Array]')
      throw new TypeError('Bad argument: wrapper must have a data array')
    else if(toString.apply(wrapper.logs) !== '[object Array]')
      throw new TypeError('Bad argument: wrapper must have a logs array')
    else if(typeof wrapper.status !== 'string')
      throw new TypeError('Bad argument: wrapper must have a status string')
    else if(typeof wrapper.discard !== 'number')
      throw new TypeError('Bad argument: wrapper must have a discard number')
    duplicateFilter(wrapper)
      .then(dist => detailProvider(dist))
      .then(data => validityFilter(data))
      .then(validData => resolve(validData))
  })
}

function duplicateFilter(wrapper) {
  return new Promise((resolve, reject) => {
    const exists = wrapper.data.map(async item => {
      try {
        item.exists = await isExist(item)
      } catch(error) {
        item.exists = true
      }
      return item
    })
    Promise.all(exists)
      .then(allMovies => allMovies.filter(item => item.exists === false))
      .then(eliminates => {
        if(eliminates.length === 0) reject(new Error('!!data set was empty'))
        wrapper.data = eliminates
      })
      .then(() => resolve(wrapper))
  })
}

function detailProvider(wrapper) {
  return new Promise(resolve => {
    const filled = wrapper.data.map(async item => {
      let rawData = {}
      let details = {}
      try {
        rawData = await fetchJSON(item.doubanId)
        details = await extractContent(rawData)
      } catch(error) {
        details = {}
      }
      const movies = Object.assign(item, details)
      return movies
    })
    Promise.all(filled)
      .then(m => wrapper.data = m)
      .then(() => resolve(wrapper))
  })
}

function validityFilter(wrapper) {
  const cleanData = wrapper.data.filter(item => item.year)
  if(cleanData.length < 1) throw new Error('!!data set was empty')
  wrapper.data = cleanData
  return wrapper
}
