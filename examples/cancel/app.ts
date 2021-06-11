import axios, { Canceler } from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/cancel/get', {
  cancelToken: source.token
}).then(res => {
  console.log(res)
}).catch(function(e) {
  if (axios.isCancel(e)) {
    console.log('Request canceled', e.message, 'get')
  }
})

setTimeout(() => {
  source.cancel('Operation canceled by the user.')
  axios.post('/cancel/post', { a: 1 }, { cancelToken: source.token }).catch(function(e) {
    if (axios.isCancel(e)) {
      console.log(e.message, 'post')
    }
  })
}, 100)

// let cancel: Canceler

// axios.get('/cancel/get', {
//   cancelToken: new CancelToken(c => {
//     cancel = c
//   })
// }).catch(function(e) {
//   if (axios.isCancel(e)) {
//     console.log('Request canceled')
//   }
// })

// setTimeout(() => {
//   cancel()
// }, 200)
