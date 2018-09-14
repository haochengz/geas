
import { fetchMovieList } from './crawler'
jest.mock('../tasks/fetch-list', () => jest.fn())
import fetchList from '../tasks/fetch-list'
jest.mock('./movie', () => ({
  updateMovie: jest.fn(),
  getMovie: jest.fn(),
  addMovie: jest.fn()
}))
import { updateMovie, getMovie, addMovie } from './movie'

describe('fetchMovieList()', () => {
  beforeEach(() => {
    fetchList.mockReset()
    getMovie.mockReset()
    addMovie.mockReset()
    updateMovie.mockReset()
    addMovie.mockResolvedValue()
    updateMovie.mockResolvedValue()
    fetchList.mockResolvedValue({
      data: []
    })
  })

  it('should return a brief about fetching result', async () => {
    fetchList.mockResolvedValue({
      status: '5 movies were updated',
      data: [
        {doubanId: '1'},
        {doubanId: '2'},
        {doubanId: '3'},
        {doubanId: '4'},
        {doubanId: '5'}
      ]
    })
    getMovie.mockResolvedValueOnce({doubanId: '1'})
    getMovie.mockResolvedValueOnce(null)
    getMovie.mockResolvedValueOnce({doubanId: '3'})
    getMovie.mockResolvedValueOnce(null)
    getMovie.mockResolvedValueOnce({doubanId: '5'})
    const result = await fetchMovieList()
    expect(result).toBe('Updated 3 movies and created 2 new movies')
  })

  it('should return a brief about fetching result within another fetch input', async () => {
    fetchList.mockResolvedValue({
      status: '5 movies were updated',
      data: [
        {doubanId: '1'},
        {doubanId: '2'},
        {doubanId: '3'},
        {doubanId: '4'},
        {doubanId: '5'}
      ]
    })
    getMovie.mockResolvedValueOnce({doubanId: '1'})
    getMovie.mockResolvedValueOnce(null)
    getMovie.mockResolvedValueOnce({doubanId: '3'})
    getMovie.mockResolvedValueOnce(null)
    getMovie.mockResolvedValueOnce(null)
    const result = await fetchMovieList()
    expect(result).toBe('Updated 2 movies and created 3 new movies')
  })

  it('should fetching movie data from task api and get result', async () => {
    fetchList.mockResolvedValue({
      status: '2 movies were updated',
      data: [
        {doubanId: '1'},
        {doubanId: '2'}
      ]
    })
    await fetchMovieList()
    expect(fetchList).toHaveBeenCalled()
  })

  it('should been rejectd if cannot fetch any data from remote server', async () => {
    try {
      await fetchMovieList()
      expect(true).toBe(false)
    } catch(error) {
      expect(error).toBe('No any data were found, maybe network is down')
    }
  })

  it('should inquiring to the database to determine are they new', async () => {
    fetchList.mockResolvedValue({
      status: '2 movies were updated',
      data: [
        {doubanId: '1'},
        {doubanId: '2'}
      ]
    })
    await fetchMovieList()
    expect(getMovie).toHaveBeenCalledTimes(2)
  })

  it('should create new doc if it was a new movie', async done => {
    fetchList.mockResolvedValue({
      status: '2 movies were updated',
      data: [
        {doubanId: '1'},
        {doubanId: '2'}
      ]
    })
    getMovie
      .mockResolvedValueOnce({doubanId: '1'})
      .mockResolvedValueOnce(null)
    addMovie.mockImplementation(item => {
      expect(item).toMatchObject({doubanId: '2'})
      return Promise.resolve()
    })
    await fetchMovieList()
    done()
  })

  it('should update an exists doc if it was already in db', async done => {
    fetchList.mockResolvedValue({
      status: '2 movies were updated',
      data: [
        {doubanId: '1'},
        {doubanId: '2'}
      ]
    })
    getMovie
      .mockResolvedValueOnce({doubanId: '1'})
      .mockResolvedValueOnce(null)
    updateMovie.mockImplementation(item => {
      expect(item).toMatchObject({doubanId: '1'})
      expect(item).not.toBe(null)
      return Promise.resolve()
    })
    await fetchMovieList()
    done()
  })

  it('should report created number only if the creation operation successed', async () => {
    fetchList.mockResolvedValue({
      status: '5 movies were updated',
      data: [
        {doubanId: '1'},
        {doubanId: '2'},
        {doubanId: '3'},
        {doubanId: '4'},
        {doubanId: '5'}
      ]
    })
    getMovie.mockResolvedValueOnce({doubanId: '1'})
    getMovie.mockResolvedValueOnce(null)
    getMovie.mockResolvedValueOnce({doubanId: '3'})
    getMovie.mockResolvedValueOnce(null)
    getMovie.mockResolvedValueOnce({doubanId: '5'})
    addMovie.mockResolvedValueOnce()
    addMovie.mockRejectedValueOnce() // add movie been rejected
    const result = await fetchMovieList()
    expect(result).toBe('Updated 3 movies and created 1 new movies')
  })

  it('should report updated number only if the creation operation successed', async () => {
    fetchList.mockResolvedValue({
      status: '5 movies were updated',
      data: [
        {doubanId: '1'},
        {doubanId: '2'},
        {doubanId: '3'},
        {doubanId: '4'},
        {doubanId: '5'}
      ]
    })
    getMovie.mockResolvedValueOnce({doubanId: '1'})
    getMovie.mockResolvedValueOnce(null)
    getMovie.mockResolvedValueOnce({doubanId: '3'})
    getMovie.mockResolvedValueOnce(null)
    getMovie.mockResolvedValueOnce({doubanId: '5'})
    updateMovie.mockResolvedValueOnce()
    updateMovie.mockRejectedValueOnce() // add movie been rejected
    updateMovie.mockResolvedValueOnce()
    const result = await fetchMovieList()
    expect(result).toBe('Updated 2 movies and created 2 new movies')
  })
})
