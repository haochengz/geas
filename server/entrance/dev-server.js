
require('babel-core/register')
require('babel-polyfill')

process.env.NODE_ENV = 'dev'

module.exports = require('../serve')
