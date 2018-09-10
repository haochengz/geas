
import { connect } from './database'

async function load() {
  try {
    await connect()
  } catch(error) {
    console.error(error)
    throw new Error('Infrastructure loading failed')
  }
}

export default load
