
const logger = require('koa-logger')

export default app => {
  console.info('Loading koa logger middleware')
  app.use(logger())
}
