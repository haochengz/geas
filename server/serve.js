
import Koa from 'koa'
import load from '../infrastructure'
import config from '../config'

const app = new Koa()

load()
  .then(() => {
    app.listen(config.server.port, () => {
      console.info(`Listening ${config.server.port}... ...`)
    })
  })
  .catch(() => {
    console.error('Server start failed')
  })
