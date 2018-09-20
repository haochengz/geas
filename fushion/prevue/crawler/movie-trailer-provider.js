
import trailerCrawler from './tasks/fetch-trailer'

export default function fetchTrailer(wrapper) {
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
    fetch(wrapper)
      .then(dist => filter(dist))
      .then(validData => resolve(validData))
  })
}

async function fetch(wrapper) {
  const data = await trailerCrawler(wrapper.data)
  wrapper.data = data
  return wrapper
}

function filter(wrapper) {
  const cleanData = wrapper.data.filter(item => item.video && item.cover)
  if(cleanData.length < 1) throw new Error('!!data set was empty')
  wrapper.data = cleanData
  return wrapper
}
