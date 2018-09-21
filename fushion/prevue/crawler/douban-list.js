
const puppeteer = require('puppeteer')
const { sleep } = require('../../../lib/util/helper')

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
    throw 'Start browser failed because ' + error
  }
  return browser
}

function unfoldList(page, url, itemNum) {
  return new Promise(async (resolve, reject) => {
    try {
      await page.goto(url, {
        waitUntil: 'networkidle2'
      })
      await page.waitForSelector('.more')
      if(itemNum >= 20) {
        page.click('.more')
          .then(() => sleep(3000))
          .then(() => resolve(page))
      } else {
        resolve(page)
      }
    } catch(error) {
      reject('Unfold the list page failed because: ' + error)
    }
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

async function fetch(itemNum) {
  console.log('create broswer')
  const browser = await getBrowser()
  console.log('open new page')
  const emptyPage = await browser.newPage()
  console.log('unfold list')
  const page = await unfoldList(emptyPage, tempUrl, itemNum)
  console.log('extract items')
  const result = await extractItems(page)
  console.log('done')
  browser.close()
  if(itemNum <= 20)
    return result.slice(0, itemNum)
  else
    return result
}

// eslint-disable-next-line no-extra-semi
process.on('message', async itemNum => {
  let result = {
    status: 'Browser never started',
    data: null
  }
  try {
    result.data = await fetch(itemNum)
    result.status = `${result.data.length} movies were updated`
  } catch(error) {
    console.log(error)
    result = {
      status: error,
      data: result.data
    }
  }
  console.log('send to father')
  process.send({
    result
  })
  process.exit(0)
})
