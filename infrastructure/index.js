
import glob from 'glob'
import { resolve } from 'path'
import R from 'ramda'

import { connect } from './database'

async function load(app) {
  try {
    console.info('connecting to database')
    await connect()
    console.info('initializing global middlewares')
    middlewareInit(app)
  } catch(error) {
    console.error(error)
    throw new Error('Infrastructure loading failed')
  }
}

function middlewareInit(app) {
  glob.sync(resolve(__dirname, './middleware/', '**/*.js')).forEach(
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
