import axios from './axios/api';
import type { loginForm } from '../components/dto/login.type';

export const login = (userDetail: loginForm): any => {
  return axios.postRequest({ url: `/auth/login`, data: { userDetail } });
};

/**
 * 判断当前用户是否登录（根据cookie来判断）
 */
export const auth = () => {
  return axios.getReq(`/auth/isAuth`, { withCredentials: true });
};

/**
 * 返回最新的上传文件的token信息
 */
export const retrieveNewToken: any = async () => {
  const result = await axios.getRequest({
    url: '/asr-service-api/signature',
    withCredentials: true,
  });
  return result;
};
