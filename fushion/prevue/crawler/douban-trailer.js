
const puppeteer = require('puppeteer')

const { sleep } = require('../../../lib/util/helper')

const url = 'https://movie.douban.com/subject/'

process.on('message', async movies => {
  console.log('Crawling started')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
    // headless: false,
    // sloMo: 250
  })

  for(let i = 0; i < movies.length; i++) {
    let doubanId = movies[i].doubanId
    const page = await browser.newPage()
    await page.goto(url + doubanId, {
      waitUntil: 'networkidle2'
    })
    await sleep(3000)

    const result = await page.evaluate(() => {
      /* global window */
      var $ = window.$
      var videoCover = $('.related-pic-video').attr('style')
      if (videoCover) {
        videoCover = videoCover.split('background-image:url(')[1]
      } else {
        videoCover = ''
      }
      var videoPage = $('.related-pic-video').attr('href')

      return {
        videoPage,
        videoCover
      }
    })

    let video = ''
    if(result.videoPage) {
      await page.goto(result.videoPage, {
        waitUntil: 'networkidle2'
      })
      await sleep(3000)

      video = await page.evaluate(() => {
        var $ = window.$
        var it = $('source')

        if (it && it.length > 0) {
          return it.attr('src')
        }
        return ''
      })
    } else {
      console.log('Cannot reach video page, maybe server is down')
      continue
    }

    const data = {
      doubanId,
      video,
      cover: result.videoCover
    }
    process.send(data)
  }

  browser.close()
  process.exit(0)
})
