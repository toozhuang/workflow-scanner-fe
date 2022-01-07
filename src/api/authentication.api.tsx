import axios from './axios/api'
import type { loginForm } from '../components/dto/login.interface';

export const login = (userDetail: loginForm) => {
    return axios.postReq(`/auth/login`, {userDetail})
    // return null;
}

/**
 * 判断当前用户是否登录（根据cookie来判断）
 */
export const auth = () => {
    return axios.getReq(`/auth/isAuth`, {withCredentials: true,})
}


/**
 * 返回最新的上传文件的token信息
 */
export const retrieveNewToken = ()=>{
    return axios.getReq('/asr-service-api/signature',{withCredentials: true,})
}
