/**
 * user 的获取是从 localstorage 中拿取
 */

import _ from 'lodash';
import { ASR_COMMAND, AsrActionType, AsrStateType } from './dto/asr.types';
import DB from '../common/indexed-db';

const userStringObject: string = localStorage.getItem('currentUser') || '{}';

// 做深一次的判断是因为我们的user对象的数据放在 localstorage 这个 currentUser 下的 user 字段中
const user = !_.isEmpty(JSON.parse(userStringObject))
  ? JSON.parse(userStringObject).userInfo
  : {};

export enum AUTH_COMMAND {
  REQUEST_LOGIN = 'REQUEST_LOGIN',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGOUT = 'LOGOUT',
  LOGIN_ERROR = 'LOGIN_ERROR',
}

export type ActionType = {
  type: string;
  payload: {
    user: any;
    token: string;
  };
  error: string;
};

type StateType = {
  user: any;
  loading: boolean;
};

export const initialState: StateType = {
  user: user,
  loading: false, // 控制全局的 loading
};

/**
 * 主要需要考虑清楚
 * 这个 reducer 的初步state 或者说这个 state
 * 最终需要放入什么信息
 */
export const asrInitialState: AsrStateType = {
  loading: false,
  bucket: {
    endpoint: '',
    key: '',
    OriginPolicy: '',
    Policy: '',
    Signature: '',
  },
  currentStep: 0,
  file: {
    filePath: '',
    fileInfo: null,
  },
  taskId: '',
};

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
};

export const AsrReducer = (
  previousState: AsrStateType,
  action: AsrActionType,
) => {
  switch (action.type) {
    case ASR_COMMAND.CLEAN_UP_STATE:
      return asrInitialState;
    case ASR_COMMAND.REQUEST_SIGNATURE:
      return {
        ...previousState,
        loading: true,
      };
    case ASR_COMMAND.REQUEST_SIGNATURE_SUCCESS:
      return {
        ...previousState,
        bucket: action.payload.content,
        loading: false,
      };
    case ASR_COMMAND.UPLOAD_SUCCESS:
      return {
        ...previousState,
        file: {
          filePath: action.payload.content.filePath,
          fileInfo: action.payload.content.fileInfo,
        },
        currentStep: action.payload.currentStep,
        loading: false,
      };

    case ASR_COMMAND.SUBMIT_TRANSLATE_REQUEST:
      return {
        ...previousState,
        loading: true,
      };
    case ASR_COMMAND.SUBMIT_TRANSLATE_SUCCESS: {
      console.log(' zheli ne : ', action.payload.currentStep);
      return {
        ...previousState,
        loading: false,
        taskId: action.payload.content,
        currentStep: action.payload.currentStep,
      };
    }
    case ASR_COMMAND.SUBMIT_TRANSLATE_ERROR:
      // TODO: 没有做任何操作当前
      return {
        ...previousState,
        loading: false,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
