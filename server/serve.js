
import Koa from 'koa'
import R from 'ramda'
import { resolve } from 'path'
import load from '../infrastructure'
import config from '../config'

const PROJECTS = [
  'prevue'
]
const app = new Koa()

load()
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
  .catch(error => {
    console.error('Server start failed')
    console.error(error)
  })
