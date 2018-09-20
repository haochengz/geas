

const cp = require('child_process')
const r = require('path').resolve

module.exports = function(movies) {
  return new Promise((resolve, reject) => {
    const scriptPath = r(__dirname, '../douban-trailer.js')
    const child = cp.fork(scriptPath, [])
    let invoked = false
    let bundle = []

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
      else resolve(bundle)
    })

    child.on('message', async data => {
      console.log(data)
      bundle.push(data)
    })
    
    child.send(movies)
  })
}
