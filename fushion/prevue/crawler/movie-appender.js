
import fetchList from './tasks/fetch-list'

export default function fetchBrief(wrapper) {
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
      .then(movies => filter(movies))
      .then(resolve)
  })
}

async function fetch(wrapper) {
  try {
    const result = await fetchList()
    if(result.data.length < 1){
      throw new Error('!!No any items from list page were found')
    }
    wrapper.data = result.data
    wrapper.logs.push(`::Fetched ${result.data.length} items from douban movie list page`)
    return wrapper
  } catch(error) {
    wrapper.logs.push(error.message)
    throw {
      time: new Date(),
      payload: wrapper,
      stacks: error,
      message: '!!Catching a fatal error in movie-appender.js'
    }
  }
}

function filter(wrapper) {
  const result = wrapper.data.filter(item => item.doubanId && item.title && item.poster && item.rate)
  if(result.length < 1) throw new Error('!!No more item left after brief filter')
  const discard = wrapper.data.length - result.length
  wrapper.data = result
  wrapper.discard = wrapper.discard + discard
  wrapper.logs.push(`::Filter out ${discard} items from original data set by brief filter, ${wrapper.data.length} left`)
  return wrapper
}
