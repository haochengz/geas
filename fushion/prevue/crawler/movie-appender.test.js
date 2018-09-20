
import fetchList from './tasks/fetch-list'
import fetchBrief from './movie-appender'
const fetch = require('./movie-appender').__get__('fetch')
const filter = require('./movie-appender').__get__('filter')

jest.mock('./tasks/fetch-list', () => jest.fn())

describe('fetchBrief()', () => {
  let initData = {}

  beforeEach(() => {
    initData = {
      data: [],
      logs: ['Unfinish'],
      status: 'After initiate',
      discard: 0
    }
    fetchList.mockReset()
    fetchList.mockResolvedValue({
      data: [
        {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg'},
        {doubanId: 2, title: 'The Adventrue of Zelda', rate: 7, poster: 'a.jpg'},
        {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg'},
        {doubanId: 4, rate: 7, poster: 'a.jpg'},
        {doubanId: 5, title: 'King Kong', rate: 7},
      ],
      status: 'ok'
    })
  })
  it('should append the data from server to the result', async () => {
    const res = await fetchBrief(initData)
    expect(res.data).toHaveLength(3)
  })

  it('should resolves the clean data', async () => {
    const res = await fetchBrief(initData)
    expect(res.data[2].title).toBe('Spider Man')
  })

  it('should examine the validity of the parameter', async done => {
    try {
      await fetchBrief()
      done.fail('Never should be here')
    } catch(error) {
      expect(error.message).toBe('Bad argument: wrapper')
      done()
    }
  })

  it('should reject if the structure of wrapper was wrong', async done => {
    try {
      await fetchBrief({data: 1})
      done.fail('Never should be here')
    } catch(error) {
      expect(error.message).toBe('Bad argument: wrapper must have a data array')
      done()
    }
  })

  it('should also works for other validations', async done => {
    try {
      await fetchBrief({data: [], logs: ''})
      done.fail('Never should be here')
    } catch(error) {
      expect(error.message).toBe('Bad argument: wrapper must have a logs array')
      done()
    }
  })

  it('should also works for other validations', async done => {
    try {
      await fetchBrief({data: [], logs: [], status: null})
      done.fail('Never should be here')
    } catch(error) {
      expect(error.message).toBe('Bad argument: wrapper must have a status string')
      done()
    }
  })

  it('should also works for other validations', async done => {
    try {
      await fetchBrief({data: [], logs: [], status: ''})
      done.fail('Never should be here')
    } catch(error) {
      expect(error.message).toBe('Bad argument: wrapper must have a discard number')
      done()
    }
  })
})

describe('fetch()', () => {
  let initData = {}

  beforeEach(() => {
    initData = {
      data: [],
      logs: ['Unfinish'],
      status: 'After initiate',
      discard: 0
    }
    fetchList.mockReset()
    fetchList.mockResolvedValue({
      data: [1, 2, 3],
      status: 'ok'
    })
  })

  it('should calling fetchList to get the data from server', async () => {
    await fetch(initData)
    expect(fetchList).toHaveBeenCalled()
  })

  it('should append the data from fetchList to passing in parameter', async () => {
    fetchList.mockResolvedValue({
      data: [1, 2, 3, 4, 5],
      status: 'ok'
    })
    const result = await fetch(initData)
    expect(result.data).toHaveLength(5)
  })

  it('should record status before starts', async done => {
    fetchList.mockRejectedValue(new Error('!!Rejected by fetchList() function at movie-appender.js'))
    try {
      await fetch(initData)
      done.fail('should never be here')
    } catch(error) {
      expect(error.payload.logs[1]).toBe('!!Rejected by fetchList() function at movie-appender.js')
      done()
    }
  })

  it('should be fatal if fetchList resolves 0 items', async done => {
    fetchList.mockResolvedValue({
      data: [],
      status: 'ok'
    })
    try {
      await fetch(initData)
      done.fail('should never be here')
    } catch(error) {
      expect(error.payload.logs[1]).toBe('!!No any items from list page were found')
      done()
    }
  })
})

describe('filter()', () => {
  let medianData = {}

  beforeEach(() => {
    medianData = {
      data: [
        {doubanId: 1, title: 'Avengers', rate: 7, poster: 'a.jpg'},
        {doubanId: 2, rate: 7, poster: 'a.jpg'},
        {doubanId: 3, title: 'Spider Man', rate: 7, poster: 'a.jpg'},
        {doubanId: 4, title: 'King Kong II', rate: 7, poster: 'a.jpg'},
        {doubanId: 5, title: 'King Kong', rate: 7},
      ],
      logs: ['Unfinish', ['::Fetched 5 items from douban movie list page']],
      status: 'Before fetch data from list page',
      discard: 0
    }
  })

  it('should filter the incomplete items', () => {
    const res = filter(medianData)
    expect(res.data).toHaveLength(3)
  })

  it('should record the logs', () => {
    const res = filter(medianData)
    expect(res.logs[2]).toBe('::Filter out 2 items from original data set by brief filter, 3 left')
  })

  it('should save the number of discard items', () => {
    const res = filter(medianData)
    expect(res.discard).toBe(2)
  })

  it('should be fatal if no items left after the filter operation', done => {
    const badData = {
      data: [
        {title: 'Avengers', rate: 7, poster: 'a.jpg'},
        {doubanId: 2, rate: 7, poster: 'a.jpg'},
        {doubanId: 3, title: 'Spider Man', poster: 'a.jpg'},
        {title: 'King Kong II', rate: 7, poster: 'a.jpg'},
        {doubanId: 5, title: 'King Kong', rate: 7},
      ],
      logs: ['Unfinish', ['::Fetched 5 items from douban movie list page']],
      status: 'Before fetch data from list page',
      discard: 0
    }
    try {
      filter(badData)
      done.fail('should never be here')
    } catch(error) {
      expect(error.message).toBe('!!No more item left after brief filter')
      done()
    }
  })
})
