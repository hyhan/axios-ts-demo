import { AxiosStatic, AxiosRequestConfig } from './types/index';
import Axios from './core/Axios'
import { extend } from './helpers/utils';
import defaults from './defaults';
import mergeConfig from './core/mergeConfig';
import Cancel from './cancel/Cancel';
import CancelToken from './cancel/CancelToken';
import isCancel from './cancel/isCancel';

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaults)
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

axios.Cancel = Cancel
axios.CancelToken = CancelToken
axios.isCancel = isCancel


export default axios
