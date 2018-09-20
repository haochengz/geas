
import mockingoose from 'mockingoose'
require('../database/schema/movie.schema')
const { getAllMovies, getMovie, isExist } = require('./movie')

beforeEach(() => {
  mockingoose.resetAll()
})

describe('getAllMovies()', () => {
  it('should return an array of movies', async () => {
    mockingoose.Movie.toReturn([{}], 'find')
    const movies = await getAllMovies()
    expect(movies).toHaveLength(1)
  })
})

describe('getMovie()', () => {
  it('should return an array of movies', async () => {
    mockingoose.Movie.toReturn({}, 'findOne')
    const movie = await getMovie({doubanId: '123456'})
    expect(movie).toMatchObject({})
  })

  it('should throw an error if cannot find id or doubanId in param', async done => {
    try {
      await getMovie({})
      done.fail('should not be here')
    } catch(error) {
      expect(error).toBe('Must have an id or doubanId field in parameter')
      done()
    }
  })
})

describe('isExist()', () => {
  it('should return false if the doubanId were not existed in db', async () => {
    mockingoose.Movie.toReturn(null, 'findOne')
    const res = await isExist({doubanId: '12345'})
    expect(res).toBe(false)
  })

  it('should return true if the doubanId were already existed in db', async () => {
    mockingoose.Movie.toReturn({
      doubanId: '12345',
      title: 'some movie'
    }, 'findOne')
    const res = await isExist({doubanId: '12345'})
    expect(res).toBe(true)
  })
})
