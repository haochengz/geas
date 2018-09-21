
import Koa from 'koa'
import R from 'ramda'
import { resolve } from 'path'
import load from '../infrastructure'
import config from '../config'

const PROJECTS = [
  'prevue'
]
const app = new Koa()

load(app)
  .then(() => {
    R.map(R.compose(
      async initial => await initial(app),
      path => require(path).default,
      project => resolve(__dirname, '../fushion/', project, 'initial.js')
    ))(PROJECTS)
  })
  .then(() => {
    app.listen(config.server.port, () => {
      console.info(`Listening ${config.server.port}... ...`)
    })
  })
  .then(async () => {
    await foo()
  })
  .catch(error => {
    console.error('Server start failed')
    console.error(error)
  })

async function foo() {
  const fetchBrief = require('../fushion/prevue/crawler/movie-appender').default
  const fetchDetail = require('../fushion/prevue/crawler/movie-detail-provider').default
  const fetchTrailer = require('../fushion/prevue/crawler/movie-trailer-provider').default
  const ossUploader = require('../fushion/prevue/crawler/movie-oss-uploader').default
  const wrapper = {
    data: [],
    logs: ['Unfinish'],
    status: 'After initiate',
    discard: 0
  }
  return new Promise(resolve => {
    fetchBrief(wrapper)
      .then(m => {
        console.log('Detail')
        return fetchDetail(m)
      })
      .then(n => {
        console.log('Trailer')
        return fetchTrailer(n)
      })
      .then(o => {
        console.log('OSS')
        console.log(o)
        return ossUploader(o)
      })
      .then(wrapper => {
        console.log(wrapper)
        resolve(wrapper)
      })
      .catch(error => {
        console.log(error)
      })
  })
}
