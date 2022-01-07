/**
 * user 的获取是从 localstorage 中拿取
 */

import _ from 'lodash'
import Cookies from "js-cookie";

const userStringObject: string = localStorage.getItem('currentUser') || "{}"
console.log('难道没有还？ ', JSON.parse(userStringObject).userInfo)
// 做深一次的判断是因为我们的user对象的数据放在 localstorage 这个 currentUser 下的 user 字段中
const user =!_.isEmpty(JSON.parse(userStringObject)) ?JSON.parse(userStringObject).userInfo:{};
console.log(user)


export enum AUTH_COMMAND {
    REQUEST_LOGIN="REQUEST_LOGIN",
    LOGIN_SUCCESS="LOGIN_SUCCESS",
    LOGOUT="LOGOUT",
    LOGIN_ERROR= "LOGIN_ERROR",
}

export type ActionType = {
    type: string,
    payload: {
        user: any,
        token: string
    },
    error:string
}

type StateType = {
    user: any,
    cookie: any,
    loading: boolean
}

export const initialState: StateType = {
    user:  user,
    cookie: '暂时没想到怎么用， 不过可能后期会使用',
    loading: false,  // 控制全局的 loading
}


/**
 * 就是一个传统的 redux 中的reducer
 * 现在等于全部驱动都底层的function了
 * @param initialState
 * @param action
 * @constructor
 */
export const AuthReducer = (initialState: StateType, action: ActionType) => {
    switch (action.type) {
        case AUTH_COMMAND.REQUEST_LOGIN:
            return {
                ...initialState,
                loading: true,
            };
        case AUTH_COMMAND.LOGIN_SUCCESS:
            // TODO: 暂时先这么来一下吧
            Cookies.set('user', JSON.stringify(action.payload.user));
            Cookies.set('ticket', action.payload.token);
            return {
                ...initialState,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
            };
        case AUTH_COMMAND.LOGOUT:
            return {
                ...initialState,
                user: '',
                token: '',
            };

        case AUTH_COMMAND.LOGIN_ERROR:
            return {
                ...initialState,
                loading: false,
                errorMessage: action.error,
            };

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }

}
