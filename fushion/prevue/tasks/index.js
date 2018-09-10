
const fetchList = require('./fetch-list')

fetchList()
  .then(result => {
    console.log(result.status)
    result.data.forEach((item, index) => {
      console.log(index, '->', item)
    })
  })
  .catch(err => {
    console.error(err)
  })