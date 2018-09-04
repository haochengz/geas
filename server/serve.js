
import Koa from 'koa'

import config from '../config'

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'Good to go'
  return next()
})

app.listen(config.server.port, () => {
  console.info(`Listening ${config.server.port}... ...`)
})
