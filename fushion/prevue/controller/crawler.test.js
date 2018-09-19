
import Crawler from './crawler'

describe('Crawler Factory Test', () => {
  let crawler = null

  beforeEach(() => {
    crawler = new Crawler()
  })
  it('should creates a crawler instance', () => {
    expect(crawler.status).toBe('Before initiate')
  })

  it('should resolves a string to report by calling start method', async () => {
    const report = await crawler.start()
    expect(typeof report).toBe('string')
  })

  it('should report the crawler to be done or failed', async () => {
    const report = await crawler.start()
    const firstLine = report.split('\n')[0]
    expect(firstLine).toBe('Unfinish')
  })
})

//------------------------------------------------------------------------------
// v0.2
//------------------------------------------------------------------------------

// import { fetchMovies, fetchMovieList, fetchMovieDetail } from './crawler'
// import { isExisted } from './movie'
// import { fetchMovieDetails } from '../crawler/douban-detail'
// import fetchList from '../tasks/fetch-list'

// const filterOutDuplication = require('./crawler.js').__get__('filterOutDuplication')

// jest.mock('../tasks/fetch-list', () => jest.fn())
// jest.mock('./movie', () => ({
//   isExisted: jest.fn()
// }))
// jest.mock('../crawler/douban-detail', () => ({
//   fetchMovieDetails: jest.fn()
// }))

// describe('fetchMoves()', () => {
//   beforeEach(() => {
//     fetchList.mockReset()
//     fetchList.mockResolvedValue({ data: [] })
//     isExisted.mockReset()
//     isExisted.mockResolvedValue(false)
//   })

//   it('should excute the functions sequentially', async () => {
//     fetchList.mockResolvedValue({ data: [{doubanId: 1}, {doubanId: 2}, {doubanId: 3}, {doubanId: 4}, {doubanId: 5}, {doubanId: 6}] })
//     isExisted.mockResolvedValueOnce(true)
//     isExisted.mockResolvedValue(false)
//     fetchMovieDetails.mockResolvedValue({
//       data: [{doubanId: 2, title: 'King Kong'}, {doubanId: 3, title: 'Avengers'}, {doubanId: 4, title: 'Spider Man'}],
//       failedNum: 3
//     })
//     const movies = await fetchMovies()
//     expect(movies.discardNum).toBe(4)
//   })
// })

// describe('fetchMovieList()', () => {
//   const initData = {
//     models: [],
//     receiveNum: 0,
//     discardNum: 0
//   }
//   beforeEach(() => {
//     fetchList.mockReset()
//     fetchList.mockResolvedValue({ data: [] })
//   })
//   it('should calls fetchList to get a set of movies', async () => {
//     await fetchMovieList(initData)
//     expect(fetchList).toHaveBeenCalled()
//   })

//   it('should add movies to the passing in parameter and returns', async () => {
//     fetchList.mockResolvedValue({ data: [1, 2, 3] })
//     const movies = await fetchMovieList(initData)
//     expect(movies.models).toHaveLength(3)
//   })

//   it('should record how much data were received', async () => {
//     fetchList.mockResolvedValue({ data: [1, 2, 3] })
//     const movies = await fetchMovieList(initData)
//     expect(movies.receiveNum).toBe(3)
//   })

//   it('should no field been discarded during list fetching', async () => {
//     fetchList.mockResolvedValue({ data: [1, 2, 3] })
//     const movies = await fetchMovieList(initData)
//     expect(movies.discardNum).toBe(0)
//   })
// })

// describe('filterOutDuplicated', async () => {
//   let initialData = null
//   beforeEach(() => {
//     isExisted.mockReset()
//     initialData = {
//       models: [1, 2, 3, 4, 5, 6],
//       receiveNum: 6,
//       discardNum: 0
//     }
//   })
//   it('should calls movie controller for each movie to determine its existed or not', async () => {
//     await filterOutDuplication(initialData)
//     expect(isExisted).toHaveBeenCalled()
//   })

//   it('should filter out the movie from duplicate', async () => {
//     isExisted.mockResolvedValueOnce(true)
//     isExisted.mockResolvedValueOnce(true)
//     isExisted.mockResolvedValueOnce(false)
//     isExisted.mockResolvedValueOnce(true)
//     isExisted.mockResolvedValueOnce(false)
//     isExisted.mockResolvedValueOnce(true)
//     const after = await filterOutDuplication(initialData)
//     expect(after.discardNum).toBe(4)
//   })

//   it('should only unexisted movie remains', async () => {
//     isExisted.mockResolvedValueOnce(true)
//     isExisted.mockResolvedValueOnce(true)
//     isExisted.mockResolvedValueOnce(false)
//     isExisted.mockResolvedValueOnce(true)
//     isExisted.mockResolvedValueOnce(false)
//     isExisted.mockResolvedValueOnce(true)
//     const after = await filterOutDuplication(initialData)
//     expect(after.models).toEqual([3, 5])
//   })

//   it('should discard the movie when isExisted throw an error', async () => {
//     isExisted.mockResolvedValueOnce(true)
//     isExisted.mockResolvedValueOnce(false)
//     isExisted.mockResolvedValueOnce(false)
//     isExisted.mockRejectedValueOnce('') // rejection
//     isExisted.mockResolvedValueOnce(true)
//     isExisted.mockResolvedValueOnce(false)
//     const after = await filterOutDuplication(initialData)
//     expect(after.models).toEqual([2, 3, 6])
//   })

//   it('should finish anyway whereas isExisted throwing an error at last element', async () => {
//     isExisted.mockResolvedValueOnce(true)
//     isExisted.mockResolvedValueOnce(false)
//     isExisted.mockResolvedValueOnce(false)
//     isExisted.mockResolvedValueOnce(true)
//     isExisted.mockResolvedValueOnce(false)
//     isExisted.mockRejectedValueOnce('') // rejection
//     const after = await filterOutDuplication(initialData)
//     expect(after.models).toEqual([2, 3, 5])
//   })
// })

// describe('fetchMovieDetail()', () => {
//   beforeEach(() => {
//     fetchMovieDetails.mockReset()
//     fetchMovieDetails.mockResolvedValue({
//       data: []
//     })
//   })

//   it('should calls fetchMovies with an array of doubanIds', async () => {
//     await fetchMovieDetail({
//       models: [{doubanId: 1}, {doubanId: 2}, {doubanId: 3}, {doubanId: 4}, {doubanId: 5}, {doubanId: 6}],
//       receiveNum: 6,
//       discardNum: 1
//     })
//     expect(fetchMovieDetails).toHaveBeenCalledWith([{doubanId: 1}, {doubanId: 2}, {doubanId: 3}, {doubanId: 4}, {doubanId: 5}, {doubanId: 6}])
//   })

//   it('should resolves an array contains all the movie details', async () => {
//     fetchMovieDetails.mockResolvedValue({
//       data: [{doubanId: 1, title: 'King Kong'}, {doubanId: 2, title: 'Avengers'}, {doubanId: 3, title: 'Spider Man'}],
//       failedNum: 3
//     })
//     const data = await fetchMovieDetail({
//       models: [{doubanId: 1}, {doubanId: 2}, {doubanId: 3}, {doubanId: 4}, {doubanId: 5}, {doubanId: 6}],
//       receiveNum: 6,
//       discardNum: 1
//     })
//     expect(data.models[1].title).toBe('Avengers')
//   })

//   it('should excludes the failed field from dataSet', async () => {
//     fetchMovieDetails.mockResolvedValue({
//       data: [{doubanId: 1, title: 'King Kong'}, {doubanId: 2, title: 'Avengers'}, {doubanId: 3, title: 'Spider Man'}],
//       failedNum: 3
//     })
//     const data = await fetchMovieDetail({
//       models: [{doubanId: 1}, {doubanId: 2}, {doubanId: 3}, {doubanId: 4}, {doubanId: 5}, {doubanId: 6}],
//       receiveNum: 6,
//       discardNum: 1
//     })
//     expect(data.discardNum).toBe(4)
//   })
// })

//------------------------------------------------------------------------------
// v0.1
//------------------------------------------------------------------------------

// import { fetchMovieList } from './crawler'
// jest.mock('../tasks/fetch-list', () => jest.fn())
// import fetchList from '../tasks/fetch-list'
// jest.mock('./movie', () => ({
//   updateMovie: jest.fn(),
//   getMovie: jest.fn(),
//   addMovie: jest.fn()
// }))
// import { updateMovie, getMovie, addMovie } from './movie'

// describe('fetchMovieList()', () => {
//   beforeEach(() => {
//     fetchList.mockReset()
//     getMovie.mockReset()
//     addMovie.mockReset()
//     updateMovie.mockReset()
//     addMovie.mockResolvedValue()
//     updateMovie.mockResolvedValue()
//     fetchList.mockResolvedValue({
//       data: []
//     })
//   })

//   it('should return a brief about fetching result', async () => {
//     fetchList.mockResolvedValue({
//       status: '5 movies were updated',
//       data: [
//         {doubanId: '1'},
//         {doubanId: '2'},
//         {doubanId: '3'},
//         {doubanId: '4'},
//         {doubanId: '5'}
//       ]
//     })
//     getMovie.mockResolvedValueOnce({doubanId: '1'})
//     getMovie.mockResolvedValueOnce(null)
//     getMovie.mockResolvedValueOnce({doubanId: '3'})
//     getMovie.mockResolvedValueOnce(null)
//     getMovie.mockResolvedValueOnce({doubanId: '5'})
//     const result = await fetchMovieList()
//     expect(result).toBe('Updated 3 movies and created 2 new movies')
//   })

//   it('should return a brief about fetching result within another fetch input', async () => {
//     fetchList.mockResolvedValue({
//       status: '5 movies were updated',
//       data: [
//         {doubanId: '1'},
//         {doubanId: '2'},
//         {doubanId: '3'},
//         {doubanId: '4'},
//         {doubanId: '5'}
//       ]
//     })
//     getMovie.mockResolvedValueOnce({doubanId: '1'})
//     getMovie.mockResolvedValueOnce(null)
//     getMovie.mockResolvedValueOnce({doubanId: '3'})
//     getMovie.mockResolvedValueOnce(null)
//     getMovie.mockResolvedValueOnce(null)
//     const result = await fetchMovieList()
//     expect(result).toBe('Updated 2 movies and created 3 new movies')
//   })

//   it('should fetching movie data from task api and get result', async () => {
//     fetchList.mockResolvedValue({
//       status: '2 movies were updated',
//       data: [
//         {doubanId: '1'},
//         {doubanId: '2'}
//       ]
//     })
//     await fetchMovieList()
//     expect(fetchList).toHaveBeenCalled()
//   })

//   it('should been rejectd if cannot fetch any data from remote server', async () => {
//     try {
//       await fetchMovieList()
//       expect(true).toBe(false)
//     } catch(error) {
//       expect(error).toBe('No any data were found, maybe network is down')
//     }
//   })

//   it('should inquiring to the database to determine are they new', async () => {
//     fetchList.mockResolvedValue({
//       status: '2 movies were updated',
//       data: [
//         {doubanId: '1'},
//         {doubanId: '2'}
//       ]
//     })
//     await fetchMovieList()
//     expect(getMovie).toHaveBeenCalledTimes(2)
//   })

//   it('should create new doc if it was a new movie', async done => {
//     fetchList.mockResolvedValue({
//       status: '2 movies were updated',
//       data: [
//         {doubanId: '1'},
//         {doubanId: '2'}
//       ]
//     })
//     getMovie
//       .mockResolvedValueOnce({doubanId: '1'})
//       .mockResolvedValueOnce(null)
//     addMovie.mockImplementation(item => {
//       expect(item).toMatchObject({doubanId: '2'})
//       return Promise.resolve()
//     })
//     await fetchMovieList()
//     done()
//   })

//   it('should update an exists doc if it was already in db', async done => {
//     fetchList.mockResolvedValue({
//       status: '2 movies were updated',
//       data: [
//         {doubanId: '1'},
//         {doubanId: '2'}
//       ]
//     })
//     getMovie
//       .mockResolvedValueOnce({doubanId: '1'})
//       .mockResolvedValueOnce(null)
//     updateMovie.mockImplementation(item => {
//       expect(item).toMatchObject({doubanId: '1'})
//       expect(item).not.toBe(null)
//       return Promise.resolve()
//     })
//     await fetchMovieList()
//     done()
//   })

//   it('should report created number only if the creation operation successed', async () => {
//     fetchList.mockResolvedValue({
//       status: '5 movies were updated',
//       data: [
//         {doubanId: '1'},
//         {doubanId: '2'},
//         {doubanId: '3'},
//         {doubanId: '4'},
//         {doubanId: '5'}
//       ]
//     })
//     getMovie.mockResolvedValueOnce({doubanId: '1'})
//     getMovie.mockResolvedValueOnce(null)
//     getMovie.mockResolvedValueOnce({doubanId: '3'})
//     getMovie.mockResolvedValueOnce(null)
//     getMovie.mockResolvedValueOnce({doubanId: '5'})
//     addMovie.mockResolvedValueOnce()
//     addMovie.mockRejectedValueOnce() // add movie been rejected
//     const result = await fetchMovieList()
//     expect(result).toBe('Updated 3 movies and created 1 new movies')
//   })

//   it('should report updated number only if the creation operation successed', async () => {
//     fetchList.mockResolvedValue({
//       status: '5 movies were updated',
//       data: [
//         {doubanId: '1'},
//         {doubanId: '2'},
//         {doubanId: '3'},
//         {doubanId: '4'},
//         {doubanId: '5'}
//       ]
//     })
//     getMovie.mockResolvedValueOnce({doubanId: '1'})
//     getMovie.mockResolvedValueOnce(null)
//     getMovie.mockResolvedValueOnce({doubanId: '3'})
//     getMovie.mockResolvedValueOnce(null)
//     getMovie.mockResolvedValueOnce({doubanId: '5'})
//     updateMovie.mockResolvedValueOnce()
//     updateMovie.mockRejectedValueOnce() // add movie been rejected
//     updateMovie.mockResolvedValueOnce()
//     const result = await fetchMovieList()
//     expect(result).toBe('Updated 2 movies and created 2 new movies')
//   })
// })
