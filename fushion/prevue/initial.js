
import R from 'ramda'
import { resolve } from 'path'
import glob from 'glob'
import initSchema from './database'

export default function(app) {
  return new Promise(async (resolve, reject) => {
    try {
      await initSchema()
      // loading exclusive middlewares
      await routerInit(app)
      resolve('loading prevue success')
    } catch(error) {
      reject(error)
    }
  })
}

function routerInit(app) {
  glob.sync(resolve(__dirname, './route/', '**/*.router.js')).forEach(R.compose(
    router => {
      app.use(router.routes())
      app.use(router.allowedMethods())
    },
    file => require(file).default
  ))
}