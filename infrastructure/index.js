
import glob from 'glob'
import { resolve } from 'path'
import R from 'ramda'

import { connect } from './database'

async function load(app) {
  try {
    await connect()
    await middlewareInit(app)
  } catch(error) {
    console.error(error)
    throw new Error('Infrastructure loading failed')
  }
}

function middlewareInit(app) {
  glob.sync(resolve(__dirname, './middleware/', '**/*.js')).forEach(
    R.compose(
      middleware => middleware(app),
      file => require(file).default
    )
  )
}

export default load
