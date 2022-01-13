/**
 * Axios 的基类
 * 服务端的基础异常在这里捕获
 */

import httpService from './intercept';
import dev_env from '../../config.env'
import prod_env from '../../config.prod'
import {AxiosRequestConfig} from "axios";
import {AxiosRequest} from "../dto/axios.type";
import {log} from "util";
import {message} from "antd";


// 在这里组装 base url 基础 url 的设定
const isDev = process.env.NODE_ENV === 'development';
const baseURL = isDev ? dev_env.apiService.baseURL : prod_env.apiService.baseURL;

class Abstract{

    protected baseURL:string = baseURL;
    protected headers:Object = {} // 'content-type': 'application/text', 取消设置默认的header

    public apiAxios({baseURL=this.baseURL,headers=this.headers,method,url,data,params,responseType,withCredentials}:AxiosRequest){
        return new Promise((resolve ,reject)=>{
            httpService({
                baseURL,
                headers,
                method,
                url,
                params,
                data,
                responseType,
                withCredentials
            },).then(
                (res:any)=>{
                    console.log('统一有 res： ',res.data)
                    // 200:服务端业务处理正常结束
                    if (res.status === 200 || res.status===201) {
                        const apiStatus = res.data.status
                        // 在这个内部判断是否正确
                        if (parseInt(apiStatus) > 0) {
                            resolve({ status: true, message: 'success', data: res.data?.data, origin: res.data });
                        } else {
                            message.error(res.data.statusInfo.message)
                            resolve({ status: false, message: res.data?.statusInfo.message || (url + '请求失败'), data: res.data?.data, origin: res.data });
                        }
                    } else {
                        resolve({ status: false, message: res.data?.errorMessage || (url + '请求失败'), data: null });
                    }
                }
            ).catch(err=>{
                const message = err?.data?.errorMessage || err?.message || (url + '请求失败');
                message.error({ type: 'error', message });
                reject({ status: false, message, data: null});
            })
        } );
    }


}

export default Abstract
