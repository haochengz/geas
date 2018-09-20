
import fetchDetail from './movie-detail-provider'
import { isExist } from '../controller/movie'
import { fetchJSON, extractContent } from './douban-detail'
const duplicateFilter = require('./movie-detail-provider').__get__('duplicateFilter')
const detailProvider = require('./movie-detail-provider').__get__('detailProvider')
const validityFilter = require('./movie-detail-provider').__get__('validityFilter')

jest.mock('../controller/movie', () => ({
  isExist: jest.fn()
}))

jest.mock('./douban-detail', () => ({
  fetchJSON: jest.fn(),
  extractContent: jest.fn()
}))


describe('fetchDetail()', () => {
  let medianData = null
  let fetchData = null
  let extractData = null
  beforeEach(() => {
    fetchData = {
      rate: 8,
      summary: 'a nice movie',
      cover: 'a.jpg',
      rawTitle: 'Avengers',
      genres: ['marvel', 'comic'],
      pubDate: 2018-9-10,
      year: 2018
    }
    extractData = {
      rate: 8,
      summary: 'a nice movie',
      cover: 'a.jpg',
      rawTitle: 'Avengers',
      genres: ['marvel', 'comic'],
      pubDate: 2018-9-10,
      year: 2018,
      tags: 'unknown'
    }
    medianData = {
      data: [
        {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg'},
        {doubanId: 2, title: 'Iron Man', rate: 7, poster: 'a.jpg'},
        {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg'},
        {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg'},
        {doubanId: 5, title: 'King Kong', rate: 7, poster: 'c.jpg'},
      ],
      logs: ['Unfinish', ['::Fetched 5 items from douban movie list page']],
      status: 'Before fetch data from list page',
      discard: 0
    }
    fetchJSON.mockReset()
    fetchJSON.mockResolvedValue(fetchData)
    extractContent.mockReset()
    extractContent.mockResolvedValue(extractData)
    isExist.mockReset()
    isExist.mockResolvedValue(false)
  })
  it('should be a function which resolve an object as result', async () => {
    const res = await fetchDetail(medianData)
    expect(typeof res).toBe('object')
  })

  it('should accepts the right format only', async done => {
    try {
      await fetchDetail()
      done.fail('should not be here')
    } catch(error) {
      expect(error.message).toBe('Bad argument: wrapper')
      done()
    }
  })
})

describe('duplicateFilter()', () => {
  let medianData = null
  beforeEach(() => {
    medianData = {
      data: [
        {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg'},
        {doubanId: 2, title: 'Iron Man', rate: 7, poster: 'a.jpg'},
        {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg'},
        {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg'},
        {doubanId: 5, title: 'King Kong', rate: 7, poster: 'c.jpg'},
      ],
      logs: ['Unfinish', ['::Fetched 5 items from douban movie list page']],
      status: 'Before fetch data from list page',
      discard: 0
    }
    isExist.mockReset()
    isExist.mockResolvedValue(true)
  })

  it('should calls the isExist controller to examine every item in its parameter', async () => {
    isExist.mockResolvedValue(false)
    await duplicateFilter(medianData)
    expect(isExist).toHaveBeenCalledTimes(5)
  })

  it('should filter out all the existed movie', async () => {
    isExist.mockResolvedValueOnce(false)
    isExist.mockResolvedValueOnce(false)
    isExist.mockResolvedValueOnce(true)
    isExist.mockResolvedValueOnce(false)
    isExist.mockResolvedValueOnce(true)
    const res = await duplicateFilter(medianData)
    expect(res.data).toHaveLength(3)
  })

  it('should rejects if no more data in wrapper', async done => {
    isExist.mockResolvedValue(true)
    try {
      await duplicateFilter(medianData)
      done.fail('should never be here')
    } catch(error) {
      expect(error.message).toBe('!!data set was empty')
      done()
    }
  })

  it('should ignores the item which rejected by calling isExists', async () => {
    isExist.mockResolvedValueOnce(false)
    isExist.mockRejectedValueOnce('database lost connection')
    isExist.mockResolvedValueOnce(true)
    isExist.mockRejectedValueOnce('bad format')
    isExist.mockResolvedValueOnce(false)
    const res = await duplicateFilter(medianData)
    expect(res.data).toHaveLength(2)
  })
})

describe('detailProvider()', () => {
  let medianData = null
  let fetchData = null
  let extractData = null
  beforeEach(() => {
    fetchData = {
      rate: 8,
      summary: 'a nice movie',
      cover: 'a.jpg',
      rawTitle: 'Avengers',
      genres: ['marvel', 'comic'],
      pubDate: 2018-9-10,
      year: 2018
    }
    extractData = {
      rate: 8,
      summary: 'a nice movie',
      cover: 'a.jpg',
      rawTitle: 'Avengers',
      genres: ['marvel', 'comic'],
      pubDate: 2018-9-10,
      year: 2018,
      tags: 'unknown'
    }
    medianData = {
      data: [
        {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg'},
        {doubanId: 2, title: 'Iron Man', rate: 7, poster: 'a.jpg'},
        {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg'},
        {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg'},
        {doubanId: 5, title: 'King Kong', rate: 7, poster: 'c.jpg'},
      ],
      logs: ['Unfinish', ['::Fetched 5 items from douban movie list page']],
      status: 'Before fetch data from list page',
      discard: 0
    }
    fetchJSON.mockReset()
    fetchJSON.mockResolvedValue(fetchData)
    extractContent.mockReset()
    extractContent.mockResolvedValue(extractData)
  })

  it('should calls fetchJSON for remote details', async () => {
    await detailProvider(medianData)
    expect(fetchJSON).toHaveBeenCalledTimes(5)
  })

  it('should returns the data set with the details', async () => {
    const res = await detailProvider(medianData)
    expect(res.data[0].year).toBe(2018)
  })

  it('should fill the item with empty object if fetchJSON gone wrong', async () => {
    fetchJSON.mockResolvedValueOnce(fetchData)
    fetchJSON.mockResolvedValueOnce(fetchData)
    fetchJSON.mockRejectedValueOnce('network error')
    const res = await detailProvider(medianData)
    expect(res.data[2].year).toBe(undefined)
  })
})

describe('validityFilter()', () => {
  let filledData = null
  beforeEach(() => {
    filledData = {
      data: [
        {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg', year: 2018},
        {doubanId: 2, title: 'Iron Man', rate: 7, poster: 'a.jpg'},
        {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg', year: 2018},
        {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg'},
        {doubanId: 5, title: 'King Kong', rate: 7, poster: 'c.jpg', year: 2018},
      ],
      logs: ['Unfinish', ['::Fetched 5 items from douban movie list page']],
      status: 'Before fetch data from list page',
      discard: 0
    }
  })
  it('should filter out the unvalid field from data set', () => {
    const res = validityFilter(filledData)
    expect(res.data).toHaveLength(3)
  })

  it('should throw a fatal error if no more data exists', done => {
    try {
      validityFilter({
        data: [
          {doubanId: 2, title: 'Iron Man', rate: 7, poster: 'a.jpg'},
          {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg'}
        ]
      })
      done.fail('should never been here')
    } catch(error) {
      expect(error.message).toBe('!!data set was empty')
      done()
    }
  })
})
