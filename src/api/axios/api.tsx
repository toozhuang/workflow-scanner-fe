import httpService from './intercept';
import dev_env from '../../config.env';
import prod_env from '../../config.prod';
import { AxiosRequestConfig } from 'axios';
import Abstract from './abstract';
import { AxiosRequest, CustomAxiosResponse } from '../dto/axios.type';

const isDev = process.env.NODE_ENV === 'development';
const BASEURL = isDev
  ? dev_env.apiService.baseURL
  : prod_env.apiService.baseURL;

/**
 * 相当于在下面输出的时候实例化这个 class
 * 这样就能使用单例模式 防止 axios 多次实例化了
 */
class Axios extends Abstract {
  postRequest({
    baseURL,
    headers,
    url,
    data,
    params,
    responseType,
    withCredentials,
  }: AxiosRequest): Promise<CustomAxiosResponse> {
    return this.apiAxios({
      baseURL,
      headers,
      method: 'POST',
      url,
      data,
      params,
      responseType,
      withCredentials,
    });
  }

  getRequest({
    baseURL,
    headers,
    url,
    data,
    params,
    responseType,
    withCredentials,
  }: AxiosRequest) {
    return this.apiAxios({
      baseURL,
      headers,
      method: 'GET',
      url,
      data,
      params,
      responseType,
      withCredentials,
    });
  }

  getReq(url: string, config: AxiosRequestConfig) {
    const completeUrl = BASEURL + url;
    return httpService.get(completeUrl, config);
  }

  postReq(url: string, data: any, config?: AxiosRequestConfig) {
    const completeUrl = BASEURL + url;
    return httpService.post(completeUrl, data, config);
  }
}

// 单例模式
let instance;

export default (() => {
  if (instance) return instance;
  instance = new Axios();
  return instance;
})();
