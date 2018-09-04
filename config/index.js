
let env = {}

if(process.env.NODE_ENV === 'dev') {
  env = require('./dev')
} else if (process.env.NODE_ENV === 'production') {
  env = require('./prod')
}

export default env
