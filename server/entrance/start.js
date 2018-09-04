
require('babel-core/register')
require('babel-polyfill')

process.env.NODE_ENV = 'production'

module.exports = require('../serve')
