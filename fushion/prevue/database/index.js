
const glob = require('glob')
const { resolve } = require('path')

export default function() {
  glob.sync(resolve(__dirname, './schema/', '**/*.schema.js')).forEach(require)
}
