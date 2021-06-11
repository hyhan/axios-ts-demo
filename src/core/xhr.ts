import { parseHeaders } from "../helpers/headers"
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "../types"
import { createError } from '../helpers/error';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      data = null,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken
    } = config
    const request = new XMLHttpRequest()
    request.open(method, url!, true)
    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
    if (responseType) {
      request.responseType = responseType
    }
    if (timeout) {
      request.timeout = timeout
    }
    request.onreadystatechange = function () {
      if (request.readyState !== 4) {
        return
      }
      const responseHeader = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType === 'text' ? request.responseText : request.response
      const response: AxiosResponse = {
        headers: responseHeader,
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        config,
        request
      }
      handleResponse(response)
    }
    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }
    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        console.log('aaaaa-11', config.url)
        reject(createError(`Request failed with status code ${response.status}`, config, null, request, response))
      }
    }

    processCancel()

    request.send(data)

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise
          .then(reason => {
            request.abort()
            reject(reason)
          })
          .catch(
            /* istanbul ignore next */
            () => {
              // do nothing
            }
          )
      }
    }
  })
}
