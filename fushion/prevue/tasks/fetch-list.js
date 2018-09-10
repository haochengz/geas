
const cp = require('child_process')
const r = require('path').resolve

module.exports = function() {
  return new Promise((resolve, reject) => {
    console.info('Douban movie list fetcher starting...')
    const doubanCrawlerPath = r(__dirname, '../crawler/douban-list.js')
    const child = cp.fork(doubanCrawlerPath, [])
    let invoked = false

    child.on('error', err => {
      if (invoked) return
      invoked = true
      reject(err)
    })

    child.on('exit', code => {
      if (invoked) return
      invoked = true
      if(code !== 0)
        reject(`Movie list fetching exited with code: ${code}`)
    })

    child.on('message', bundle => {
      resolve(bundle.result)
    })
  })
}
