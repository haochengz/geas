
const puppeteer = require('puppeteer')
const { promisify } = require('util')
const sleep = promisify(setTimeout)

const tempUrl = 'https://movie.douban.com/tag/#/?sort=R&range=6,10&tags=%E7%BE%8E%E5%9B%BD,%E7%94%B5%E5%BD%B1'
// movie >> us >> rated(6 ~ 10) >> sort(newest) >> all

async function getBrowser() {
  let browser
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      dumpio: false
    })
  } catch(error) {
    console.error(error)
    throw new Error('Start browser failed')
  }
  return browser
}

function unfoldList(page, url) {
  return new Promise(async resolve => {
    await page.goto(url, {
      waitUntil: 'networkidle2'
    })
    await page.waitForSelector('.more')
    page.click('.more')
      .then(() => sleep(3000))
      .then(() => resolve(page))
  })
}

const extractItems = async page => {
  const movies = await page.evaluate(() => {
    /* global window */
    var $ = window.$
    var items = $('.list-wp a')
    var links = []
    if (items.length >= 1) {
      items.each((index, item) => {
        var it = $(item)
        var doubanId = it.find('div').attr('data-id')
        var title = it.find('.title').text()
        var rate = Number(it.find('.rate').text())
        var poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')
        if(doubanId && title && rate && poster) {
          links.push({doubanId, title, rate, poster})
        }
      })
    }
    return links
  })
  return movies
}

async function fetch() {
  const browser = await getBrowser()
  const emptyPage = await browser.newPage()
  const page = await unfoldList(emptyPage, tempUrl)
  const result = await extractItems(page)
  browser.close()
  return result
}

// eslint-disable-next-line no-extra-semi
;(async function() {
  let result = {
    status: 'Browser never started',
    data: null
  }
  try {
    result.data = await fetch()
    result.status = `${result.data.length} movies were updated`
  } catch(error) {
    result = {
      status: error,
      data: result.data
    }
  }
  process.send({
    result
  })
  process.exit(0)
})()
