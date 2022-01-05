import httpService from './intercept';
import dev_env from '../../config.env'
import prod_env from '../../config.prod'
import {AxiosRequestConfig} from "axios";

const isDev = process.env.NODE_ENV === 'development';
const BASEURL = isDev ? dev_env.apiService.baseURL : prod_env.apiService.baseURL;


class Axios{
    getReq(url:string,config:AxiosRequestConfig){
        const completeUrl = BASEURL +  url
        return httpService.get(completeUrl,config)
    }

    postReq(url:string,data:any,config?:AxiosRequestConfig){
        const completeUrl = BASEURL +  url
        return httpService.post(completeUrl,data,config)
    }
}

// 单例模式
let instance;

export default (()=>{
    if(instance) return instance;
    instance = new Axios()
    return instance
})()
