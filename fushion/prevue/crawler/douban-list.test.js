
const getBrowser = require('./douban-list').__get__('getBrowser')
const unfoldList = require('./douban-list').__get__('unfoldList')
const extractItems = require('./douban-list').__get__('extractItems')

jest.mock('../../../lib/util/helper', () => ({
  sleep: jest.fn().mockResolvedValue()
}))

describe('getBrowser()', () => {
  it('should aquire a new browser which puppeteer resolved', async () => {
    const puppeteer = require('puppeteer')
    puppeteer.launch = jest.fn().mockResolvedValue({})
    const browser = await getBrowser()

    expect(browser).toMatchObject({})
  })

  it('should throw an error if puppeteer.launch() was rejected', async done => {
    let puppeteer = require('puppeteer')
    puppeteer.launch = jest.fn().mockRejectedValue('error')

    try {
      await getBrowser()
      done.fail('should not be here')
    } catch(error) {
      expect(error).toBe('Start browser failed because error')
      done()
    }
  })

  it('should passing a option object into puppeteer.launch()', async () => {
    const puppeteer = require('puppeteer')
    puppeteer.launch = jest.fn().mockResolvedValue({})
    await getBrowser()

    expect(puppeteer.launch).toHaveBeenCalledWith({
      args: ['--no-sandbox'],
      dumpio: false
    })
  })
})

describe('unfoldList(page, url)', () => {
  it('should click more button one time', async () => {
    const pageMock = {
      goto: jest.fn(),
      waitForSelector: jest.fn(),
      click: jest.fn().mockResolvedValue()
    }
    await unfoldList(pageMock, '')

    expect(pageMock.click).toHaveBeenCalledTimes(1)
  })

  it('should reject if something wrong', async done => {
    const pageMock = {
      goto: jest.fn(),
      waitForSelector: jest.fn().mockRejectedValue('error'),
      click: jest.fn().mockResolvedValue()
    }
    try {
      await unfoldList(pageMock, '')
      done.fail('should not be here')
    } catch(error) {
      expect(error).toBe('Unfold the list page failed because: error')
      done()
    }
  })
})

describe('extractItems(page)', () => {
  it('should return a movie object', async () => {
    const pageMock = {
      evaluate: jest.fn().mockResolvedValue({})
    }

    const movie = await extractItems(pageMock)
    expect(movie).toMatchObject({})
  })
})

