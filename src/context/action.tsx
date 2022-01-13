import {login} from "../api/authentication.api";
import {AUTH_COMMAND} from "./reducer";


/**
 * 定义了一套登录的流程， 以及该登录在整个数据流中和react redux 的互动
 * @param dispatch
 * @param loginPayload
 */
export async function loginUser(dispatch:any, loginPayload:any) {
    dispatch({type: AUTH_COMMAND.REQUEST_LOGIN})
    try {
        const {data} = await login(loginPayload)
        const payload = {
            user: data.userInfo,
            token: data.token
        }

        dispatch({type: AUTH_COMMAND.LOGIN_SUCCESS, payload})
        localStorage.setItem('currentUser',JSON.stringify(data))
        return data;
    }catch(e){
        dispatch({type: AUTH_COMMAND.LOGIN_ERROR})
    }

}
