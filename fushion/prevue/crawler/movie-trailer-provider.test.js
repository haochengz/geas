
import fetchTrailer from './movie-trailer-provider'
import trailerCrawler from './tasks/fetch-trailer'

const fetch = require('./movie-trailer-provider').__get__('fetch')
const filter = require('./movie-trailer-provider').__get__('filter')

jest.mock('./tasks/fetch-trailer', () => jest.fn())

describe('fetchTrailer()', () => {
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

    trailerCrawler.mockReset()
    trailerCrawler.mockResolvedValue([
      {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg', video: '1.mp4', cover: 'a.jpg'},
      {doubanId: 2, title: 'Iron Man', rate: 7, poster: 'a.jpg', video: '1.mp4'},
      {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg', video: '1.mp4', cover: 'a.jpg'},
      {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg', cover: 'a.jpg'},
      {doubanId: 5, title: 'King Kong', rate: 7, poster: 'c.jpg', video: '1.mp4', cover: 'a.jpg'}
    ])
  })
  it('should be a function', () => {
    expect(typeof fetchTrailer).toBe('function')
  })

  it('should fetch and filter', async () => {
    const res = await fetchTrailer(medianData)
    expect(res.data[1].video).toBeTruthy()
    expect(res.data).toHaveLength(3)
  })

  it('should accepts the right format only', async done => {
    try {
      await fetchTrailer()
      done.fail('should not be here')
    } catch(error) {
      expect(error.message).toBe('Bad argument: wrapper')
      done()
    }
  })
})

describe('fetch()', () => {
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

    trailerCrawler.mockReset()
    trailerCrawler.mockResolvedValue([
      {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg', video: '1.mp4', cover: 'a.jpg'},
      {doubanId: 2, title: 'Iron Man', rate: 7, poster: 'a.jpg', video: '1.mp4', cover: 'a.jpg'},
      {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg', video: '1.mp4', cover: 'a.jpg'},
      {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg', video: '1.mp4', cover: 'a.jpg'},
      {doubanId: 5, title: 'King Kong', rate: 7, poster: 'c.jpg', video: '1.mp4', cover: 'a.jpg'}
    ])
  })
  it('should calls the trailerCrawler to fetch online trailer uri', async () => {
    await fetch(medianData)
    expect(trailerCrawler).toHaveBeenCalled()
  })

  it('should calls the trailerCrawler with an array of movies', async () => {
    const doc = Object.assign(medianData.data)
    await fetch(medianData)
    expect(trailerCrawler).toHaveBeenCalledWith(doc)
  })

  it('should returns the data with new fields in it', async () => {
    const res = await fetch(medianData)
    expect(res.data[1].video).toBeTruthy()
  })
})

describe('filter()', () => {
  let medianData = null
  beforeEach(() => {
    medianData = {
      data: [
        {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg', video: '1.mp4', cover: 'a.jpg'},
        {doubanId: 2, title: 'Iron Man', rate: 7, poster: 'a.jpg', video: '1.mp4'},
        {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg', video: '1.mp4', cover: 'a.jpg'},
        {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg', cover: 'a.jpg'},
        {doubanId: 5, title: 'King Kong', rate: 7, poster: 'c.jpg', video: '1.mp4', cover: 'a.jpg'}
      ],
      logs: ['Unfinish', ['::Fetched 5 items from douban movie list page']],
      status: 'Before fetch data from list page',
      discard: 0
    }
  })

  it('should filter out the unvalid fields from data set', () => {
    const res = filter(medianData)
    expect(res.data).toHaveLength(3)
  })

  it('should throw a fatal error if no more data exists', done => {
    try {
      filter({
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

// validator
// fetcher
// filter