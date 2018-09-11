
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
  console.info('initializing global middlewares')
  const middlewares = glob.sync(resolve(__dirname, 'middleware', '**/*.js'))
  console.log(`find ${middlewares.length} global middlewares:\n ${middlewares}`)
  middlewares.forEach(
    R.compose(
      middleware => middleware(app),
      file => require(file).default,
      file => {
        console.log('find one: ', file)
        return file
      }
    )
  )
}

export default load
