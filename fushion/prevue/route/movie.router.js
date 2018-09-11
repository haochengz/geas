
import Router from 'koa-router'

const router = new Router()

router.get('/api/movies', (ctx, next) => {
  ctx.body = 'KOA_ROUTER'
  return next()
})

export default router