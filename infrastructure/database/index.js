
const mongoose = require('mongoose')
const { db } = require('../../config').default

mongoose.Promise = Promise

const connectionUrl = `mongodb://${db.admin}:${db.pwd}@${db.host}:${db.port}/${db.name}`

exports.connect = () => {
  let maxConnectAttempts = 10
  let connectAttempts = 0

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
    mongoose.connect(connectionUrl, { useNewUrlParser: true })

    mongoose.connection.on('disconnection', () => {
      connectAttempts++
      if (connectAttempts >= maxConnectAttempts) {
        reject('REJ-FAIL: DB connect is reaching max attempts.')
      }
      mongoose.connect(connectionUrl, { useNewUrlParser: true })
    })

    mongoose.connection.on('error', () => {
      connectAttempts++
      if (connectAttempts >= maxConnectAttempts) {
        reject('REJ-FAIL: DB connect is reaching max attempts.')
      }
      mongoose.connect(connectionUrl, { useNewUrlParser: true })
    })

    mongoose.connection.once('open', () => {
      connectAttempts = 0
      resolve('RES-OK: DB was connected')
    })
  })
}