
const { promisify } = require('util')

exports.sleep = promisify(setTimeout)
