import axios from 'axios'
import dev_env from '../config.env'
import prod_env from '../config.prod'

const isDev = process.env.NODE_ENV === 'development';
const URL = isDev ? dev_env.apiService.transferScannerService : prod_env.apiService.transferScannerService


export const login = (userDetail: any) => {
    // @ts-ignore
    return axios.post(`${URL}/auth/login`, {userDetail: userDetail})
}

/**
 * 判断当前用户是否登录（根据cookie来判断）
 */
export const auth = () => {
    return axios.get(`${URL}/auth/isAuth`, {withCredentials: true,})
}
