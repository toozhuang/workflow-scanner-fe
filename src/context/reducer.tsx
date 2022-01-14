/**
 * user 的获取是从 localstorage 中拿取
 */

import _ from 'lodash'
import Cookies from "js-cookie";
import {AsrActionType, AsrStateType} from "./dto/asr.types";
import abstract from "../api/axios/abstract";

const userStringObject: string = localStorage.getItem('currentUser') || "{}"
console.log('难道没有还？ ', JSON.parse(userStringObject).userInfo)
// 做深一次的判断是因为我们的user对象的数据放在 localstorage 这个 currentUser 下的 user 字段中
const user = !_.isEmpty(JSON.parse(userStringObject)) ? JSON.parse(userStringObject).userInfo : {};
console.log(user)


export enum AUTH_COMMAND {
    REQUEST_LOGIN = "REQUEST_LOGIN",
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGOUT = "LOGOUT",
    LOGIN_ERROR = "LOGIN_ERROR",
}

export enum ASR_COMMAND {
    REQUEST_SIGNATURE = 'REQUEST_SIGNATURE',
    REQUEST_SIGNATURE_SUCCESS = 'REQUEST_SIGNATURE_SUCCESS',
    REQUEST_SIGNATURE_ERROR = 'REQUEST_SIGNATURE_ERROR',
    UPLOAD_REQUEST = 'UPLOAD_REQUEST',
    UPLOAD_SUCCESS = 'UPLOAD_SUCCESS',
    UPLOAD_ERROR = 'UPLOAD_ERROR',
    SUBMIT_TRANSLATE_REQUEST = 'SUBMIT_TRANSLATE_REQUEST',
    SUBMIT_TRANSLATE_SUCCESS = 'SUBMIT_TRANSLATE_SUCCESS',
    SUBMIT_TRANSLATE_ERROR = 'SUBMIT_TRANSLATE_ERROR',
    // 下面尝试少写两个状态
    GET_TRANSLATE_RESULT = 'GET_TRANSLATE_RESULT',
    DOWNLOAD_FILE = 'DOWNLOAD_FILE'
}

export type ActionType = {
    type: string,
    payload: {
        user: any,
        token: string
    },
    error: string
}

type StateType = {
    user: any,
    cookie: any,
    loading: boolean
}

export const initialState: StateType = {
    user: user,
    cookie: '暂时没想到怎么用， 不过可能后期会使用',
    loading: false,  // 控制全局的 loading
}

/**
 * 主要需要考虑清楚
 * 这个 reducer 的初步state 或者说这个 state
 * 最终需要放入什么信息
 */
export const asrInitialState: AsrStateType = {
    loading: false,
    bucket: {},
    currentStep: 0,
    filePath: "",
    taskId: ""
}


/**
 * 就是一个传统的 redux 中的reducer
 * 现在等于全部驱动都底层的function了
 * @param initialState
 * @param action
 * @constructor
 */
export const AuthReducer = (initialState: StateType, action: ActionType) => {
    console.log('难道是 auth reducer 吗 ')
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

export const AsrReducer = (initialState: AsrStateType, action: AsrActionType) => {
    console.log('是你把？？ ')
    switch (action.type) {
        case ASR_COMMAND.REQUEST_SIGNATURE:
            return {
                ...initialState,
                loading: true,
            };
        case ASR_COMMAND.REQUEST_SIGNATURE_SUCCESS:
            return {
                ...initialState,
                bucket: action.payload.content,
                loading: false,
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}
