
import got from 'got'

const URIPrefix = 'http://api.douban.com/v2/movie/subject/'

export async function fetchJSON(doubanId) {
  const uri = URIPrefix + doubanId
  let response = {}
  try {
    response = await got(uri)
  } catch(error) {
    throw error.message
  }
  if(response.statusCode !== 200) throw `Status code: ${response.statusCode}`
  const detail = JSON.parse(response.body)
  return detail
}

export function extractContent(rawData) {
  if(typeof rawData !== 'object') throw 'bad argument'
  const content = {
    rate: rawData.rating && rawData.rating.average || null,
    summary: rawData.summary || null,
    cover: rawData.images && rawData.images.large || null,
    rawTitle: rawData.original_title || null,
    genres: rawData.genres || [],
    pubData: rawData.year || null,
    year: rawData.year || null,
    tags: rawData.subtype || 'uncategorized'
  }
  return content
}

export function fetchMovies(ids) {
  return new Promise(resolve => {
    let movies = []
    ids.forEach(async (id, index) => {
      const details = await fetchJSON(id)
      const movie = extractContent(details)
      movies.push(movie)
      if(index === ids.length - 1) resolve(movies)
    })
  })
}
