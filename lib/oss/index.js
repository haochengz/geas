
let secret = null
if (process.env.NODE_ENV === 'production') {
  secret = require('/root/var/secret')
} else {
  secret = require('../../config/secret')
}

const co = require('co')
const nanoid = require('nanoid')
const request = require('request')

const OSS = require('ali-oss')
const client = new OSS({
  region: 'oss-cn-shenzhen',
  accessKeyId: secret.aliOss.accessKeyId,
  accessKeySecret: secret.aliOss.accessKeySecret
})

export function upload(url, extension) {
  return co(function *() {
    client.useBucket('prevue')
    console.log('start a ' + url + ' upload')
    let stream = request(url)
    let result = yield client.putStream(nanoid() + extension, stream)
    return result
  })
}
