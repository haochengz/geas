
import ossUploader from './movie-oss-uploader'
import doubanUploader from './douban-uploader'

const upload = require('./movie-oss-uploader').__get__('upload')
const filter = require('./movie-oss-uploader').__get__('filter')

jest.mock('./douban-uploader', () => jest.fn())

describe('ossUploader()', () => {
  let medianData = null
  beforeEach(() => {
    medianData = {
      data: [
        {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg'},
        {doubanId: 2, title: 'Iron Man', rate: 7, poster: 'a.jpg'},
        {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg', video: 'a.mp4'},
        {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg', video: 'w.mp4', cover: 'c.jpg'},
        {doubanId: 5, title: 'King Kong', rate: 7, cover: 'c.jpg'},
      ],
      logs: ['Unfinish', ['::Fetched 5 items from douban movie list page']],
      status: 'Before fetch data from list page',
      discard: 0
    }
    doubanUploader.mockReset()
    doubanUploader.mockResolvedValue([
      {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg', posterKey: 'jfsdfhfa14e'},
      {doubanId: 2, title: 'Iron Man', rate: 7, poster: 'a.jpg', posterKey: 'jfsdfhfa14e'},
      {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg', video: 'a.mp4'},
      {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg', video: 'w.mp4', cover: 'c.jpg', posterKey: 'jfsdfhfa14e', coverKey: 'jfsdfhfa14e', videoKey: 'jfsdfhfa14e'},
      {doubanId: 5, title: 'King Kong', rate: 7, cover: 'c.jpg', coverKey: 'djkfj290fa'},
    ])
  })

  it('should be a function', () => {
    expect(typeof ossUploader).toBe('function')
  })

  it('should fetch and filter', async () => {
    const res = await ossUploader(medianData)
    expect(res.data[0].videoKey).toBeTruthy()
    expect(res.data).toHaveLength(1)
  })

  it('should accepts the right format only', async done => {
    try {
      await ossUploader()
      done.fail('should not be here')
    } catch(error) {
      expect(error.message).toBe('Bad argument: wrapper')
      done()
    }
  })
})

describe('upload()', () => {
  let medianData = null
  beforeEach(() => {
    medianData = {
      data: [
        {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg'},
        {doubanId: 2, title: 'Iron Man', rate: 7, poster: 'a.jpg'},
        {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg', video: 'a.mp4'},
        {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg', video: 'w.mp4', cover: 'c.jpg'},
        {doubanId: 5, title: 'King Kong', rate: 7, cover: 'c.jpg'},
      ],
      logs: ['Unfinish', ['::Fetched 5 items from douban movie list page']],
      status: 'Before fetch data from list page',
      discard: 0
    }
    doubanUploader.mockReset()
    doubanUploader.mockResolvedValue([
      {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg', posterKey: 'jfsdfhfa14e'},
      {doubanId: 2, title: 'Iron Man', rate: 7, poster: 'a.jpg'},
      {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg', video: 'a.mp4'},
      {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg', video: 'w.mp4', cover: 'c.jpg'},
      {doubanId: 5, title: 'King Kong', rate: 7, cover: 'c.jpg'},
    ])
  })
  it('should calls the doubanUploader to upload the media to OSS server', async () => {
    await upload(medianData)
    expect(doubanUploader).toHaveBeenCalled()
  })

  it('should pass an array of movies to doubanUploader', async () => {
    const doc = Object.assign(medianData.data)
    await upload(medianData)
    expect(doubanUploader).toHaveBeenCalledWith(doc)
  })

  it('should returns the wrapper with upload results', async () => {
    const res = await upload(medianData)
    expect(res.data[0].posterKey).toBeTruthy()
  })
})

describe('filter()', () => {
  let medianData = null
  beforeEach(() => {
    medianData = {
      data: [
        {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg', posterKey: 'jfsdfhfa14e'},
        {doubanId: 2, title: 'Iron Man', rate: 7, poster: 'a.jpg', posterKey: 'jfsdfhfa14e'},
        {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg', video: 'a.mp4'},
        {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg', video: 'w.mp4', cover: 'c.jpg', posterKey: 'jfsdfhfa14e', coverKey: 'jfsdfhfa14e', videoKey: 'jfsdfhfa14e'},
        {doubanId: 5, title: 'King Kong', rate: 7, cover: 'c.jpg', coverKey: 'djkfj290fa'},
      ],
      logs: ['Unfinish', ['::Fetched 5 items from douban movie list page']],
      status: 'Before fetch data from list page',
      discard: 0
    }
  })

  it('should filter out the unvalid fields from data set', () => {
    const res = filter(medianData)
    expect(res.data).toHaveLength(1)
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

// ossUploader
// uploader
// filter