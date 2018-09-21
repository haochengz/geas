
const cp = require('child_process')
const r = require('path').resolve

module.exports = function(itemNum=40) {
  return new Promise((resolve, reject) => {
    console.info('Douban movie list fetcher starting...')
    const doubanCrawlerPath = r(__dirname, '../douban-list.js')
    const child = cp.fork(doubanCrawlerPath, [])
    let invoked = false

    child.on('error', error => {
      if (invoked) return
      invoked = true
      reject(`Movie list fetching exited with error: ${error}`)
    })

    child.on('exit', code => {
      if (invoked) return
      invoked = true
      if(code !== 0)
        reject(`Movie list fetching exited with code: ${code}`)
    })

    child.on('message', bundle => {
      console.log('messaging success')
      resolve(bundle.result)
    })

    child.send(itemNum)
  })
}
