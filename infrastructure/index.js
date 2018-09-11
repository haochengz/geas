
import glob from 'glob'
import { resolve } from 'path'
import R from 'ramda'

import { connect } from './database'

async function load(app) {
  try {
    await connect()
    middlewareInit(app)
  } catch(error) {
    console.error(error)
    throw new Error('Infrastructure loading failed')
  }
}

function middlewareInit(app) {
  const middlewarePath = resolve(__dirname, './middleware/', '**/*.js')
  console.info('initializing global middlewares from ' + middlewarePath)
  const middlewares = glob.sync(middlewarePath)
  console.log(`find ${middlewares.length} global middlewares:\n ${middlewares}`)
  middlewares.forEach(
    R.compose(
      middleware => middleware(app),
      file => require(file).default,
      file => {
        console.log('loading: ', file)
        return file
      }
    )
  )
}

export default load
