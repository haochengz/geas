
import doubanUploader from './douban-uploader'

export default function ossUploader(wrapper) {
  return new Promise(resolve => {
    if(typeof wrapper !== 'object')
      throw new TypeError('Bad argument: wrapper')
    else if(toString.apply(wrapper.data) !== '[object Array]')
      throw new TypeError('Bad argument: wrapper must have a data array')
    else if(toString.apply(wrapper.logs) !== '[object Array]')
      throw new TypeError('Bad argument: wrapper must have a logs array')
    else if(typeof wrapper.status !== 'string')
      throw new TypeError('Bad argument: wrapper must have a status string')
    else if(typeof wrapper.discard !== 'number')
      throw new TypeError('Bad argument: wrapper must have a discard number')
    upload(wrapper)
      .then(dist => filter(dist))
      .then(validData => resolve(validData))
  })
}

async function upload(wrapper) {
  const data = await doubanUploader(wrapper.data)
  wrapper.data = data
  return wrapper
}

function filter(wrapper) {
  const cleanData = wrapper.data.filter(item => item.videoKey && item.coverKey && item.posterKey)
  if(cleanData.length < 1) throw new Error('!!data set was empty')
  wrapper.data = cleanData
  return wrapper
}
