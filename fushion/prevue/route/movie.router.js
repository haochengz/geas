
import Router from 'koa-router'
import { getAllMovies, getMovie } from '../controller/movie'
import fetchList from '../controller/crawler'

const router = new Router()

router.get('/movies', async (ctx, next) => {
  try {
    const doc = await getAllMovies()
    ctx.status = 200
    ctx.type = 'application/json; charset=utf-8'
    ctx.body = {
      success: true,
      code: 0,
      data: doc
    }
    return next()
  } catch(error) {
    ctx.status = 404
    ctx.body = {
      success: false,
      code: 1,
      error: error
    }
    return next()
  }
})

router.get('/movies/:mid', async (ctx, next) => {
  try {
    const doc = await getMovie(ctx.params.mid)
    ctx.status = 200
    ctx.body = {
      success: true,
      code: 0,
      data: doc
    }
    return next()
  } catch(error) {
    ctx.status = 404
    ctx.body = {
      success: false,
      code: 1,
      error: error
    }
    return next()
  }
})

router.get('/crawler/list', async (ctx, next) => {
  let result = ''
  try {
    result = await fetchList()
    ctx.body = result
  } catch(error) {
    console.error(error)
    ctx.body = 'FAILED'
  }
  return next()
})

export default router
