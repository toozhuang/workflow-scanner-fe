import {login} from "../api/authentication.api";
import {AUTH_COMMAND} from "./reducer";


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
